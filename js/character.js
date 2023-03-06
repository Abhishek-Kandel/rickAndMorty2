import { fetchCharacterById } from "./fechCharacters.js";
const goBackButton = document.getElementById("go-back-button");
const characterDetailContainer = document.getElementById(
  "character-detail-container"
);

// display character detail
function displayCharacterDetail(character) {
  characterDetailContainer.innerHTML = `<div class="image">
		<img src="${character.image}" alt="${character.name}"></div><div class="details">
		<h2>${character.name}</h2>
		<p>Status: ${character.status}</p>
		<p>Gender: ${character.gender}</p>
		<p>Species: ${character.species}</p>
		<p>Origin: ${character.origin.name}</p>
		<p>Location: ${character.location.name}</p></div>
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
