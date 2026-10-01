/* Song title related variables */
var int_songTitle = -1;
var str_songTitle = "";
var str_songList = [
    "karma",
];

/* Variable to check if the audio files have been assigned or not */
var audioFilesAssigned = false;

/* Variable to check if audio is currently playing or not */
var currPlaying = false;

/* Counting number of correct answers */
const totalQuestions = 5;
var correctQuestions = 0;
var currentQuestion = 0;

/* Audio variables to take control of later */
// Will be assigned later
var audio1;
var audio2;

/* Path to the audio files */
var str_audio320;
var str_audio256;
var str_audio224;
var str_audio192;
var str_audio160;
var str_audio128;

/* Selected audio file paths*/
var str_audio1;
var str_audio2;
var str_correctAudio;

/* The postion in the array of audio */
var int_audio1;
var int_audio2;
var int_correctAudio;

/* An array of audio file paths */
/* Will be updated again in updateAudioArray() */
var str_audioArray = [
    str_audio320,
    str_audio256,
    str_audio224,
    str_audio192,
    str_audio160,
    str_audio128
];

/* Variable to later print the result of the test */
var result = "";

/* Starts the test */
function startTest() {
    if(audioFilesAssigned == false) {
        audioFilesAssigned = true;
    }
    result = "";
    currentQuestion = 0;

    assignAudioFiles();
}

/* Gets a random number */
function getRandomNumber(sizeOfArray) {
    return Math.floor(Math.random() * sizeOfArray);
}
/* Changes the array index into the kbps number of an audio file */
function getKbpsNumber(arrayIndex) {
    switch(arrayIndex) {
        case 0: return 320;
        case 1: return 256;
        case 2: return 224;
        case 3: return 192;
        case 4: return 160;
        case 5: return 128;
        default: return -1; // Should never ener here
    }
}

/* Updates audio array according to song title */
function updateAudioArray() {
    str_audioArray = [
        str_audio320,
        str_audio256,
        str_audio224,
        str_audio192,
        str_audio160,
        str_audio128
    ];
}

/* First step before assigning audio files */
function assignAudioFiles() {
    int_songTitle = getRandomNumber(str_songList.length);
    str_songTitle = str_songList[int_songTitle];

    str_audio320 = "audioFiles/" + str_songTitle + "/audio320.mp3";
    str_audio256 = "audioFiles/" + str_songTitle + "/audio256.mp3";
    str_audio224 = "audioFiles/" + str_songTitle + "/audio224.mp3";
    str_audio192 = "audioFiles/" + str_songTitle + "/audio192.mp3";
    str_audio160 = "audioFiles/" + str_songTitle + "/audio160.mp3";
    str_audio128 = "audioFiles/" + str_songTitle + "/audio128.mp3";

    updateAudioArray();

    currentQuestion += 1;

    int_audio1 = getRandomNumber(str_audioArray.length);
    int_audio2 = getRandomNumber(str_audioArray.length);

    while(int_audio1 == int_audio2) {
        int_audio2 = getRandomNumber(str_audioArray.length);
    }

    if(int_audio1 > int_audio2) {
        int_correctAudio = int_audio2;
    } else {
        int_correctAudio = int_audio1;
    }

    str_audio1 = str_audioArray[int_audio1];
    str_audio2 = str_audioArray[int_audio2];
    str_correctAudio = str_audioArray[int_correctAudio];

    console.log("New audio set!")
    console.log(str_audio1);
    console.log(str_audio2);
    console.log(str_correctAudio);

    changeAssignedAudioDiv();

    result += "Trial " + currentQuestion + " : " + getKbpsNumber(int_audio1) + "kbps v/s " + getKbpsNumber(int_audio2) + "kbps";
}

/* Changes the assigned audio files */
function changeAssignedAudioDiv() {
    var html_text = document.getElementById("assigned-audio-div");
    if(html_text == null) {
        console.log("assigned-audio-div was not set properly!");
        return;
    }
    html_text.innerHTML = 
    // "<strike>Audio files will appear here.</strike><br><br>"
    // + "<strike>! DO NOT TOUCH THE ACTUAL AUDIO CONTORLS !</strike><br>"
    // + "<strike>Use the buttons above instead.</strike><br>"
    // + "Audio file visuals removed<br>"
    "<audio controls id=\"audio1-mp3\" hidden>" +
    "<source src=\"" + str_audio1 + "\" type=\"audio/mpeg\">" +
    "If this is shown, your browser does not support this page." +
    "</audio><br>" +
    "<audio controls id=\"audio2-mp3\" hidden>" +
    "  <source src=\"" + str_audio2 + "\" type=\"audio/mpeg\">" +
    "  If this is shown, your browser does not support this page." +
    "</audio><br>" +
    "Audio Files Set!<br>" +
    "Current Trial : " + currentQuestion + " / " + totalQuestions +
    "<br><br><br>";

    console.log("changeAssignedAudioDiv() worked!");

    audio1 = document.getElementById("audio1-mp3");
    audio2 = document.getElementById("audio2-mp3");

    document.getElementById("start-test-div").innerHTML = "<br>Test " + currentQuestion + " has started, press an audio button, then press play<br><br>";
}

/* Starts to play all audio files */
/* If already playing, pauses the audio file */
function startAudioAll() {
    if(!audioFilesAssigned) {
        return;
    }
    if(!currPlaying) {
        audio1.play();
        audio2.play();

        currPlaying = true;

        console.log("Playing audio");
    }
    else {
        pauseAudioAll()
    }
    
}
/* Pauses all audio files */
function pauseAudioAll() {
    if(!audioFilesAssigned) {
        return;
    }
    audio1.pause();
    audio2.pause();

    currPlaying = false;

    console.log("Pausing audio");
}
/* "Stops" all audio files */
/* Pauses and resets all audio files' time to 0 */
function stopAudioAll() {
    if(!audioFilesAssigned) {
        return;
    }

    audio1.pause();
    audio1.currentTime = 0;
    audio2.pause();
    audio2.currentTime = 0;

    currPlaying = false;

    console.log("Stopping audio");
}

/* Sets the audio files' time to a certain time */
function setTimeOfAudio(time) {
    audio1.currentTime = time;
    audio2.currentTime = time;
}
/* Adds 5 seconds to playpack of audio files */
function add5SecondsToAudioRevision() {
    if(!audioFilesAssigned) {
        return;
    }
    var currTime = audio1.currentTime + 5;

    if(currTime >= audio1.duration) {
        setTimeOfAudio(audio1.duration);
    }
    else {
        setTimeOfAudio(currTime);
    }
    console.log("+5 seconds");
}
/* Subtracts 5 seconds to playback of audio files */
function subtract5SecondsToAudioRevision() {
    if(!audioFilesAssigned) {
        return;
    }
    var currTime = audio2.currentTime - 5;

    if(currTime <= 0) {
        setTimeOfAudio(0);
    }else {
        setTimeOfAudio(currTime);
    }
    console.log("-5 seconds");
}

/* Only plays audio 1 (by muting the other) */
function playAudio1Button() {
    if(!audioFilesAssigned) {
        return;
    }
    audio1.muted = false;
    audio2.muted = true;

    document.getElementById("start-test-div").innerHTML = "<br>Current sound will be Audio 1<br><br>"
    
    console.log("Playing audio 1");
}
/* Only plays audio 2 (by muting the other) */
function playAudio2Button() {
    if(!audioFilesAssigned) {
        return;
    }
    audio2.muted = false;
    audio1.muted = true;

    document.getElementById("start-test-div").innerHTML = "<br>Current sound will be Audio 2<br><br>"
    
    console.log("Playing audio 2")
}

/* Sets the current volume of the audio files */
function setCurrentVolume(volume) {
    audio1.volume = volume;
    audio2.volume = volume;
}
/* Reduces the volume of the audio files (by 5%) */
function reduceAudioVolume() {
    if(!audioFilesAssigned) {
        return;
    }
    var currVolume = audio2.volume - 0.05;

    if(currVolume <= 0) {
        setCurrentVolume(0);
    }
    else {
        setCurrentVolume(currVolume);
    }
    console.log("Volume decreased!");
}
/* Increases the volume of the audio files (by 5%) */
function increaseAudioVolume() {
    if(!audioFilesAssigned) {
        return;
    }
    var currVolume = audio1.volume + 0.05;

    if(currVolume >= 1) {
        setCurrentVolume(1);
    }
    else {
        setCurrentVolume(currVolume);
    }
    console.log("Volume increased!");
}

/* When audio 1 is chosen to be better */
function isCorrectAudio1() {
    if(!audioFilesAssigned) {
        return;
    }
    
    currPlaying = false;

    if(int_audio1 == int_correctAudio) {
        correctQuestions += 1;
        result += " : Correct<br>";
    } else {
        result += " : Incorrect<br>"
    }

    console.log("Answered : " + currentQuestion + "\nCorrect :" + correctQuestions);

    if(currentQuestion >= totalQuestions) {
        resultScreen();
    }
    else {
        assignAudioFiles();
    }
}
/* When audio 2 is chosen to be better */
function isCorrectAudio2() {
    if(!audioFilesAssigned) {
        return;
    }
    
    currPlaying = false;

    if(int_audio2 == int_correctAudio) {
        correctQuestions += 1;
        result += " : Correct<br>"
    }
    else {
        result += " : Incorrect<br>"
    }

    console.log("Answered : " + currentQuestion + "\nCorrect : " + correctQuestions);

    if(currentQuestion >= totalQuestions) {
        resultScreen();
    }
    else {
        assignAudioFiles();
    }
}

/* Prints the result screen */
function resultScreen() {
    var html_text = document.getElementById("assigned-audio-div");
    if(html_text == null) {
        console.log("assigned-audio-div was not set properly!");
        return;
    }

    result = "<b>Results</b><br>" + result;
    result += "<br>You got " + correctQuestions + " out of " + totalQuestions + " correct.<br>";
    html_text.innerHTML = result;

    document.getElementById("start-test-div").innerHTML = "<br>You have finished the test!<br><br>"

    audioFilesAssigned = false;
}


/*
function startAudioAll() {
    audioFlac.play();
    audio320.play();
    // audio256.play();
    audio192.play();
    audio128.play();
}
function pauseAudioAll() {
    audioFlac.pause();
    audio320.pause();
    // audio256.pause();
    audio192.pause();
    audio128.pause();
}
function stopAudioAll() {
    audioFlac.pause();
    audioFlac.currentTime = 0;
    audio320.pause();
    audio320.currentTime = 0;
    // audio256.pause();
    // audio256.currentTime = 0;
    audio192.pause();
    audio192.currentTime = 0;
    audio128.pause();
    audio128.currentTime = 0;
}

function setTimeOfAudio(time) {
    audioFlac.currentTime = time;
    audio320.currentTime = time;
    // audio256.currentTime = time;
    audio192.currentTime = time;
    audio128.currentTime = time;
}
function add5SecondsToAudioRevision() {
    var currTime = audio128.currentTime + 5;

    if(currTime >= audio128.duration) {
        setTimeOfAudio(audio128.duration);
    }
    else {
        setTimeOfAudio(currTime);
    }
}
function subtract5SecondsToAudioRevision() {
    var currTime = audio128.currentTime - 5;

    if(currTime <= 0) {
        setTimeOfAudio(0);
    }else {
        setTimeOfAudio(currTime);
    }
}

function playAudio1Button() {
    audioFlac.muted = false;
    audio320.muted = true;
    // audio256.muted = true;
    audio192.muted = true;
    audio128.muted = true;
}
function playAudio2Button() {
    audioFlac.muted = true;
    audio320.muted = false;
    // audio256.muted = true;
    audio192.muted = true;
    audio128.muted = true;
}
function playAudio3Button() {
    audioFlac.muted = true;
    audio320.muted = true;
    // audio256.muted = false;
    audio192.muted = true;
    audio128.muted = true;
}
function playAudio4Button() {
    audioFlac.muted = true;
    audio320.muted = true;
    // audio256.muted = true;
    audio192.muted = false;
    audio128.muted = true;
}
function playAudio5Button() {
    audioFlac.muted = true;
    audio320.muted = true;
    // audio256.muted = true;
    audio192.muted = true;
    audio128.muted = false;
}
*/