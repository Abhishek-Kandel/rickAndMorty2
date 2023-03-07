import { fetchCharacters } from "./fechCharacters.js";

const pagination = document.querySelector(".pagination");
const characterCardsContainer = document.getElementById(
  "character-cards-container"
);
const searchInput = document.querySelector(
  '.search-container input[type="text"]'
);
const sortBySelect = document.getElementById("sort-by");

let currentPage = 1;
let totalPages = 1;
let currentCharacters = {};
let searchClicked = false;
let searchQuery = "";

//display characters cards
function displayCharacters(characters) {
  characterCardsContainer.innerHTML = "";
  characters = characters.results;
  if (characters) {
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
  } else {
    characterCardsContainer.innerHTML = "No character found";
  }
}

//handle search
async function handleSearch() {
  const searchInput = document.querySelector(".search-container input");
  searchQuery = searchInput.value.trim();
  if (searchQuery !== "") {
    searchClicked = true;

    const data = await fetchCharacters(1, searchQuery);
    if (data && !data.error) {
      currentCharacters = { ...data };
      totalPages = data.info.pages;
      currentPage = 1;
      handleSort();
      displayPaginationButtons(totalPages);
    }
  } else {
    currentCharacters = await fetchCharacters();
    totalPages = currentCharacters.info.pages;
    handleSort();
    displayPaginationButtons(totalPages);
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

// to display pagination
function displayPaginationButtons(totalPages) {
  pagination.innerHTML = "";
  if (totalPages === 1) {
    return;
  }
  const button = `
        <button class="page-button active">${1}</button>
      `;
  pagination.insertAdjacentHTML("beforeend", button);

  for (let i = 2; i <= totalPages; i++) {
    const button = `
        <button class="page-button">${i}</button>
      `;
    pagination.insertAdjacentHTML("beforeend", button);
  }
}

// to handle pagination
async function handlePaginationButtonClick(event) {
  if (event.target.classList.contains("page-button")) {
    currentPage = parseInt(event.target.textContent);
    if (!searchClicked) {
      currentCharacters = await fetchCharacters(currentPage);
      totalPages = currentCharacters.info.pages;
      displayCharacters(currentCharacters);
    } else {
      currentCharacters = await fetchCharacters(currentPage, searchQuery);
      totalPages = currentCharacters.info.pages;
      handleSort();
    }

    const buttons = pagination.querySelectorAll("button");
    buttons.forEach((button) => {
      button.classList.remove("active");
    });

    event.target.classList.add("active");
    console.log(event.target.classList);
  }
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
pagination.addEventListener("click", handlePaginationButtonClick);

//initial setup
(async function () {
  currentCharacters = await fetchCharacters();
  totalPages = currentCharacters.info.pages;
  displayCharacters(currentCharacters);
  displayPaginationButtons(totalPages);
})();
