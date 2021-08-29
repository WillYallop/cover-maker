import Markup from './markup/shapes.html';
import { storeMutation } from '../../controllers/store';

export default class Text {
    constructor() {
        this.markup = Markup;
    }
    // Initialise
    initialise() {
        var bodyEle = document.getElementById('cm_toolPaneBody');
        for(var i = 0; i < bodyEle.children.length; i++) {
            var child = bodyEle.children[i];
            child.addEventListener('click', (e) => {
                let shape = e.target.attributes['shape-btn'].value;
                storeMutation('addElementsConfig', {
                    type: 'shape',
                    shape: shape
                });
            });
        }
    }

    // Render
    render(callback) {
        callback(this.markup);
    }
}