import Markup from './markup/background.html';
import { storeMutation, storeRead } from '../../controllers/store';
import axios from 'axios';
import { createClient } from 'pexels';
import { elementOptions } from '../../functions/elementConfigOptions';
const client = createClient(process.env.PEXELS_API_KEY);
const { cloneDeep } = require('lodash/fp/lang');

export default class Background {
    constructor() {
        this.markup = Markup;
        this.colors = [
            { name: 'red', color: '#D42628' },
            { name: 'orange', color: '#FE4F29' },
            { name: 'organge/yellow', color: '#FE8E26' },
            { name: 'yellow', color: '#FFB92F' },
            { name: 'yellow/green', color: '#C7D746' },
            { name: 'light green', color: '#81BB4C' },
            { name: 'green', color: '#45A54E' },
            { name: 'aqua', color: '#0E8B7D' },
            { name: 'light blue', color: '#12B3CC' },
            { name: 'blue', color: '#208BEC' },
            { name: 'dark blue', color: '#3748A8' },
            { name: 'purple', color: '#5B33AA' },
            { name: 'light purple', color: '#9125A3' },
            { name: 'pink', color: '#E42058' },
            { name: 'grey', color: '#728188' },
            { name: 'brown', color: '#854F3E' }
        ];
        this.gradients = [
            { colors: ['#FFE000', '#799F0C'] },
            { colors: ['#00416A', '#E4E5E6'] },
            { colors: ['#ffe259', '#ffa751'] },
            { colors: ['#799F0C', '#ACBB78'] },
            { colors: ['#334d50', '#cbcaa5'] },
            { colors: ['#F7F8F8', '#ACBB78'] },
            { colors: ['#FFE000', '#799F0C'] },
            { colors: ['#00416A', '#E4E5E6'] },
            { colors: ['#bdc3c7', '#2c3e50'] },
            { colors: ['#ee9ca7', '#ffdde1'] },
            { colors: ['#2193b0', '#6dd5ed'] },
            { colors: ['#b92b27', '#1565C0'] },
            { colors: ['#373B44', '#4286f4'] },
            { colors: ['#FF0099', '#493240'] },
            { colors: ['#8E2DE2', '#4A00E0'] },
            { colors: ['#1f4037', '#99f2c8'] },
            { colors: ['#f953c6', '#b91d73'] },
            { colors: ['#c31432', '#240b36'] },
            { colors: ['#f12711', '#f5af19'] },
            { colors: ['#659999', '#f4791f'] },
            { colors: ['#dd3e54', '#6be585'] },
            { colors: ['#8360c3', '#2ebf91'] },
            { colors: ['#544a7d', '#ffd452'] },
            { colors: ['#009FFF', '#ec2F4B'] },
            { colors: ['#654ea3', '#eaafc8'] },
            { colors: ['#FF416C', '#FF4B2B'] },
            { colors: ['#a8ff78', '#78ffd6'] },
            { colors: ['#ED213A', '#93291E'] },
            { colors: ['#FDC830', '#F37335'] },
            { colors: ['#00B4DB', '#0083B0'] }
        ]
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
        this.initialiseActiveBody('cm_colorBackground');
    }
    // Run setup for selected body type
    initialiseActiveBody(id) {
        switch(id) {
            case 'cm_colorBackground': {
                if(!this.colorBackgroundLoaded) {
                    // Create color buttons
                    for(var i = 0; i < this.colors.length; i++) {
                        let template = `<button class="colorOption" index="${i}" aria-label="${this.colors[i].name}" style="background-color: ${this.colors[i].color};"></button>`;
                        document.getElementById('cm_colorPresentBody').insertAdjacentHTML('beforeend', template);
                    }
                    // Add event listeners to all these buttons
                    var buttons = document.querySelectorAll('.colorOption');
                    for(var bI = 0; bI < buttons.length; bI++) {
                        let button = buttons[bI];
                        button.addEventListener('click', (e) => {
                            storeMutation('updateArtboardBackground', {
                                type: 'solid',
                                color: this.colors[e.target.attributes['index'].value].color
                            });
                        })
                    }

                    this.buildOptions('color');

                    this.colorBackgroundLoaded = true;
                }
                break;
            }
            case 'cm_gradientBackground': {
                if(!this.gradientBackgroundLoaded) {
                    for(var i = 0; i < this.gradients.length; i++) {
                        let template = `<button class="gradientOptions" index="${i}" style="background: linear-gradient(90deg, ${this.gradients[i].colors[0]}, ${this.gradients[i].colors[1]});"></button>`;
                        document.getElementById('cm_gradientPresentBody').insertAdjacentHTML('beforeend', template);
                    }
                    // Add event listeners to all these buttons
                    var buttons = document.querySelectorAll('.gradientOptions');
                    for(var bI = 0; bI < buttons.length; bI++) {
                        let button = buttons[bI];
                        button.addEventListener('click', (e) => {
                            storeMutation('updateArtboardBackground', {
                                type: 'gradient',
                                colors: cloneDeep(this.gradients[e.target.attributes['index'].value].colors),
                                rotation: storeRead().artboard.gradientRotation,
                                gradientType: storeRead().artboard.gradientType
                            });
                        })
                    }

                    this.buildOptions('gradient');

                    this.gradientBackgroundLoaded = true;
                }
                break;
            }
            case 'cm_imageBackground': {
                if(!this.imageBackgroundLoaded) {
                    
                    // Add custom image
                    this.imageInpElement = document.getElementById('cm_uploadImage');
                    this.imageInpElement.addEventListener('change', (e) => {
                        var file = e.target.files[0];
                        if(file) {
                            var reader = new FileReader();
                            reader.readAsDataURL(e.target.files[0]);
                            reader.onload = () => {
                                // create element
                                function toDataURL(url, callback) {
                                    var xhr = new XMLHttpRequest();
                                    xhr.onload = function() {
                                    var reader = new FileReader();
                                    reader.onloadend = function() {
                                        callback(reader.result);
                                    }
                                    reader.readAsDataURL(xhr.response);
                                    };
                                    xhr.open('GET', url);
                                    xhr.responseType = 'blob';
                                    xhr.send();
                                }
                                toDataURL(reader.result, (result) => {
                                    let imgEle = new Image();
                                    imgEle.src = reader.result;
                                    imgEle.addEventListener('load', (e) => {
                                        storeMutation('updateArtboardBackground', {
                                            type: 'image',
                                            src: result,
                                            color: '#fff',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        });
                                        this.imageInpElement.value = null;
                                        imgEle.remove();
                                    });
                                })
                            };
                            reader.onerror = (error) => {
                                console.log('Error: ', error);
                            };
                        }
                    }, false);

                    // Load stock images from pexels
                    this.imageResultsConEle = document.getElementById('cm_imageResultCon');
                    this.imageSearchInpEle = document.getElementById('cm_imageSearchInp');
                    this.imageSearchBtnEle = document.getElementById('cm_searchImgBtn');
                    this.loadMoreBtnEle = document.getElementById('cm_loadMoreImgsBtn');
                    // Add event listener
                    this.imageSearchBtnEle.addEventListener('click', (e) => {
                        this.stockImages();
                    }, true);
                    this.imageSearchInpEle.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.stockImages();
                        }
                    }, true);
                    this.imageResultsConEle.addEventListener('click', (e) => {
                        var target = e.target;
                        if(target.localName === 'button') {
                            let pictureIndex = target.attributes['index'].value;
                            storeMutation('updateArtboardBackground', {
                                type: 'image',
                                src: this.photos[pictureIndex].src.large,
                                color: this.photos[pictureIndex].avg_color,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            });
                        }
                    }, true);
                    this.loadMoreBtnEle.addEventListener('click', (e) => {
                        this.loadMoreImages();
                    }, true); 
                    this.stockImages();
                    this.buildOptions('image');
                    this.imageBackgroundLoaded = true;
                }
                break;
            }
        }
    }

    // For images
    stockImages() {
        this.handleLoad(false);
        if(this.imageSearchInpEle.value) { 
            client.photos.search({ query: this.imageSearchInpEle.value, per_page: 18 })
            .then((res) => { 
                this.imageResultsConEle.innerHTML = '';
                this.photos = res.photos;
                this.nextPage = res.next_page;
                // Add elements
                for(var i = 0; i < this.photos.length; i++) {
                    let photoEle = `
                    <button class="photoCol" index="${i}" style="background-color: ${this.photos[i].avg_color};">
                        <div class="btnInnerImgCon">
                            <img src="${this.photos[i].src.tiny}" loading="lazy">
                            <a href="${this.photos[i].photographer_url}" class="artistLink" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.4" height="14.2"><path d="M6.2 7a3.5 3.5 0 10-3.5-3.5 3.5 3.5 0 003.5 3.6zm2.5 1h-.5a4.8 4.8 0 01-4 0h-.5A3.7 3.7 0 000 11.7v1.2a1.3 1.3 0 001.3 1.3h9.8a1.3 1.3 0 001.3-1.3v-1.2A3.7 3.7 0 008.7 8z" fill="#160f22"/></svg>
                            </a>
                        </div>
                    </button>`;
                    this.imageResultsConEle.insertAdjacentHTML('beforeend', photoEle);
                }
                this.handleLoad(true);
            });
        }
    }
    loadMoreImages() {
        if(this.nextPage) {
            axios.get(this.nextPage)
            .then((res) => {
                let photosBefore = this.photos.length;
                this.photos = this.photos.concat(res.data.photos);
                this.nextPage = res.data.next_page;
                // Add elements
                for(var i = photosBefore; i < this.photos.length; i++) {
                    let photoEle = `
                    <button class="photoCol" index="${i}" style="background-color: ${this.photos[i].avg_color};">
                        <div class="btnInnerImgCon">
                            <img src="${this.photos[i].src.tiny}">
                            <a href="${this.photos[i].photographer_url}" class="artistLink" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.4" height="14.2"><path d="M6.2 7a3.5 3.5 0 10-3.5-3.5 3.5 3.5 0 003.5 3.6zm2.5 1h-.5a4.8 4.8 0 01-4 0h-.5A3.7 3.7 0 000 11.7v1.2a1.3 1.3 0 001.3 1.3h9.8a1.3 1.3 0 001.3-1.3v-1.2A3.7 3.7 0 008.7 8z" fill="#160f22"/></svg>
                            </a>
                        </div>
                    </button>`;
                    this.imageResultsConEle.insertAdjacentHTML('beforeend', photoEle);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
    // Handle laod
    handleLoad(state) {
        if(state) {
            // Remove loading indicator
            document.getElementById('cm_skeletonLoadingInd').classList.remove('active');
            // Show image body
            this.imageResultsConEle.classList.add('active');
            // Show load more btn
            this.loadMoreBtnEle.classList.add('active'); 
        }
        else {
            // Show loading indicator
            document.getElementById('cm_skeletonLoadingInd').classList.add('active');
            // Hide image body
            this.imageResultsConEle.classList.remove('active');
            // Hide load more btn
            this.loadMoreBtnEle.classList.remove('active');
        }
    }

    // Build options
    buildOptions(type) {
        if(type === 'color') {
            // Background Color Picker
            elementOptions({
                type: 'color-picker',
                class: '.backgroundColorPicker',
                value: storeRead().artboard.backgroundColor,
                opacity: false,
                update: (value) => {
                    let hex = value.toHEXA().toString();
                    storeMutation('updateArtboardBackground', {
                        type: 'solid',
                        color: hex
                    });
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
        else if(type === 'gradient') {
            // Background Color 1 Picker
            elementOptions({
                type: 'color-picker',
                class: '.backgroundColorPicker1',
                value: storeRead().artboard.backgroundGradientColors[0],
                opacity: false,
                update: (value) => {
                    let hex = value.toHEXA().toString();
                    storeMutation('updateArtboardBackground', {
                        type: 'gradient',
                        subType: 'single',
                        color: hex,
                        index: 0,
                        rotation: storeRead().artboard.gradientRotation,
                        gradientType: storeRead().artboard.gradientType
                    });
                },
                error: (err) => {
                    console.error(err);
                }
            });
            // Background Color 2 Picker
            elementOptions({
                type: 'color-picker',
                class: '.backgroundColorPicker2',
                value: storeRead().artboard.backgroundGradientColors[1],
                opacity: false,
                update: (value) => {
                    let hex = value.toHEXA().toString();
                    storeMutation('updateArtboardBackground', {
                        type: 'gradient',
                        subType: 'single',
                        color: hex,
                        index: 1,
                        rotation: storeRead().artboard.gradientRotation,
                        gradientType: storeRead().artboard.gradientType
                    });
                },
                error: (err) => {
                    console.error(err);
                }
            });
            // Gradient Angle
            elementOptions({
                type: 'slider-input',
                id: 'cm_gradientAngleInp',
                value: storeRead().artboard.gradientRotation,
                displayId: 'cm_gradientAngleText',
                displayFormat: (value) => {
                    return `${value}deg`;
                },
                update: (value) => {
                    storeMutation('updateArtboardBackground', {
                        type: 'gradient',
                        colors: storeRead().artboard.backgroundGradientColors,
                        rotation: value,
                        gradientType: storeRead().artboard.gradientType
                    });
                },
                error: (err) => {
                    console.error(err);
                }
            });
            // Gradient Type
            elementOptions({
                type: 'multiple-btns',
                id: 'cm_gradientTypeOption',
                value: storeRead().artboard.gradientType,
                update: (value) => {
                    storeMutation('updateArtboardBackground', {
                        type: 'gradient',
                        colors: storeRead().artboard.backgroundGradientColors,
                        rotation: storeRead().artboard.gradientRotation,
                        gradientType: value
                    });
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
        else if(type === 'image') {


        }
    }

    // Render
    render(callback) {
        callback(this.markup);
    }
}