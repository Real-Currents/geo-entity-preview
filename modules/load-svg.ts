export default function loadSVG (filePath) {
    const temp =  window.document.createElement('div');
    console.log(filePath);
    temp.insertAdjacentHTML('afterbegin', require('../models/canvas.svg').trim());
    return temp.children[0];
}
