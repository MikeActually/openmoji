#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const emojisList = require('../data/openmoji.json');

let html = `
<!DOCTYPE html>
<html lang='en'>
<head>
<title>OpenMoji Catalog</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital@0;1&display=swap" rel="stylesheet">
<style>
body[color-scheme='dark'] {
    --background-color-body: #17181c;
    --background-hover: #333;
}

body[color-scheme='light'] {
    --background-color-body: white;
    --background-hover: url("guidelines/openmoji-template.svg") #fff;
}
body {
    max-width: 864px;
    margin: 0 auto;
    background-color: var(--background-color-body);
    transition: background-color 0.5s ease;
    line-height: 0;
    font-family: "Source Sans Pro", sans-serif;
}
img, button {
    width: 72px;
    height: 72px;
}
button {
    display: inline-block;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: none;
    background: transparent;
    border-radius: 5px;
    font-family: sans-serif;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out,
                transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}
button:hover, button:focus {
    background: var(--background-hover);
    transform: scale(1.5);
}
button:focus {
    outline: 1px solid var(--background-color-toggle);
    outline-offset: -4px;
}
button:active {
    transform: scale(1.4);
}
button p {
	line-height: 72px;
	font-size: 44px;
	margin: 0;
}
.toggle {
    position: fixed;
    background-color: #aaa;
    color: var(--background-color-body);
    padding: 5px;
    border-radius: 5px;
    height: 25px
}
#systemToggle {
    bottom: 100px;
    left: 10px;
}
#fontToggle {
    bottom: 55px;
    left: 10px;
}
#blackToggle {
    bottom: 10px;
    left: 10px;
}
#backgroundToggle {
    bottom: 10px; 
    right: 10px;
}
.omBlack p {
    font-family: OpenMojiBlack;
}
.omColor p {
    font-family: OpenMojiColor;
}
@media only screen and (max-width:576px) {
    button, img {
        height: 14vw;
        width: 14vw;
    }
    .toggle {
        width: calc(calc(100% - 50px) / 3);
        height: auto;
        line-height: normal;
        position: static;
        margin: 2.5px;
    }
    #toggles {
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 2.5px;
    }
    #color, #black, #system {
        margin: 0 1vw;
    }
}
@font-face {
    font-family: 'OpenMojiBlack';
    src: url('font/OpenMoji-Black.ttf') format('truetype');
  }
@font-face {
    font-family: 'OpenMojiColor';
    src: url('font/OpenMoji-Color.ttf') format('truetype');
  }
</style>
</head>
<body color-scheme='light'>
<p style='text-align: center; padding: 15px; font-style: italic; color: #999;'> click to copy codepoint </p>
`;

html += `<div id='color'>`
html += _.map(emojisList, (e) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}"
        src="${'color/72x72/' + e.hexcode +'.png'}" height="72" width="72">
    </button>`;
    }
}).join('');

html += `</div><div id='black' style='display:none;'>`

html += _.map(emojisList, (e) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <img alt="${e.annotation}" title="${e.annotation} - ${e.hexcode}"
        src="${'black/72x72/' + e.hexcode +'.png'}" height="72" width="72">
    </button>`;
    }
}).join('');

html += `</div><div id='system' style='display:none;'>`

html += _.map(emojisList, (e) => {
    if (e.skintone === '') {
        return `<button onclick="copyToClipboard('${e.hexcode}')">
        <p title="${e.annotation} - ${e.hexcode}">${e.emoji}</p>
    </button>`;
    }
}).join('');

html += `</div>
<div id='toggles'>
    <div class='toggle' id='systemToggle'>
        <input type="checkbox" id="openmojisystemCheckbox"/>
        <label for="openmojisystemCheckbox" id="openmojisystemToggle"> Toggle System Emojis</label>
    </div>

    <div class='toggle' id='fontToggle'>
        <input type="checkbox" id="openmojifontCheckbox"/>
        <label for="openmojifontCheckbox" id="openmojifontToggle"> Toggle OpenMoji Font</label>
    </div>

    <div class='toggle' id='blackToggle'>
        <input type="checkbox" id="colorblackCheckbox"/>
        <label for="colorblackCheckbox" id="colorblackToggle"> Toggle Black Emojis</label>
    </div>

    <div class='toggle' id='backgroundToggle'>
        <input type="checkbox" id="modeCheckbox"/>
        <label for="modeCheckbox" id="modeToggle"> Toggle Background Color</label>
    </div>
</div>

<script>
const colorblackToggle = document.getElementById('colorblackCheckbox');

colorblackToggle.addEventListener('change', () => {
    if (colorblackToggle.checked) {
        document.getElementById('black').style = "";
        document.getElementById('color').style = "display:none";
        document.getElementById('system').style = "display:none";
    } else {
        document.getElementById('black').style = "display:none";
        if (openmojisystemToggle.checked) {
            document.getElementById('system').style = "";
        } else {
            document.getElementById('color').style = "";
        }
    }
});

const openmojifontToggle = document.getElementById('openmojifontCheckbox');

openmojifontToggle.addEventListener('change', () => {
    if (openmojifontToggle.checked) {
        document.getElementById('system').style = "";        
        if (colorblackToggle.checked) {
            document.getElementById('system').classList.add("omBlack");
        } else {
            document.getElementById('system').classList.add("omColor");
        }
        document.getElementById('color').style = "display:none";
        document.getElementById('black').style = "display:none";
    } else {
        document.getElementById('system').classList.remove("omBlack");
        document.getElementById('system').classList.remove("omColor");
        if (openmojisystemToggle.checked) {
            document.getElementById('system').style = "";
        } else {
            document.getElementById('color').style = "";
        }
    }
});
const openmojisystemToggle = document.getElementById('openmojisystemCheckbox');

openmojisystemToggle.addEventListener('change', () => {
    if (openmojisystemToggle.checked) {
        document.getElementById('system').style = "";
        document.getElementById('color').style = "display:none";
        document.getElementById('black').style = "display:none";
    } else {
        document.getElementById('system').style = "display:none";
        if (colorblackToggle.checked) {
            document.getElementById('black').style = "";
        } else {
            document.getElementById('color').style = "";
        }
    }
});

const modeToggle = document.getElementById('modeCheckbox');

modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        document.body.setAttribute('color-scheme', 'dark');
    } else {
        document.body.setAttribute('color-scheme', 'light');
    }
});

function copyToClipboard(value) {
    var temp = document.createElement('input')
    document.body.append(temp);
    temp.value = value
    temp.select();
    document.execCommand("copy");
    temp.parentNode.removeChild(temp);
}
</script>
</body>
</html>
`;

// write HTML
fs.writeFileSync('index.html', html);