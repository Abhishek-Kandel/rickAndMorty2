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

//fetch characters from API
async function fetchCharacters(page = 1, name = "") {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}&name=${name}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

//display characters cards
function displayCharacters(characters) {
  characterCardsContainer.innerHTML = "";
  characters = characters.results;
  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");
    characterCard.innerHTML = `<img src= "${character.image}" alt="${character.name}"> <h2>${character.name}</h2> <p>Status: ${character.status}</p> <p>Gender: ${character.gender}</p> <p>Species: ${character.species}</p>`;
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
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?name=${searchQuery}`
      );
      const data = await response.json();
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

// event listeners
searchInput.addEventListener("change", handleSearch);
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
