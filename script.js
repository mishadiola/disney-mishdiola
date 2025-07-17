//////////////Characters.html

let currentPage = 1;
let allCharacters = [];
let activeFilter = "all";

async function loadMoreCharacters() {
  const btn = document.getElementById("loadMoreBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Loading...";
  }

  try {
    for (let i = currentPage; i < currentPage + 5; i++) {
      const res = await fetch(`https://api.disneyapi.dev/character?page=${i}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const newChars = data.data;

      allCharacters.push(...newChars);
    }

    renderCharacters();
    currentPage += 5;
  } catch (err) {
    console.error("Error fetching characters:", err);
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Load More";
  }
}

function renderCharacters() {
  const container = document.getElementById("charactersContainer");
  container.innerHTML = "";

  const filtered = allCharacters.filter((char) => {
    if (!char.imageUrl || !char.films.length) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "princess")
      return /Ariel|Elsa|Anna|Belle|Moana|Rapunzel|Jasmine|Cinderella|Aurora|Snow White/i.test(
        char.name
      );
    if (activeFilter === "animal")
      return /Simba|Bambi|Dumbo|Nemo|Stitch|Pluto|Baloo|Thumper|Bolt/i.test(
        char.name
      );
  });

  filtered.forEach((char) => {
    const card = document.createElement("div");
    card.className = "character-card";
    card.innerHTML = `
      <img src="${char.imageUrl}" alt="${char.name}" />
      <p>Films: ${char.films.slice(0, 2).join(", ")}</p>
      <div class="character-name">${char.name}</div>
    `;
    container.appendChild(card);
  });
}

// Function para mag-filter ng characters
function filterCharacters(category, btn) {
  activeFilter = category;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderCharacters();
}

function searchCharacters() {
  const query = document
    .getElementById("characterSearch")
    .value.trim()
    .toLowerCase();

  const container = document.getElementById("charactersContainer");
  container.innerHTML = "";

  const filtered = allCharacters.filter((char) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "princess" &&
        /Ariel|Elsa|Anna|Belle|Moana|Rapunzel|Jasmine|Cinderella|Aurora|Snow White/i.test(
          char.name
        )) ||
      (activeFilter === "animal" &&
        /Simba|Bambi|Dumbo|Nemo|Stitch|Pluto|Baloo|Thumper|Bolt/i.test(
          char.name
        )) ||
      (activeFilter === "classic" &&
        /Mickey|Minnie|Donald|Goofy|Daisy/i.test(char.name));

    const matchesSearch = char.name.toLowerCase().includes(query);

    return (
      char.imageUrl && char.films.length > 0 && matchesFilter && matchesSearch
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center;">No characters found.</p>`;
  } else {
    filtered.forEach((char) => {
      const card = document.createElement("div");
      card.className = "character-card";
      card.innerHTML = `
        <img src="${char.imageUrl}" alt="${char.name}" />
        <p>Films: ${char.films.slice(0, 2).join(", ")}</p>
        <div class="character-name">${char.name}</div>
      `;
      container.appendChild(card);
    });
  }
}

document.addEventListener("DOMContentLoaded", loadMoreCharacters);

////////////////////Movies.html
let currentMoviePage = 1;
let allMovies = [];
let activeMovieFilter = "all";

const movieTags = {
  princess: [
    "Frozen",
    "Moana",
    "Tangled",
    "Cinderella",
    "Beauty and the Beast",
    "The Little Mermaid",
    "Mulan",
  ],
  pixar: [
    "Toy Story",
    "Monsters, Inc.",
    "Cars",
    "Up",
    "Coco",
    "Turning Red",
    "Inside Out",
    "Soul",
  ],
  classic: [
    "The Lion King",
    "Aladdin",
    "Snow White",
    "Bambi",
    "Dumbo",
    "Pinocchio",
  ],
};

async function loadMoreMovies() {
  const btn = document.getElementById("loadMoreMoviesBtn");
  btn.disabled = true;
  btn.textContent = "Loading...";

  const movieSet = new Set(allMovies.map((m) => m.name));

  try {
    for (let i = currentMoviePage; i < currentMoviePage + 5; i++) {
      const res = await fetch(`https://api.disneyapi.dev/character?page=${i}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const characters = data.data;

      characters.forEach((char) => {
        if (char.films && char.films.length > 0 && char.imageUrl) {
          const randomFilm =
            char.films[Math.floor(Math.random() * char.films.length)];

          if (!movieSet.has(randomFilm)) {
            allMovies.push({
              name: randomFilm,
              character: char.name,
              image: char.imageUrl,
            });
            movieSet.add(randomFilm);
          }
        }
      });
    }

    renderMovies();
    currentMoviePage += 5;
  } catch (err) {
    console.error("Failed to load movies:", err);
  }

  btn.disabled = false;
  btn.textContent = "Load More";
}

function renderMovies() {
  const container = document.getElementById("moviesContainer");
  const query = document
    .getElementById("movieSearch")
    .value.trim()
    .toLowerCase();

  container.innerHTML = "";

  const uniqueMovies = [];
  const seen = new Set();

  allMovies.forEach((movie) => {
    if (
      activeMovieFilter !== "all" &&
      !movieTags[activeMovieFilter]?.includes(movie.name)
    )
      return;

    if (
      query &&
      !movie.name.toLowerCase().includes(query) &&
      !movie.character.toLowerCase().includes(query)
    )
      return;

    if (seen.has(movie.name)) return;
    seen.add(movie.name);
    uniqueMovies.push(movie);
  });

  if (uniqueMovies.length === 0) {
    container.innerHTML = "<p style='text-align:center'>No movies found.</p>";
    return;
  }

  uniqueMovies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "character-card";
    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.name}" />
      <p>Featuring: ${movie.character}</p>
      <div class="character-name">${movie.name}</div>
    `;
    container.appendChild(card);
  });
}

function filterMovies(category, btn) {
  activeMovieFilter = category;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMovies();
}

function searchMovies() {
  renderMovies();
}

document.addEventListener("DOMContentLoaded", loadMoreMovies);

let cachedCharacters = [];

async function fetchAllCharacters(pages = 5) {
  const allCharacters = [];

  for (let page = 1; page <= pages; page++) {
    const res = await fetch(`https://api.disneyapi.dev/character?page=${page}`);
    if (!res.ok) throw new Error(`Page ${page} fetch failed: ${res.status}`);
    const data = await res.json();
    allCharacters.push(...data.data);
  }

  return allCharacters;
}

async function generateFilm() {
  const image = document.getElementById("film-image");
  const description = document.getElementById("film-description");

  try {
    if (cachedCharacters.length === 0) {
      const allCharacters = await fetchAllCharacters(5);

      const bannedKeywords = [
        "Marvel",
        "Star Wars",
        "Pirates",
        "Lucasfilm",
        "Pixar",
        "Indiana",
        "Thor",
        "Iron Man",
        "Avengers",
      ];

      cachedCharacters = allCharacters.filter(
        (c) =>
          c.films &&
          c.films.length > 0 &&
          !c.films.some((film) =>
            bannedKeywords.some((keyword) =>
              film.toLowerCase().includes(keyword.toLowerCase())
            )
          )
      );
    }

    if (cachedCharacters.length === 0) {
      description.textContent =
        "Sorry, we couldn't find any characters with films.";
      return;
    }

    const randomChar =
      cachedCharacters[Math.floor(Math.random() * cachedCharacters.length)];
    const randomFilm =
      randomChar.films[Math.floor(Math.random() * randomChar.films.length)];

    description.innerHTML = `You should watch <strong>${randomFilm}</strong>! Featuring ${randomChar.name}.`;

    if (randomChar.imageUrl && randomChar.imageUrl.startsWith("http")) {
      image.src = randomChar.imageUrl;
      image.alt = randomChar.name;
    } else {
      image.src = "assets/images/DisneyMovieIntro.png";
      image.alt = "Disney Movie Placeholder";
    }
  } catch (err) {
    console.error("Error fetching film:", err);
    description.textContent = "Oops! Something went wrong. Try again later.";
    image.src = "assets/images/DisneyMovieIntro.png";
    image.alt = "Error image";
  }
}
