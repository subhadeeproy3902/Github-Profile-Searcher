const blob = document.getElementById("blob");
const delaytime = 3000;
// change for delay speed

function updateBlob() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 500) {
    blob.style.display = "none"; // hide blob on screens smaller than 500px or if clientY > 85% of screen height
  } else {
    blob.style.display = "block"; // show blob on larger screens
  }
}

window.addEventListener("resize", updateBlob);
updateBlob();

window.onpointermove = event => {
  const { clientX, clientY } = event;

  if (clientY <= 0.85 * window.innerHeight) { // limit movement if clientY > 85% of screen height
    blob.animate({
      left: `${clientX}px`,
      top: `${clientY}px`
    }, { duration: delaytime, fill: "forwards" });
  }
};
const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No profile with this username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}
function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card" style="margin-top: 2.5rem;">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <a href="${user.html_url}" target="_blank"><h2>${userID}</h2></a>
        ${userBio}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card" style="margin-top: 2.5rem;">
            <h1 style="text-align: center;">${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);
  }
});
