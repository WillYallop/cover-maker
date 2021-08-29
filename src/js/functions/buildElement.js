import { setElementBackground } from './setElementBackground';

function buildElement(obj) {
    var element;
    if(obj.type === 'image') {
        element = document.createElement('img');
        element.src = obj.src;
        element.style.objectFit = obj.objectFit;
        element.style.objectPosition = obj.objectPosition;
    }
    else if(obj.type === 'text') {
        element = document.createElement('textarea');
        element.value = obj.text;
        element.style.fontSize = `${obj.fontSize}px`;
        element.style.fontWeight = obj.fontWeight;
        element.style.textAlign = obj.textAlign;
        element.style.textTransform = obj.textTransform;
        element.style.textDecoration = obj.textDecoration;
        element.style.letterSpacing = `${obj.letterSpacing}px`;
        element.style.lineHeight = `${obj.lineHeight}px`;
        element.style.color = obj.fontColor;
        element.style.fontFamily = obj.fontFamily;
        element.classList.add('textElement');
    }
    else if(obj.type === 'shape') {
        element = document.createElement('div');
        if(obj.shape === 'rectangle') {
            element.style.borderRadius = `${obj.borderRadius}px`;
            element.style.borderWidth = `${obj.borderWidth}px`;
            element.style.borderStyle = obj.borderStyle;
            element.style.borderColor = obj.borderColor;
            setElementBackground({
                element: element,
                backgroundType: obj.backgroundType,
                color: obj.backgroundType === 'solid' ? obj.backgroundColor : obj.backgroundGradient,
                rotation: obj.gradientRotation,
                gradientType: obj.gradientType
            });
        }
        else if(obj.shape === 'circle') {
            element.style.borderRadius = `${obj.borderRadius}%`;
            element.style.borderWidth = `${obj.borderWidth}px`;
            element.style.borderStyle = obj.borderStyle;
            element.style.borderColor = obj.borderColor;
            setElementBackground({
                element: element,
                backgroundType: obj.backgroundType,
                color: obj.backgroundType === 'solid' ? obj.backgroundColor : obj.backgroundGradient,
                rotation: obj.gradientRotation,
                gradientType: obj.gradientType
            });
        }
        else if(obj.shape === 'triangle') {
            element.style.borderBottomWidth = `${obj.height}px`;
            element.style.borderBottomColor = obj.borderColor;
            element.style.borderBottomStyle = 'solid';

            element.style.borderLeftWidth = `${obj.width / 2}px`;
            element.style.borderLeftStyle = 'solid';
            element.style.borderLeftColor = 'transparent';

            element.style.borderRightWidth = `${obj.width / 2}px`;
            element.style.borderRightStyle = 'solid';
            element.style.borderRightColor = 'transparent';
        }
    }
  
    element.classList.add('artboardElement');
    element.setAttribute('selectable', true);
    element.style.position = 'absolute';
    element.style.top = obj.top;
    element.style.left = obj.left;
    element.style.opacity = obj.opacity;
    
    if(obj.shape != 'triangle') {
        element.style.width = `${obj.width}px`;
        element.style.height = `${obj.height}px`;
    }
    element.style.zIndex = obj.zIndex;
    element.style.transform = `rotate(${obj.rotation}deg)`;

    return element;
}

export { buildElement };