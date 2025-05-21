import { user } from "./services/user.js";

import { repositories } from "./services/repositories.js";

document.getElementById("btn-search").addEventListener("click", () => {
  const userName = document.getElementById("input-search").value;
  if (validateEmptyInput(userName)) return;
  getUserProfile(userName);
});

document.getElementById("input-search").addEventListener("keyup", (e) => {
  const userName = e.target.value;
  const key = e.which || e.keyCode;
  const isEnterKeyPressed = key === 13;

  if (isEnterKeyPressed) {
    if (validateEmptyInput(userName)) return;
    getUserProfile(userName);
  }
});

function validateEmptyInput(userName) {
  if (userName.length === 0) {
    alert("fill the field with the user name");
    return true;
  }
  return false;
}

async function getUserProfile(userName) {
  try {
    const userData = await user(userName);
    let userInfo = `
            <div class="info">
                <img src="${
                  userData.avatar_url
                }" alt="Foto de perfil do usuário" />
                <div class="data">
                    <h1>${userData.name || "Não possui nome cadastrado 😢"}</h1>
                    <p>${userData.bio || "Não possui bio cadastrada 😢"}</p>
                </div>
            </div>`;
    document.querySelector(".profile-data").innerHTML = userInfo;

    await getUserRepositories(userName);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    alert("Erro ao buscar perfil do usuário");
  }
}
async function getUserRepositories(userName) {
  try {
    const reposData = await repositories(userName);
    let repositoriesItems = "";

    reposData.forEach((repo) => {
      repositoriesItems += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
    });

    document.querySelector(".profile-data").innerHTML += `
            <div class="repositories section">
                <h2>Repositórios</h2>
                <ul>${repositoriesItems}</ul>
            </div>`;
  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);
  }
}
