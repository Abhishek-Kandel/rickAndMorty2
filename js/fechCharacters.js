const apiURL = "https://rickandmortyapi.com/api/character/";

//fetch characters from API
export async function fetchCharacters(page = 1, name = "") {
  try {
    const response = await fetch(`${apiURL}?page=${page}&name=${name}`);
    if (response.status === 404) {
      throw new Error("Character not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// fetch character by ID
export async function fetchCharacterById(id) {
  try {
    const response = await fetch(`${apiURL}${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
