let controllerIndex = null;

// Checks when a gamepad is connected
window.addEventListener("gamepadconnected", (event)=>{
    const gamepad = event.gamepad;
    controllerIndex = gamepad.index;
    console.log("gamepad connected");
    document.getElementById("controller-connection-status").innerHTML = "gamepad connected";
})

// Checks when a gamepad is disconnected
window.addEventListener("gamepaddisconnected", (event)=>{
    controllerIndex = null;
    console.log("gamepad disconnected");
    document.getElementById("controller-connection-status").innerHTML = "gamepad not connected";
})

function handleButtons(buttons) {
    for(let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const buttonElement = document.getElementById("controller-b" + i);
        const buttonElementShow = document.getElementById("controller-b" + i + "-show");
        const selectedButtonClass = "selected-button";

        if(buttonElement && buttonElementShow) {
        	console.log(button.value);
            if(button.value > 0) {
                buttonElement.classList.add(selectedButtonClass);
                buttonElement.style.filter = "contrast(" + button.value * 150 + "%)";
            }
            else {
                buttonElement.classList.remove(selectedButtonClass);
                buttonElement.style.filter = "contrast(" + 100 + "%)";
            }
            buttonElementShow.innerHTML = "b" + i + " : " + (Math.round(button.value * 100) / 100).toFixed(2);
        }
    }
}

function updateStick(stickId, leftRightAxis, upDownAxis) {
    // Changes the amount the stick moves
    const multiplier = 30;
    
    const stickLeftRight = leftRightAxis * multiplier;
    const stickUpDown = upDownAxis * multiplier;

    const stickIdShowLeftRight = document.getElementById(stickId + "-show-leftright");
    const stickIdShowUpDown = document.getElementById(stickId + "-show-updown");
    stickIdShowLeftRight.innerHTML = "" + stickId + " LeftRight : " + (Math.round(leftRightAxis * 100) / 100).toFixed(2);
    stickIdShowUpDown.innerHTML = "" + stickId + " UpDown : " + (Math.round(upDownAxis * 100) / 100).toFixed(2);

    const stick = document.getElementById(stickId);
    const x = Number(stick.dataset.originalXPosition);
    const y = Number(stick.dataset.originalYPosition);

    stick.setAttribute("cx", x + stickLeftRight);
    stick.setAttribute("cy", y + stickUpDown);
}

function handleSticks(axes) {
    // controller-b10 is the left stick's id
    // axes[0] is the left and right of the left stick
    // axes[1] is the up and down of the left stick
    updateStick("controller-b10", axes[0], axes[1]);

    // controller-b11 is the left stick's id
    // axes[2] is the left and right of the left stick
    // axes[3] is the up and down of the left stick
    updateStick("controller-b11", axes[2], axes[3]);
}

function gameLoop() {
    // If there is a gamepad connected
    if(controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleButtons(gamepad.buttons);
        handleSticks(gamepad.axes);
    }

    // requestAnimationFrames calls the function inside the bracket
    // when it is ready to draw the next screen
    requestAnimationFrame(gameLoop);
    // So this makes an infinite loop
}

// Call when javascript is loaded
gameLoop();