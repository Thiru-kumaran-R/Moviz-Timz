import { useState, useEffect } from "react";
import { Loading } from "./Loading.js";
import StarRating from "./StarRating";

const API_KEY = "https://www.omdbapi.com/?apikey=b7666db7";

export function MoviesDetail({
  selectedID,
  setSelectedID,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };

    onAddWatched(newWatchedMovie);
    setSelectedID(null);
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
        const response = await fetch(`${API_KEY}&i=${selectedID}`);
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      }

      getMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      const backHome = (e) => {
        if (e.code === "Escape") {
          setSelectedID(null);
        }
      };

      document.addEventListener("keydown", backHome);

      return function () {
        document.removeEventListener("keydown", backHome);
      };
    },
    [setSelectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return function () {
        document.title = `Moviz Timz`;
      };
    },
    [title]
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="details">
          <button className="btn-back" onClick={() => setSelectedID(null)}>
            &larr;
          </button>
          <header>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p> You have already rated this movie </p>
              )}
            </div>
            <p>
              <em> {plot}</em>
            </p>
            <p> Starring {actors} </p>
            <p> Directed By {director} </p>
          </section>
        </div>
      )}
    </>
  );
}
