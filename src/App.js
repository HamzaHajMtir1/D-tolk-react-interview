import React, { useState, useEffect } from 'react';
import './App.css';
import { movies$ } from './movies'; // Import the data
import './Movies.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    movies$.then((data) => {
      setMovies(data);
      setFilteredMovies(data);
      const uniqueCategories = [...new Set(data.map((movie) => movie.category))];
      setCategories(uniqueCategories);
    });
  }, []);

  const deleteMovie = (id) => {
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
    filterMovies(selectedCategories, updatedMovies);
  };

  const toggleLikeDislike = (id) => {
    const updatedMovies = movies.map((movie) =>
      movie.id === id
        ? { ...movie, likes: movie.dislikes, dislikes: movie.likes }
        : movie
    );
    setMovies(updatedMovies);
  };

  const filterMovies = (categories, allMovies = movies) => {
    if (categories.length === 0) {
      setFilteredMovies(allMovies);
    } else {
      setFilteredMovies(
        allMovies.filter((movie) => categories.includes(movie.category))
      );
    }

    const remainingCategories = [
      ...new Set(allMovies.map((movie) => movie.category)),
    ];
    setCategories(remainingCategories);
  };

  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelectedCategories);
    filterMovies(newSelectedCategories);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  return (
    <div className="App">
      <div className="filter-container">
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>

      <div className="movies-container">
        {currentMovies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <h3>{movie.title}</h3>
            <p>Category: {movie.category}</p>
            <div className="gauge">
              <div
                className="likes-bar"
                style={{
                  width: `${(movie.likes / (movie.likes + movie.dislikes)) * 100}%`,
                }}
              />
            </div>
            <p>{movie.likes} likes / {movie.dislikes} dislikes</p>
            <div className="icon-buttons">
              <button
                className="like-btn"
                onClick={() => toggleLikeDislike(movie.id)}
              >
                <FontAwesomeIcon icon={faThumbsUp} /> {movie.likes}
              </button>
              <button
                className="dislike-btn"
                onClick={() => toggleLikeDislike(movie.id)}
              >
                <FontAwesomeIcon icon={faThumbsDown} /> {movie.dislikes}
              </button>
            </div>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <div className="items-per-page">
        <label>
          Items per page:
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default App;
