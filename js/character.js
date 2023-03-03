// get DOM elements
const goBackButton = document.getElementById("go-back-button");
const characterDetailContainer = document.getElementById(
  "character-detail-container"
);

// fetch character by ID
async function fetchCharacterById(id) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// display character detail
function displayCharacterDetail(character) {
  characterDetailContainer.innerHTML = `
		<img src="${character.image}" alt="${character.name}">
		<h2>${character.name}</h2>
		<p>Status: ${character.status}</p>
		<p>Gender: ${character.gender}</p>
		<p>Species: ${character.species}</p>
		<p>Origin: ${character.origin.name}</p>
		<p>Location: ${character.location.name}</p>
	`;
}

// event listeners
goBackButton.addEventListener("click", () => {
  window.history.back();
});

// initial setup
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
fetchCharacterById(id).then((character) => {
  displayCharacterDetail(character);
});
