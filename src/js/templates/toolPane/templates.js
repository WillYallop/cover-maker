import Markup from './markup/templates.html';
import { storeMutation, storeRead } from '../../controllers/store';
const { cloneDeep } = require('lodash/fp/lang');

export default class Templates {
    constructor(templates) {
        this.templates = templates;
        this.markup = Markup;
    }

    // Initialise
    initialise() {
        this.navBtnElements = document.querySelectorAll('[related-body]');
        for(var i = 0; i < this.navBtnElements.length; i++) {
            var buttonEle = this.navBtnElements[i];
            buttonEle.addEventListener('click', (e) => {
                var target = e.target;
                var toolPaneBodyEle = document.getElementById('cm_toolPaneBody');
                // Remove all active button ele
                for(var b = 0; b < this.navBtnElements.length; b++) {
                    if(this.navBtnElements[b].classList.contains('active')) this.navBtnElements[b].classList.remove('active');
                }
                // Remove all active body ele
                for(var c = 0; c < toolPaneBodyEle.children.length; c++) {
                    if(toolPaneBodyEle.children[c].classList.contains('active')) toolPaneBodyEle.children[c].classList.remove('active');
                }
                let id = target.attributes['related-body'].value;
                document.getElementById(id).classList.add('active');
                target.classList.add('active');
                this.initialiseActiveBody(id);
            })
        }
        this.initialiseActiveBody('cm_popularTemplates');
    }
    async initialiseActiveBody(id) {
        switch(id) {
            case 'cm_popularTemplates': {
                if(!this.popTemplatesLoaded) {
                    var templates = this.templates.filter( x => x.category === 'popular');
                    this.addBlankTemplateCol('cm_popularTemplates', 0);
                    for(var i = 0; i < templates.length; i++) {
                        let id = await renderTemplateCol(templates[i], 'cm_popularTemplates');
                        document.getElementById(id).addEventListener('click', async (e) => {
                            let target = e.currentTarget;
                            let templateID = target.attributes['template-id'].value;
                            if(templateID) {
                                let templateObj = this.templates.find( x => x.id === parseInt(templateID));
                                if(templateObj) { 
                                    var file = await storeRead().getFilesCallback(`${storeRead().variables.API_URL}${templateObj.src}`);
                                    storeMutation('setArtboardData', cloneDeep(file));
                                }
                            }
                        });
                    }
                    this.popTemplatesLoaded = true;
                }
                break;
            }
            case 'cm_genreTemplates': {
                if(!this.genreTemplatesLoaded) {
                    var templates = this.templates.filter( x => x.category === 'genres');
                    this.addBlankTemplateCol('cm_genreTemplates', 1);
                    for(var i = 0; i < templates.length; i++) {
                        let id = await renderTemplateCol(templates[i], 'cm_genreTemplates');
                        document.getElementById(id).addEventListener('click', async (e) => {
                            let target = e.currentTarget;
                            let templateID = target.attributes['template-id'].value;
                            if(templateID) {
                                let templateObj = this.templates.find( x => x.id === parseInt(templateID));
                                if(templateObj) { 
                                    var file = await storeRead().getFilesCallback(`${storeRead().variables.API_URL}${templateObj.src}`);
                                    storeMutation('setArtboardData', cloneDeep(file));
                                }
                            }
                        });
                    }
                    this.genreTemplatesLoaded = true;
                }
                break;
            }
            case 'cm_themesTemplates': {
                if(!this.themeTemplatesLoaded) {
                    var templates = this.templates.filter( x => x.category === 'themes');
                    this.addBlankTemplateCol('cm_themesTemplates', 2);
                    for(var i = 0; i < templates.length; i++) {
                        let id = await renderTemplateCol(templates[i], 'cm_themesTemplates');
                        document.getElementById(id).addEventListener('click', async (e) => {
                            let target = e.currentTarget;
                            let templateID = target.attributes['template-id'].value;
                            if(templateID) {
                                let templateObj = this.templates.find( x => x.id === parseInt(templateID));
                                if(templateObj) { 
                                    var file = await storeRead().getFilesCallback(`${storeRead().variables.API_URL}${templateObj.src}`);
                                    storeMutation('setArtboardData', cloneDeep(file));
                                }
                            }
                        });
                    }
                    this.themeTemplatesLoaded = true;
                }
                break;
            }
        }
    }
    addBlankTemplateCol(parent, id) {
        var template = `
        <div id="cm_templateBlank${id}" class="templateCol">
            <div class="innerTemplate blankInner"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M20.4 8.6h-7v-7A1.6 1.6 0 0011.8 0h-1.6a1.6 1.6 0 00-1.6 1.6v7h-7A1.6 1.6 0 000 10.2v1.6a1.6 1.6 0 001.6 1.6h7v7a1.6 1.6 0 001.6 1.6h1.6a1.6 1.6 0 001.6-1.6v-7h7a1.6 1.6 0 001.6-1.6v-1.6a1.6 1.6 0 00-1.6-1.6z" fill="#fff"/></svg>
                <p>Start from blank</p>
            </div>
        </div>`;
        document.getElementById(parent).insertAdjacentHTML('beforeend', template);
        document.getElementById(`cm_templateBlank${id}`).addEventListener('click', () => {
            storeMutation('resetArtboardData');
        });
    }

    // Render 
    render(callback) {
        callback(this.markup);
    }
}
 
function renderTemplateCol(data, parent) {
    return new Promise((resolve) => {
        var template = `
            <div id="cm_templateId${data.id}" class="templateCol" template-id="${data.id}">
                <div class="innerTemplate"> 
                    <img src="${storeRead().variables.API_URL}${data.img}" loading="lazy"> 
                </div>
                <div class="titleOverlay">
                    <p>${data.name}</p> 
                </div>
            </div>`;
        document.getElementById(parent).insertAdjacentHTML('beforeend', template);
        resolve(`cm_templateId${data.id}`);
    });
}