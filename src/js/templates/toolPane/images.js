import Markup from './markup/images.html';
import { storeMutation } from '../../controllers/store';
import axios from 'axios';
import { createClient } from 'pexels';
const client = createClient(process.env.PEXELS_API_KEY);

export default class Text {
    constructor() {
        this.markup = Markup;
    }
    // Initialise
    initialise() {
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
                            let naturalHeight = imgEle.naturalHeight;
                            let naturalWidth = imgEle.naturalWidth;
                            storeMutation('addElementsConfig', {
                                type: 'image',
                                src: result,
                                naturalHeight: naturalHeight,
                                naturalWidth: naturalWidth
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
                let pictureSrc = this.photos[pictureIndex].src.large;
                let imgEle = new Image();
                imgEle.src = pictureSrc;
                imgEle.addEventListener('load', (e) => {
                    let naturalHeight = imgEle.naturalHeight;
                    let naturalWidth = imgEle.naturalWidth;
                    storeMutation('addElementsConfig', {
                        type: 'image',
                        src: pictureSrc,
                        naturalHeight: naturalHeight,
                        naturalWidth: naturalWidth
                    });
                    imgEle.remove();
                });
            }
        }, true);
        this.loadMoreBtnEle.addEventListener('click', (e) => {
            this.loadMoreImages();
        }, true); 

        this.stockImages();
    }
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

    // Render
    render(callback) {
        callback(this.markup);
    }
}