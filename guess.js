import {Trie} from './trie.js';
import {words1, words2} from './dictionary.js';

function validateInputText(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[A-Za-z]/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }  
  }

function changeInputColor(guessId, inputId, colorId) {
    const elementId = "guess-".concat(guessId).concat("-input-").concat(inputId);
    document.getElementById(elementId).style.backgroundColor = colorId;
    ["green","yellow","gray"].forEach(cId => {
        let colorElementId = "guess-".concat(guessId).concat("-input-").concat(inputId).concat("-color-").concat(cId);
        let element = document.getElementById(colorElementId);
        if (colorId === cId) {
            element.style.borderStyle = "solid";
            element.style.borderWidth = "0.1em";
            element.style.borderColor = "black";
        } else {
            element.style.borderStyle = "none";
        }
    });
    let trie = new Trie();
    words1.forEach((word) => trie.add(word));
    words2.forEach((word) => trie.add(word));
    const t = trie.findAllWords({},{0:"w"},{},"w");
    console.log(t);
}

function getInputs(guessId) {
    let ans = [];
    ['1','2','3','4','5'].forEach((id) => {
        const inputId = "guess-".concat(guessId).concat("-input-").concat(id);
        const inputElement = document.getElementById(inputId);
        const inputColor = inputElement.style.backgroundColor;
        const inputValue = inputElement.value;
        ans.push(inputValue);
    })
    console.log(ans);
}

window.changeInputColor = changeInputColor;
window.validateInputText = validateInputText;
window.getInputs = getInputs;