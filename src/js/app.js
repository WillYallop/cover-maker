import '../scss/main.scss';
import markup from '../markup/index.html';
import 'simplebar';
import 'simplebar/dist/simplebar.css';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTh, faImages, faFont, faLayerGroup, faMarker, faChevronLeft, faBrush, faThLarge, faEdit, faCog, faShapes } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(faTh, faImages, faFont, faLayerGroup, faMarker, faChevronLeft, faBrush, faThLarge, faEdit, faCog, faShapes );
// Controllers 
import ToolPane from './controllers/toolPane';
import Artboard from './controllers/artboard';
import Elements from  './controllers/elements';
import ConfigPane from './controllers/configPane';
import { initSaveController } from './controllers/save';
import { initLoadController } from './controllers/load';
import { storeRead, storeOn, storeMutation } from './controllers/store';
const { cloneDeep } = require('lodash/fp/lang');

export class CoverMaker {
    constructor(config) {
        this.config = config;
        storeMutation('storeVariables', this.config.processVariables);
        // load
        this.loadConfig = {
            artificialLoadTime: 200,
            removeAnimation: 300
        }
        this.handleLoad();
        storeMutation('getFilesCallbackURL', this.config.getFilesFromURL);
        window.onbeforeunload = function() {
            return "Data will be lost if you leave the page, are you sure?";
        };
    }
    handleLoad() {
        // Load any required data 
        setTimeout(() => {
            var loadingCon = document.getElementById('cm_loadingCon');
            loadingCon.classList.remove('active');
            // Inject markup & icons
            document.getElementById(this.config.injectEleId).insertAdjacentHTML('afterbegin', markup);
            dom.i2svg();
            this.initialise();
            setTimeout(() => {
                loadingCon.remove();
            }, this.loadConfig.removeAnimation);
        }, this.loadConfig.artificialLoadTime);
    }
    async initialise() {
        // Initialise toolPane
        this.toolPane = new ToolPane(this.config);
        this.artboard = new Artboard();
        this.elements = new Elements();
        this.configPane = new ConfigPane();
        
        initSaveController(this.config.injectEleId, this.elements.removeSelection());
        initLoadController(this.config.injectEleId);
        this.initControllerCallbacks();

        if(this.config.openTemplateFromURL) { 
            // http://localhost:3000/?template=0
            var templateID = getParameterByName('template');
            if(templateID) {
                let templateObj = this.config.templates.find( x => x.id === parseInt(templateID));
                if(templateObj) { 
                    var file = await this.config.getFilesFromURL(`${storeRead().variables.API_URL}${templateObj.src}`);
                    storeMutation('setArtboardData', cloneDeep(file));
                }
            }
        }
    }
    initControllerCallbacks() {

        // Store callbacks
        storeOn('refresh-artboard', () => {
            this.configPane.resetLayers();
            this.configPane.updateConfigHandler();
            this.artboard.refreshArtboard();
        });
        storeOn('text-manipulated', () => {
            this.configPane.updateTextarea();
        });

        // Artboard Callbacks
        this.artboard.on('update-zoom-percent', (percent) => {
            this.elements.setData({ key: 'zoomPercent', value: percent });
        });
        // Config Pane Callbacks
        this.configPane.on('update-elements', () => {
            this.artboard.refreshArtboard();
            this.elements.removeSelection();
        });
        this.configPane.on('center-selected', (axis) => {
            this.elements.centerSelected(axis);
        });
        // Elements Callbacks
        this.elements.on('elements-manipulated', () => {
            this.configPane.updateSizeAndPos();
        });
    }
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}