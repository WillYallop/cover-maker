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

async function initialiseCoverMaker(templateURL, textTemplateURL) {
    try {
        let templates = await getConfg(templateURL);
        let textTemplates = await getConfg(textTemplateURL);
        const CoverMaker = new coverMaker({
            injectEleId: 'cm_inject',
            openTemplateFromURL: true,
            templates:templates,
            textTemplates: textTemplates,
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
initialiseCoverMaker('https://playlist-tools-api.herokuapp.com/cover-maker/free/templates/config.json', 'https://playlist-tools-api.herokuapp.com/cover-maker/free/textTemplates/config.json');