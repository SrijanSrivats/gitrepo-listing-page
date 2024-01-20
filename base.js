var username=""
document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", function () {
        const currUsername = document.getElementById("username").value;
        if(currUsername !== username) {
            username = currUsername;

            document.getElementById("loader").innerHTML = "<p>Loading...</p>";
            if (!currUsername) {
                alert("Please enter a username.");
                return;
            }

            document.getElementById("repositories").innerHTML = "";
            // Show loader

            fetchRepositories(currUsername, 1);
        }
    });
});

function fetchRepositories(username, page = 1) {
    var perPage = 10;
    var apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch repositories. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderRepositories(data, username, page);
        })
        .catch(error => {
            document.getElementById("loader").innerHTML = "<p>Error fetching repositories. Please try again.</p>";
            console.error('Error:', error);
        });
}

function renderRepositories(repositories,username,page) {
    document.getElementById("loader").innerHTML = "";
    var ownerDisplay = document.getElementById("ownerInfo")
    ownerDisplay.className = "d-flex flex-row"
    ownerDisplay.innerHTML=""
    var displayPic = document.createElement("img");
    displayPic.src = repositories[1].owner.avatar_url;
    displayPic.className = "card-img-top pic mr-3 mb-3";
    displayPic.alt = "Owner Display Pic";
    ownerDisplay.appendChild(displayPic);

    var socialIds = document.createElement("h3");
    socialIds.className = "";
    socialIds.textContent = `${repositories[1].owner.login}`;
    ownerDisplay.appendChild(socialIds);
    


    var repositoriesContainer = document.getElementById("repositories");
    repositoriesContainer.innerHTML=""
    repositoriesContainer.className = "d-flex"

    repositories.forEach(function (repo , index) {

        var card = document.createElement("div");
        card.className = "card mt-3 repo";

        var cardBody = document.createElement("div");
        cardBody.className = "card-body";

        var repoName = document.createElement("h2");
        repoName.className = "card-title";
        repoName.textContent = repo.name;
        cardBody.appendChild(repoName);

        var repoDescription = document.createElement("h5");
        repoDescription.className = "card-title";
        repoDescription.textContent = repo.description || "Desciption is empty";
        cardBody.appendChild(repoDescription);
        
        var repoUrl = document.createElement("a");
        repoUrl.className = "card-link"
        repoUrl.href = repo.html_url
        repoUrl.target = "_blank";
        repoUrl.textContent = "View Repository"
        cardBody.appendChild(repoUrl)

        card.appendChild(cardBody);

        repositoriesContainer.appendChild(card);
    });
    var totalPages = 10; 

    renderPagination(totalPages, username, page);

}

function renderPagination(totalPages, username, currentPage) {
    var paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        var pageButton = document.createElement("button");
        
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        
        pageButton.textContent = i;
        pageButton.addEventListener("click", function () {
            fetchRepositories(username, i);
        });

        paginationContainer.appendChild(pageButton);
    }
}