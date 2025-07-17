//////// Modal
function openModal() {
  document.getElementById("quizModal").style.display = "block";
  startQuiz();
}

function closeModal() {
  document.getElementById("quizModal").style.display = "none";
  resetQuiz();
}

///////////Quiz Data
const quizData = [
  {
    question: "What do you value most?",
    choices: ["Kindness", "Bravery", "Intelligence", "Adventure"],
  },
  {
    question: "Pick a favorite place:",
    choices: ["Ocean", "Castle", "Forest", "City"],
  },
  {
    question: "What’s your ideal pet?",
    choices: ["Horse", "Dragon", "Fish", "Cat"],
  },
  {
    question: "Choose a color:",
    choices: ["Blue", "Red", "Yellow", "Green"],
  },
  {
    question: "Pick a hobby:",
    choices: ["Singing", "Fighting", "Inventing", "Exploring"],
  },
];

let currentQuestion = 0;
let answers = [];

function startQuiz() {
  document.getElementById("nextBtn").style.display = "inline-block";
  showQuestion();
}

function showQuestion() {
  const questionEl = document.getElementById("questionText");
  const choicesContainer = document.getElementById("choicesContainer");

  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  choicesContainer.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "choice-btn";
    btn.onclick = () => {
      answers[currentQuestion] = choice;
      document
        .querySelectorAll(".choice-btn")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    choicesContainer.appendChild(btn);
  });

  document.getElementById("nextBtn").textContent =
    currentQuestion === quizData.length - 1 ? "See Result" : "Next";
}

function nextQuestion() {
  if (answers[currentQuestion]) {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showResult();
    }
  } else {
    alert("Please select an answer.");
  }
}

async function showResult() {
  const questionEl = document.getElementById("questionText");
  const choicesContainer = document.getElementById("choicesContainer");
  const nextBtn = document.getElementById("nextBtn");
  const resultImage = document.getElementById("resultImage");

  try {
    const res = await fetch("https://api.disneyapi.dev/character?page=1");
    const data = await res.json();
    const characters = data.data.filter(
      (c) => c.imageUrl && c.films && c.films.length
    );

    const resultChar =
      characters[Math.floor(Math.random() * characters.length)];
    const movie = resultChar.films[0];

    questionEl.innerHTML = `
      You are most like <strong>${resultChar.name}</strong> <br />
      <em>from</em> <strong>${movie}</strong>!
    `;

    choicesContainer.innerHTML = `<p>Thanks for taking the quiz!</p>`;
    nextBtn.style.display = "none";

    resultImage.src = resultChar.imageUrl;
    resultImage.alt = resultChar.name;
    resultImage.style.display = "block";
  } catch (err) {
    questionEl.textContent = "Oops! Something went wrong.";
    choicesContainer.innerHTML = "";
    resultImage.style.display = "none";
    console.error("Error fetching character from API:", err);
  }
}

function resetQuiz() {
  currentQuestion = 0;
  answers = [];

  document.getElementById("nextBtn").style.display = "inline-block";

  const resultImage = document.getElementById("resultImage");
  resultImage.src = "";
  resultImage.alt = "";
  resultImage.style.display = "none";
}

////////////Slideshow
const slideIndices = [0, 0, 0];
const characterSlides = [[], [], []];

function showSlide(boxIndex) {
  const img = document.getElementById(`slide-img-${boxIndex + 1}`);
  const nameEl = document.getElementById(`slide-name-${boxIndex + 1}`);
  const filmEl = document.getElementById(`slide-film-${boxIndex + 1}`);
  const charList = characterSlides[boxIndex];

  if (charList.length === 0) return;

  const character = charList[slideIndices[boxIndex]];
  img.src = character.imageUrl;
  img.alt = character.name;
  nameEl.textContent = character.name;
  filmEl.textContent = character.films?.[0] || "Unknown Film";
}

function nextSlide(boxIndex) {
  if (!characterSlides[boxIndex].length) return;
  slideIndices[boxIndex] =
    (slideIndices[boxIndex] + 1) % characterSlides[boxIndex].length;
  showSlide(boxIndex);
}

async function fetchCharactersForBox(boxIndex, page = 1) {
  try {
    const res = await fetch(`https://api.disneyapi.dev/character?page=${page}`);
    const data = await res.json();
    const chars = data.data.filter((c) => c.imageUrl && c.films?.length);

    characterSlides[boxIndex] = chars;
    showSlide(boxIndex);

    setInterval(() => nextSlide(boxIndex), 3000);
  } catch (err) {
    console.error(`Failed to fetch characters for box ${boxIndex + 1}`, err);
  }
}

window.onload = () => {
  fetchCharactersForBox(0, 1);
  fetchCharactersForBox(1, 2);
  fetchCharactersForBox(2, 3);
};
