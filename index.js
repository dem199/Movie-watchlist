function findMovie() {
  const movieTitle = document.getElementById('input-text').value;

  if (movieTitle) {
    document.getElementsByTagName('main')[0].innerHTML = `
      <div id="search-box"></div>
    `;
    fetch(`https://www.omdbapi.com/?s=${movieTitle}&apikey=ce8ec4bc`)
      .then(res => res.json())
      .then(data => {
        let searchResults = data.Search;
        if (searchResults && searchResults.length > 0) {
          searchResults.map(movie => {
            fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=ce8ec4bc`)
              .then(res => res.json())
              .then(data => {
                fillHtml(data, ["saveData(this)", "Watchlist", "Icon (1)"]);
              });
          });
        } else {
          const searchBox = document.getElementById('search-box');
          searchBox.innerHTML = '<p class="error-message">No movies found.</p>';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        clearMain();
      });
  } else {
    clearMain();
  }
}

function loadStorageContent() {
  event.preventDefault();
  document.querySelector('.search-container').style.display = 'none';
  document.querySelector('.header-info-sub').innerHTML = `
    <a href="#" onclick="location.reload()">Find your film</a>
  `;
  document.querySelector('.header-info-main').textContent = 'My watchlist';
  if (localStorage.length) {
    document.getElementsByTagName('main')[0].innerHTML = `
      <div id="search-box"></div>
    `;
    let imdbS = Object.keys(localStorage);
    for (let imdb of imdbS) {
      fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=ce8ec4bc`)
        .then(res => res.json())
        .then(data => {
          fillHtml(data, ["removeData(this)", "Remove", "Icon (3)"]);
        });
    }
  } else {
    clearMain();
  }
}

function saveData(local) {
  event.preventDefault();
  localStorage.setItem(local.name, local.name);
  local.textContent = "✔Added";
}

function removeData(localKey) {
  event.preventDefault();
  localStorage.removeItem(localKey.name);
  localKey.parentElement.parentElement.parentElement.remove();
}

function clearMain() {
  document.getElementsByTagName('main')[0].innerHTML = `
    <div class="blank-details">
      <img src="image/Icon (2).png" alt="" />
      <h1>Start exploring</h1>
    </div>
    <div id="search-box"></div>
  `;
}

function fillHtml(data, action) {
  document.getElementById('search-box').innerHTML += `
    <div class="movie-container">
      <img src=${data.Poster} alt="" class="movie-image"/>
      <div class="movie-info">
        <div class="movie-info-one">
          <h3 class="movie-title">${data.Title}</h3>
          <img src="image/Icon.png" class="movie-rating" /><span>${data.imdbRating}</span>
        </div>
        <div class="movie-info-two">
          <p class="movie-time">${data.Runtime}</p>
          <p class="movie-genre">${data.Genre}</p>
          <a class="watchlist-anchor" name=${data.imdbID} href="#" onclick=${action[0]}><img src="./image/${action[2]}.png"  alt="Some Data" /> ${action[1]}</a>
          </div>
          <div class="movie-description">
            <p class="description">
              ${data.Plot}
            </p>
          </div>
        </div>
      </div>
    `;
  }
  
  
  
