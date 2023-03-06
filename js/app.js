import { fetchCharacters } from "./fechCharacters.js";

const characterCardsContainer = document.getElementById(
  "character-cards-container"
);
const searchInput = document.querySelector(
  '.search-container input[type="text"]'
);
const sortBySelect = document.getElementById("sort-by");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

let currentPage = 1;
let totalPages = 1;
let currentCharacters = {};
let searchClicked = false;
let searchQuery = "";

//display characters cards
function displayCharacters(characters) {
  characterCardsContainer.innerHTML = "";
  characters = characters.results;
  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");
    characterCard.innerHTML = `<img src= "${character.image}" alt="${character.name}"> <h2>${character.name}</h2> <br><div class="status-species"><p>${character.status}</p><pre> - </pre><p>${character.species}</p></div><br>
                              <p class="location">Last known location:</p><p>${character.location.name}</p>`;
    characterCard.addEventListener("click", () => {
      window.location.href = `character.html?id=${character.id}`;
    });
    characterCardsContainer.appendChild(characterCard);
  });
}

//display pagination
function displayPagination() {
  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

//handle search
async function handleSearch() {
  const searchInput = document.querySelector(".search-container input");
  searchQuery = searchInput.value.trim();
  if (searchQuery !== "") {
    try {
      const data = await fetchCharacters(1, searchQuery);
      if (!data.error) {
        currentCharacters = { ...data };
        console.log(currentCharacters);
        totalPages = data.info.pages;
        currentPage = 1;
        displayCharacters(currentCharacters);
        displayPagination();
        searchClicked = true;
      }
    } catch (error) {
      alert("No character found");
      console.error(error);
    }
  } else {
    currentCharacters = await fetchCharacters();
    totalPages = currentCharacters.info.pages;
    displayCharacters(currentCharacters);
    displayPagination();
  }
}

//handle sort
function handleSort() {
  const sortBy = sortBySelect.value;
  currentCharacters.results.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    return 0;
  });
  displayCharacters(currentCharacters);
}

//handle pagination
async function handlePagination(direction) {
  if (direction === "previous" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next" && currentPage < totalPages) {
    currentPage++;
  } else {
    return;
  }

  if (!searchClicked) {
    currentCharacters = await fetchCharacters(currentPage);
    totalPages = currentCharacters.info.pages;
  } else {
    currentCharacters = await fetchCharacters(currentPage, searchQuery);
    totalPages = currentCharacters.info.pages;
  }
  displayCharacters(currentCharacters);
  displayPagination();
}

//debounce handleSearch function
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// event listeners
searchInput.addEventListener("keypress", debounce(handleSearch, 500)); 
sortBySelect.addEventListener("change", handleSort);
previousButton.addEventListener("click", () => handlePagination("previous"));
nextButton.addEventListener("click", () => handlePagination("next"));

//initial setup
(async function () {
  currentCharacters = await fetchCharacters();
  totalPages = currentCharacters.info.pages;
  displayCharacters(currentCharacters);
  displayPagination();
})();
