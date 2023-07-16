const cardDesign = document.querySelector('.body');
const btnSearch = document.querySelector('#btnSearch');
const search = document.querySelector('#search');
const API = '1a7e56bd628ddb734ce7bfc67e526a64';
const api_key = 'd98214ee'
let moviesTitle = ['Fast x', 'Avatar the way of water', 'Extraction', 'Aquaman', 'Transformers: Rise of the beasts', 'spider man no way home', 'Arrow', 'The flash'];

async function generateMovie(title) {
  const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${api_key}`);
  const data = await response.json();
  return data;
}

async function generateMovieSearch(movie) {
  const response = await fetch(`https://www.omdbapi.com/?t=${movie}&apikey=${api_key}`);
  const data = await response.json();
  return data;
}

async function fetchMovieTrailer(title) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${title}`);
  const data = await response.json();
  return data;
}

async function getTrailerVideoKey(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API}`);
  const data = await response.json();
  const videoKey = data.results?.find((video) => video.type === 'Trailer')?.key || '';
  return videoKey;
}


async function displayMovies() {
  const moviesHTML = await Promise.all(
    moviesTitle.map(async (title) => {
      const movie = await generateMovie(title);
      const trailerData = await fetchMovieTrailer(title);
      const movieId = trailerData.results[0]?.id;
      const trailerVideoKey = await getTrailerVideoKey(movieId);
      const trailerUrl = `https://www.youtube.com/watch?v=${trailerVideoKey}`;
      return `
        <div class="col-md-3">
          <div class="card h-100">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" height=500>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">Year: ${movie.Year}</p>
              <p class="card-text">Plot: ${movie.Plot}</p>
              <button class="btn btn-primary mt-auto btn-trailer" data-trailer="${trailerUrl}">Watch Trailer</button>
              <button class="btn btn-secondary mt-2 btn-details" data-movie="${movie.Title}">More Details</button>
            </div>
          </div>
        </div>
      `;
    })
  );

  cardDesign.innerHTML = `
    <div class="row row-cols-1 row-cols-md-4 g-4">
      ${moviesHTML.join('')}
    </div>
  `;

  // Add event listeners to the buttons
  const trailerButtons = cardDesign.querySelectorAll('.btn-trailer');
  trailerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const trailerUrl = button.dataset.trailer;
      watchTrailer(trailerUrl);
    });
  });

  const detailsButtons = cardDesign.querySelectorAll('.btn-details');
  detailsButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const movieData = button.dataset.movie;
      showMovieDetails(movieData);
    });
  });
}

function watchTrailer(trailerUrl) {
  if (trailerUrl) {
    // Open the trailer URL in a new tab
    window.open(trailerUrl, '_blank');
  } else {
    alert('Trailer not available');
  }
}

async function showMovieDetails(title) {
  const movieData = await generateMovieSearch(title);
  if (movieData.Response === 'True') {
    cardDesign.innerHTML = `
      <div class="row">
        <div class="col">
          <div class="card" style="width: 18rem;">
            <img src="${movieData.Poster}" class="card-img-top" alt="${movieData.Title}" height=200>
            <div class="card-body">
              <h5 class="card-title">${movieData.Title}</h5>
              <p class="card-text">Year: ${movieData.Year}</p>
              <p class="card-text">Plot: ${movieData.Plot}</p>
              <p class="card-text">Country: ${movieData.Country}</p>
              <p class="card-text">Language: ${movieData.Language}</p>
              <p class="card-text">Genre: ${movieData.Genre}</p>
              <p class="card-text">Actors: ${movieData.Actors}</p>
              <p class="card-text">Released: ${movieData.Released}</p>
              <p class="card-text">Runtime: ${movieData.Runtime}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  cardDesign.innerHTML = `
    <div class="row row-cols-1 row-cols-md-4 g-4">
      ${moviesHTML.join('')}
    </div>
  `;

  if (movieData.Response === 'False') {
    cardDesign.innerHTML = '<p>Nothing found.</p>';
  }
}

displayMovies();

btnSearch.addEventListener('click', async function () {
  const value = search.value;
  const movieData = await generateMovieSearch(value);

  if (movieData.Response === 'True') {
    const trailerData = await fetchMovieTrailer(movieData.Title);
    const movieId = trailerData.results[0]?.id;
    const trailerVideoKey = await getTrailerVideoKey(movieId);
    const trailerUrl = `https://www.youtube.com/watch?v=${trailerVideoKey}`;

    cardDesign.innerHTML = `
      <div class="row">
        <div class="col">
          <div class="card" style="width: 18rem;">
            <img src="${movieData.Poster}" class="card-img-top" alt="${movieData.Title}" height=200>
            <div class="card-body">
              <h5 class="card-title">${movieData.Title}</h5>
              <p class="card-text">Year: ${movieData.Year}</p>
              <p class="card-text">Plot: ${movieData.Plot}</p>
              <p class="card-text">Country: ${movieData.Country}</p>
              <p class="card-text">Language: ${movieData.Language}</p>
              <p class="card-text">Genre: ${movieData.Genre}</p>
              <p class="card-text">Actors: ${movieData.Actors}</p>
              <p class="card-text">Released: ${movieData.Released}</p>
              <p class="card-text">Runtime: ${movieData.Runtime}</p>
              <button class="btn btn-primary mt-2 btn-trailer" data-trailer="${trailerUrl}">Watch Trailer</button>
            </div>
          </div>
        </div>
      </div>
    `;

     // Add event listener to the "Watch Trailer" button
     const trailerButton = cardDesign.querySelector('.btn-trailer');
     trailerButton.addEventListener('click', () => {
       const trailerUrl = trailerButton.dataset.trailer;
       watchTrailer(trailerUrl);
     });

  } else {
    cardDesign.innerHTML = '<p>Nothing found.</p>';
  }
});


