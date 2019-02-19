export default function loadSVG (path) {
    const file = require(__dirname + '/' + path);
    const temp =  window.document.createElement('div');
    temp.insertAdjacentHTML('afterbegin', file.trim());
    return temp.children[0];
}
