document.getElementById("userForm").addEventListener("submit", function(e) {
    e.preventDefault(); // sustabdo formos persikrovimą

    const formData = new FormData(this);
    const data = {};

    // surenkam visus formos duomenis į objektą
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // 1) Parodyti objektą konsolėje
    console.log(data);

    // 2) Atvaizduoti rezultatą po forma
    const resultBox = document.getElementById("resultContainer");
    resultBox.innerHTML = `
        <h3>Jūsų įvesti duomenys:</h3>
        <p><strong>Vardas:</strong> ${data.name}</p>
        <p><strong>Pavardė:</strong> ${data.surname}</p>
        <p><strong>Telefonas:</strong> ${data.phone}</p>
        <p><strong>Adresas:</strong> ${data.address}</p>
        <p><strong>El. paštas:</strong> ${data.email}</p>

        <p><strong>Vidurkis:</strong> ${data.name} ${data.surname} ${((parseFloat(data.rating_site) + parseFloat(data.rating_skill) + parseFloat(data.rating_balloons)) / 3).toFixed(2)}/10</p>
        
        <div class="alert alert-success mt-3">
            ✔️ Duomenys sėkmingai išsiųsti!
        </div>
    `});
    // ====== REALAUS LAIKO VALIDACIJA ======

const form = document.getElementById("userForm");
const inputs = form.querySelectorAll("input");

// Pagalbinės funkcijos regex'ams
const patterns = {
    name: /^[A-Za-zÀ-ž\s]+$/,       // tik raidės
    surname: /^[A-Za-zÀ-ž\s]+$/,    // tik raidės
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // el. paštas
    address: /^[A-Za-z0-9À-ž\s.,-]+$/ // tekstas + skaičiai
};

// Funkcija: rodyti klaidos pranešimą
function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-msg")) {
        error = document.createElement("div");
        error.className = "error-msg text-danger mt-1";
        input.insertAdjacentElement("afterend", error);
    }
    error.textContent = message;
}

// Funkcija: paslėpti klaidos pranešimą
function clearError(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-msg")) {
        error.remove();
    }
}

// Pagrindinė tikrinimo funkcija
function validateInput(input) {
    const value = input.value.trim();
    const name = input.name;

    // LAZY VALIDATION — jei dar nepaliestas, nerodome klaidų
    if (input.dataset.touched === "false") return true;

    if (value === "") {
        showError(input, "Laukas negali būti tuščias");
        return false;
    }

    if (name === "name" && !patterns.name.test(value)) {
        showError(input, "Vardas gali būti sudarytas tik iš raidžių");
        return false;
    }

    if (name === "surname" && !patterns.surname.test(value)) {
        showError(input, "Pavardė gali būti sudaryta tik iš raidžių");
        return false;
    }

    if (name === "email" && !patterns.email.test(value)) {
        showError(input, "Neteisingas el. pašto formatas");
        return false;
    }

    if (name === "address" && !patterns.address.test(value)) {
        showError(input, "Adresas turi būti įvestas kaip tekstas");
        return false;
    }

    clearError(input);
    return true;
}

// Realaus laiko validacija
inputs.forEach(input => {
    input.dataset.touched = "false";

    if (input.name !== "phone") {

        input.addEventListener("blur", () => {
            input.dataset.touched = "true";
            validateInput(input);
            checkAllFields();
        });

        input.addEventListener("input", () => {
            if (input.dataset.touched === "true") {
                validateInput(input);
                checkAllFields();
            }
        });

    }
});

// Formos siuntimas
form.addEventListener("submit", function(e) {

    let valid = true;

    inputs.forEach(input => {
        if (input.name !== "phone") {
            if (!validateInput(input)) valid = false;
        }
    });

    if (!valid) {
        e.preventDefault();
        return; // jei klaidų – nestabdyti
    }
});
// ====== TELEFONO FORMATAVIMAS ======

const phoneInput = document.querySelector('input[name="phone"]');
phoneInput.dataset.touched = "false";
const submitBtn = document.querySelector('button[type="submit"]');

// leidžiami tik skaičiai, formatas +370 6xx xxxxx
phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, ""); // pašaliname viską išskyrus skaičius

    if (digits.startsWith("370")) {
        digits = digits; 
    } else if (digits.startsWith("0")) {
        digits = "370" + digits.substring(1);
    } else if (!digits.startsWith("370")) {
        digits = "370" + digits;
    }

    digits = digits.substring(0, 11); // maksimaliai 11 skaitmenų (3706xxxxxxx)

    let formatted = "+";

    if (digits.length > 0) formatted += digits.substring(0, 3); // 370
    if (digits.length > 3) formatted += " " + digits.substring(3, 4); // 6
    if (digits.length > 4) formatted += digits.substring(4, 6); // xx
    if (digits.length > 6) formatted += " " + digits.substring(6); // xxxxx

    phoneInput.value = formatted;

    validatePhone();
    checkAllFields();
});

function validatePhone() {
    if (phoneInput.dataset.touched === "false") return true;

    const digits = phoneInput.value.replace(/\D/g, "");

    if (digits.length !== 11 || !digits.startsWith("3706")) {
        showError(phoneInput, "Telefono numeris turi būti formatu +370 6xx xxxxx");
        return false;
    }

    clearError(phoneInput);
    return true;
}



// ====== SUBMIT MYGTUKO LOGIKA ======

function checkAllFields() {
    let allValid = true;

    inputs.forEach(input => {
        if (input.name !== "phone") {
            if (!validateInput(input)) allValid = false;
        }
    });

    if (!validatePhone()) allValid = false;

    submitBtn.disabled = !allValid;
}

// paleidžiame tikrinimą keičiant bet kurį lauką
inputs.forEach(input => {
    input.addEventListener("input", checkAllFields);
});

// pradžioje mygtukas išjungtas
submitBtn.disabled = true;


/* =============================
      MANO ŽAIDIMAS – LOGIKA
============================= */

const GAME_DATASET = [
  '💎','🔥','🌙','⭐','⚡','🍀','🌸','🎧','🧩','🚀','🎮','🪐'
];

// DOM
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const board = document.getElementById("gameBoard");
const attemptsEl = document.getElementById("attempts");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("winMessage");

// Nauji elementai geriausiam rezultatui ir laikmačiui
let bestEasyEl, bestHardEl, timerEl;
function createAdditionalStats() {
  const statsBox = document.querySelector(".stats-box");

  // Geriausias rezultatas
  const best = document.createElement("div");
  best.innerHTML = `
    <p>Geriausias (Lengvas): <span id="best_easy">-</span></p>
    <p>Geriausias (Sunkus): <span id="best_hard">-</span></p>
  `;

  // Laikmatis
  const t = document.createElement("p");
  t.innerHTML = `Laikas: <span id="timer">0</span> s`;

  statsBox.appendChild(best);
  statsBox.appendChild(t);

  bestEasyEl = document.getElementById("best_easy");
  bestHardEl = document.getElementById("best_hard");
  timerEl = document.getElementById("timer");
}
createAdditionalStats();

// State
let rows = 3, cols = 4;
let firstCard = null, secondCard = null;
let lockBoard = false;
let attempts = 0, matches = 0;
let totalPairs = 6;

// Timer
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// LocalStorage
function loadBestScores() {
  const easy = localStorage.getItem("best_easy");
  const hard = localStorage.getItem("best_hard");

  bestEasyEl.textContent = easy ? easy : "-";
  bestHardEl.textContent = hard ? hard : "-";
}

function updateBestScore(level, value) {
  const key = level === "easy" ? "best_easy" : "best_hard";
  const currentBest = localStorage.getItem(key);

  if (!currentBest || value < currentBest) {
    localStorage.setItem(key, value);
  }

  loadBestScores();
}

loadBestScores();

// Shuffle
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Grid
function setGridDimensions(){
  if (difficultySelect.value === "easy") {
    rows = 3; cols = 4; totalPairs = 6;
  } else {
    rows = 4; cols = 6; totalPairs = 12;
  }
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

// Deck
function buildDeck(){
  const chosen = GAME_DATASET.slice(0, totalPairs);
  const pairs = [];
  chosen.forEach(i => pairs.push(i, i));
  return shuffle(pairs);
}

// Create card
function createCard(value, index){
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.value = value;

  const back = document.createElement("div");
  back.className = "face back";
  back.textContent = "❓";

  const front = document.createElement("div");
  front.className = "face front";
  front.textContent = value;

  card.append(back, front);
  card.addEventListener("click", handleCardClick);

  return card;
}

// Render board
function renderBoard(){
  board.innerHTML = "";
  setGridDimensions();
  const deck = buildDeck();
  deck.forEach((val, i) => board.appendChild(createCard(val, i)));
}

function handleCardClick(e){
  if (!gameStarted) return; // kol nepradėjo žaidimo

  const card = e.currentTarget;
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  attempts++;
  attemptsEl.textContent = attempts;

  checkMatch();
}

function checkMatch(){
  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("matched", "disabled");
    secondCard.classList.add("matched", "disabled");

    matches++;
    matchesEl.textContent = matches;

    resetChoices();
    checkWin();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetChoices();
    }, 900);
  }
}

function resetChoices(){
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  timer = 0;
  timerEl.textContent = timer;
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function stopTimer(){
  clearInterval(timerInterval);
}

// Win
function checkWin(){
  if (matches === totalPairs) {
    stopTimer();
    winMessage.style.display = "block";

    updateBestScore(difficultySelect.value, attempts);
  }
}

// Reset
function resetGame(){
  attempts = 0;
  matches = 0;
  attemptsEl.textContent = 0;
  matchesEl.textContent = 0;
  winMessage.style.display = "none";
  resetChoices();
  renderBoard();

  gameStarted = false;
  stopTimer();
  timer = 0;
  timerEl.textContent = "0";
}

// Start
startBtn.addEventListener("click", () => {
  resetGame();
  gameStarted = true;
  startTimer();
});

// Reset
resetBtn.addEventListener("click", resetGame);

// Change difficulty
difficultySelect.addEventListener("change", resetGame);

// Init
renderBoard();
