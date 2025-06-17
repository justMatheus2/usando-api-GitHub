import { user } from "./services/user.js";
import { repositories } from "./services/repositories.js";
import { events } from "./services/events.js";

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
                    <div class="stats">
                    <p>👥Seguidores: ${userData.followers}</p>
                    <p>👥Seguindo: ${userData.following}</p>
                    <p>📔Repositórios: ${userData.public_repos}</p>
                  </div>
                </div>
            </div>`;
    document.querySelector(".profile-data").innerHTML = userInfo;

    await getUserRepositories(userName);
    await getUserEvents(userName);
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
      repositoriesItems += `
            <li class="repo-item">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <div class="repo-meta">
                    <span class="repo-stat" title="Forks">
                        <i class="fas fa-code-branch"></i> ${repo.forks_count}
                    </span>
                    <span class="repo-stat" title="Stars">
                        <i class="fas fa-star"></i> ${repo.stargazers_count}
                    </span>
                    <span class="repo-stat" title="Watchers">
                        <i class="fas fa-eye"></i> ${repo.watchers_count}
                    </span>
                    ${repo.language ? `
                    <span class="repo-lang">
                        <span class="lang-color" style="background-color: ${getLanguageColor(repo.language)}"></span>
                        ${repo.language}
                    </span>` : ''}
                </div>
            </li>`;
        });
        
        document.querySelector(".profile-data").innerHTML += `
        <div class="repositories section">
            <h2>Repositórios</h2>
            <ul class="repo-list">${repositoriesItems}</ul>
        </div>`;
  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);
  }
}
  async function getUserEvents(userName) {
    try {
        const eventsData = await events(userName);
        
        const filteredEvents = eventsData
            .filter(event => event.type === 'PushEvent' || event.type === 'CreateEvent')
            .slice(0, 10);
        
        if (filteredEvents.length === 0) {
            return;
        }
        
        let eventsHTML = `
        <div class="events section">
            <h2>Últimas Atividades</h2>
            <ul class="events-list">`;
        
        filteredEvents.forEach(event => {
            if (event.type === 'PushEvent') {
                const repoName = event.repo.name.split('/')[1];
                const commitMessage = event.payload.commits[0]?.message || "Sem mensagem de commit";
                eventsHTML += `
                <li class="event-item">
                    <span class="event-type push-event">Push</span>
                    <span class="event-repo">${repoName}</span>
                    <p class="event-message">${commitMessage}</p>
                </li>`;
            } else if (event.type === 'CreateEvent') {
                eventsHTML += `
                <li class="event-item">
                    <span class="event-type create-event">Create</span>
                    <p class="event-message">Sem mensagem de commit</p>
                </li>`;
            }
        });
        
        eventsHTML += `</ul></div>`;
        document.querySelector(".profile-data").innerHTML += eventsHTML;
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'C++': '#f34b7d',
        'C': '#555555',
        'Shell': '#89e051',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Go': '#00ADD8',
        'Rust': '#dea584'
    };
    return colors[language] || '#cccccc';
}