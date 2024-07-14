import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar.js";
import { Search } from "./components/Search.js";
import { NumResults } from "./components/NumResults.js";
import { Box } from "./components/Box.js";
import { Main } from "./components/Main.js";
import { MovieList } from "./components/MovieList.js";
import { WatchedSummary } from "./components/WatchedSummary.js";
import { WatchedMoviesList } from "./components/WatchedMoviesList.js";
import { MoviesDetail } from "./components/MoviesDetail.js";
import { Error } from "./components/Error.js";
import { Loading } from "./components/Loading.js";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  function handleAddWatched(movie) {
    setWatched((prevMovie) => [...prevMovie, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((prevMovie) => prevMovie.filter((movieID) => movieID !== id));
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=b7666db7&s=${query}`
        );
        const data = await response.json();

        console.log(data);
        if (!response.ok) {
          throw new Error("Something went wrong !");
        }

        if (data.Response === "False") {
          throw new Error("Movie not found...");
        }

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search onSetQuery={setQuery} query={query} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {loading && <Loading />}
          {!loading && !error ? (
            <MovieList movies={movies} setSelectedID={setSelectedID} />
          ) : null}
          {error && <Error message={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MoviesDetail
              selectedID={selectedID}
              setSelectedID={setSelectedID}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
