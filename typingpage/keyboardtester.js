
/**
 * Function to fix the issue when right shift was pressed, it didn't show up on the website.
 * Added addional "key codes" for alt, control, meta as well.
 * @param e Keyboard event from keydown
 * @returns The "key code" for keyboard event
 */
function fixKeyCode(e) {
    switch(e.key) {
        case 'Shift':
            if(e.code === "ShiftLeft" || e.location === 1) {
                return 'ShiftLeft';
            }
            else {
                return 'ShiftRight';
            }
        case 'Control':
            if(e.location === 2) {
                return 'ControlRight';
            }
            else {
                return 'ControlLeft';
            }
        case 'Alt':
            if(e.location === 2) {
                return 'AltRight';
            }
            else {
                return 'AltLeft';
            }
        case 'Meta':
            if(e.location === 2) {
                return 'MetaRight';
            }
            else {
                return 'MetaLeft';
            }
        default: return e.code;
    }
}


/**
 * Function to add key that is being pressed.
 * @param code Key code of key that is being pressed.
 */
function setKeyPress(code) {
    var keyDiv = document.querySelector('.kb-key[data-code="' + code + '"]');
    if(keyDiv) {
        keyDiv.classList.remove('kb-pressed');
        keyDiv.classList.add('kb-press');
    }
}

/**
 * Function to add key that was pressed.
 * @param code Key code of key that was pressed.
 */
function setKeyPressed(code) {
    var keyDiv = document.querySelector('.kb-key[data-code="' + code + '"]');
    if(keyDiv) {
        keyDiv.classList.remove('kb-press');
        keyDiv.classList.add('kb-pressed');
    }
}

/**
 * Function to check if keyboard page is currently being shown.
 * @returns True if keyboard page is being shown, else false.
 */
function isKeyboardPageVisible() {
    var page = document.getElementById('div-keyboard-page');
    return !!page && window.getComputedStyle(page).display !== 'none';
}

/**
 * Function that tries to block browser shortcuts because keys/key combos can disturb the "experience"
 * Thank you AI.
 * @param e Keyboard event from keydown.
 */
function tryBlockBrowserShortcuts(e) {
    if(!isKeyboardPageVisible()) return;
    
    var isFunctionKey = /^F([1-9]|1[0-2])$/.test(e.code);
    var ctrlOrMeta = e.ctrlKey || e.metaKey;
    var isBlockableCombo = ctrlOrMeta && ['r', 'f', 's', 'p', 'u'].indexOf(e.key.toLowerCase()) !== -1;
    var isDevToolsCombo = ctrlOrMeta && e.shiftKey && ['i', 'j', 'c'].indexOf(e.key.toLowerCase()) !== -1;
    var isTabKey = e.code === 'Tab';
    var isEnterKey = e.code === 'Enter' || e.code === 'NumpadEnter';
    var isAltKey = e.key === 'Alt';

    if (isFunctionKey || isBlockableCombo || isDevToolsCombo || isTabKey || isEnterKey || isAltKey) {
        e.preventDefault();
    }
}

/**
 * Function that ties to block user from opening context menu.
 * @param e Event from keydown.
 */
function tryBlockContextMenu(e) {
    if(!isKeyboardPageVisible()) return;
    e.preventDefault();
}
document.addEventListener('contextmenu', tryBlockContextMenu); // Called right here.

/**
 * Updating last key pressed, pressed key's key code visually on the website.
 */
document.addEventListener('keydown', function(e) {
    tryBlockBrowserShortcuts(e);

    var keycode = fixKeyCode(e);
    setKeyPress(keycode);

    var lastKeyElement = document.getElementById('kb-last-key');
    var lastKeyCodeElement = document.getElementById('kb-last-key-code');
    if(lastKeyElement) {
        if(e.key === ' ') {
            lastKeyElement.textContent = 'Space';
        }
        else {
            lastKeyElement.textContent = e.key;
        }
    }
    if(lastKeyCodeElement) {
        lastKeyCodeElement.textContent = keycode;
    }
});

/**
 * Adding to "pressed" if the key up is detected.
 */
document.addEventListener('keyup', function(e) {
    if(isKeyboardPageVisible() && e.key === 'Alt') {
        e.preventDefault();
    }

    setKeyPressed(fixKeyCode(e));
});


/**
 * Function to release all the keys that are pressed.
 * Also adds released key(s) to pressed.
 */
function releaseAllPressedKeys() {
    document.querySelectorAll('.kb-key.kb-press').forEach(function(keyDiv) {
        keyDiv.classList.remove('kb-press');
        keyDiv.classList.add('kb-pressed');
    });
}

/**
 * If the browser window is not focused, releaseAllPressedKeys is activated.
 * In case of pressing windows key, alt tab, etc.
 */
window.addEventListener('blur', releaseAllPressedKeys);
document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        releaseAllPressedKeys();
    }
});

/**
 * Function to "reset" the visual keyboard to say nothing has been pressed.
 */
function resetKeyboard() {
    document.querySelectorAll('.kb-key.kb-press, .kb-key.kb-pressed').forEach(function(keyDiv) {
        keyDiv.classList.remove('kb-press');
        keyDiv.classList.remove('kb-pressed');
    })
    //console.log("resetKeyboardPressed!");
}


/**
 * Reset button functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    var resetBtn = document.getElementById('kb-reset');
    if(resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetKeyboard();

            // Added to unfocus the button so when pressing space or enter,
            // the button doesn't get activated again.
            resetBtn.blur(); 
        });
    }
});