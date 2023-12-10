// local-storage.js

// Generic localStorage helpers
const setLocalStorageKey = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  const getLocalStorageKey = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
  // These two will be used by the rest of the functions a lot
  export const getMovies = () => getLocalStorageKey('movies');
  export const setMovies = (movies) => setLocalStorageKey('movies', movies);
  
  // More helper functions
  export const initializeMovies = (defaultMovies) => setMovies(defaultMovies);
  
  export const addMovie = (movie) => {
    const movies = getMovies() || [];
    setMovies([...movies, movie]);
  };
  
  export const removeMovie = (movieTitle) => {
    const movies = (getMovies() || []).filter((movie) => movie.title !== movieTitle);
    setMovies([...movies]);
  };
  export const resetMovies = () => {
    localStorage.removeItem('movies');
  };