import { buildElement } from '../functions/buildElement';
import { setArtboardBackground } from '../functions/setArtboardBackground';

const version = '1.0.0';

var state = {
    handlers: {}, 
    getFilesCallback: undefined,
    variables: undefined,
    artboard: {
        version: version,
        backgroundColor: '#fff',
        backgroundType: 'solid',
        backgroundGradientColors: ['#fff', '#fff'],
        gradientRotation: 90,
        gradientType: 'linear',
        totalImagesAdded: 0,
        textBlocksAdded: 0,
        totalShapesAdded: 0,
        elements: []
    }
}

function storeMutation(mutation, data) {
    switch(mutation) {
        // Set artboard data
        // Used for: load feature
        case 'setArtboardData': {
            state.artboard.elements = undefined;
            var newArtboard = {
                version: data.version,
                backgroundColor: data.backgroundColor,
                backgroundType: data.backgroundType,
                backgroundGradientColors: data.backgroundGradientColors,
                gradientRotation: data.gradientRotation,
                gradientType: data.gradientType,
                totalImagesAdded: data.totalImagesAdded,
                textBlocksAdded: data.textBlocksAdded,
                totalShapesAdded: data.totalShapesAdded,
                elements: data.elements
            };
            // build element
            for(var i = 0; i < newArtboard.elements.length; i++) {
                newArtboard.elements[i].element = buildElement(newArtboard.elements[i]);
                if(newArtboard.elements[i].type === 'text') {
                    newArtboard.elements[i].element.addEventListener('keyup', (e) => {
                        this.emit('text-manipulated');
                    });
                }
            }
            state.artboard = newArtboard;
            // // Update artboard
            emit('refresh-artboard');
            break;
        }
        case 'resetArtboardData': {
            state.artboard = {
                version: version,
                backgroundColor: '#fff',
                backgroundType: 'solid',
                backgroundGradientColors: ['#fff', '#fff'],
                gradientRotation: 90,
                gradientType: 'linear',
                totalImagesAdded: 0,
                textBlocksAdded: 0,
                totalShapesAdded: 0,
                elements: []
            };
            // // Update artboard
            emit('refresh-artboard');
            break;
        }
        case 'addTextElements': {
            var greatestZIndex = Math.max.apply(Math, state.artboard.elements.map( x => x.zIndex ));
            for(var i = 0; i < data.length; i++) {
                let newObj = {
                    id: Date.now() + i, 
                    type: data[i].type,
                    top:  data[i].top, 
                    left: data[i].left, 
                    width: data[i].width, 
                    selected: false,
                    display: true,
                    opacity: data[i].opacity,
                    rotation: data[i].rotation,
                    zIndex: greatestZIndex + 1
                }
                greatestZIndex++
                newObj.name = `${data[i].type} ${state.artboard.textBlocksAdded}`;
                state.artboard.textBlocksAdded++;
                newObj.height = data[i].height;
                newObj.text = data[i].text;
                newObj.fontSize = data[i].fontSize ;
                newObj.fontWeight = data[i].fontWeight;
                newObj.textAlign = data[i].textAlign;
                newObj.textTransform = data[i].textTransform;
                newObj.textDecoration = data[i].textDecoration;
                newObj.letterSpacing = data[i].letterSpacing;
                newObj.lineHeight = data[i].lineHeight;
                newObj.fontColor = data[i].fontColor;
                newObj.fontFamily = data[i].fontFamily;
                newObj.element = buildElement(newObj);
                newObj.element.addEventListener('keyup', (e) => {
                    emit('text-manipulated');
                });
                state.artboard.elements.push(newObj);
            }
            // Update artboard
            emit('refresh-artboard');
            break;
        }
        // Add new element
        case 'addElementsConfig': {
            // Data includes:
            // type, src, naturalHeight, naturalWidth
            var obj = { 
                id: Date.now(), 
                type: data.type,
                top: '20px', 
                left: '20px', 
                width: 300, 
                selected: false,
                display: true,
                opacity: 1,
                rotation: 0,
                zIndex: state.artboard.elements.length + state.artboard.totalImagesAdded + state.artboard.textBlocksAdded + state.artboard.totalShapesAdded
            };
            if(data.type === 'image') {
                obj.src = data.src;
                obj.name = `${data.type} ${state.artboard.totalImagesAdded}`;
                state.artboard.totalImagesAdded++;
                // Get original images aspect ratio & work out the correct height with a set width of 300
                obj.aspectRatio = data.naturalHeight / data.naturalWidth;
                obj.height = Math.floor(obj.aspectRatio * parseInt(obj.width));
                // Set object style
                obj.objectFit = 'contain';
                obj.objectPosition = 'center';
                obj.element = buildElement(obj);
            }
            else if(data.type === 'text') {
                obj.name = `${data.type} ${state.artboard.textBlocksAdded}`;
                state.artboard.textBlocksAdded++;
                obj.height = 150;
                obj.text = 'Start typing..';
                obj.fontSize = 32;
                obj.fontWeight = 'normal';
                obj.textAlign = 'center';
                obj.textTransform = 'none';
                obj.textDecoration = 'none';
                obj.letterSpacing = 2;
                obj.lineHeight = 38.4;
                obj.fontColor = '#2B2B2B';
                obj.fontFamily = 'Open Sans';
                obj.element = buildElement(obj);
                obj.element.addEventListener('keyup', (e) => {
                    emit('text-manipulated');
                });
            }
            else if(data.type === 'shape') {
                obj.backgroundColor = '#C1C1C1';
                obj.borderColor = '#C1C1C1'; 
                obj.borderWidth = 0;
                obj.borderStyle = 'solid';
                obj.shape = data.shape;
                obj.name = `${data.shape} - ${data.type} ${state.artboard.totalShapesAdded}`;
                state.artboard.totalShapesAdded++;
                if(data.shape === 'rectangle') {
                    obj.height = 150;
                    obj.borderRadius = 0;
                    obj.backgroundType = 'solid';
                    obj.backgroundGradient = ['#C1C1C1', '#C1C1C1'];
                    obj.gradientRotation = 90;
                    obj.gradientType = 'linear';
                }
                else if(data.shape === 'circle') {
                    obj.height = 300;
                    obj.borderRadius = 50;
                    obj.backgroundType = 'solid';
                    obj.backgroundGradient = ['#C1C1C1', '#C1C1C1'];
                    obj.gradientRotation = 90;
                    obj.gradientType = 'linear';
                }
                else if(data.shape === 'triangle') {
                    obj.height = 300;
                    obj.borderRadius = 0;
                }
                obj.element = buildElement(obj);
            }
            state.artboard.elements.push(obj);
            // Update artboard
            emit('refresh-artboard');
            break;
        }
        // Set single key 
        case 'setSingleArtboardKey': {
            state.artboard[data.key] = data.value;
            // Update artboard
            emit('refresh-artboard');
            break;
        }
        // Update element by index and key
        case 'updateArtboardElementByIndex': {
            state.artboard.elements[data.index][data.key] = data.value;
            break;
        }
        case 'removeArtboardElementByIndex': {
            state.artboard.elements.splice(data.index, 1);
            break;
        }
        // Handle background 
        case 'updateArtboardBackground': {
            state.artboard.backgroundType = data.type;
            if(data.type === 'solid') {
                state.artboard.backgroundColor = data.color;
            }
            else if(data.type === 'gradient') {
                state.artboard.gradientRotation = data.rotation;
                state.artboard.gradientType = data.gradientType;
                if(data.subType === 'single') state.artboard.backgroundGradientColors[data.index] = data.color;
                else state.artboard.backgroundGradientColors = data.colors;
            }
            else if(data.type === 'image') {
                state.artboard.backgroundColor = data.color;
                state.artboard.backgroundImage = data.src;
                state.artboard.backgroundSize = data.backgroundSize;
                state.artboard.backgroundPosition = data.backgroundPosition;
            }
            setArtboardBackground(state.artboard);
            break;
        }
        // Save config get files callback
        case 'getFilesCallbackURL': {
            state.getFilesCallback = data;
            break;
        }
        // Store variables
        case 'storeVariables': {
            console.log(data);
            state.variables = data;
            break;
        }
    }
}

function storeRead() {
    return state;
}


function storeOn(eventName, handler) {
    if(!state.handlers[eventName]) {
        state.handlers[eventName] = handler;
    }
}
function emit(eventName, data) {
    var callback = state.handlers[eventName];
    if(callback != undefined) {
        switch(eventName) {
            case 'refresh-artboard': {
                callback();
                break;
            }
            case 'text-manipulated': {
                callback();
                break;
            }
        }
    }
}

export { storeRead, storeMutation, storeOn };