import { Movie } from "./Movie";

export function MovieList({ movies, setSelectedID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} setSelectedID={setSelectedID} />
      ))}
    </ul>
  );
}
