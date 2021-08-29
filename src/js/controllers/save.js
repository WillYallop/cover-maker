'use strict';

import modalTemplate from '../../markup/components/saveModal.html';
import { saveAs } from 'file-saver';
import imageCompression from 'browser-image-compression';
import { toPng } from 'html-to-image';
import { storeRead } from './store';

var config = {};
var removeSelected = undefined;
var image = undefined;
var originalImage = undefined;
var imageConfig = {
    format: 'image/jpeg',
    quality: 100,
    size: [300,300]
};

// ----------------------------------//
// ---- Image Method ----------------//
// ----------------------------------//

// Get image from HTML
function generateImageFromHtml() {
    return new Promise((resolve, reject) => {
        // Remoe selected elements and snap points
        removeSelected;
        setTimeout(() => {
            function loadXHR(url) {
                return new Promise(function(resolve, reject) {
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url);
                        xhr.responseType = "blob";
                        xhr.onerror = function() {reject("Network error.")};
                        xhr.onload = function() {
                            if (xhr.status === 200) {resolve(xhr.response)}
                            else {reject("Loading error:" + xhr.statusText)}
                        };
                        xhr.send();
                    }
                    catch(err) {reject(err.message)}
                });
            }
            var node = document.getElementById('cm_artboard');
            node.style.transform = 'scale(1)';
            toPng(node)
            .then((dataUrl) => {
                loadXHR(dataUrl)
                .then((blob) => {
                    // Display image in preview
                    const url = URL.createObjectURL(blob);
                    let imgEle = new Image();
                    imgEle.onload = () => {
                        URL.revokeObjectURL(url)
                        handleExportPreview(imgEle);
                    };
                    imgEle.src = url;
    
                    // Resolve
                    resolve(blob);
                });
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                reject(error);
            });
        }, 200);
    });
}

// Optimise img
function optimiseImg(blob) {
    return new Promise((resolve, reject) => {
        var options = {
            maxWidthOrHeight: imageConfig.size[0],
            useWebWorker: true,
            fileType: imageConfig.format,
            initialQuality: imageConfig.quality / 100 
        }
        imageCompression(blob, options)
        .then((compressedFile) => {
            resolve(compressedFile); // write your own logic
        })
        .catch((error) => {
            reject(error.message);
        }); 
    });
}

// Update image config
function updateImgConfig(inp) {
    if(inp === 'format') {
        imageConfig.format = config.imageFormatEle.value;
    }
    else if(inp === 'quality') {
        imageConfig.quality = parseInt(config.imageQualityEle.value);
        document.getElementById('cm_qualityInpDisplay').innerHTML = `${imageConfig.quality}%`;
    }
    else if(inp === 'size') {
        let val = parseInt(config.imageSizePresetEle.value);
        imageConfig.size[0] = val;
        imageConfig.size[1] = val;
    }
}

// ----------------------------------//
// ---- JSON Method -----------------//
// ----------------------------------//

// Generate JSON
function generateJSON(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// ----------------------------------//
// ---- Main ------------------------//
// ----------------------------------//

function handleExportPreview(element) {
    config.previewColEle.innerHTML = '';
    config.previewColEle.append(element);
    document.getElementById('cm_savePreviewColLoadingInd').classList.add('hide');
}

// Handle save
async function save() {
    if(config.methodSelectEle.value === 'image') {
        image = await optimiseImg(originalImage);
        // Download Image
        window.saveAs(image, `${config.saveAs}.${image.type.split('image/')[1]}`);
    }
    else if(config.methodSelectEle.value === 'json') {
        generateJSON(storeRead().artboard, config.saveAs);
    } 
}

// Handle Methods
async function handleMethodChange() {
    // Display appropriate markup and create events
    var imageMethodOptions = document.querySelector('[save-row-type="image"]');
    var jsonMethodOptions = document.querySelector('[save-row-type="json"]');
    if(config.methodSelectEle.value === 'image') {
        if(jsonMethodOptions) jsonMethodOptions.classList.remove('active');
        if(imageMethodOptions) {
            imageMethodOptions.classList.add('active');
            // Define elements
            config.imageFormatEle = document.getElementById('cm_formatInp');
            config.imageQualityEle = document.getElementById('cm_qualityInp');
            config.imageSizePresetEle = document.getElementById('cm_sizePresetInp');
            // Add events
            config.imageFormatEle.addEventListener('change', (e) => updateImgConfig('format'), true);
            config.imageQualityEle.addEventListener('change', (e) => updateImgConfig('quality'), true);
            config.imageSizePresetEle.addEventListener('change', (e) => updateImgConfig('size'), true);

            // Reset defualt image config
            imageConfig = {
                format: 'image/jpeg', 
                quality: 100,
                size: [300,300]
            };

            originalImage = await generateImageFromHtml();
        }
    } 
    else if(config.methodSelectEle.value === 'json') {
        if(imageMethodOptions) imageMethodOptions.classList.remove('active');
        if(jsonMethodOptions) {
            jsonMethodOptions.classList.add('active');
            // Add events

        } 
    }
}

// Handle save as name change
function updateFileName() {
    config.saveAs = config.saveAsInpEle.value;
}

// Toggle Save Modal
function toggleSaveModal() {
    // Remove & Destroy
    if(config.active) {
        if(config.modalEle === undefined) return;
        config.active = false;
        config.modalEle.remove(); 
        destroy(); 
    }
    // Inject modal and create event listeners
    else {
        if(config.injectEleId === undefined) return;
        config.active = true;
        // inject modal and create required event listeners
        document.getElementById(config.injectEleId).insertAdjacentHTML('beforeend', config.modalTemplate);
        // Save elements
        config.modalEle = document.getElementById(config.modalEleId);
        config.closeModalBtnEle = document.getElementById('cm_closeModalBtn');
        config.methodSelectEle = document.getElementById('cm_methodInp');
        config.saveAsInpEle = document.getElementById('cm_saveAsInp');
        config.exportImageBtnEle = document.getElementById('cm_exportImageBtn');
        config.previewColEle = document.getElementById('cm_savePreviewCol');
        // Handle new events
        config.closeModalBtnEle.addEventListener('click', (e) => toggleSaveModal(), true); // Close modal
        config.methodSelectEle.addEventListener('change', (e) => handleMethodChange(), true); // Handle method change
        config.saveAsInpEle.addEventListener('keyup', (e) => updateFileName(), true); // Handle save as file name change
        config.exportImageBtnEle.addEventListener('click', (e) => save(), true); // Add save event
        handleMethodChange();
        updateFileName();
    }
}
 
// Initialise the save
function initSaveController(injectEleId, removeSelectedCallback) {
    // Set config
    config = {
        injectEleId: injectEleId,
        saveBtnEle: document.getElementById('cm_saveBtn'),
        modalEleId: 'cm_saveModal',
        modalTemplate: modalTemplate,
        modalEle: undefined,
        active: false,
        saveAs: 'Playlist Cover'
    };
    removeSelected = removeSelectedCallback;
    config.saveBtnEle.addEventListener('click', (e) => toggleSaveModal(), true); // Add Toggle Save Modal
}

// Destroy listeners
function destroy() {
    config.saveBtnEle.removeEventListener('click', (e) => toggleSaveModal(), true); // Remove Toggle Save Modal Event
    config.closeModalBtnEle.removeEventListener('click', (e) => toggleSaveModal(), true); // Remove close modal event
    config.methodSelectEle.removeEventListener('change', (e) => handleMethodChange(), true); // Remove Handle method change event
    config.exportImageBtnEle.removeEventListener('click', (e) => save(), true); // Remove save event
    config.saveAsInpEle.removeEventListener('keyup', (e) => updateFileName(), true); // Remove Handle save as file name change event
    if(config.methodSelectEle.value === 'image') {
        config.imageFormatEle.removeEventListener('change', (e) => updateImgConfig('format'), true);
        config.imageQualityEle.removeEventListener('change', (e) => updateImgConfig('quality'), true);
        config.imageSizePresetEle.removeEventListener('change', (e) => updateImgConfig('size'), true);
    }
    else if(config.methodSelectEle.value === 'json') {

    }
}

export { initSaveController };