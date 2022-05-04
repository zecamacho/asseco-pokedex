let count = 151;
let pageSize = 20;
let baseUrl = "https://pokeapi.co/api/v2/";
let pokemonListUrl = baseUrl + `pokemon?limit=${count}`;

let data = [];
let filteredData = [];
/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
/* -------------------------------------------------------------------------- */

let containerNode = document.querySelector(".container");
let listNode = document.querySelector(".list-grid");
let detailNode = document.querySelector(".detail");
let searchBar = document.getElementById("search");
let paginationContainer = document.querySelector(".pagination-container");
/* -------------------------------------------------------------------------- */
/*                                   Events                                   */
/* -------------------------------------------------------------------------- */

searchBar.addEventListener("keyup", (e) => {
  let searchTerm = e.target.value;
  filteredData = [
    ...data.filter((p) => p.name.includes(searchTerm.toLowerCase())),
  ];
  displayGrid();
});

/* -------------------------------------------------------------------------- */
/*                                   Details                                  */
/* -------------------------------------------------------------------------- */
const renderTypes = (pokemon) => `
    <div class="types">
        ${pokemon.types
          .map((t) => `<div class="type-${t.type.name}">${t.type.name}</div>`)
          .join("")}
    </div>
`;

const updateDetails = (pokemon) => {
  if (!pokemon) {
    return;
  }

  detailNode.innerHTML = `
    <h1 class="pokemon-detail-title">${pokemon.name}</h1>
    ${renderTypes(pokemon)}
  `;

  detailNode.appendChild(root);
};

/* ------------------------------------ - ----------------------------------- */

const getDetails = (info) => fetch(info.url).then((res) => res.json());

const createNode = (pokemon) => {
  let root = document.createElement("div");
  root.classList.add("pokemon-card");
  root.innerHTML = `
    <div class="pokemon-title">${pokemon.name}</div>
    <img src="${pokemon.sprites.front_default}" alt="" srcset="">
  `;

  root.addEventListener("click", () => updateDetails(pokemon));

  return root;
};

const paginate = (page = 0, _, i) =>
  i >= page * pageSize && i <= page * pageSize + pageSize;

const displayGrid = (_page) => {
  listNode.innerHTML = "";
  paginationContainer.innerHTML = ``;

  [...Array(Math.ceil(filteredData.length / pageSize)).keys()].forEach(
    setupPageButtons
  );

  filteredData
    .filter((...args) => paginate(_page, ...args))
    .map(createNode)
    .map((n) => listNode.appendChild(n));
};

const setupPageButtons = (i) => {
  let pageButtonRoot = document.createElement("div");
  pageButtonRoot.classList.add("page-button");
  pageButtonRoot.textContent = i + 1;

  pageButtonRoot.addEventListener("click", () => {
    displayGrid(i);
  });

  paginationContainer.appendChild(pageButtonRoot);
};

const main = async () => {
  let { results } = await fetch(pokemonListUrl).then((res) => res.json());
  let promiseArray = results.map(getDetails);

  data = await Promise.all(promiseArray);
  filteredData = [...data];

  displayGrid();
};

main();

// const wait = (s) =>
//   new Promise((resolve, reject) => {
//     setTimeout(resolve, s * 1000);
//   });
