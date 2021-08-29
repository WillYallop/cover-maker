import { storeRead, storeMutation } from './store';
import { elementOptions } from '../functions/elementConfigOptions';
import { setElementBackground } from '../functions/setElementBackground';

export default class ConfigPane {
    constructor() {
        this.handlers = {};

        // Edit layer templates
        this.editLayerTemplate = {
            image: `
            <div class="uploadImgCon">
                <img id="cm_layerImgPreview" class="imgPreview">
                <label class="uploadImgBtn" for="cm_layerUploadImage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M8.67 11.25H6.33a.7.7 0 01-.7-.7V5.63H3.06a.58.58 0 01-.42-1L7.1.17a.57.57 0 01.8 0l4.46 4.46a.58.58 0 01-.42 1H9.38v4.92a.7.7 0 01-.7.7zM15 11v3.29a.7.7 0 01-.7.7H.7a.7.7 0 01-.7-.7V11a.7.7 0 01.7-.7h3.99v.24a1.64 1.64 0 001.64 1.63h2.34a1.64 1.64 0 001.64-1.64v-.23h3.99a.7.7 0 01.7.7zm-3.63 2.58a.59.59 0 10-.59.59.59.59 0 00.59-.59zm1.87 0a.59.59 0 10-.58.59.59.59 0 00.58-.59z" fill="#606060"/></svg>
                    <input type="file" id="cm_layerUploadImage" style="display:none">
                </label>
            </div>
            <div class="layerInoCon">
                <div class="infoSect">
                    <p class="sectName">Name:</p>
                    <input id="cm_layerInfoNameInp" class="inputStyle">
                </div>
                <div class="infoSect">
                    <p class="sectName">Type:</p>
                    <div class="infoSectBody">
                        <p>Image</p>
                    </div>
                </div>
                <div class="infoSect">
                    <p class="sectName">Image Fit:</p>
                    <div id="cm_imgOjectFitCon" class="imgFitBody">
                        <button value="contain">contain</button>
                        <button value="cover">cover</button>
                    </div>
                </div>
                <div class="infoSect">
                    <p class="sectName">Image Position:</p> 
                    <div id="cm_layerInfoImgPosBtnCon" class="imgPosBody">
                        <button value="center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g transform="translate(19464 -11426)"><rect width="20" height="20" transform="translate(-19444 11426) rotate(90)" fill="none"/><rect class="mainSvg" width="20" height="3" rx="1.5" transform="translate(-19464 11434.5)" fill="#3e3e3e"/></g></svg></button>
                        <button value="top"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g transform="translate(19434 -11426)"><rect width="20" height="20" transform="translate(-19414 11426) rotate(90)" fill="none"/><rect class="mainSvg" width="20" height="3" rx="1.5" transform="translate(-19434 11426)" fill="#3e3e3e"/></g></svg></button>
                        <button value="right"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g transform="translate(19404 -11426) translate(-19384 11426) rotate(90)"><rect width="20" height="20" fill="none"/><rect class="mainSvg" width="20" height="3" rx="1.5" fill="#3e3e3e"/></g></svg></button>
                        <button value="bottom"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g transform="translate(19374 -11426)"><rect width="20" height="20" transform="translate(-19354 11426) rotate(90)" fill="none"/><rect class="mainSvg" width="20" height="3" rx="1.5" transform="translate(-19354 11446) rotate(180)" fill="#3e3e3e"/></g></svg></button>
                        <button value="left"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><g transform="translate(19344 -11426)"><rect width="20" height="20" transform="translate(-19324 11426) rotate(90)" fill="none"/><rect class="mainSvg" width="20" height="3" rx="1.5" transform="translate(-19344 11446) rotate(-90)" fill="#3e3e3e"/></g></svg></button>
                    </div>
                </div>
                <div class="infoSect">
                    <p class="sectName">Opacity: <span id="cm_opacityPreviewText"></span></p>
                    <input type="range" id="cm_opacityInpSlider" min="0" value="100" max="100">
                </div>
                <div class="infoSect">
                    <p class="sectName">Rotate: <span id="cm_rotatePreviewText"></span></p>
                    <input type="range" id="cm_rotateInpSlider" min="0" value="0" max="360">
                </div>

                <div class="infoSect">
                    <p class="sectName">Size:</p>
                    <div class="inputWrapperLabel">
                        <div class="label">width</div>
                        <input id="cm_elementWidth" class="inputStyle" type="number">
                    </div>
                    <div class="inputWrapperLabel">
                        <div class="label">height</div>
                        <input id="cm_elementHeight" class="inputStyle" type="number">
                    </div>
                </div>
                <div class="infoSect">
                    <p class="sectName">Position:</p>
                    <div class="inputWrapperLabel">
                        <div class="label">top</div>
                        <input id="cm_elementTopPos" class="inputStyle" type="number">
                    </div>
                    <div class="inputWrapperLabel">
                        <div class="label">left</div>
                        <input id="cm_elementLeftPos" class="inputStyle" type="number">
                    </div>
                </div>

            </div>`,
            text: `
            <div class="layerInoCon">
            
                <div class="infoSect">
                    <p class="sectName">Name:</p>
                    <input id="cm_layerInfoNameInp" class="inputStyle">
                </div>

                <div class="infoSect">
                    <p class="sectName">Type:</p>
                    <div class="infoSectBody">
                        <p>Text</p>
                    </div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Value:</p>
                    <textarea id="cm_layerInfoTextarea" class="inputStyle textareaStyle">

                    </textarea>
                </div>

                <div class="infoSect">
                    <p class="sectName">Font Color:</p>
                    <div class="colorPickerCon"></div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Font Size:</p>
                    <input id="cm_layerInfoTextFontSizeInp" class="inputStyle" type="number">
                </div>

                <div class="infoSect">
                    <p class="sectName">Font:</p>
                    <div id="font-picker"></div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Text Weight:</p>
                    <div id="cm_fontWeightBtnsCon" class="textWeightBody">
                        <button value="bold">BOLD</button>
                        <button value="normal">Normal</button>
                    </div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Text Align:</p> 
                    <div id="cm_layerInfoTextAlignBtnCon" class="textAlignBody multipleBtnBody">
                        <button value="left"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M.6 14.3h11.7a.6.6 0 00.6-.6V12a.6.6 0 00-.6-.6H.6a.6.6 0 00-.6.6v1.7a.6.6 0 00.6.6zm0-11.4h11.7a.6.6 0 00.6-.6V.6a.6.6 0 00-.6-.6H.6a.6.6 0 00-.6.6v1.7a.6.6 0 00.6.6zm18.7 2.8H.7a.7.7 0 00-.7.7V8a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7V6.4a.7.7 0 00-.7-.7zm0 11.4H.7a.7.7 0 00-.7.8v1.4a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7v-1.4a.7.7 0 00-.7-.8z" fill="#3e3e3e"/></svg></button>
                        <button value="center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M19.3 5.7H.7a.7.7 0 00-.7.7V8a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7V6.4a.7.7 0 00-.7-.7zm0 11.4H.7a.7.7 0 00-.7.8v1.4a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7v-1.4a.7.7 0 00-.7-.8zM4.8 3h10.4a.5.5 0 00.5-.6V.5a.5.5 0 00-.5-.5H4.8a.5.5 0 00-.5.5v1.8a.5.5 0 00.5.6zm10.4 11.4a.5.5 0 00.5-.6V12a.5.5 0 00-.5-.6H4.8a.5.5 0 00-.5.6v1.7a.5.5 0 00.5.6z" fill="#3e3e3e"/></svg></button>
                        <button value="right"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M.7 8.6h18.6a.7.7 0 00.7-.7V6.4a.7.7 0 00-.7-.7H.7a.7.7 0 00-.7.7V8a.7.7 0 00.7.7zM19.3 17H.7a.7.7 0 00-.7.8v1.4a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7v-1.4a.7.7 0 00-.7-.8zM19.4 0H7.7a.6.6 0 00-.6.6v1.7a.6.6 0 00.6.6h11.7a.6.6 0 00.6-.6V.6a.6.6 0 00-.6-.6zm0 11.4H7.7a.6.6 0 00-.6.6v1.7a.6.6 0 00.6.6h11.7a.6.6 0 00.6-.6V12a.6.6 0 00-.6-.6z" fill="#3e3e3e"/></svg></button>
                        <button value="justify"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M19.3 17.1H.7a.7.7 0 00-.7.8v1.4a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7v-1.4a.7.7 0 00-.7-.8zm0-5.7H.7a.7.7 0 00-.7.7v1.5a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7V12a.7.7 0 00-.7-.7zm0-5.7H.7a.7.7 0 00-.7.7V8a.7.7 0 00.7.7h18.6a.7.7 0 00.7-.7V6.4a.7.7 0 00-.7-.7zm0-5.7H.7a.7.7 0 00-.7.7v1.4a.7.7 0 00.7.8h18.6A.7.7 0 0020 2V.7a.7.7 0 00-.7-.7z" fill="#3e3e3e"/></svg></button>
                    </div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Text Transform:</p> 
                    <div id="cm_layerInfoTextTransBtnCon" class="textTransBody multipleBtnBody">
                        <button value="none">Ttt</button>
                        <button value="uppercase">TT</button>
                        <button value="lowercase">tt</button>
                        <button value="capitalize">Tt</button>
                    </div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Text Decoration:</p> 
                    <div id="cm_layerInfoTextDecorBtnCon" class="textDecorBody multipleBtnBody">
                        <button value="none">T</button>
                        <button value="underline" style="text-decoration: underline;">T</button>
                    </div>
                </div>

                <div class="infoSect">
                    <p class="sectName">Letter Spacing:</p>
                    <input id="cm_layerInfoTextLetterSpacingInp" class="inputStyle" type="number">
                </div>


                <div class="infoSect">
                    <p class="sectName">Line Spacing:</p>
                    <input id="cm_layerInfoTextLineSpacingInp" class="inputStyle" type="number">
                </div>
                <div class="infoSect">
                    <p class="sectName">Opacity: <span id="cm_opacityPreviewText"></span></p>
                    <input type="range" id="cm_opacityInpSlider" min="0" value="100" max="100">
                </div>
                <div class="infoSect">
                    <p class="sectName">Rotate: <span id="cm_rotatePreviewText"></span></p>
                    <input type="range" id="cm_rotateInpSlider" min="0" value="0" max="360">
                </div>

                <div class="infoSect">
                    <p class="sectName">Size:</p>
                    <div class="inputWrapperLabel">
                        <div class="label">width</div>
                        <input id="cm_elementWidth" class="inputStyle" type="number">
                    </div>
                    <div class="inputWrapperLabel">
                        <div class="label">height</div>
                        <input id="cm_elementHeight" class="inputStyle" type="number">
                    </div>
                </div>
                <div class="infoSect">
                    <p class="sectName">Position:</p>
                    <div class="inputWrapperLabel">
                        <div class="label">top</div>
                        <input id="cm_elementTopPos" class="inputStyle" type="number">
                    </div>
                    <div class="inputWrapperLabel">
                        <div class="label">left</div>
                        <input id="cm_elementLeftPos" class="inputStyle" type="number">
                    </div>
                </div>

            </div>`,
            shape: {
                rectangle: `
                <div class="layerInoCon">
                
                    <div class="infoSect">
                        <p class="sectName">Name:</p>
                        <input id="cm_layerInfoNameInp" class="inputStyle">
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Type:</p>
                        <div class="infoSectBody">
                            <p>Shape</p>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Shape:</p>
                        <div class="infoSectBody">
                            <p>Rectangle</p>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Background Type:</p>
                        <div class="selectWrapper">
                            <select id="cm_backgroundColourType" type="text" class="inputStyle">
                                <option value="solid">Solid Color</option>
                                <option value="gradient">Gradient</option>
                            </select>
                            <div class="selectArrows">
                                <svg xmlns="http://www.w3.org/2000/svg" width="5.57" height="3.38"><path d="M2.57.09L.1 2.57a.3.3 0 000 .43l.29.3a.3.3 0 00.43 0L2.8 1.32l1.97 1.96a.3.3 0 00.44 0l.28-.28a.3.3 0 000-.44L3 .1a.3.3 0 00-.43 0z" fill="#fff"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="5.57" height="3.38"><path d="M2.57 3.3L.1.8a.3.3 0 010-.43L.37.09a.3.3 0 01.44 0l1.98 1.96L4.76.1a.3.3 0 01.44 0l.28.29a.3.3 0 010 .43L3 3.3a.3.3 0 01-.43 0z" fill="#fff"/></svg>
                            </div>
                        </div>
                        <div class="selectOptionBody" select-option="solid">
                            <div class="infoSect">
                                <p class="sectName">Background Color:</p>
                                <div class="colorPickerConBackgroundColor"></div>
                            </div>
                        </div>
                        <div class="selectOptionBody" select-option="gradient">
                            <div class="infoSect">
                                <p class="sectName">Background Gradient:</p>
                                <div class="colourPicker1">
                                    <div class="colorPickerConBackgroundColorGradient1"></div>
                                </div>
                                <div class="colourPicker2">
                                    <div class="colorPickerConBackgroundColorGradient2"></div>
                                </div>
                            </div>
                            <div class="infoSect">
                                <p class="sectName">Gradient Angle: <span id="cm_configPaneGradientAngleP"></p> 
                                <input type="range" id="cm_configPaneGradientAngleInput" min="0" value="0" max="360">
                            </div>
                            <div class="infoSect">
                                <p class="sectName">Gradient Type:</p>
                                <div id="cm_configPaneGradientType" class="textWeightBody">
                                    <button value="linear">Linear</button>
                                    <button value="radial">Radial</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Border Color:</p>
                        <div class="colorPickerConBorderColor"></div>
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Border Width:</p>
                        <input id="cm_layerBorderWidthInp" class="inputStyle" type="number">
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Border Radius:</p>
                        <input id="cm_layerBorderRadiusInp" class="inputStyle" type="number">
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Border Style:</p>
                        <div id="cm_borderStyleBtnCon" class="textWeightBody">
                            <button value="solid">Solid</button>
                            <button value="dashed">Dashed</button>
                        </div>
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Opacity: <span id="cm_opacityPreviewText"></span></p>
                        <input type="range" id="cm_opacityInpSlider" min="0" value="100" max="100">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Rotate: <span id="cm_rotatePreviewText"></span></p>
                        <input type="range" id="cm_rotateInpSlider" min="0" value="0" max="360">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Size:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">width</div>
                            <input id="cm_elementWidth" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">height</div>
                            <input id="cm_elementHeight" class="inputStyle" type="number">
                        </div>
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Position:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">top</div>
                            <input id="cm_elementTopPos" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">left</div>
                            <input id="cm_elementLeftPos" class="inputStyle" type="number">
                        </div>
                    </div>
    
                </div>`,
                circle: `
                <div class="layerInoCon">
                
                    <div class="infoSect">
                        <p class="sectName">Name:</p>
                        <input id="cm_layerInfoNameInp" class="inputStyle">
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Type:</p>
                        <div class="infoSectBody">
                            <p>Shape</p>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Shape:</p>
                        <div class="infoSectBody">
                            <p>Cirlce</p>
                        </div>
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Background Type:</p>
                        <div class="selectWrapper">
                            <select id="cm_backgroundColourType" type="text" class="inputStyle">
                                <option value="solid">Solid Color</option>
                                <option value="gradient">Gradient</option>
                            </select>
                            <div class="selectArrows">
                                <svg xmlns="http://www.w3.org/2000/svg" width="5.57" height="3.38"><path d="M2.57.09L.1 2.57a.3.3 0 000 .43l.29.3a.3.3 0 00.43 0L2.8 1.32l1.97 1.96a.3.3 0 00.44 0l.28-.28a.3.3 0 000-.44L3 .1a.3.3 0 00-.43 0z" fill="#fff"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="5.57" height="3.38"><path d="M2.57 3.3L.1.8a.3.3 0 010-.43L.37.09a.3.3 0 01.44 0l1.98 1.96L4.76.1a.3.3 0 01.44 0l.28.29a.3.3 0 010 .43L3 3.3a.3.3 0 01-.43 0z" fill="#fff"/></svg>
                            </div>
                        </div>
                        <div class="selectOptionBody" select-option="solid">
                            <div class="infoSect">
                                <p class="sectName">Background Color:</p>
                                <div class="colorPickerConBackgroundColor"></div>
                            </div>
                        </div>
                        <div class="selectOptionBody" select-option="gradient">
                            <div class="infoSect">
                                <p class="sectName">Background Gradient:</p>
                                <div class="colourPicker1">
                                    <div class="colorPickerConBackgroundColorGradient1"></div>
                                </div>
                                <div class="colourPicker2">
                                    <div class="colorPickerConBackgroundColorGradient2"></div>
                                </div>
                            </div>
                            <div class="infoSect">
                                <p class="sectName">Gradient Angle: <span id="cm_configPaneGradientAngleP"></p> 
                                <input type="range" id="cm_configPaneGradientAngleInput" min="0" value="0" max="360">
                            </div>
                            <div class="infoSect">
                                <p class="sectName">Gradient Type:</p>
                                <div id="cm_configPaneGradientType" class="textWeightBody">
                                    <button value="linear">Linear</button>
                                    <button value="radial">Radial</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Border Color:</p>
                        <div class="colorPickerConBorderColor"></div>
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Border Width:</p>
                        <input id="cm_layerBorderWidthInp" class="inputStyle" type="number">
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Border Style:</p>
                        <div id="cm_borderStyleBtnCon" class="textWeightBody">
                            <button value="solid">Solid</button>
                            <button value="dashed">Dashed</button>
                        </div>
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Opacity: <span id="cm_opacityPreviewText"></span></p>
                        <input type="range" id="cm_opacityInpSlider" min="0" value="100" max="100">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Rotate: <span id="cm_rotatePreviewText"></span></p>
                        <input type="range" id="cm_rotateInpSlider" min="0" value="0" max="360">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Size:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">width</div>
                            <input id="cm_elementWidth" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">height</div>
                            <input id="cm_elementHeight" class="inputStyle" type="number">
                        </div>
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Position:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">top</div>
                            <input id="cm_elementTopPos" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">left</div>
                            <input id="cm_elementLeftPos" class="inputStyle" type="number">
                        </div>
                    </div>
    
                </div>`,
                triangle: `
                <div class="layerInoCon">
                
                    <div class="infoSect">
                        <p class="sectName">Name:</p>
                        <input id="cm_layerInfoNameInp" class="inputStyle">
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Type:</p>
                        <div class="infoSectBody">
                            <p>Shape</p>
                        </div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Shape:</p>
                        <div class="infoSectBody">
                            <p>Triangle</p>
                        </div>
                    </div>
    
                    <div class="infoSect">
                        <p class="sectName">Background Color:</p>
                        <div class="colorPickerConBackgroundColor"></div>
                    </div>

                    <div class="infoSect">
                        <p class="sectName">Opacity: <span id="cm_opacityPreviewText"></span></p>
                        <input type="range" id="cm_opacityInpSlider" min="0" value="100" max="100">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Rotate: <span id="cm_rotatePreviewText"></span></p>
                        <input type="range" id="cm_rotateInpSlider" min="0" value="0" max="360">
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Size:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">width</div>
                            <input id="cm_elementWidth" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">height</div>
                            <input id="cm_elementHeight" class="inputStyle" type="number">
                        </div>
                    </div>
                    <div class="infoSect">
                        <p class="sectName">Position:</p>
                        <div class="inputWrapperLabel">
                            <div class="label">top</div>
                            <input id="cm_elementTopPos" class="inputStyle" type="number">
                        </div>
                        <div class="inputWrapperLabel">
                            <div class="label">left</div>
                            <input id="cm_elementLeftPos" class="inputStyle" type="number">
                        </div>
                    </div>
    
                </div>`
            }
        };

        // Elements
        this.layersBodyElement = document.getElementById('cm_layersBody');
        this.editLayerBodyElement = document.getElementById('cm_editLayerBody'); 
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
                case 'update-elements': {
                    callback();
                    break;
                }
                case 'center-selected': {
                    callback(data);
                    break;
                }
            }
        }
    }

    // Handle new artboard config
    updateConfigHandler() {
        this.handleLayout();
        this.handleLayers();
    }
    resetLayers() {
        // reset
        this.layersBodyElement.innerHTML = '';
        this.editLayerBodyElement.innerHTML = '';
        document.getElementById('cm_editLayerSection').style.display = 'none';
        this.editLayerActive = false;
        this.selectedIndex = undefined;
    }

    // Layout
    handleLayout() {
        var yCenterBtnEle = document.getElementById('cm_alignSelectedYBtn');
        var xCenterBtnEle = document.getElementById('cm_alignSelectedXBtn');
        yCenterBtnEle.addEventListener('click', (e) => {
            this.emit('center-selected', 'y');
        });
        xCenterBtnEle.addEventListener('click', (e) => {
            this.emit('center-selected', 'x');
        });
    }
    // Layers
    handleLayers() {
        // render out all elements in order, in the layers group
        for(var i = 0; i < storeRead().artboard.elements.length; i++) {
            var elementObj = storeRead().artboard.elements[i];
            var template = `
                <div id="cm_layerRow-${elementObj.id}" class="layerRow" element-id="${elementObj.id}" draggable="true">
                    <div class="layerLeftRow" ignore>
                        <div id="cm_elePreviewBox-${elementObj.id}" class="previewBox ${elementObj.type}">T</div>
                        <p id="cm_layerName-${elementObj.id}" ignore>${elementObj.name}</p>
                    </div>
                    <div class="layerBtnCon" ignore>
                        <div id="cm_layerActiveIndicator-${elementObj.id}" class="layerIndIcon" active-layer ignore aria-label="edit layer indicator"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5 0A7.5 7.5 0 1015 7.5 7.5 7.5 0 007.5 0zm2.4 7.5a2.4 2.4 0 11-2.4-2.4 2.4 2.4 0 012.4 2.4z" fill="#8e8f90"/></svg></div>
                        <button id="cm_deleteElementBtn-${elementObj.id}" class="deleteElementBtn" delete-layer="${elementObj.id}" ignore aria-label="delete layer"><svg xmlns="http://www.w3.org/2000/svg" width="13.1" height="15"><path d="M12.7 1H9L9 .3a.7.7 0 00-.7-.4H5a.7.7 0 00-.6.4L4 .9H.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.4h12.2a.5.5 0 00.4-.5v-.9a.5.5 0 00-.4-.5zM1.6 13.6A1.4 1.4 0 003 15h7.2a1.4 1.4 0 001.4-1.3l.6-10H.9z" fill="#8e8f90"/></svg></button>
                    </div>
                </div>`;
            this.layersBodyElement.insertAdjacentHTML('beforeend', template);
            
            let previewBoxEle = document.getElementById(`cm_elePreviewBox-${elementObj.id}`);
            if(elementObj.type === 'image') previewBoxEle.innerHTML = `<img id="cm_elePreviewBoxImg-${elementObj.id}" src="${elementObj.src}">`;
            if(elementObj.type === 'text') previewBoxEle.innerText = 'T';
            if(elementObj.type === 'shape') previewBoxEle.innerHTML = `<div class="${elementObj.shape}"></div>`;

            var layerRowEle = document.getElementById(`cm_layerRow-${elementObj.id}`);

            // Render edit layer options
            layerRowEle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(!e.target.attributes['ignore']) {
                    var index = storeRead().artboard.elements.findIndex( x => x.id === parseInt(e.target.attributes['element-id'].value));
                    this.handleEditLayer(index);
                };
            });

            // Handle delete layer
            document.getElementById(`cm_deleteElementBtn-${elementObj.id}`).addEventListener('click', (e) => {
                var id = parseInt(e.target.attributes['delete-layer'].value);       
                var index = storeRead().artboard.elements.findIndex( x => x.id === id);
                if(index != -1) {
                    storeRead().artboard.elements[index].element.remove();
                    storeMutation('removeArtboardElementByIndex', {
                        index: index
                    });
                    // Remove layer
                    this.editLayerBodyElement.innerHTML = '';
                    document.getElementById('cm_editLayerSection').style.display = 'none';
                    var activeLayers = document.querySelectorAll('[active-layer]');
                    for(var i = 0; i < activeLayers.length; i++) {
                        if(activeLayers[i].classList.contains('active')) activeLayers[i].classList.remove('active');
                    }
                    this.editLayerActive = false;
                    this.selectedIndex = undefined;
                    document.getElementById(`cm_layerRow-${id}`).remove();
                    // Update artboard
                    this.emit('update-elements');
                }
            });

            // Handle down events for layer body
            layerRowEle.addEventListener('dragstart', (e) => {
                this.dragTarget = e.target;
                this.dragTarget.style.opacity = 0.5;
                this.mousePos = [e.clientX, e.clientY];
            }, false);
            layerRowEle.addEventListener('dragend', (e) => {
                // reset the transparency
                this.dragTarget.style.opacity = 1;
                this.dragTarget = undefined;
            }, false);
            /* events fired on the drop targets */
            layerRowEle.addEventListener('dragover', (e) => {
                // prevent default to allow drop
                e.preventDefault();
            }, false);
            layerRowEle.addEventListener('drop', (e) => {
                if(e.target.classList.contains('layerRow')) {
                    // get the layer id of the target
                    var layerId = e.target.attributes['element-id'].value;
                    var target = document.getElementById(e.target.id);
                    // find element in artboard config with that id, and move the dragTarget above it.
                    // move element
                    var currentMousePos = [e.clientX, e.clientY];
                    if(currentMousePos[1] < this.mousePos[1]) {
                        // drag up
                        this.layersBodyElement.insertBefore(this.dragTarget, target);
                    }
                    else {
                        // drag down
                        if(target.nextSibling) {
                            this.layersBodyElement.insertBefore(this.dragTarget, target.nextSibling);
                        } else {
                            this.layersBodyElement.appendChild(this.dragTarget);
                        }
                    }
                    // update the z index of the elements by the order of these layer children
                    for(var i = 0; i < this.layersBodyElement.children.length; i++) {
                        let child = this.layersBodyElement.children[i];
                        var index = storeRead().artboard.elements.findIndex( x => x.id === parseInt(child.attributes['element-id'].value));
                        storeMutation('updateArtboardElementByIndex', {
                            index: index,
                            key: 'zIndex',
                            value: i
                        });
                        storeRead().artboard.elements[index].element.style.zIndex = i;
                    }
                    this.emit('update-elements');
                }
            }, false);

            // mobile
            layerRowEle.addEventListener('touchstart', (e) => {
                this.dragTarget = e.target;
                this.dragTarget.style.opacity = 0.5;
                this.mousePos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
                var index = storeRead().artboard.elements.findIndex( x => x.id === parseInt(e.target.attributes['element-id'].value));
                this.handleEditLayer(index);
            });
            layerRowEle.addEventListener('touchend', (e) => {
                if(this.dragTarget != undefined) {
                    e.preventDefault();
                    // find element in artboard config with that id, and move the dragTarget above it.
                    // move element
                    var currentMousePos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
                    if(currentMousePos[1] < this.mousePos[1]) {
                        // drag up
                        if(this.dragTarget.previousSibling) {
                            this.layersBodyElement.insertBefore(this.dragTarget, this.dragTarget.previousSibling);
                        }
                    }
                    else {
                        // drag down
                        this.layersBodyElement.appendChild(this.dragTarget);
                    }
                    // update the z index of the elements by the order of these layer children
                    for(var i = 0; i < this.layersBodyElement.children.length; i++) {
                        let child = this.layersBodyElement.children[i];
                        let index = child.attributes['element-id'].value;
                        storeMutation('updateArtboardElementByIndex', {
                            index: index,
                            key: 'zIndex',
                            value: i
                        });
                    }
                    this.emit('update-elements');
                    // reset the transparency
                    this.dragTarget.style.opacity = 1;
                    this.dragTarget = undefined;
                }   
            }, { passive: false });
        }
    }
    handleEditLayer(index) {
        this.editLayerActive = true;
        if(index != this.selectedIndex) {
            this.selectedIndex = index;
            this.selectedLayer = storeRead().artboard.elements[this.selectedIndex];

            // Insert template
            if(this.selectedLayer.type != 'shape') {
                this.editLayerBodyElement.innerHTML = this.editLayerTemplate[this.selectedLayer.type];
            }
            else {
                this.editLayerBodyElement.innerHTML = this.editLayerTemplate[this.selectedLayer.type][this.selectedLayer.shape];
            }
            document.getElementById('cm_editLayerSection').style.display = 'block';

            var activeLayers = document.querySelectorAll('[active-layer]');
            for(var i = 0; i < activeLayers.length; i++) {
                if(activeLayers[i].classList.contains('active')) activeLayers[i].classList.remove('active');
            }
            document.getElementById(`cm_layerActiveIndicator-${this.selectedLayer.id}`).classList.add('active');

            // Add events
            if(this.selectedLayer.type === 'image') this.handleImageLayerType();
            else if(this.selectedLayer.type === 'text') this.handleTextLayerType();
            else if(this.selectedLayer.type === 'shape') {
                if(this.selectedLayer.shape === 'rectangle') this.handleShapeRectangleLayerType();
                else if(this.selectedLayer.shape === 'circle') this.handleShapeCircleLayerType();
                else if(this.selectedLayer.shape === 'triangle') this.handleShapeTriangleLayerType();
            }
        }
    }
    // specifically handle image layer type
    handleImageLayerType() {
        // Layer Name
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoNameInp',
            value: this.selectedLayer.name,
            update: (value) => {
                // update artboardConfig
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'name',
                    value: value
                });
                // update layer name
                document.getElementById(`cm_layerName-${this.selectedLayer.id}`).innerText = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Img Preview
        elementOptions({
            type: 'image-preview',
            id: 'cm_layerImgPreview',
            value: this.selectedLayer.src,
            update: () => {

            },
            error: (err) => {
                console.error(err);
            }
        });
        // Img Upload
        elementOptions({
            type: 'image-upload',
            id: 'cm_layerUploadImage',
            value: undefined,
            update: (image) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'src',
                    value: image
                });
                storeRead().artboard.elements[this.selectedIndex].element.src = image;
                document.getElementById(`cm_elePreviewBoxImg-${this.selectedLayer.id}`).src = image;
                document.getElementById('cm_layerImgPreview').src = image;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Object Fit
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_imgOjectFitCon',
            value: this.selectedLayer.objectFit,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'objectFit',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.objectFit = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Object Pos
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_layerInfoImgPosBtnCon',
            value: this.selectedLayer.objectPosition,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'objectPosition',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.objectPosition = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Opacity
        elementOptions({
            type: 'slider-input',
            id: 'cm_opacityInpSlider',
            value: this.selectedLayer.opacity * 100,
            displayId: 'cm_opacityPreviewText',
            displayFormat: (value) => {
                return value / 100;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'opacity',
                    value: value / 100
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.opacity = value / 100;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Rotation
        elementOptions({
            type: 'slider-input',
            id: 'cm_rotateInpSlider',
            value: this.selectedLayer.rotation,
            displayId: 'cm_rotatePreviewText',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'rotation',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.transform = `rotate(${value}deg)`;
            },
            error: (err) => {
                console.error(err);
            }
        });

        // Width
        elementOptions({
            type: 'number-input',
            id: 'cm_elementWidth',
            value: this.selectedLayer.width,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'width',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.width = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Height
        elementOptions({
            type: 'number-input',
            id: 'cm_elementHeight',
            value: this.selectedLayer.height,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'height',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.height = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Top
        elementOptions({
            type: 'number-input',
            id: 'cm_elementTopPos',
            value: parseInt(this.selectedLayer.top),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'top',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.top = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Left
        elementOptions({
            type: 'number-input',
            id: 'cm_elementLeftPos',
            value: parseInt(this.selectedLayer.left),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'left',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.left = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    // specifically handle text layer type
    handleTextLayerType() {
        // Layer Name
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoNameInp',
            value: this.selectedLayer.name,
            update: (value) => {
                // update artboardConfig
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'name',
                    value: value
                });
                // update layer name
                document.getElementById(`cm_layerName-${this.selectedLayer.id}`).innerText = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Textarea
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoTextarea',
            value: this.selectedLayer.text,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'text',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.value = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Color Picker
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerCon',
            value: this.selectedLayer.fontColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'fontColor',
                    value: hex
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.color = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Font Size
        elementOptions({
            type: 'number-input',
            id: 'cm_layerInfoTextFontSizeInp',
            value: this.selectedLayer.fontSize,
            minValue: 1,
            resetValue: 16,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'fontSize',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.fontSize = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Font Face
        elementOptions({
            type: 'font-face',
            value: this.selectedLayer.fontFamily,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'fontFamily',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.fontFamily = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Font weight
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_fontWeightBtnsCon',
            value: this.selectedLayer.fontWeight,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'fontWeight',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.fontWeight = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Text Align
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_layerInfoTextAlignBtnCon',
            value: this.selectedLayer.textAlign,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'textAlign',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.textAlign = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Text Transform
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_layerInfoTextTransBtnCon',
            value: this.selectedLayer.textTransform,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'textTransform',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.textTransform = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Text Decoration
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_layerInfoTextDecorBtnCon',
            value: this.selectedLayer.textDecoration,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'textDecoration',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.textDecoration = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Letter spacing
        elementOptions({
            type: 'number-input',
            id: 'cm_layerInfoTextLetterSpacingInp',
            value: this.selectedLayer.letterSpacing,
            minValue: -1,
            resetValue: 2,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'letterSpacing',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.letterSpacing = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Line spacing
        elementOptions({
            type: 'number-input',
            id: 'cm_layerInfoTextLineSpacingInp',
            value: this.selectedLayer.lineHeight,
            minValue: 0,
            resetValue: 19,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'lineHeight',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.lineHeight = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Opacity
        elementOptions({
            type: 'slider-input',
            id: 'cm_opacityInpSlider',
            value: this.selectedLayer.opacity * 100,
            displayId: 'cm_opacityPreviewText',
            displayFormat: (value) => {
                return value / 100;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'opacity',
                    value: value / 100
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.opacity = value / 100;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Rotation
        elementOptions({
            type: 'slider-input',
            id: 'cm_rotateInpSlider',
            value: this.selectedLayer.rotation,
            displayId: 'cm_rotatePreviewText',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'rotation',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.transform = `rotate(${value}deg)`;
            },
            error: (err) => {
                console.error(err);
            }
        });


        // Width
        elementOptions({
            type: 'number-input',
            id: 'cm_elementWidth',
            value: this.selectedLayer.width,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'width',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.width = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Height
        elementOptions({
            type: 'number-input',
            id: 'cm_elementHeight',
            value: this.selectedLayer.height,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'height',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.height = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Top
        elementOptions({
            type: 'number-input',
            id: 'cm_elementTopPos',
            value: parseInt(this.selectedLayer.top),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'top',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.top = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Left
        elementOptions({
            type: 'number-input',
            id: 'cm_elementLeftPos',
            value: parseInt(this.selectedLayer.left),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'left',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.left = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    // specifically handle shape rectangle layer type
    handleShapeRectangleLayerType() {
        // Layer Name
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoNameInp',
            value: this.selectedLayer.name,
            update: (value) => {
                // update artboardConfig
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'name',
                    value: value
                });
                // update layer name
                document.getElementById(`cm_layerName-${this.selectedLayer.id}`).innerText = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Background Type Selection
        elementOptions({
            type: 'render-section-select',
            id: 'cm_backgroundColourType',
            value: this.selectedLayer.backgroundType,
            sectionAttribute: 'select-option',
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundType',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Background Solid
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColor',
            value: this.selectedLayer.backgroundColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundColor',
                    value: hex
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: hex,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColorGradient1',
            value: this.selectedLayer.backgroundGradient[0],
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                let newGradient = this.selectedLayer.backgroundGradient;
                newGradient[0] = hex;
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundGradient',
                    value: newGradient
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: newGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColorGradient2',
            value: this.selectedLayer.backgroundGradient[1],
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                let newGradient = this.selectedLayer.backgroundGradient;
                newGradient[1] = hex;
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundGradient',
                    value: newGradient
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: newGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient Angle
        elementOptions({
            type: 'slider-input',
            id: 'cm_configPaneGradientAngleInput',
            value: this.selectedLayer.gradientRotation,
            displayId: 'cm_configPaneGradientAngleP',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'gradientRotation',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: value,
                    gradientType: elementData.gradientType
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient Type
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_configPaneGradientType',
            value: this.selectedLayer.gradientType,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'gradientType',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: value
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Color Picker
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBorderColor',
            value: this.selectedLayer.borderColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderColor',
                    value: hex
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Width
        elementOptions({
            type: 'number-input',
            id: 'cm_layerBorderWidthInp',
            value: this.selectedLayer.borderWidth,
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderWidth',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderWidth = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Radius
        elementOptions({
            type: 'number-input',
            id: 'cm_layerBorderRadiusInp',
            value: this.selectedLayer.borderRadius,
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderRadius',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderRadius = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Style
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_borderStyleBtnCon',
            value: this.selectedLayer.borderStyle,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderStyle',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderStyle = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Opacity
        elementOptions({
            type: 'slider-input',
            id: 'cm_opacityInpSlider',
            value: this.selectedLayer.opacity * 100,
            displayId: 'cm_opacityPreviewText',
            displayFormat: (value) => {
                return value / 100;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'opacity',
                    value: value / 100
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.opacity = value / 100;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Rotation
        elementOptions({
            type: 'slider-input',
            id: 'cm_rotateInpSlider',
            value: this.selectedLayer.rotation,
            displayId: 'cm_rotatePreviewText',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'rotation',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.transform = `rotate(${value}deg)`;
            },
            error: (err) => {
                console.error(err);
            }
        });

        // Width
        elementOptions({
            type: 'number-input',
            id: 'cm_elementWidth',
            value: this.selectedLayer.width,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'width',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.width = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Height
        elementOptions({
            type: 'number-input',
            id: 'cm_elementHeight',
            value: this.selectedLayer.height,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'height',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.height = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Top
        elementOptions({
            type: 'number-input',
            id: 'cm_elementTopPos',
            value: parseInt(this.selectedLayer.top),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'top',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.top = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Left
        elementOptions({
            type: 'number-input',
            id: 'cm_elementLeftPos',
            value: parseInt(this.selectedLayer.left),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'left',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.left = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    // specifically handle shape circle layer type
    handleShapeCircleLayerType() {
        // Layer Name
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoNameInp',
            value: this.selectedLayer.name,
            update: (value) => {
                // update artboardConfig
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'name',
                    value: value
                });
                // update layer name
                document.getElementById(`cm_layerName-${this.selectedLayer.id}`).innerText = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Background Type Selection
        elementOptions({
            type: 'render-section-select',
            id: 'cm_backgroundColourType',
            value: this.selectedLayer.backgroundType,
            sectionAttribute: 'select-option',
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundType',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Background Solid
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColor',
            value: this.selectedLayer.backgroundColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundColor',
                    value: hex
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: hex,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColorGradient1',
            value: this.selectedLayer.backgroundGradient[0],
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                let newGradient = this.selectedLayer.backgroundGradient;
                newGradient[0] = hex;
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundGradient',
                    value: newGradient
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: newGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColorGradient2',
            value: this.selectedLayer.backgroundGradient[1],
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                let newGradient = this.selectedLayer.backgroundGradient;
                newGradient[1] = hex;
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'backgroundGradient',
                    value: newGradient
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: newGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: elementData.gradientType
                });
                // storeRead().artboard.elements[this.selectedIndex].element.style.backgroundColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient Angle
        elementOptions({
            type: 'slider-input',
            id: 'cm_configPaneGradientAngleInput',
            value: this.selectedLayer.gradientRotation,
            displayId: 'cm_configPaneGradientAngleP',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'gradientRotation',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: value,
                    gradientType: elementData.gradientType
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Gradient Type
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_configPaneGradientType',
            value: this.selectedLayer.gradientType,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'gradientType',
                    value: value
                });
                var elementData = storeRead().artboard.elements[this.selectedIndex];
                setElementBackground({
                    element: elementData.element,
                    backgroundType: elementData.backgroundType,
                    color: value === 'solid' ? elementData.backgroundColor : elementData.backgroundGradient,
                    rotation: elementData.gradientRotation,
                    gradientType: value
                });
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Color Picker
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBorderColor',
            value: this.selectedLayer.borderColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderColor',
                    value: hex
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Width
        elementOptions({
            type: 'number-input',
            id: 'cm_layerBorderWidthInp',
            value: this.selectedLayer.borderWidth,
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderWidth',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderWidth = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Border Style
        elementOptions({
            type: 'multiple-btns',
            id: 'cm_borderStyleBtnCon',
            value: this.selectedLayer.borderStyle,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderStyle',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderStyle = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Opacity
        elementOptions({
            type: 'slider-input',
            id: 'cm_opacityInpSlider',
            value: this.selectedLayer.opacity * 100,
            displayId: 'cm_opacityPreviewText',
            displayFormat: (value) => {
                return value / 100;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'opacity',
                    value: value / 100
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.opacity = value / 100;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Rotation
        elementOptions({
            type: 'slider-input',
            id: 'cm_rotateInpSlider',
            value: this.selectedLayer.rotation,
            displayId: 'cm_rotatePreviewText',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'rotation',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.transform = `rotate(${value}deg)`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Width
        elementOptions({
            type: 'number-input',
            id: 'cm_elementWidth',
            value: this.selectedLayer.width,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'width',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.width = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Height
        elementOptions({
            type: 'number-input',
            id: 'cm_elementHeight',
            value: this.selectedLayer.height,
            minValue: 10,
            resetValue: 300,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'height',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.height = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Top
        elementOptions({
            type: 'number-input',
            id: 'cm_elementTopPos',
            value: parseInt(this.selectedLayer.top),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'top',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.top = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Left
        elementOptions({
            type: 'number-input',
            id: 'cm_elementLeftPos',
            value: parseInt(this.selectedLayer.left),
            minValue: 0,
            resetValue: 0,
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'left',
                    value: `${value}px`
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.left = `${value}px`;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
    // specifically handle shape triangle layer type
    handleShapeTriangleLayerType() {
        // Layer Name
        elementOptions({
            type: 'text-input',
            id: 'cm_layerInfoNameInp',
            value: this.selectedLayer.name,
            update: (value) => {
                // update artboardConfig
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'name',
                    value: value
                });
                // update layer name
                document.getElementById(`cm_layerName-${this.selectedLayer.id}`).innerText = value;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Background Color Picker
        elementOptions({
            type: 'color-picker',
            class: '.colorPickerConBackgroundColor',
            value: this.selectedLayer.borderColor,
            opacity: true,
            update: (value) => {
                let hex = value.toHEXA().toString();
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'borderColor',
                    value: hex
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.borderBottomColor = hex;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Opacity
        elementOptions({
            type: 'slider-input',
            id: 'cm_opacityInpSlider',
            value: this.selectedLayer.opacity * 100,
            displayId: 'cm_opacityPreviewText',
            displayFormat: (value) => {
                return value / 100;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'opacity',
                    value: value / 100
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.opacity = value / 100;
            },
            error: (err) => {
                console.error(err);
            }
        });
        // Rotation
        elementOptions({
            type: 'slider-input',
            id: 'cm_rotateInpSlider',
            value: this.selectedLayer.rotation,
            displayId: 'cm_rotatePreviewText',
            displayFormat: (value) => {
                return `${value}deg`;
            },
            update: (value) => {
                storeMutation('updateArtboardElementByIndex', {
                    index: this.selectedIndex,
                    key: 'rotation',
                    value: value
                });
                storeRead().artboard.elements[this.selectedIndex].element.style.transform = `rotate(${value}deg)`;
            },
            error: (err) => {
                console.error(err);
            }
        });

                // Width
                elementOptions({
                    type: 'number-input',
                    id: 'cm_elementWidth',
                    value: this.selectedLayer.width,
                    minValue: 10,
                    resetValue: 300,
                    update: (value) => {
                        storeMutation('updateArtboardElementByIndex', {
                            index: this.selectedIndex,
                            key: 'width',
                            value: value
                        });
                        storeRead().artboard.elements[this.selectedIndex].element.style.borderLeftWidth = `${value / 2}px`;
                        storeRead().artboard.elements[this.selectedIndex].element.style.borderRightWidth = `${value / 2}px`;
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
                // Height
                elementOptions({
                    type: 'number-input',
                    id: 'cm_elementHeight',
                    value: this.selectedLayer.height,
                    minValue: 10,
                    resetValue: 300,
                    update: (value) => {
                        storeMutation('updateArtboardElementByIndex', {
                            index: this.selectedIndex,
                            key: 'height',
                            value: value
                        });
                        storeRead().artboard.elements[this.selectedIndex].element.style.borderBottomWidth = `${value}px`;
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
                // Top
                elementOptions({
                    type: 'number-input',
                    id: 'cm_elementTopPos',
                    value: parseInt(this.selectedLayer.top),
                    minValue: 0,
                    resetValue: 0,
                    update: (value) => {
                        storeMutation('updateArtboardElementByIndex', {
                            index: this.selectedIndex,
                            key: 'top',
                            value: `${value}px`
                        });
                        storeRead().artboard.elements[this.selectedIndex].element.style.top = `${value}px`;
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
                // Left
                elementOptions({
                    type: 'number-input',
                    id: 'cm_elementLeftPos',
                    value: parseInt(this.selectedLayer.left),
                    minValue: 0,
                    resetValue: 0,
                    update: (value) => {
                        storeMutation('updateArtboardElementByIndex', {
                            index: this.selectedIndex,
                            key: 'left',
                            value: `${value}px`
                        });
                        storeRead().artboard.elements[this.selectedIndex].element.style.left = `${value}px`;
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
    }
    updateTextarea() {
        if(typeof this.selectedIndex === 'number' && this.editLayerActive) {
            var textarea = document.getElementById('cm_layerInfoTextarea');
            storeMutation('updateArtboardElementByIndex', {
                index: this.selectedIndex,
                key: 'text',
                value: storeRead().artboard.elements[this.selectedIndex].element.value
            });
            textarea.value = storeRead().artboard.elements[this.selectedIndex].element.value;
        }
    }
    updateSizeAndPos() {
        if(typeof this.selectedIndex === 'number' && this.editLayerActive) {
            var target = storeRead().artboard.elements[this.selectedIndex];
            document.getElementById('cm_elementWidth').value = Math.floor(target.width);
            document.getElementById('cm_elementHeight').value = Math.floor(target.height);
            document.getElementById('cm_elementTopPos').value = parseInt(target.top);
            document.getElementById('cm_elementLeftPos').value = parseInt(target.left);
        }
    }
}