const searchInput = document.getElementById("searchInput");
const themeButton = document.getElementById("themeButton");
const characterCardsContainer = document.querySelector(".character-cards");
const btnAnterior = document.getElementById("btn-Anterior");
const btnProximo = document.getElementById("btn-Proximo");

let currentPage = 1;
let characters = [];
let currentTheme = "black";

// Função para buscar  API
const fetchApi = async (page) => {
  try {
    const response = await api.get(`/character/?page=${page}`);

    if (response.status !== 200) {
      throw new Error("Falha ao buscar dados na API");
    }

    characters = response.data.results || data;
    return characters;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }
};

// Função para criar e exibir personagem no na tela "display"
const displayCharacterCards = (characters) => {
  characterCardsContainer.innerHTML = "";

  characters.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");

    const characterName = document.createElement("h2");
    characterName.textContent = `${character.name}`;

    const characterImage = document.createElement("img");
    characterImage.src = character.image;
    characterImage.alt = `${character.name}`;

    const characterStatus = document.createElement("p");
    characterStatus.textContent = `Status: ${character.status}`;

    const characterSpecies = document.createElement("p");
    characterSpecies.textContent = `Espécie: ${character.species}`;

    const characterOrigin = document.createElement("p");
    characterOrigin.textContent = `Origem: ${character.origin.name}`;

    const characterLocation = document.createElement("p");
    characterLocation.textContent = `Localização: ${character.location.name}`;

    characterCard.appendChild(characterImage);
    characterCard.appendChild(characterName);
    characterCard.appendChild(characterStatus);
    characterCard.appendChild(characterSpecies);
    characterCard.appendChild(characterOrigin);
    characterCard.appendChild(characterLocation);

    characterCardsContainer.appendChild(characterCard);
  });
};

// atualizar a página
const updatePage = async (page) => {
  const characters = await fetchApi(page);

  if (characters) {
    displayCharacterCards(characters);

    currentPage = page;

    document.getElementById("currentPageNumber").textContent = currentPage;
    await fetchApi(currentPage);
  } else {
    console.log("Não foi possível encontrar dados para a página inserida.");
  }
};

//  botão "Anterior"
btnAnterior.addEventListener("click", async () => {
  if (currentPage > 1) {
    await updatePage(currentPage - 1);
  }
});

//  botão "Próximo"
btnProximo.addEventListener("click", async () => {
  await updatePage(currentPage + 1);
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  fetchCharacter(currentPage, searchInput.value);
});

// pesquisar personagens
const searchCharacters = async (term) => {
  try {
    const response = await api.get(`character/?name=${term}`);

    if (response.status !== 200) {
      throw new Error("Falha ao buscar dados na API");
    }

    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar dados da pesquisa:", error);
    return [];
  }
};

// campo de pesquisa
searchInput.addEventListener("input", async () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm) {
    const matchingCharacters = await searchCharacters(searchTerm);

    if (matchingCharacters.length > 0) {
      displayCharacterCards(matchingCharacters);
    } else {
      console.log("Nenhum personagem encontrado para a pesquisa.");
    }
  } else {
    displayCharacterCards(characters);
  }
});

// limpar a lista de nomes
const clearNameList = () => {
  nameList.innerHTML = "";
};

const toggleTheme = () => {
  if (currentTheme === "black") {
    document.body.classList.remove("black-theme");
    document.body.classList.add("white-theme");
    currentTheme = "white";
  } else {
    document.body.classList.remove("white-theme");
    document.body.classList.add("black-theme");
    currentTheme = "black";
  }
};

document.body.classList.add("black-theme");
themeButton.addEventListener("click", toggleTheme);
updatePage(currentPage);
