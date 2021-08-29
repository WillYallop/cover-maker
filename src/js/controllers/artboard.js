import { storeRead } from './store';
import { setArtboardBackground } from '../functions/setArtboardBackground';

export default class Artboard {
    constructor() {
        this.handlers = {};
        this.artboardSize = [1400, 1400];

        // Elements
        this.zoomSliderInpElement = document.getElementById('cm_artboardZoomInp');
        this.artboardOuterElement = document.getElementById('cm_artboardOuter');
        this.artboardElement = document.getElementById('cm_artboard');

        this.initialise();
    }
    on(eventName, handler) {
        if(!this.handlers[eventName]) {
            this.handlers[eventName] = handler;
        }
    }
    emit(eventName, data) {
        var callback = this.handlers[eventName];
        if(callback != undefined) {
            switch(eventName) {
                case 'update-zoom-percent': {
                    callback(data);
                    break;
                }
            }
        }
    }
    initialise() {
        this.refreshArtboard();
        this.zoomHandler();
        this.zoomUpdate();
    }


    
    // Function
    refreshArtboard() {
        var artboardConfig = storeRead().artboard;
        var artboardElements = artboardConfig.elements;
        // Update background color
        setArtboardBackground(artboardConfig);
        // Clear artboard elements
        let removeElements = this.artboardElement.querySelectorAll('[selectable]');
        for(let i = 0; i < removeElements.length; i++) {
            removeElements[i].remove();
        }
        // Insert elements
        for (let i = artboardElements.length - 1; i >= 0; i--) {
            // console.log(artboardElements[i].element);
            this.artboardElement.append(artboardElements[i].element);
        }
    }

    zoomHandler() {
        this.zoom = 60;
        this.zoomSliderInpElement.addEventListener('mousedown', (e) => {
            this.zoomUpdate();
        });
        this.zoomSliderInpElement.addEventListener('touchstart', (e) => {
            this.zoomUpdate();
        });
        this.zoomSliderInpElement.addEventListener('mouseup', (e) => {
            clearInterval(this.zoomLoop);
        });
        this.zoomSliderInpElement.addEventListener('touchend', (e) => {
            clearInterval(this.zoomLoop);
        });
    }
    zoomUpdate() {
        this.zoomLoop = setInterval(() => {
            this.zoom = this.zoomSliderInpElement.value;
            var percent = this.zoom / 100;
            this.artboardElement.style.transform = `scale(${percent})`;
            this.artboardOuterElement.style.width = `${this.artboardSize[0] * percent}px`;
            this.artboardOuterElement.style.height = `${this.artboardSize[1] * percent}px`;
            document.getElementById('cm_artboardZoomText').innerText = `${this.zoom}%`;
            this.emit('update-zoom-percent', percent);
        }, 50);
    }
}