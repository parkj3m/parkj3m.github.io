/**
 * Toggles a div to be shown or hidden
 * @param {*} divId The id of the div or span that will be hidden or shown
 * @param {*} linkId The id of the link that will be clicked to hide or show the div or span
 * @param {*} linkName The name of the link that will be clicked on
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

// Below is the older version of toggle div I used
/**
 * Toggles a div to be shown or hidden
 * @param {*} divID The id of the div or span that will be hidden or shown
 * @param {*} linkID The id of the link that will be clicked to hide or show the div or span
 * @param {*} linkName The name of the link that will be clicked on
 */
function toggleDiv(divID, linkID, linkName) {
    var div = document.getElementById(divID);
    var link = document.getElementById(linkID);

    if(div.style.display == 'none') {
        div.style.display = '';
        link.innerText = '▼ ' + linkName;
    } else {
        div.style.display = 'none';
        link.innerText = '▶ ' + linkName;
    }
}