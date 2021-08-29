import Markup from './markup/text.html';
import { storeMutation, storeRead } from '../../controllers/store';

export default class Text {
    constructor(textTemplates) {
        this.textTemplates = textTemplates;
        this.markup = Markup;
    }
    // Initialise
    async initialise() {
        this.addTextBlockBtn = document.getElementById('cm_addTextBlockBtn');
        this.addTextBlockBtn.addEventListener('click', (e) => {
            storeMutation('addElementsConfig', {
                type: 'text'
            });
        });
        // Render text template options
        for(var i = 0; i < this.textTemplates.length; i++) {
            let id = await renderTemplateCol(this.textTemplates[i], 'cm_textBodyTemplateCon');
            document.getElementById(id).addEventListener('click', async (e) => {
                let target = e.currentTarget;
                let templateID = target.attributes['text-template-id'].value;
                if(templateID) {
                    let templateObj = this.textTemplates.find( x => x.id === parseInt(templateID));
                    if(templateObj) { 
                        var file = await storeRead().getFilesCallback(`${storeRead().variables.API_URL}${templateObj.src}`);
                        storeMutation('addTextElements', file);
                    }
                }
            });
        }
    }

    // Render
    render(callback) {
        callback(this.markup); 
    }
}

function renderTemplateCol(data, parent) {
    return new Promise((resolve) => {
        var template = `
            <div id="cm_textTemplateId${data.id}" class="templateCol" text-template-id="${data.id}">
                <div class="innerTemplate"> 
                    <img src="${storeRead().variables.API_URL}${data.img}" loading="lazy"> 
                </div>
            </div>`;
        document.getElementById(parent).insertAdjacentHTML('beforeend', template);
        resolve(`cm_textTemplateId${data.id}`); 
    });
}