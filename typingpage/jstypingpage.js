/**
 * Toggles a div to be shown or hidden
 * @param {*} divId The id of the div or span that will be hidden or shown
 * @param {*} linkId The id of the link that will be clicked to hide or show the div or span
 */
function unfoldDiv(divId, linkId) {
    var div = document.getElementById(divId);
    var link = document.getElementById(linkId);
    var arrow = link.querySelector('.arrow');

    if(div.classList.contains('open')) {
        div.style.maxHeight = '0';
        div.classList.remove('open');
        arrow.classList.remove('arrow-spin');
    } else {
        div.classList.add('open');
        div.style.maxHeight = div.scrollHeight + 'px';
        arrow.classList.add('arrow-spin');
    }
}

/**
 * Function to only show a certain div and "hiding" the others
 * @param {*} divId The divId to show among the divclass-infos
 */
function showInfoDivWithId(divId) {
    var infoDivs = document.querySelectorAll(".divclass-info");

    infoDivs.forEach(function(div) {
        if(div.id === divId) {
            div.style.display = "block";
        }
        else {
            div.style.display = "none";
        }
    });
}

/**
 * Function to only show a certain (full) div and "hiding" the others
 * @param {*} divId The divId to show among the divclass-infos
 */
function showInfoDivWithIdFull(divId) {
    var infoDivs = document.querySelectorAll(".divclass-info-full");

    infoDivs.forEach(function(div) {
        if(div.id === divId) {
            if(divId !== 'div-main-page') {
                div.style.display = "block";
            }
            else {
                div.style.display = "flex";
            }
            
        }
        else {
            div.style.display = "none";
        }
    });

    if(typeof resetKeyboard === 'function') {
        resetKeyboard();
    }
}