/********************************************************************************* * 
 
* WEB422 Assignment 2

* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *

* Name: Chaeyoung Park Student ID: 011784154 Date: Jun 2, 2023

* Cyclic Link: https://cute-erin-capybara-yoke.cyclic.app/

* ********************************************************************************/



let currentPage = 1; // Keep track of the current page

const moviesPerPage = 10; // Number of movies to display per page

// Function to display movie rows in the table
function displayMovieRows(data) {
  const movieRows = data.map(movie => {
    return `
      <tr data-id="${movie._id}">
        <td>${movie.year}</td>
        <td>${movie.title}</td>
        <td>${movie.plot ? movie.plot : 'Unknown'}</td>
        <td>${movie.rated ? movie.rated : 'Unknown'}</td>
        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
      </tr>
    `;
  }).join('');

  document.querySelector('#moviesTable tbody').innerHTML = movieRows;
  document.querySelector('#current-page').innerHTML = currentPage;
}

// Show movie details in the modal
function showMovieDetails(data) {
  let commentsList = "";

  if (data.poster) {
    commentsList += `
      <img class="img-fluid w-100" src="${data.poster}"><br><br>
    `;
  }

  commentsList += `
    <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
    <p>${data.fullplot}</p>
    <strong>Cast:</strong> ${data.cast ? data.cast.join(', ') : 'Unknown'}<br><br>
    <strong>Awards:</strong> ${data.awards.text}<br>
    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
  `;

  document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
  document.querySelector('#detailsModal .modal-body').innerHTML = commentsList;

  const myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
    backdrop: 'static',
    keyboard: false,
    focus: true,
  });

  myModal.show();
}


// Loading The Data
function loadMoviesData(title = null) {
  let url = title
    ? `https://cute-erin-capybara-yoke.cyclic.app/api/movies?page=${currentPage}&perPage=${moviesPerPage}&title=${title}`
    : `https://cute-erin-capybara-yoke.cyclic.app/api/movies?page=${currentPage}&perPage=${moviesPerPage}`;

  const pagination = document.querySelector('.pagination');
  title ? pagination.classList.add('d-none') : pagination.classList.remove('d-none');

  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayMovieRows(data);
      attachRowClickListeners(data);
    })
    .catch(error => {
      console.error('Failed to fetch movie data:', error);
    });
}


//// Adding Click Events & Loading / Displaying Movie Data /////
function attachRowClickListeners(data) {
  const rows = document.querySelectorAll('#moviesTable tbody tr');

  rows.forEach(row => {
    row.addEventListener('click', () => {
      const clickedId = row.getAttribute('data-id');

      fetch(`https://cute-erin-capybara-yoke.cyclic.app/api/movies/${clickedId}`)
        .then(res => res.json())
        .then(data => {
          showMovieDetails(data);
        })
        .catch(error => {
          console.error('Failed to fetch movie details:', error);
        });
    });
  });
}

  // Run this code when the DOM is loaded 
 document.addEventListener('DOMContentLoaded', () => {
  loadMoviesData();

  // Search form submission event listener
  document.querySelector('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    currentPage = 1;
    const title = document.querySelector('#title').value.trim();
    loadMoviesData(title);
  });

  // Clear form button click event listener
  document.querySelector('#clearForm').addEventListener('click', () => {
    document.querySelector('#title').value = "";
    loadMoviesData();
  });

  // Previous page button click event listener
  document.querySelector('#previous-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadMoviesData();
    }
  });

  // Next page button click event listener
  document.querySelector('#next-page').addEventListener('click', () => {
    currentPage++;
    loadMoviesData();
  });
});
