



window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad is connected at index %d. The gamepad's name is %s.", e.gamepad.index, e.gamepad.id);
    document.getElementById("gamepad-connection").innerHTML
        = "|| Gamepad Connected";
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad is disconnected at index %d. The gamepad's name is %s", e.gamepad.index, e.gamepad.id);
    document.getElementById("gamepad-connection").innerHTML
        = "|| Gamepad Disconnected. Please Connect a Gamepad"
});

const gamepadDisplay = document.getElementById("gamepad-display");

function update() {
    const gpds = navigator.getGamepads();
    if(gpds[0]) {
        const gamepadState = {
            id: gamepad[0].id,
            axes: [
                gpds[0].axes[0].toFixed(2),
                gpds[0].axes[1].toFixed(2),
                gpds[0].axes[2].toFixed(2),
                gpds[0].axes[3].toFixed(2),
            ],
            buttons: [
                {button_0: gpds[0].buttons[0].pressed},
                {button_1: gpds[0].buttons[1].pressed},
                {button_2: gpds[0].buttons[2].pressed},
                {button_3: gpds[0].buttons[3].pressed},
                {button_4: gpds[0].buttons[4].pressed},
                {button_5: gpds[0].buttons[5].pressed},
                {button_6: gpds[0].buttons[6].pressed},
                {button_7: gpds[0].buttons[7].pressed},
                {button_8: gpds[0].buttons[8].pressed},
                {button_9: gpds[0].buttons[9].pressed},
                {button_10: gpds[0].buttons[10].pressed},
                {button_11: gpds[0].buttons[11].pressed},
                {button_12: gpds[0].buttons[12].pressed},
                {button_13: gpds[0].buttons[13].pressed},
                {button_14: gpds[0].buttons[14].pressed},
                {button_15: gpds[0].buttons[15].pressed},
            ]
        }
        gamepadDisplay.textContent = JSON.stringify(gamepadState, null, 2);
    }
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update)


