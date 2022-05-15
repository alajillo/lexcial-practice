import './style.css'
import { createEditor, $getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, createCommand } from 'lexical';
import { registerRichText } from '@lexical/rich-text'
import { $createColorBox, ColorBox } from './customNode';

const contentEditorElement = document.getElementById('editor');
const buttonElement = document.getElementById('button');
const colorInputElement = document.getElementById('color');
const saveButtonElement = document.getElementById('save');
const loadButtonElement = document.getElementById('load');

const state = {
  color: ''
}


colorInputElement.addEventListener('input', (e) => {
  state.color = e.target.value;
})

const editor = createEditor({ onError: console.error, nodes: [ColorBox] });

editor.setRootElement(contentEditorElement);
registerRichText(editor);

const INSERT_COLOR_BOX_COMMAND = createCommand();

editor.registerCommand(INSERT_COLOR_BOX_COMMAND, (color) => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const colorNode = $createColorBox(color);
    selection.insertNodes([colorNode]);
  }
},
  COMMAND_PRIORITY_NORMAL
)

buttonElement.addEventListener('click', () => {
  editor.dispatchCommand(INSERT_COLOR_BOX_COMMAND, state.color)
})

saveButtonElement.addEventListener('click', () => {
  const editorJSON = editor.getEditorState().toJSON();
  window.localStorage.setItem('editorState', JSON.stringify(editorJSON));
})

loadButtonElement.addEventListener('click', () => {
  const editorJSON = window.localStorage.getItem('editorState');
  const editorState = editor.parseEditorState(editorJSON);
  editor.setEditorState(editorState);
})


editor.registerDecoratorListener((nextDecorateNodes) => {
  const decoratorKeys = Object.keys(nextDecorateNodes);
  decoratorKeys.forEach((nodeKey) => {
    const element = editor.getElementByKey(nodeKey);
    const decorator = nextDecorateNodes[nodeKey];
    if (element !== null) {
      if (!element.hasChildNodes()) {
        element.appendChild(decorator);
      }
    }
  }
  )
})

