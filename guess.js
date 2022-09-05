import {Trie} from './trie.js';
import {words1, words2} from './dictionary.js';

const colorConverter = {
    "rgb(0, 128, 0)":"green",
    "rgb(255, 255, 0)":"yellow",
    "rgb(128, 128, 128)":"gray",
};

function validateInputText(evt, inputId) {
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
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
    if( regex.test(key) ) {
        if (theEvent.keyCode !== 8) {
            const elementId = "guess-1".concat("-input-").concat(inputId);
            document.getElementById(elementId).value = key;
            if (inputId < 5){
                const nextElementId = "guess-1".concat("-input-").concat(inputId+1);
                document.getElementById(nextElementId).focus();
            }
        }
    }
}

function backspaceOverride(evt, inputId) {
     var theEvent = evt || window.event;
    // Handle key press
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const keyID = theEvent.keyCode;
    const elementId = "guess-1".concat("-input-").concat(inputId);
    const prevElementId = "guess-1".concat("-input-").concat(inputId-1);
    const currElement = document.getElementById(elementId);
    const prevElement = document.getElementById(prevElementId);
    if (keyID === 8) {
        if (inputId >1){
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
            if (currElement.value.length !== 0) {
                document.getElementById(elementId).value = "";
            } else {
                document.getElementById(prevElementId).focus();
            }
            
        }
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

function resetSuggestedWords() {
    const titleSection = document.getElementById('suggestionListTitle');
    titleSection.innerHTML="";
    const section = document.getElementById('suggestionList');
    section.style.height="0px";
    section.innerHTML="";
    return;
}

function appendSuggestedWords(suggestedWords) {
    const titleSection = document.getElementById('suggestionListTitle');
    titleSection.innerHTML="";
    const title = document.createElement('p');
    if (suggestedWords.length === 0){
        title.innerHTML = "There are no words that matched your criteria";
        title.style.color="red";
        title.fontwei
    } else {
        title.innerHTML = "There are " + suggestedWords.length + " suggested word(s) that matched your criteria:";
    }
    titleSection.append(title);

    const section = document.getElementById('suggestionList');
    if (suggestedWords.length !== 0){
        section.style.width="70%";
        section.style.height="150px";
    }
    section.innerHTML="";
    suggestedWords.forEach(word=>{
        let w = document.createElement('p');
        w.style.marginLeft= "0.5em";
        w.style.marginRight= "0.5em";
        w.append(word.toUpperCase());
        section.append(w);
    });
}

function resetGuesses(){
    const titleSection = document.getElementById('guessListTitle');
    titleSection.innerHTML="";
    const section = document.getElementById('guessesList');
    section.innerHTML="";
    return;
}

function appendGuesses(guesses){
    const titleSection = document.getElementById('guessListTitle');
    titleSection.innerHTML="";
    const title = document.createElement('p');
    title.innerHTML = "Your guesses:"
    
    titleSection.append(title);
    const section = document.getElementById('guessesList');
    section.innerHTML="";
    guesses.forEach(guess=>{
        let w = document.createElement('p');
        w.style.marginLeft= "0.5em";
        w.style.marginRight= "0.5em";
        for (let i = 0; i < 5; i++){
            let s = document.createElement('span');
            s.style.color = guess['color'][i];
            s.style.fontWeight = 'bold';
            s.innerHTML=guess['word'][i].toUpperCase();
            w.append(s)
        }
        section.append(w);
    });
}

function generateGuesses() {
    let fixedLetters = {};
    let bannedLetters = {};
    let loseLetters = {};
    let guesses = [];
    let requiredLetters = {};

    let trie = new Trie();
    words1.forEach((word) => trie.add(word));
    words2.forEach((word) => trie.add(word));

    function resetInputs(guessId) {
        ['1','2','3','4','5'].forEach((id) => {
            const inputId = "guess-".concat(guessId).concat("-input-").concat(id);
            const inputElement = document.getElementById(inputId);
            inputElement.style.backgroundColor="green";
            inputElement.value = "";
            changeInputColor(guessId, id, 'green');
        });
        resetSuggestedWords();
        resetGuesses();
        return;
    }

    function getInputs(guessId,reset) {
        if (reset) {
            fixedLetters = {};
            bannedLetters = {};
            loseLetters = {};
            guesses = [];
            requiredLetters = {};
            return resetInputs(guessId);
        }
        let answerChars = [];
        let answerColors = [];
        let validInput = true;
        let tempRequiredLetters = {};

        
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

        let guess = {};
        let tempGrayLetters = {};
        for(let i = 0; i < 5; i++){
            let char = answerChars[i];
            let color = answerColors[i];
            let index = i.toString();
            if (i == 0){
                guess['word'] = char;
                guess['color'] = [color];
            } else {
                guess['word'] += char;
                guess['color'].push(color);
            }
            if (color === "green"){
                fixedLetters[index] = char;
                if (char in tempRequiredLetters){
                    tempRequiredLetters[char]++;
                } else {
                    tempRequiredLetters[char] = 1;
                }
            } else if(color === "yellow"){
                if (!(index in loseLetters)) {
                    loseLetters[index] = {};
                }
                loseLetters[index][char] = true;
                if (char in tempRequiredLetters){
                    tempRequiredLetters[char]++;
                } else {
                    tempRequiredLetters[char] = 1;
                }
            } else {
                tempGrayLetters[index] = char;
                bannedLetters[char] = true; 
            }
        }

        for (const [index, char] of Object.entries(tempGrayLetters)) {
            for (let j = 0; j < 5; j++) {
                if (j in loseLetters && char in loseLetters[j]){
                    if (!(index in loseLetters)){
                        loseLetters[index] = {};
                    }
                    loseLetters[index][char] = true;
                }
            }
        }
        
        for (const [char, charCount] of Object.entries(tempRequiredLetters)) {
            if (char in requiredLetters) {
                requiredLetters[char] = Math.max(requiredLetters[char], charCount);
            } else {
                requiredLetters[char] = charCount;
            }
        }

        let requiredLettersString = "";
        for (const [char, charCount] of Object.entries(requiredLetters)) {
            requiredLettersString += char.repeat(charCount);
            if (char in bannedLetters){
                delete bannedLetters[char];
            }
        }
        guesses.push(guess);
        let m = trie.findAllWords(bannedLetters, fixedLetters, loseLetters, requiredLettersString);
        appendSuggestedWords(m);
        appendGuesses(guesses);
        return;
    }
    return getInputs;
}

var makeAGuess = generateGuesses();

window.changeInputColor = changeInputColor;
window.validateInputText = validateInputText;
window.makeAGuess = makeAGuess;
window.backspaceOverride = backspaceOverride;