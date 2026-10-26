if(typeof POKEMON_DATA === "undefined") {
    throw new Error("POKEMON_DATA not found");
}

const POKEMON = POKEMON_DATA.map((p) => {
    const oldTyping = p.beforeFairyTypes || p.types;
    return {
        dex: p.dex,
        name: p.name,
        fairy: { type1: p.types[0], type2: p.types[1] || "None" },
        beforeFairy: {type1: oldTyping[0], type2: oldTyping[1] || "None"},
        malePercent: p.malePercent,
        bst: p.baseStatTotal,
    };
});

const MAX_GUESSES = 10;

function normalize(str) {
    return str
        .toLowerCase()
        .replace(/♀/g, "f")
        .replace(/♂/g, "m")
        .replace(/[^a-z0-9]/g, "");
}

const LOOKUP = new Map();
for(const p of POKEMON) {
    LOOKUP.set(normalize(p.name), p);
}
LOOKUP.set("nidoranfemale", LOOKUP.get("nidoranf"));
LOOKUP.set("nidoranmale", LOOKUP.get("nidoranm"));

function genderText(male) {
    if(male === null) {
        return "Genderless";
    }

    return `${male}% ♂ / ${100 - male}% ♀`;
}

function arrow(guessVal, answerVal) {
    if(guessVal < answerVal) {
        return " ▲";
    }
    if(guessVal > answerVal) {
        return " ▼";
    }
    return "";
}

let answer;
let guessed;
let gameOver;
let fairyOn = true;
let dexHintsUsed;

const form = document.getElementById("form-guess");
const input = document.getElementById("input-guess");
const guessButton = document.getElementById("btn-guess");
const message = document.getElementById("message");
const rows = document.getElementById("guess-rows");
const guessCount = document.getElementById("guessCount");
const newGameButton = document.getElementById("btn-newGame");
const dataList = document.getElementById("pokemonList");
const fairyToggle = document.getElementById("fairyToggle");
const fairyText = document.getElementById("fairyText");

document.getElementById("maxGuesses").textContent = MAX_GUESSES;

const OPTION_TO_NAME = new Map();
const OPTIONS = POKEMON.map((p) => {
    const nameText = `#${String(p.dex).padStart(3, "0")} ${p.name}`;
    OPTION_TO_NAME.set(nameText, p.name);

    return { nameText, key: normalize(p.name) };
});

function renderOptions(text) {
    const typed = normalize(text);
    dataList.innerHTML = "";

    for(const o of OPTIONS) {
        if(typed === "" || o.key.includes(typed)) {
            const option = document.createElement("option");
            option.value = o.nameText;
            dataList.appendChild(option);
        }
    }
}

input.addEventListener("input", () => {
    const name = OPTION_TO_NAME.get(input.value);

    if(name) {
        input.value = name;
    }

    renderOptions(input.value);
});

renderOptions("");

function typesOf(p) {
    return fairyOn ? p.fairy : p.beforeFairy;
}

function newGame() {
    answer = POKEMON[Math.floor(Math.random() * POKEMON.length)];
    guessed = new Set();
    gameOver = false;
    dexHintsUsed = 0;
    rows.innerHTML = "";
    guessCount.textContent = "0";
    setMessage("");
    input.disabled = false;
    guessButton.disabled = false;
    newGameButton.classList.add("hidden");
    input.value = "";
    renderOptions("");
    input.focus();
}

function endGame(text, kind) {
    gameOver = true;
    setMessage(`${text} ${hintSummary()}`, kind);
    input.disabled = true;
    guessButton.disabled = true;
    newGameButton.classList.remove("hidden");
}

function setMessage(text, kind = "") {
    message.textContent = text;
    message.className = "message " + kind;
}

function makeCell(text, clss, delay) {
    const div = document.createElement("div");
    div.className = "cell " + clss;
    div.textContent = text;
    div.style.animationDelay = `${delay * 0.12}s`;

    return div;
}

function makeHintCell(result, delay) {
    const div = makeCell("?", "dex-hidden", delay);
    div.title = "Click to Reveal Dex # Hint";
    div.addEventListener("click", () => {
        if(!gameOver) {
            dexHintsUsed++;
        }
        div.className = "cell " + (result.ok ? "correct" : "incorrect");
        div.textContent = result.text;
        div.removeAttribute("title");
        fitText(div);
    }, {once: true});

    return div;
}

function hintSummary() {
    if(dexHintsUsed === 0) {
        return "No Dex # Hints Used!";
    }
    if(dexHintsUsed === 1) {
        return "Used 1 Dex # Hint!";
    }
    return `Used ${dexHintsUsed} Dex # Hints!`;
}

function compare(guess) {
    const g = typesOf(guess);
    const a = typesOf(answer);

    return [
        { text: g.type1, ok: g.type1 === a.type1 },
        { text: g.type2, ok: g.type2 === a.type2 },
        { text: genderText(guess.malePercent), ok: guess.malePercent === answer.malePercent },
        { text: `${guess.bst}${arrow(guess.bst, answer.bst)}`, ok: guess.bst === answer.bst },
        { text: `#${guess.dex}${arrow(guess.dex, answer.dex)}`, ok: guess.dex === answer.dex, hint: true },
    ];
}

function renderRow(guess) {
    const row = document.createElement("div");
    row.className = "row";
    row.appendChild(makeCell(guess.name, "name", 0));
    compare(guess).forEach((c, i) => {
        row.appendChild(c.hint ? makeHintCell(c, i + 1) : makeCell(c.text, c.ok ? "correct" : "incorrect", i + 1));
    });
    rows.prepend(row);
    row.querySelectorAll(".cell").forEach(fitText);
}

const MIN_FONT_PX = 10;

function fitText(el) {
    el.style.fontSize = "";
    el.style.whiteSpace = "nowrap";

    const style = getComputedStyle(el);
    const availableWidth = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const textRange = document.createRange();

    textRange.selectNodeContents(el);

    let size = parseFloat(style.fontSize);
    while(textRange.getBoundingClientRect().width > availableWidth && size - 0.5 >= MIN_FONT_PX) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
    }

    if(textRange.getBoundingClientRect().width > availableWidth) {
        el.style.whiteSpace = "";
    }
}

function fitAll() {
    document.querySelectorAll(".header-row div, #guess-rows .cell").forEach(fitText);
}

window.addEventListener("resize", fitAll);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if(gameOver) { return; }

    const rawInput = input.value.trim();
    const guess = LOOKUP.get(normalize(rawInput));

    if(!guess) {
        setMessage(`"${rawInput}" is misspelled or not in this version (Gen 1–2 only). Try again.`, "error");
        input.select();

        return;
    }
    if(guessed.has(guess.dex)) {
        setMessage(`You already guessed ${guess.name}.`, "error");
        input.select();

        return;
    }

    guessed.add(guess.dex);
    guessCount.textContent = guessed.size;
    renderRow(guess);
    input.value = "";
    renderOptions("");

    if(guess.dex === answer.dex) {
        endGame(`Correct! It was ${answer.name}. Solved in ${guessed.size} / ${MAX_GUESSES}.`, "win");
    }
    else if(guessed.size >= MAX_GUESSES) {
        endGame(`Out of guesses. The answer was ${answer.name}.`, "lose");
    }
    else {
        setMessage("");
    }
});

fairyToggle.addEventListener("change", () => {
    fairyOn = fairyToggle.checked;
    fairyText.textContent = fairyOn ? "Fairy Type: ON (Gen 6+ Typing)" : "Fairy Type: OFF (Gen 2–5 Typing)";
    newGame();
    setMessage("Pokemon Type Changed — New Game Started.");
});

newGameButton.addEventListener("click", newGame);

newGame();
fitAll();