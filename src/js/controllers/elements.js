import { storeMutation, storeRead } from './store';

// This class is responsible for
// Adding event listeners to artboard to catch all targets
// Spawning the selector element around all the elements in a group
// Re posistioning etc the element based on user input
export default class ElementSelector {
    constructor() {
        this.handlers = {};
        this.selectElementTemplate = `
            <div id="cm_selectionElement" class="sectionBoxCon">
                <button id="cm_moveEleBtn" class="moveElementBtn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M20 14v5a1 1 0 01-1 1h-5a1 1 0 01-.8-1.8l1.6-1.6-4.8-4.8-4.8 4.8 1.6 1.6a1 1 0 01-.7 1.8H1A1 1 0 010 19v-5a1 1 0 011.8-.8l1.6 1.6L8.2 10 3.4 5.2 1.8 6.8A1 1 0 010 6.1V1A1 1 0 011 0h5a1 1 0 01.8 1.8L5.2 3.4 10 8.2l4.8-4.8-1.6-1.6a1 1 0 01.7-1.8h5A1 1 0 0120 1v5a1 1 0 01-1.8.8l-1.6-1.6-4.8 4.8 4.8 4.8 1.6-1.6a1 1 0 011.8.7z" fill="#fff"/></svg></button>
                <button id="cm_scaleBtn" class="botRight scaleBtn"></button>
                <button id="cm_scaleWidthBtn" class="scaleBtn rightMid"></button>
                <button id="cm_scaleHeightBtn" class="scaleBtn botMid"></button>
            </div>`;
        this.selectedElements = [];
        this.shiftActive = false;

        this.data = {
            zoomPercent: 1,
            snappingThreshold: 10
        };

        this.whitelistSelectIds = [
            'cm_scaleBtn',
            'cm_moveEleBtn',
            'cm_scaleHeightBtn',
            'cm_scaleWidthBtn',
            'cm_alignSelectedYBtn',
            'cm_alignSelectedXBtn'
        ];

        this.onSnappingPointY = false;
        this.onSnappingPointX = false;

        // Elements
        this.artboardElement = document.getElementById('cm_artboard');
        this.snappingPointIndElement = document.getElementById('cm_snappingPointInd');
        this.snappingPointCenterYElement = document.getElementById('cm_snappingPointCenterY');
        this.snappingPointCenterXElement = document.getElementById('cm_snappingPointCenterX');

        this.selectListener();
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
                case 'elements-manipulated': {
                    callback();
                    break;
                }
            }
        }
    }
    
    setData(config) {
        // TEMP
        // replace with store system
        this.data[config.key] = config.value;
    }

    // listen for selects
    selectListener() {
        window.addEventListener('keydown', (e) => { if(e.which === 16) this.shiftActive = true; });
        window.addEventListener('keyup', (e) => { if(e.which === 16) this.shiftActive = false; });
        window.addEventListener('click', (e) => {
            if(e.target.attributes['selectable']) {
                var findMatchEleI = storeRead().artboard.elements.findIndex( x => x.element === e.target);
                if(findMatchEleI != -1) {
                    if(this.shiftActive) {
                        // check the element does exist within the selected array
                        storeMutation('updateArtboardElementByIndex', {
                            index: findMatchEleI,
                            key: 'selected',
                            value: true
                        })
                        storeRead().artboard.elements[findMatchEleI].element.classList.add('selected');
                    }
                    else {
                        // loop over all elements and only select the one click
                        for(var key in storeRead().artboard.elements) {
                            storeMutation('updateArtboardElementByIndex', {
                                index: key,
                                key: 'selected',
                                value: false
                            })
                            storeRead().artboard.elements[key].element.classList.remove('selected');
                        }
                        // find clicked 
                        storeMutation('updateArtboardElementByIndex', {
                            index: findMatchEleI,
                            key: 'selected',
                            value: true
                        })
                        storeRead().artboard.elements[findMatchEleI].element.classList.add('selected');
                        document.getElementById(`cm_layerRow-${storeRead().artboard.elements[findMatchEleI].id}`).click();
                    };
                    // Reset snap point lock
                    this.resetSnappingPoints();
                    // Update selection box
                    this.updateSelectionBox();
                }
            } 
            else {
                // if item is in whitelist
                var whiteListItemFound = this.whitelistSelectIds.find( x => x === e.target.id);
                if(!whiteListItemFound) {
                    this.removeSelection();
                }
            }
        });
    }
    updateSelectionBox() {
        // Work out the most top left corner of an element relative to the artboard
        // Work out the most bottom right corner of an element relative to the artboard
        var elementCoords = [
            [], // top values
            [], // right values
            [], // bottom values
            [] // left values
        ];
        // for each element
        for(var i = 0; i < storeRead().artboard.elements.length; i++) {
            var target = storeRead().artboard.elements[i];
            if(target.selected) {
                elementCoords[0].push(target.element.offsetTop);  // top
                elementCoords[1].push(this.artboardElement.offsetWidth - (target.element.offsetWidth + target.element.offsetLeft)); // right
                elementCoords[2].push(this.artboardElement.offsetHeight - (target.element.offsetHeight + target.element.offsetTop)); // bottom
                elementCoords[3].push(target.element.offsetLeft); // left
            }
        }
        this.selectionBoxPos = [0,0,0,0];
        // for each set of element coords work out the bounding box of the selection
        this.selectionBoxPos[0] = Math.min(...elementCoords[0]);
        this.selectionBoxPos[1] = Math.min(...elementCoords[1]);
        this.selectionBoxPos[2] = Math.min(...elementCoords[2]);
        this.selectionBoxPos[3] = Math.min(...elementCoords[3]);
     
        // Create or update selection element pos & add event listeners to scale btns
        if(!document.getElementById('cm_selectionElement')) {
            this.artboardElement.insertAdjacentHTML('beforeend', this.selectElementTemplate);
            this.selectionBoxElement = document.getElementById('cm_selectionElement');
            // Add listeners for select box buttons
            this.selectorButtonEventHandler();
        }
        // set selectionBoxElement size/pos
        this.selectionBoxElement.style.top = `${this.selectionBoxPos[0]}px`;
        this.selectionBoxElement.style.left = `${this.selectionBoxPos[3]}px`;
        this.selectionBoxElement.style.right = `${this.selectionBoxPos[1]}px`;
        this.selectionBoxElement.style.bottom = `${this.selectionBoxPos[2]}px`;
    }
    // Reset eveything to do with the selection
    removeSelection() {
        if(document.getElementById('cm_selectionElement')) document.getElementById('cm_selectionElement').remove();
        for(var key in storeRead().artboard.elements) {
            storeMutation('updateArtboardElementByIndex', {
                index: key,
                key: 'selected',
                value: false
            });
            storeRead().artboard.elements[key].element.classList.remove('selected');
        }
        this.resetSnappingPoints();
        this.moveElementButtonDown = false;
        this.scaleElementButtonDown = false;
        this.oldMousePos = undefined;
        if(document.getElementById('cm_sizeTooltip')) document.getElementById('cm_sizeTooltip').remove();
        this.updateSizeTooltipData = false;
    }

    // Create all event handlers for selector buttons
    selectorButtonEventHandler() {
        // Handle down events for move button
        document.getElementById('cm_moveEleBtn').addEventListener('mousedown', (e) => {
            this.moveElementButtonDown = true;
            for(var key in storeRead().artboard.elements) {
                if(storeRead().artboard.elements[key].selected) {
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'offset',
                        value: [
                            storeRead().artboard.elements[key].element.offsetLeft - (e.clientX / this.data.zoomPercent),
                            storeRead().artboard.elements[key].element.offsetTop - (e.clientY / this.data.zoomPercent)
                        ]
                    });
                }
            }
        }, true);
        document.getElementById('cm_moveEleBtn').addEventListener('touchstart', (e) => {
            this.moveElementButtonDown = true;
            for(var key in storeRead().artboard.elements) {
                if(storeRead().artboard.elements[key].selected) {
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'offset',
                        value: [
                            storeRead().artboard.elements[key].element.offsetLeft - (e.changedTouches[0].clientX  / this.data.zoomPercent),
                            storeRead().artboard.elements[key].element.offsetTop - (e.changedTouches[0].clientY  / this.data.zoomPercent)
                        ]
                    });
                }
            }
        }, true);
        // Handle down events for scale button
        document.getElementById('cm_scaleBtn').addEventListener('mousedown', (e) => {
            for(var key in storeRead().artboard.elements) {
                if(storeRead().artboard.elements[key].selected) {
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'aspectRatio',
                        value: storeRead().artboard.elements[key].element.offsetHeight / storeRead().artboard.elements[key].element.offsetWidth
                    });
                }
            }
            this.scaleElementButtonDown = true;
            this.scaleType = 'both';
        }, true);
        document.getElementById('cm_scaleBtn').addEventListener('touchstart', (e) => {
            for(var key in storeRead().artboard.elements) {
                if(storeRead().artboard.elements[key].selected) {
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'aspectRatio',
                        value: storeRead().artboard.elements[key].element.offsetHeight / storeRead().artboard.elements[key].element.offsetWidth
                    });
                }
            }
            this.scaleElementButtonDown = true;
            this.scaleType = 'both';
        }, true);
        // Handle down events for scale width button
        document.getElementById('cm_scaleWidthBtn').addEventListener('mousedown', (e) => {
            this.scaleElementButtonDown = true;
            this.scaleType = 'x';
        }, true);
        document.getElementById('cm_scaleWidthBtn').addEventListener('touchstart', (e) => {
            this.scaleElementButtonDown = true;
            this.scaleType = 'x';
        }, true);
        // Handle down events for scale height button
        document.getElementById('cm_scaleHeightBtn').addEventListener('mousedown', (e) => {
            this.scaleElementButtonDown = true;
            this.scaleType = 'y';
        }, true);
        document.getElementById('cm_scaleHeightBtn').addEventListener('touchstart', (e) => {
            this.scaleElementButtonDown = true;
            this.scaleType = 'y';
        }, true);

        var artboardPageConEle = document.getElementById('cm_artboardPageCon');

        // Shared - mouse
        // Handle release of all buttons
        artboardPageConEle.addEventListener('mouseup', () => { 
            if(this.scaleElementButtonDown || this.moveElementButtonDown) this.handleTooltip(false);
            this.moveElementButtonDown = false;
            this.scaleElementButtonDown = false;
            this.oldMousePos = undefined;
        }, true);
        // Handle mouse move
        artboardPageConEle.addEventListener('mousemove', (e) => {
            e.preventDefault();
            // Move
            if(this.moveElementButtonDown) this.handleMoveEleMoveEvent({
                clientX: e.clientX / this.data.zoomPercent,
                clientY: e.clientY / this.data.zoomPercent
            });
            // Scale
            if(this.scaleElementButtonDown) {
                this.handleTooltip(true, 'size');
                var rect = this.artboardElement.getBoundingClientRect();
                if(this.oldMousePos === undefined) {
                    this.oldMousePos = [
                        ((e.clientX - rect.left) - parseInt(this.selectionBoxElement.style.left)) / this.data.zoomPercent, 
                        ((e.clientY - rect.top) - parseInt(this.selectionBoxElement.style.top)) / this.data.zoomPercent
                    ];
                }
                this.newMousePos = [
                    ((e.clientX - rect.left) - parseInt(this.selectionBoxElement.style.left)) / this.data.zoomPercent, 
                    ((e.clientY - rect.top) - parseInt(this.selectionBoxElement.style.top)) / this.data.zoomPercent
                ]; // x, y
                // Update on size
                // eventually loop through items selected and pass them as the target
                this.handleScaleEleMoveEvent(this.scaleType);
                // if the difference in new and old mouse pos for each axis is greater than 5 update it
                this.oldMousePos = this.newMousePos;
                this.emit('elements-manipulated');
            }
        }, true);

        // Shared - touch
        // Handle release of all buttons
        artboardPageConEle.addEventListener('touchend', () => { 
            if(this.scaleElementButtonDown || this.moveElementButtonDown) this.handleTooltip(false);
            this.moveElementButtonDown = false;
            this.scaleElementButtonDown = false;
            this.oldMousePos = undefined;
        }, true);
        // Handle mouse move
        artboardPageConEle.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if(this.moveElementButtonDown) this.handleMoveEleMoveEvent({
                clientX: e.changedTouches[0].clientX  / this.data.zoomPercent,
                clientY: e.changedTouches[0].clientY  / this.data.zoomPercent
            });
            if(this.scaleElementButtonDown) {
                this.handleTooltip(true, 'size');
                var rect = this.artboardElement.getBoundingClientRect();
                if(this.oldMousePos === undefined) {
                    this.oldMousePos = [
                        ((e.changedTouches[0].clientX - rect.left) - parseInt(this.selectionBoxElement.style.left)) / this.data.zoomPercent, 
                        ((e.changedTouches[0].clientY - rect.top) - parseInt(this.selectionBoxElement.style.top)) / this.data.zoomPercent
                    ];
                }
                this.newMousePos = [
                    ((e.changedTouches[0].clientX - rect.left) - parseInt(this.selectionBoxElement.style.left)) / this.data.zoomPercent, 
                    ((e.changedTouches[0].clientY - rect.top) - parseInt(this.selectionBoxElement.style.top)) / this.data.zoomPercent
                ]; // x, y
                // Update on size
                // eventually loop through items selected and pass them as the target
                this.handleScaleEleMoveEvent(this.scaleType);
                // if the difference in new and old mouse pos for each axis is greater than 5 update it
                this.oldMousePos = this.newMousePos;
                this.emit('elements-manipulated');
            }
        }, { passive: false });
    }
    // Move element on mouse move
    handleMoveEleMoveEvent(data) {
        this.handleTooltip(true, 'pos');
        this.checkSnappingPoints(data);
        for(var key in storeRead().artboard.elements) {
            if(storeRead().artboard.elements[key].selected) {

                // Check snapping point x is not active
                if(!this.onSnappingPointX) {
                    // Update selection elements pos
                    var newX =  (data.clientX + storeRead().artboard.elements[key].offset[0]) + 'px';
                    storeRead().artboard.elements[key].element.style.left = newX;
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'left',
                        value: newX
                    });
                }
                // Check snapping point y is not active
                if(!this.onSnappingPointY) {
                    // Update selection elements pos
                    var newY = (data.clientY + storeRead().artboard.elements[key].offset[1]) + 'px';
                    storeRead().artboard.elements[key].element.style.top = newY;
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'top',
                        value: newY
                    });
                }

            }
        }
        this.updateSelectionBox();
        this.emit('elements-manipulated');
    }
    // Scale element on mouse move
    handleScaleEleMoveEvent(axis) {
        // axis is either: x, y, both
        this.resetSnappingPoints();
        // Scale element that is selected
        for(var key in storeRead().artboard.elements) {
            if(storeRead().artboard.elements[key].selected) {
                if(axis === 'x') {
                    var mousePosDifX = Math.abs(this.newMousePos[0] - this.oldMousePos[0]);
                    // Get bigger
                    if(this.newMousePos[0] > this.oldMousePos[0]) var width = storeRead().artboard.elements[key].element.offsetWidth + mousePosDifX;
                    // Get smaller
                    else var width = storeRead().artboard.elements[key].element.offsetWidth - mousePosDifX;

                    // Case for triangles
                    if(storeRead().artboard.elements[key].shape != 'triangle') {
                        storeRead().artboard.elements[key].element.style.width = `${width}px`;
                    }
                    else {
                        storeRead().artboard.elements[key].element.style.borderLeftWidth = `${width / 2}px`;
                        storeRead().artboard.elements[key].element.style.borderRightWidth = `${width / 2}px`;
                    }
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'width',
                        value: width
                    });

                }
                else if(axis === 'y') {
                    var mousePosDifY = Math.abs(this.newMousePos[1] - this.oldMousePos[1]);
                    // Get bigger
                    if(this.newMousePos[1] > this.oldMousePos[1]) var height = storeRead().artboard.elements[key].element.offsetHeight + mousePosDifY;
                    // Get smaller
                    else var height = storeRead().artboard.elements[key].element.offsetHeight - mousePosDifY;

                    // Case for triangles
                    if(storeRead().artboard.elements[key].shape != 'triangle') {
                        storeRead().artboard.elements[key].element.style.height = `${height}px`;
                    }
                    else {
                        storeRead().artboard.elements[key].element.style.borderBottomWidth = `${height}px`;
                    }
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'height',
                        value: height
                    });

                }
                else if(axis === 'both') {
                    var mousePosDifY = Math.abs(this.newMousePos[1] - this.oldMousePos[1]);
                    var mousePosDifX = Math.abs(this.newMousePos[0] - this.oldMousePos[0]);
                    // Scale them at the same time to keep the aspect ratio
                    if(this.shiftActive) {
                        // GET THE CURRENT ASPECT RATIO OF THE ELEMENT
                        // only update the width, then work out the height based on the aspect ratio
                        var incVal = Math.max(mousePosDifX, mousePosDifY);
                        //bigger
                        if(this.newMousePos[0] > this.oldMousePos[0] || this.newMousePos[1] > this.oldMousePos[1]) {
                            var width = storeRead().artboard.elements[key].element.offsetWidth + incVal;
                            var height = Math.floor(storeRead().artboard.elements[key].aspectRatio * storeRead().artboard.elements[key].element.offsetWidth);
                        }
                        // smaller
                        else {
                            var width = storeRead().artboard.elements[key].element.offsetWidth - incVal;
                            var height = Math.floor(storeRead().artboard.elements[key].aspectRatio * storeRead().artboard.elements[key].element.offsetWidth);
                        }

                        // Case for triangles
                        if(storeRead().artboard.elements[key].shape != 'triangle') {
                            storeRead().artboard.elements[key].element.style.width = `${width}px`;
                            storeRead().artboard.elements[key].element.style.height = `${height}px`;
                        }
                        else {
                            storeRead().artboard.elements[key].element.style.borderLeftWidth = `${width / 2}px`;
                            storeRead().artboard.elements[key].element.style.borderRightWidth = `${width / 2}px`;
                            storeRead().artboard.elements[key].element.style.borderBottomWidth = `${height}px`;
                        }
                        storeMutation('updateArtboardElementByIndex', {
                            index: key,
                            key: 'width',
                            value: width
                        });
                        storeMutation('updateArtboardElementByIndex', {
                            index: key,
                            key: 'height',
                            value: height
                        });

                    } 
                    // Scale width and height independently
                    else {
                        // Apply height
                        // Get bigger
                        if(this.newMousePos[1] > this.oldMousePos[1]) var height = storeRead().artboard.elements[key].element.offsetHeight + mousePosDifY;
                        // Get smaller
                        else var height = storeRead().artboard.elements[key].element.offsetHeight - mousePosDifY;

                        // Case for triangles
                        if(storeRead().artboard.elements[key].shape != 'triangle') {
                            storeRead().artboard.elements[key].element.style.height = `${height}px`;
                        }
                        else {
                            storeRead().artboard.elements[key].element.style.borderBottomWidth = `${height}px`;
                        }
                        storeMutation('updateArtboardElementByIndex', {
                            index: key,
                            key: 'height',
                            value: height
                        });

                        // Apply width
                        // Get bigger
                        if(this.newMousePos[0] > this.oldMousePos[0]) var width = storeRead().artboard.elements[key].element.offsetWidth + mousePosDifX;
                        // Get smaller
                        else var width = storeRead().artboard.elements[key].element.offsetWidth - mousePosDifX;

                        // Case for triangles
                        if(storeRead().artboard.elements[key].shape != 'triangle') {
                            storeRead().artboard.elements[key].element.style.width = `${width}px`;
                        }
                        else {
                            storeRead().artboard.elements[key].element.style.borderLeftWidth = `${width / 2}px`;
                            storeRead().artboard.elements[key].element.style.borderRightWidth = `${width / 2}px`;
                        }
                        storeMutation('updateArtboardElementByIndex', {
                            index: key,
                            key: 'width',
                            value: width
                        });
           
                    }
                }
                this.updateSelectionBox();
            }
        }
        this.updateSelectionBox();
    }

    // Spawn tooltip bellow cursor, display appropriate data depending on action
    handleTooltip(action, type) {
        if(action) {
            if(!this.updateSizeTooltipData) {
                // spawn tooltip
                this.updateSizeTooltipData = true;
                var tooltip = document.createElement("SPAN");
                tooltip.id = 'cm_sizeTooltip';
                tooltip.classList.add('sizeTooltipCon');
                tooltip.style.top = `${window.event.clientY + 20}px`;
                tooltip.style.left = `${window.event.clientX + 20}px`;
                if(type === 'size') {
                    tooltip.innerHTML = `W: ${this.selectionBoxElement.offsetWidth}px H: ${this.selectionBoxElement.offsetHeight}px`;
                }
                else if(type === 'pos') {
                    tooltip.innerHTML = `T: ${this.selectionBoxElement.style.top} R: ${this.selectionBoxElement.style.right}<br>B: ${this.selectionBoxElement.style.bottom} L: ${this.selectionBoxElement.style.left}`;
                }
                document.getElementsByTagName("BODY")[0].append(tooltip);
            }
            else {
                // update data inside & tooltip pos
                var sizeTooltip = document.getElementById('cm_sizeTooltip');
                sizeTooltip.style.top = `${window.event.clientY + 20}px`;
                sizeTooltip.style.left = `${window.event.clientX + 20}px`;
                if(type === 'size') {
                    sizeTooltip.innerHTML = `W: ${this.selectionBoxElement.offsetWidth}px H: ${this.selectionBoxElement.offsetHeight}px`;
                }
                else if(type === 'pos') {
                    sizeTooltip.innerHTML = `T: ${this.selectionBoxElement.style.top} R: ${this.selectionBoxElement.style.right}<br>B: ${this.selectionBoxElement.style.bottom} L: ${this.selectionBoxElement.style.left}`;
                }
            }
        }
        else {
            // remove tooltip
            if(document.getElementById('cm_sizeTooltip')) document.getElementById('cm_sizeTooltip').remove();
            this.updateSizeTooltipData = false;
        }
    }

    // Snapping points
    checkSnappingPoints(data) {
        // CHECK FOR THE SNAPPING POINTS ON THE OUTER EDGE OF THE ARTBOARD
        // Check snapping points for y axis
        if(this.selectionBoxPos[0] === 0 || this.selectionBoxPos[2] === 0) { // top - bottom
            this.onSnappingPointY = true;
            this.spawnArtboardSnappingPointIndicator('y', true);
            // If mouse y pos hasnt been registerd do that
            // Then check if we are passed a difference of this.data.snappingThreshold
            if(this.mouseOffsetY === undefined) {
                this.mouseOffsetY = data.clientY;
            }
            else {
                let dif = Math.abs(this.mouseOffsetY - data.clientY);
                if(dif > this.data.snappingThreshold) {
                    this.onSnappingPointY = false;
                    this.mouseOffsetY = undefined;
                    this.spawnArtboardSnappingPointIndicator('y', false);
                }
            }
        }
        // Check snapping points for x axis
        if(this.selectionBoxPos[1] === 0 || this.selectionBoxPos[3] === 0) { // right - left
            this.onSnappingPointX = true;
            this.spawnArtboardSnappingPointIndicator('x', true);
            // If mouse y pos hasnt been registerd do that
            // Then check if we are passed a difference of this.data.snappingThreshold
            if(this.mouseOffsetX === undefined) {
                this.mouseOffsetX = data.clientX;
            }
            else {
                let dif = Math.abs(this.mouseOffsetX - data.clientX);
                if(dif > this.data.snappingThreshold) {
                    this.onSnappingPointX = false;
                    this.mouseOffsetX = undefined;
                    this.spawnArtboardSnappingPointIndicator('x', false);
                }
            }
        }

        // CHECK FOR THE SNAPPING POINTS IN THE CENTER OF THE ARTBOARD
        var artboardCenterX = this.artboardElement.offsetWidth / 2;
        var artboardCenterY = this.artboardElement.offsetHeight / 2;

        var selectionWidth = this.selectionBoxElement.offsetWidth;
        var selectionHeight = this.selectionBoxElement.offsetHeight;

        var selectionCenterY = Math.ceil((this.artboardElement.offsetHeight - Math.abs(this.selectionBoxPos[0] - this.selectionBoxPos[2])) / 2);
        var selectionCenterX =  Math.ceil((this.artboardElement.offsetWidth -  Math.abs(this.selectionBoxPos[1] - this.selectionBoxPos[3])) / 2);


        // Check snapping points for the y axis to spawn x axis center
        if(selectionHeight + this.data.snappingThreshold < this.artboardElement.offsetHeight / 2) {
            if(this.selectionBoxPos[0] === artboardCenterY || this.selectionBoxPos[2] === artboardCenterY || selectionCenterY === artboardCenterY) {
                this.onSnappingPointY = true;
                this.spawnArtboardSnappingPointIndicator('y-center', true);
                // If mouse y pos hasnt been registerd do that
                // Then check if we are passed a difference of this.data.snappingThreshold
                if(this.mouseOffsetY === undefined) {
                    this.mouseOffsetY = data.clientY;
                }
                else {
                    let dif = Math.abs(this.mouseOffsetY - data.clientY);
                    if(dif > this.data.snappingThreshold) {
                        this.onSnappingPointY = false;
                        this.mouseOffsetY = undefined;
                        this.spawnArtboardSnappingPointIndicator('y-center', false);
                    }
                }
            }
        }
        else {
            // Allow center snapping
            if(selectionCenterY === artboardCenterY) {
                this.onSnappingPointY = true;
                this.spawnArtboardSnappingPointIndicator('y-center', true);
                // If mouse y pos hasnt been registerd do that
                // Then check if we are passed a difference of this.data.snappingThreshold
                if(this.mouseOffsetY === undefined) {
                    this.mouseOffsetY = data.clientY;
                }
                else {
                    let dif = Math.abs(this.mouseOffsetY - data.clientY);
                    if(dif > this.data.snappingThreshold) {
                        this.onSnappingPointY = false;
                        this.mouseOffsetY = undefined;
                        this.spawnArtboardSnappingPointIndicator('y-center', false);
                    }
                }
            }
        }
        // Check snapping points for the x axis to spawn x axis center
        if(selectionWidth + this.data.snappingThreshold < this.artboardElement.offsetWidth / 2) {
            if(this.selectionBoxPos[1] === artboardCenterX || this.selectionBoxPos[3] === artboardCenterX || selectionCenterX === artboardCenterX) {
                this.onSnappingPointX = true;
                this.spawnArtboardSnappingPointIndicator('x-center', true);
                // If mouse x pos hasnt been registerd do that
                // Then check if we are passed a difference of this.data.snappingThreshold
                if(this.mouseOffsetX === undefined) {
                    this.mouseOffsetX = data.clientX;
                }
                else {
                    let dif = Math.abs(this.mouseOffsetX - data.clientX);
                    if(dif > this.data.snappingThreshold) {
                        this.onSnappingPointX = false;
                        this.mouseOffsetX = undefined;
                        this.spawnArtboardSnappingPointIndicator('x-center', false);
                    }
                }
            }
        }
        else {
            // Allow center snapping
            if(selectionCenterX === artboardCenterX) {
                this.onSnappingPointX = true;
                this.spawnArtboardSnappingPointIndicator('x-center', true);
                // If mouse x pos hasnt been registerd do that
                // Then check if we are passed a difference of this.data.snappingThreshold
                if(this.mouseOffsetX === undefined) {
                    this.mouseOffsetX = data.clientX;
                }
                else {
                    let dif = Math.abs(this.mouseOffsetX - data.clientX);
                    if(dif > this.data.snappingThreshold) {
                        this.onSnappingPointX = false;
                        this.mouseOffsetX = undefined;
                        this.spawnArtboardSnappingPointIndicator('x-center', false);
                    }
                }
            }
        }

    }
    spawnArtboardSnappingPointIndicator(axis, action) {
        if(axis === 'x') {
            // Determine if its the left indicator or the right snapping indicator
            if(this.selectionBoxPos[1] === 0) { // right
                if(action) this.snappingPointIndElement.style.borderRight = '1px solid';
                else this.snappingPointIndElement.style.borderRight = 'none';
            }
            if(this.selectionBoxPos[3] === 0) { // left
                if(action) this.snappingPointIndElement.style.borderLeft = '1px solid';
                else this.snappingPointIndElement.style.borderLeft = 'none';
            }
        }
        else if(axis === 'y') {
            // Determine if its the top indicator or the bottom snapping indicator
            if(this.selectionBoxPos[0] === 0) { // top
                if(action) this.snappingPointIndElement.style.borderTop = '1px solid';
                else this.snappingPointIndElement.style.borderTop = 'none';
            }
            if(this.selectionBoxPos[2] === 0) { // bottom
                if(action) this.snappingPointIndElement.style.borderBottom = '1px solid';
                else this.snappingPointIndElement.style.borderBottom = 'none';
            }
        }
        // center indicators
        else if(axis === 'y-center') {
            // console.log('spawn y center');
            if(action) this.snappingPointCenterYElement.style.borderBottom = '1px solid';
            else this.snappingPointCenterYElement.style.borderBottom = 'none';
        }
        else if(axis === 'x-center') {
            // console.log('spawn y center');
            if(action) this.snappingPointCenterXElement.style.borderRight = '1px solid';
            else this.snappingPointCenterXElement.style.borderRight = 'none';
        } 
    }
    resetSnappingPoints() {
        // Turn off snapping point indicators
        this.onSnappingPointY = false;
        this.onSnappingPointX = false;
        this.snappingPointIndElement.style.borderTop = 'none';
        this.snappingPointIndElement.style.borderRight = 'none';
        this.snappingPointIndElement.style.borderBottom = 'none';
        this.snappingPointIndElement.style.borderLeft = 'none';
        this.snappingPointCenterYElement.style.borderBottom = 'none';
        this.snappingPointCenterXElement.style.borderRight = 'none';
    }

    // Layout button effects
    centerSelected(axis) {
        // Scale element that is selected
        for(var key in storeRead().artboard.elements) {
            if(storeRead().artboard.elements[key].selected) {
                if(axis === 'x') {
                    var artboardCenterX = this.artboardElement.offsetWidth / 2;
                    var elementCenterX = storeRead().artboard.elements[key].element.offsetWidth / 2;
                    var left = Math.floor(artboardCenterX - elementCenterX);
                    storeRead().artboard.elements[key].element.style.left = `${left}px`;
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'left',
                        value: `${left}px`
                    });
                }
                else if(axis === 'y') {
                    var artboardCenterY = this.artboardElement.offsetHeight / 2;
                    var elementCenterY = storeRead().artboard.elements[key].element.offsetHeight / 2;
                    var top = Math.floor(artboardCenterY - elementCenterY);
                    storeRead().artboard.elements[key].element.style.top = `${top}px`;
                    storeMutation('updateArtboardElementByIndex', {
                        index: key,
                        key: 'top',
                        value: `${top}px`
                    });
                }
                this.updateSelectionBox();
            }
        }
    }
}