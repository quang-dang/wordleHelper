import {Trie} from './trie.js';
import {words1, words2} from './dictionary.js';

const colorConverter = {
    "rgb(0, 128, 0)":"green",
    "rgb(255, 255, 0)":"yellow",
    "rgb(128, 128, 128)":"gray",
};

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
}

function generateGuesses() {
    let fixedLetters = {};
    let bannedLetters = {};
    let loseLetters = {};
    let requiredLetters = "";

    let trie = new Trie();
    words1.forEach((word) => trie.add(word));
    words2.forEach((word) => trie.add(word));
    console.log("here");

    function getInputs(guessId) {
        let answerChars = [];
        let answerColors = [];
        let validInput = true;
        ['1','2','3','4','5'].forEach((id) => {
            const inputId = "guess-".concat(guessId).concat("-input-").concat(id);
            const inputElement = document.getElementById(inputId);
            const inputColor = getComputedStyle(inputElement).backgroundColor;
            const inputValue = inputElement.value;
            if (!inputValue){
                validInput = false;
            }
            answerChars.push(inputValue.toLowerCase());
            answerColors.push(colorConverter[inputColor]);
        });
        if (!validInput) {
            alert("please enter all 5 letters");
            return;
        }
        requiredLetters = "";
        for(let i = 0; i < 6; i++){
            let char = answerChars[i];
            let color = answerColors[i];
            let index = i.toString();
            if (color === "green"){
                fixedLetters[index] = char;
            } else if(color === "yellow"){
                if (!(index in loseLetters)) {
                    loseLetters[index] = {};
                }
                loseLetters[index][char] = true;
            } else {
                bannedLetters[char] = true; 
            }
            if (fixedLetters[index]) {
                requiredLetters = requiredLetters.concat(fixedLetters[index]);
            }
        }

        console.log(fixedLetters);
        console.log(bannedLetters);
        console.log(loseLetters);
        console.log(requiredLetters);
        let m = trie.findAllWords(bannedLetters, fixedLetters, loseLetters, requiredLetters);
        console.log(m);
        return;
    }
    return getInputs;
}

var makeAGuess = generateGuesses();

window.changeInputColor = changeInputColor;
window.validateInputText = validateInputText;
window.makeAGuess = makeAGuess;