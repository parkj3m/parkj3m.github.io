var TEST_SECONDS = 30;
var LINE_WORD_COUNT = 6;
var WORD_LIST = 
["옵치", "포탈", "엘든링", "닼소", "원신",
"발로", "엘밤통", "블러드본", "세키로", "포코피아",
"실크송", "메이플", "프디바", "디맥", "스컬",
"팩토리오", "뮤즈대시", "테라리아", "슬더슬", "아이작",
"단간론파", "스타레일", "젠존제", "할나", "언더테일",
"델타룬", "모모도라", "레포데", ];

var textDisplay, lineTop, lineCenter, lineBottom;
var timerDisplay;
var typingInput;
var resultsDiv, resultSpeed, resultAccuracy;
var restartButton;

var topWords = [];
var centerWords = [];
var bottomWords = [];
var spanWords = [];
var currentWordIndex = 0, currentCharIndex = 0;
var mistakes = 0;
var totalTyped = 0;
var timeLeft = TEST_SECONDS;
var timerId = null;
var testStarted = false;
var testOver = false;

/**
 * Function to get a random number (int) smaller than max.
 * @param max Max size of array.
 * @returns Random number smaller than max.
 */
function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Function to create a new word list.
 * @param n Number of words to have in list.
 * @returns A "new" word list.
 */
function createWordList(n) {
    var words = [];

    for(var i = 0; i < n; i++) {
        words.push(WORD_LIST[getRandomIndex(WORD_LIST.length)]);
    }

    return words;
}

/**
 * Function to show the words in a certain line.
 * This will be used to show the top and center lines.
 * @param line The line you want to show the words.
 * @param words The list words you want show on the line.
 */
function showTopCenterLine(line, words) {
    line.textContent = words.join(' ');
}

/**
 * Function to move the underline to the current place
 */
function updateUnderline() {
    var previous = lineBottom.querySelector('.typing-char-current');

    if(previous) {
        previous.classList.remove('typing-char-current');
    }
    if(spanWords[currentWordIndex] && spanWords[currentWordIndex][currentCharIndex]) {
        spanWords[currentWordIndex][currentCharIndex].classList.add('typing-char-current')
    }
}

/**
 * Function to show the bottom line with words.
 * @param words List of words you want to show on the bottom line.
 */
function showBottomLine(words) {
    lineBottom.innerHTML = '';
    spanWords = [];

    words.forEach(function(word) {
        var spanWord = document.createElement('span');
        spanWord.className = 'typing-word';
        var charSpans = [];
        word.split('').forEach(function(ch) {
            var charSpan = document.createElement('span');
            charSpan.className = 'typing-char-waiting';
            charSpan.textContent = ch;
            spanWord.appendChild(charSpan);
            charSpans.push(charSpan);
        });
        lineBottom.appendChild(spanWord);
        lineBottom.appendChild(document.createTextNode(' '));
        spanWords.push(charSpans);
    });

    currentWordIndex = 0;
    currentCharIndex = 0;
    updateUnderline();
}

/**
 * Function to show all lines.
 */
function showAllLines() {
    showTopCenterLine(lineTop, topWords);
    showTopCenterLine(lineCenter, centerWords);
    showBottomLine(bottomWords);
}

/**
 * Function to show the visualization of typing.
 */
function showCurrentWordProgress() {
    var typed = typingInput.value;
    var target = bottomWords[currentWordIndex];
    var chars = spanWords[currentWordIndex];

    if(!chars) { return; }

    for(var i = 0; i < chars.length; i++) {
        if(i < typed.length) {
            if(typed[i] === target[i]) {
                chars[i].className = 'typing-char-correct';
            }
            else {
                chars[i].className = 'typing-char-incorrect';
            }
        }
        else {
            chars[i].className = 'typing-char-waiting';
        }
    }
    currentCharIndex = Math.min(typed.length, chars.length);
    updateUnderline();
}

/**
 * Function to start the timer.
 */
function startTimer() {
    testStarted = true;
    timerId = setInterval(function() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if(timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

/**
 * Function to end the test and show the results.
 */
function endTest() {
    if(testOver) { return; }

    testOver = true;
    clearInterval(timerId);
    typingInput.disabled = true;

    var passedMinutes = (TEST_SECONDS - timeLeft) / 60;
    var correctChars = totalTyped - mistakes;

    var speed;
    if(passedMinutes > 0) {
        speed = Math.max(0, Math.round(correctChars / passedMinutes))
    }
    else {
        speed = 0;
    }

    var accuracy;
    if(totalTyped > 0) {
        accuracy = Math.round((correctChars / totalTyped) * 100);
    }
    else {
        accuracy = 0;
    }

    resultSpeed.textContent = speed;
    resultAccuracy.textContent = accuracy;
    resultsDiv.classList.add('div-typing-results-visible');
}

/**
 * Function that moves all the lines "down" when it is time for a new line
 */
function shiftLines() {
    bottomWords = centerWords;
    centerWords = topWords;
    topWords = createWordList(LINE_WORD_COUNT);
    showAllLines();
}

/**
 * Function to be called when a word is finished being typed,
 * and will move on to the next word.
 */
function finishCurrentWord() {
    var typed = typingInput.value;
    var target = bottomWords[currentWordIndex];
    var chars = spanWords[currentWordIndex];

    for(var i = 0; i < chars.length; i++) {
        var isCorrect = (i < typed.length && typed[i] == target[i]);

        if(isCorrect) {
            chars[i].className = 'typing-char-correct';
        }
        else {
            chars[i].className = 'typing-char-incorrect';
        }

        if(!isCorrect) { mistakes++; }
        totalTyped++;
    }

    typingInput.value = '';
    currentWordIndex++;

    if(currentWordIndex >= bottomWords.length) {
        shiftLines();
        return;
    }

    currentCharIndex = 0;
    updateUnderline();
}

/**
 * Function that "handles" all the inputs that are being typed insid the input box.
 * When typing starts, the test/timer starts, too.
 */
function handleTypingInput() {
    if(testOver) { return; }

    if(!testStarted && typingInput.value.length > 0) {
        startTimer();
    }

    showCurrentWordProgress();
}

/**
 * Function that is called when keydown is activated the input box.
 * If 'space' is pressed, it goes on to the next word.
 * @param e Keyboard event from keydown. 
 */
function handleTypingKeydown(e) {
    if(testOver) { return; }

    if(e.key === ' ') {
        e.preventDefault();

        if(!testStarted) {
            startTimer();
        }

        finishCurrentWord();
    }
}

function restartTypingTest() {
    clearInterval(timerId);
    timeLeft = TEST_SECONDS;
    mistakes = 0;
    totalTyped = 0;
    testStarted= false;
    testOver = false;

    typingInput.disabled = false;
    typingInput.value = '';
    resultsDiv.classList.remove('div-typing-results-visible');
    timerDisplay.textContent = timeLeft;

    topWords = createWordList(LINE_WORD_COUNT);
    centerWords = createWordList(LINE_WORD_COUNT);
    bottomWords = createWordList(LINE_WORD_COUNT);
    showAllLines();
    typingInput.focus();
}

document.addEventListener('DOMContentLoaded', function() {
    timerDisplay = document.getElementById('span-typing-timer');
    textDisplay = document.getElementById('div-typing-text');
    lineTop = document.getElementById('typing-line-top');
    lineCenter = document.getElementById('typing-line-center');
    lineBottom = document.getElementById('typing-line-bottom');
    typingInput = document.getElementById('input-typing');
    resultsDiv = document.getElementById('div-typing-results');
    resultSpeed = document.getElementById('span-typing-speed');
    resultAccuracy = document.getElementById('span-typing-accuracy');
    restartButton = document.getElementById('button-restart-typing');

    if(!textDisplay || !typingInput) { return; }

    textDisplay.addEventListener('click', function() {
        typingInput.focus();
    });
    typingInput.addEventListener('keydown', handleTypingKeydown);
    typingInput.addEventListener('input', handleTypingInput);

    // Safari issue?
    typingInput.addEventListener('compositionend', showCurrentWordProgress);

    if(restartButton) {
        restartButton.addEventListener('click', function() {
            restartTypingTest();
        })
    }

    restartTypingTest();
});