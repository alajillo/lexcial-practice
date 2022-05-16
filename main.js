import './style.css'
import { createEditor, $getSelection, $isRangeSelection, COMMAND_PRIORITY_NORMAL, createCommand } from 'lexical';
import { registerRichText } from '@lexical/rich-text'
import { $createColorBox, ColorBox, $isColorBox } from './customNode';

const contentEditorElement = document.getElementById('editor');
const addButtonElement = document.getElementById('add');
const changeButtonElement = document.getElementById('change');
const lockButtonElement = document.getElementById('lock');
const colorInputElement = document.getElementById('color');
const saveButtonElement = document.getElementById('save');
const loadButtonElement = document.getElementById('load');

const state = {
  color: ''
}

const editor = createEditor({ onError: console.error, nodes: [ColorBox], readOnly: true });
editor.setRootElement(contentEditorElement);

registerRichText(editor);

const INSERT_COLOR_BOX_COMMAND = createCommand();
const CHANGE_COLOR_BOX_COMMAND = createCommand();
const LOCK_EDITOR_COMMAND = createCommand();

editor.registerCommand(INSERT_COLOR_BOX_COMMAND, (color) => {
  const selection = $getSelection();
  if ($isRangeSelection(selection) && !editor.isReadOnly()) {
    const colorNode = $createColorBox(color);
    selection.insertNodes([colorNode]);
  }
},
  COMMAND_PRIORITY_NORMAL
)

editor.registerCommand(CHANGE_COLOR_BOX_COMMAND, () => {
  const select = $getSelection();
  if ($isRangeSelection(select) && !editor.isReadOnly()) {
    const nodes = select.getNodes();
    nodes.forEach((node) => {
      if ($isColorBox(node)) {
        node.setColor(state.color)
      }
    })
  }
},
  COMMAND_PRIORITY_NORMAL
)

editor.registerCommand(LOCK_EDITOR_COMMAND, (value) => {
  editor.setReadOnly(value);
},
  COMMAND_PRIORITY_NORMAL
)


colorInputElement.addEventListener('input', (e) => {
  state.color = e.target.value;
})

addButtonElement.addEventListener('click', () => {
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

changeButtonElement.addEventListener('click', () => {
  editor.dispatchCommand(CHANGE_COLOR_BOX_COMMAND)
})

lockButtonElement.addEventListener('change', (e) => {
  editor.dispatchCommand(LOCK_EDITOR_COMMAND, e.target.checked)
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

editor.registerReadOnlyListener((value) => {
  contentEditorElement.setAttribute('contentEditable', !value);
})


