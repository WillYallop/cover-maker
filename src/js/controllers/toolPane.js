// Tools
import Background from '../templates/toolPane/background';
import Images from '../templates/toolPane/images';
import Templates from '../templates/toolPane/templates';
import Text from '../templates/toolPane/text';
import Shapes from '../templates/toolPane/shapes';

export default class ToolPane {
    constructor(config) {
        this.templates = config.templates;
        this.textTemplates = config.textTemplates; 
        // Elements
        this.navButtons = document.querySelectorAll('[options-template]');
        this.toolPaneCon = document.getElementById('cm_toolPaneCon');
        // Initialise
        this.initialise();
    } 

    // Initialise
    initialise() {
        // Add event listeners to the nav buttons
        for(var i = 0; i < this.navButtons.length; i++) {
            this.navButtons[i].addEventListener('click', (e) => {
                var target = e.target;
                this.selectToolPane(target.attributes['options-template'].value);
                for(var b = 0; b < this.navButtons.length; b++) {
                    this.navButtons[b].classList.remove('active');
                };
                // Make action
                target.classList.add('active');
            });
        }
        // Render default tool pane
        this.selectToolPane('templates');
    }
    // Select new tool pane
    selectToolPane(toolName) {
        switch(toolName) {
            case 'templates': {
                this.activeTool = new Templates(this.templates);
                break;
            }
            case 'background': {
                this.activeTool = new Background();
                break;
            }
            case 'images': {
                this.activeTool = new Images();
                break;
            }
            case 'text': {
                this.activeTool = new Text(this.textTemplates);
                break;
            }
            case 'shapes': {
                this.activeTool = new Shapes();
                break;
            }
        }
        this.activeTool.render((markup) => { 
            return new Promise((resolve) => {
                this.renderToolPane(markup); 
                resolve();
            }) 
        });
    }

    // Render tool pane
    renderToolPane(markup) {
        this.toolPaneCon.innerHTML = markup;
        this.activeTool.initialise();
    }
}