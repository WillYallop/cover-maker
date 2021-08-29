// Contain all config options that you may want to assign to a specific element type

import '@simonwep/pickr/dist/themes/nano.min.css';
import Pickr from '@simonwep/pickr';
import FontPicker from "font-picker";

function elementOptions(config) {
    switch(config.type) {
        // Listen to text input and update value
        case 'text-input': {
            let input = document.getElementById(config.id);
            input.value = config.value;
            input.addEventListener('keyup', (e) => {
                config.update(input.value);
            });
            break;
        }
        // Render image in given id ele
        case 'image-preview': {
            let previewEle = document.getElementById(config.id);
            previewEle.src = config.value;
            break;
        }
        // Handle image upload
        case 'image-upload': {
            let imageInpElement = document.getElementById(config.id);
            imageInpElement.addEventListener('change', (e) => {
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
                            config.update(result);
                        })
                    };
                    reader.onerror = (error) => {
                        config.error(error);
                    };
                }
            }, false);
            break;
        }
        // Handle multiple btns
        case 'multiple-btns': {
            var btnsConELe = document.getElementById(config.id);
            for(let i = 0; i < btnsConELe.children.length; i++) {
                var child = btnsConELe.children[i];
                // Set active if currently selected
                if(child.attributes['value'].value === config.value) {
                    child.classList.add('active');
                }
                // Add event listeners to btns
                child.addEventListener('click', (e) => {
                    var target = e.target;
                    if(target.nodeName === 'BUTTON') {
                        if(!target.classList.contains('active')) {
                            // Remove active from all other children
                            for(let ci = 0; ci < btnsConELe.children.length; ci++) {
                                btnsConELe.children[ci].classList.remove('active');
                            }
                            target.classList.add('active');
                            // return target value attribute
                            config.update(target.attributes['value'].value);
                        }
                    }
                });
            }
            break;
        }
        // Handle color picker
        case 'color-picker': {
            var pickr = Pickr.create({
                el: config.class,
                theme: 'nano', // or 'monolith', or 'nano'
                default: config.value,
                components: {
                    // Main components
                    preview: true,
                    opacity: config.opacity,
                    hue: true,
                    interaction: {
                        hex: true,
                        input: true,
                        clear: true,
                        save: true
                    }
                }
            });
            pickr.on('save', (color, instance) => {
                config.update(color);
            });
            break;
        }
        // Handle font face
        case 'font-face': {
            // Font Face
            new FontPicker(process.env.GOOGLE_FONTS_API_KEY, config.value, {  }, ((val) => {
                config.update(val.family);
            }));
            break;
        }
        // Handle number inputs
        case 'number-input': {
            var numberInpEle = document.getElementById(config.id);
            numberInpEle.value = config.value;
            var timer;
            const waitTime = 500;
            numberInpEle.addEventListener('keyup', (e) => {
                var value = parseInt(e.target.value);
                numberInpEle.value = value
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if(value < config.minValue) value = config.resetValue, numberInpEle.value = value;
                    config.update(value);
                }, waitTime);
            });
            break;
        }
        // Slider Inputs
        case 'slider-input': {
            var previewTextEle = document.getElementById(config.displayId);
            previewTextEle.innerText = config.displayFormat(config.value);
            var sliderInput = document.getElementById(config.id);
            sliderInput.value = config.value;
            var sliderLoop;
            function loop() {
                sliderLoop = setInterval(() => {
                    config.update(sliderInput.value);
                    previewTextEle.innerText = config.displayFormat(sliderInput.value);
                }, 50);
            }
            sliderInput.addEventListener('mousedown', (e) => {
                loop();
            });
            sliderInput.addEventListener('touchstart', (e) => {
                loop();
            });
            sliderInput.addEventListener('mouseup', (e) => {
                clearInterval(sliderLoop);
            });
            sliderInput.addEventListener('touchend', (e) => {
                clearInterval(sliderLoop);
            });
            break;
        }
        // Render Section Select
        case 'render-section-select': {
            let selectElement = document.getElementById(config.id);
            selectElement.value = config.value;
            selectElement.addEventListener('change', (e) => {
                config.update(selectElement.value);
                // Find elements with config.sectionAttribute
                let sectionElements = document.querySelectorAll(`div[${config.sectionAttribute}]`);
                for(var i = 0; i < sectionElements.length; i++) {
                    let section = sectionElements[i];
                    if(section.attributes[`${config.sectionAttribute}`].value != selectElement.value) section.classList.remove('active');
                    else section.classList.add('active');
                }
                // hide all but the selected one
            }, false);
            // Set current
            let selectedSectionEle = document.querySelector(`div[${config.sectionAttribute}='${config.value}']`);
            selectedSectionEle.classList.add('active');
            break;
        }
    }
}

export { elementOptions };