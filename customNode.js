import { DecoratorNode } from "lexical";
export class ColorBox extends DecoratorNode {
    __color;
    static getType() {
        return 'color box';
    }
    static clone(node) {
        return new ColorBox(node.__color);
    }
    constructor(color) {
        super();
        this.__color = color;
    }
    createDOM() {
        const wrapper = document.createElement('span');
        return wrapper;
    }
    updateDOM() {
        return true;
    }
    setColor(newColor) {
        const writable = this.getWritable();
        writable.__color = newColor;
    }
    decorate() {
        const newElement = document.createElement('span');
        newElement.classList.add('color-box')
        newElement.style.backgroundColor = this.__color;
        return newElement;
    }
}

export function $createColorBox(color) {
    return new ColorBox(color);
}

export function $isColorBox(node) {
    return node instanceof ColorBox;
}