import coverMaker from './app.js';
import axios from 'axios';

function getConfg(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then((res) => {
            resolve(res.data);
        })  
        .catch((err) => {
            reject(err);
        })
    });
}

async function initialiseCoverMaker(config) {
    try {
        let templates = await getConfg(config.templateURL);
        let textTemplates = await getConfg(config.textTemplateURL);
        const CoverMaker = new coverMaker({
            injectEleId: 'cm_inject',
            openTemplateFromURL: true,
            templates: templates,
            textTemplates: textTemplates,
            processVariables: config.processVariables,
            getFilesFromURL: (url) => {
                return getConfg(url);
            }
        });
        return CoverMaker;
    }
    catch(err) {
        console.error(err);
    }
}

export { initialiseCoverMaker };