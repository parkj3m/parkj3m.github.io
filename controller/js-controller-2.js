var gamepads = navigator.getGamepads()[0];

var applyDeadzone = function(number, threshold) {
    percentage = (Math.abs(number) - threshold) / (1 - threshold);
    
    if(percentage < 0) {
        percentage = 0;
    }
    return percentage * (number > 0 ? 1 : -1);
}


