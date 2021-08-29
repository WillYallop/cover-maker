function setArtboardBackground(artboardConfig) {
    const artboardElement = document.getElementById('cm_artboard');
    switch(artboardConfig.backgroundType) {
        case 'solid': {
            artboardElement.style.backgroundColor = artboardConfig.backgroundColor;
            artboardElement.style.background = artboardConfig.backgroundColor;
            break;
        }
        case 'gradient': {
            artboardElement.style.backgroundColor = artboardConfig.backgroundGradientColors[0];
            if(artboardConfig.gradientType === 'linear') {
                artboardElement.style.background = `linear-gradient(${artboardConfig.gradientRotation}deg, ${artboardConfig.backgroundGradientColors[0]}, ${artboardConfig.backgroundGradientColors[1]})`;
            } 
            if(artboardConfig.gradientType === 'radial') {
                artboardElement.style.background = `radial-gradient(circle, ${artboardConfig.backgroundGradientColors[0]}, ${artboardConfig.backgroundGradientColors[1]})`;
            } 
            break;
        }
        case 'image': {
            artboardElement.style.backgroundSize = artboardConfig.backgroundSize;
            artboardElement.style.backgroundColor = artboardConfig.backgroundColor;
            artboardElement.style.backgroundImage = `url(${artboardConfig.backgroundImage})`;
            artboardElement.style.backgroundPosition =  artboardConfig.backgroundPosition;
            break;
        }
    }
}

export { setArtboardBackground };