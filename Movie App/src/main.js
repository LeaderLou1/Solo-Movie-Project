import './style.css';
import data from './movie-data.json';
import { getMovies, setMovies, initializeMovies, addMovie, removeMovie } from './local-storage';

// Function to create a movie element based on data
const createMovieElement = (movie) => {
  const div = document.createElement('div');
  div.className = 'movie-list-item';
  div.innerHTML = `
    <h3>${movie.title}</h3>
    <p>Critic Score: ${movie.criticScore}</p>
    <p>Audience Score: ${movie.audienceScore}</p>
    <p>Domestic: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.domestic)}</p>
    <p>Genre: ${movie.genre}</p>
  `;
  return div;
};

// Function to initialize the movie list with initial data
const initializeMovieList = () => {
    const movieList = document.getElementById('movie-list');
    const genreDropdown = document.getElementById('genre-input');
  
    data.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      movieList.appendChild(movieElement);
  
      // Extract unique genres and populate the dropdown
      if (movie.genre) {
        const option = document.createElement('option');
        option.value = movie.genre.toLowerCase(); // Convert to lowercase for consistency
        option.textContent = movie.genre;
        genreDropdown.appendChild(option);
      }
    });
  };
  

// Function to handle movie title input
const handleTitleInput = (e) => {
    const movieTitleInput = e.target;
    const movieName = movieTitleInput.value.trim(); // Trim to remove leading/trailing whitespace
  
    // Find the corresponding movie details from the data
    const selectedMovie = data.find((movie) => movie.title.toLowerCase() === movieName.toLowerCase());
  
    // Update other form elements with corresponding data
    const criticScoreInput = document.getElementById('critic-score');
    const audienceScoreInput = document.getElementById('audience-score');
    const domesticGrossInput = document.getElementById('domestic-gross-sales');
    const genreInput = document.getElementById('genre-input');
  
    if (selectedMovie) {
      criticScoreInput.value = selectedMovie.criticScore;
      audienceScoreInput.value = selectedMovie.audienceScore;
      domesticGrossInput.value = selectedMovie.domestic;
      genreInput.value = selectedMovie.genre;
    } else {
      // Clear other form elements if movie not found
      criticScoreInput.value = '';
      audienceScoreInput.value = '';
      domesticGrossInput.value = '';
      genreInput.value = '';
    }
  };
  

// Function to handle form submission
const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Check if the movie name is provided
  const movieName = formData.get('title');
  if (!movieName) {
    alert('Please provide a movie name.');
    return;
  }
  
  // Find the corresponding movie details from the data
  const selectedMovie = data.find((movie) => movie.title === movieName);

  if (selectedMovie) {
    // Create a movie element and prepend it to the movie list
    const movieElement = createMovieElement(selectedMovie);
    const movieList = document.getElementById('movie-list');
    movieList.insertBefore(movieElement, movieList.firstChild);
  
    // Log the details of the selected movie to the console
    console.log('Selected Movie:', selectedMovie);
  } else {
    alert(`Movie not found in the database. Please check the entered title for typos or choose from the available movies.`);
  }
  
  form.reset();
};
// Function to load default movies
const loadDefaultMovies = () => {
    // Retrieve the original unaltered list from movie-data.json
    const originalMovies = data;
  
    // Clear the existing movie list
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
  
    // Append the original unaltered list to the movie list
    originalMovies.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      movieList.appendChild(movieElement);
    });
  };

// Runner function
const main = () => {
    const form = document.querySelector("#new-movie-form");
    form.addEventListener('submit', handleSubmit);
  
    // Listen for title input to dynamically fill in other fields
    const titleInput = document.getElementById('title-input');
    titleInput.addEventListener('input', handleTitleInput);
  
    // Initialize the movie list on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeMovieList);
  
    // Add event listener for the "Default Movies" button
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', loadDefaultMovies);
  };
  
  // ...
  
  // Execute the main function
  main();
  // Add this at the end of your main.js file

// Function to create a bar chart
window.addEventListener('resize', () => {
    location.reload()
})
const createBarChart = () => {
    const ctx = document.getElementById('barChart').getContext('2d');
  
    // Sort movies by domestic totals in descending order
    const sortedMovies = data.slice().sort((a, b) => b.domestic - a.domestic);
  
    // Extract movie titles and domestic totals for the chart
    const movieTitles = sortedMovies.map(movie => movie.title);
    const domesticTotals = sortedMovies.map(movie => movie.domestic);
  
    // Create a bar chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: movieTitles,
        datasets: [{
          label: 'Domestic Totals',
          data: domesticTotals,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  // Function to create a pie chart
const createPieChart = () => {
    const ctx = document.getElementById('pieChart').getContext('2d');
  
    // Extract genres and calculate the total domestic gross for each genre
    const genreData = {};
    data.forEach(movie => {
        if (movie.genre) {
            if (!genreData[movie.genre]) {
                genreData[movie.genre] = 0;
            }
            genreData[movie.genre] += movie.domestic;
        }
    });

    // Extract labels and data for the pie chart
    const genreLabels = Object.keys(genreData);
    const genreValues = Object.values(genreData);

    // Create a pie chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: genreLabels,
            datasets: [{
                data: genreValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
            }],
        },
    });
};
// Function to create a scatter plot
const createScatterPlot = () => {
    const ctx = document.getElementById('scatterPlot').getContext('2d');

    // Create separate arrays for audience and critic scores
    const audienceScores = data.map(movie => movie.audienceScore);
    const criticScores = data.map(movie => movie.criticScore);

    // Create separate datasets for audience and critic scores
    const audienceDataset = {
        label: 'Audience Scores',
        data: data.map(movie => ({ x: movie.criticScore, y: movie.audienceScore })),
        backgroundColor: 'rgba(255, 99, 132, 0.8)', // Red color for audience scores
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointRadius: 4,
    };

    const criticDataset = {
        label: 'Critic Scores',
        data: data.map(movie => ({ x: movie.criticScore, y: movie.criticScore })), 
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue color for critic scores
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: 4,
    };

    // Create a scatter plot with both datasets
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [audienceDataset, criticDataset],
        },
        options: {
    
            scales: {
                x: {
                    title:{
                        display:true,
                        text: "Rotten Tomatoes Score",
                    },
                    type: 'linear',
                    position: 'bottom',
                    min: 20,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                },
                y: {
                    title:{
                        display:true,
                        text: "Box Office",
                    },
                    type: 'linear',
                    min: 0,
                    max: 700,
                    ticks: {
                        stepSize: 100,
                    },
                },
            },
        },
    });
};

// Call the createScatterPlot function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    createBarChart();
    createPieChart();
    createScatterPlot();
});

  
;
