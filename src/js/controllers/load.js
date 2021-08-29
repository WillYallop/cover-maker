'use strict';

import modalTemplate from '../../markup/components/loadModal.html';
import { storeMutation } from './store';

var config = {};
var json;
var fileName;
var fileSize;
var fileVerified = false;

// ----------------------------------//
// ---- FILES Methods -----------------//
// ----------------------------------//

// Verify the contents of the JSON
function checkFile() {
    progressBar(false);
    fileVerified = true;
    config.openFileBtnEle.classList.remove('disabled');
}

// Remove & reset
function removeFile() {
    fileVerified = false;
    config.openFileBtnEle.classList.add('disabled');
    config.filePreviewEle.classList.remove('active');
}
 
function fileUpload(e) {
    var file = e.target.files[0];
    fileName = file.name;
    fileSize = file.size;
    if(file.type != 'application/json') {
        displayError('Unsupported file type! Make sure its JSON!');
    } else {
        var reader = new FileReader();
        progressBar(true);
        reader.onload = function(e){
            try {
                var jsonString = atob(e.target.result.substring(29));
                json = JSON.parse(jsonString);
                checkFile();
                config.fileUploadInp.value = null;
            } catch(ex) {
                displayError('Error parsing JSON!');
                progressBar(false);
            }
        }
        reader.readAsDataURL(file);
    }
}

function dropZoneClick() {
    config.fileUploadInp.click();
}

// Drop function
function onFileDrop(e) {
    e.preventDefault();
    // Use DataTransfer interface to access the file(s)
    if(e.dataTransfer.files.length > 1) {
        displayError('Cannot upload multiple files!');
    }
    else {
        progressBar(true);
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file = e.dataTransfer.files[i];
            fileName = file.name;
            fileSize = file.size;
            if(file.type != 'application/json') {
                displayError('Unsupported file type! Make sure its JSON!');
            } else {
                var reader = new FileReader();
                reader.onload = function(e){
                    try {
                        var jsonString = atob(e.target.result.substring(29));
                        json = JSON.parse(jsonString);
                        checkFile();
                    } catch(ex) {
                        displayError('Error parsing JSON!');
                        progressBar(false);
                    }
                }
                reader.readAsDataURL(file);
            }
        }
    }
} 

function onFileDragOver(e) {
    e.preventDefault();
}
 
function dropIndicator(e, action) {
    e.preventDefault();
    if(action) config.dropZoneEle.classList.add('active');
    else config.dropZoneEle.classList.remove('active');
}

// ----------------------------------//
// ---- Main ------------------------//
// ----------------------------------//

function openFile() {
    if(fileVerified) {
        // Load file into artboard with callbackl
        storeMutation('setArtboardData', json);
        config.loadBtnEle.click();
    }
    else {
        displayError('You need to upload a valid file!');
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function progressBar(action) {
    var loadEle = document.getElementById('cm_fileUploadingCon');
    if(action) {
        // show loading indicator
        loadEle.classList.add('active');
        config.filePreviewEle.classList.remove('active');
    }
    else {
        //  remove loading indicator and populate loaded file details.
        loadEle.classList.remove('active');
        document.getElementById('cm_fileName').innerText = `${fileName} (${formatBytes(fileSize)})`;
        config.filePreviewEle.classList.add('active');
        config.errorRowEle.classList.remove('active');
    }
}

function displayError(err) {
    fileVerified = false;
    config.openFileBtnEle.classList.add('disabled');
    config.errorRowEle.classList.add('active');
    config.errorRowEle.innerText = err;
    console.error('ERROR', err);
}
 
// Toggle Save Modal
function toggleModal() {
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
        config.dropZoneEle = document.getElementById('cm_dropZone');
        config.fileUploadInp = document.getElementById('cm_fileUploadInp');
        config.openFileBtnEle = document.getElementById('cm_openFileBtn');
        config.removeFileBtnEle = document.getElementById('cm_removeFileBtn');
        config.filePreviewEle = document.getElementById('cm_uploadedFileRow');
        config.errorRowEle = document.getElementById('cm_errorRow');
        // Handle new events
        config.closeModalBtnEle.addEventListener('click', (e) => toggleModal(), true); // Close modal
        config.dropZoneEle.addEventListener('click', (e) => dropZoneClick(), true); // trigger file upload input
        config.dropZoneEle.addEventListener('drop', (e) => onFileDrop(e), true); // onFileDrop
        config.dropZoneEle.addEventListener('dragover', (e) => onFileDragOver(e), true); // on drag over

        config.dropZoneEle.addEventListener('dragenter', (e) => dropIndicator(e, true), true); 
        config.dropZoneEle.addEventListener('dragleave', (e) => dropIndicator(e, false), true);
        // 
        config.fileUploadInp.addEventListener('change', (e) => fileUpload(e), false);
        config.openFileBtnEle.addEventListener('click', (e) => openFile(e), true);
        config.removeFileBtnEle.addEventListener('click', (e) => removeFile(), true);
    }
}
 
// Initialise the save
function initLoadController(injectEleId) {
    // Set config
    config = {
        injectEleId: injectEleId,
        loadBtnEle: document.getElementById('cm_loadBtn'),
        modalEleId: 'cm_loadModal',
        modalTemplate: modalTemplate,
        modalEle: undefined,
        active: false
    };
    config.loadBtnEle.addEventListener('click', (e) => toggleModal(), true); // Add Toggle Save Modal
}

// Destroy listeners
function destroy() {
    config.loadBtnEle.removeEventListener('click', (e) => toggleModal(), true); // Remove Toggle Save Modal Event
    config.closeModalBtnEle.removeEventListener('click', (e) => toggleModal(), true); // Remove close modal event
    config.dropZoneEle.removeEventListener('click', (e) => dropZoneClick(), true);
    config.dropZoneEle.removeEventListener('drop', (e) => onFileDrop(e), true);
    config.dropZoneEle.removeEventListener('dragover', (e) => onFileDragOver(e), true); // on drag over
    config.dropZoneEle.removeEventListener('dragenter', (e) => dropIndicator(e, true), true); 
    config.dropZoneEle.removeEventListener('dragleave', (e) => dropIndicator(e, false), true);
    config.fileUploadInp.removeEventListener('change', (e) => fileUpload(e), false);
    config.openFileBtnEle.removeEventListener('click', (e) => openFile(e), true);
    config.removeFileBtnEle.removeEventListener('click', (e) => removeFile(), true);
}

export { initLoadController };