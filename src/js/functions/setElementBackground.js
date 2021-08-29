function setElementBackground(config) {
    const element = config.element;

    switch(config.backgroundType) {
        case 'solid': {
            element.style.backgroundColor = config.color;
            element.style.background = config.color;
            break;
        }
        case 'gradient': {
            element.style.backgroundColor = config.color[0];
            if(config.gradientType === 'linear') {
                element.style.background = `linear-gradient(${config.rotation}deg, ${config.color[0]}, ${config.color[1]})`;
            } 
            if(config.gradientType === 'radial') {
                element.style.background = `radial-gradient(circle, ${config.color[0]}, ${config.color[1]})`;
            } 
            break;
        }
    }
}

export { setElementBackground };