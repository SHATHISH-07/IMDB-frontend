import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import HorizontalCards from "./HorizontalCards";
import GenreSection from "./GenreSection";
import PersonsScrollComponent from "./PersonScrollComponent";
import Banner from "./Banner";
import trendingMovie from "../services/movies/trendingMovie";
import WatchListHome from "./WatchListHome";
import WatchList from "../services/watchList";

const HomePage = ({
  trendingMoviesDay,
  trendingMoviesWeek,
  topRatedMovies,
  popularMovies,
  nowPlayingMovie,
  upcomingMovies,
  trendingTvShowsDay,
  trendingTvShowsWeek,
  topRatedTvShows,
  popularTvShows,
  onAirTvShows,
  persons,
  genres,
  tvGenres,
  handleAddToWatchList,
  currentUser,
  handleSetMovieId,
  handleSetGenreId,
  handleSetPersonId,
  watchList,
}) => {
  const [heroPage, setHeroPage] = useState(1);
  const [trendingHeroMovies, setTrendingHeroMovies] = useState([]);
  const [movie, setMovie] = useState(null);

  // Hero Section Movies
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const response = await trendingMovie.getTrendingMovieByDay(heroPage);
        setTrendingHeroMovies(response.results || []);
        if (response.results?.length) {
          setMovie(response.results[0]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchHeroMovies();

    const pageInterval = setInterval(() => {
      setHeroPage((prevPage) => (prevPage < 245 ? prevPage + 1 : 1));
    }, 40000);
    return () => clearInterval(pageInterval);
  }, [heroPage]);

  useEffect(() => {
    if (trendingHeroMovies.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(
          Math.random() * trendingHeroMovies.length
        );
        setMovie(trendingHeroMovies[randomIndex]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [trendingHeroMovies]);

  useEffect(() => {
    window.scrollBy(0, 0);
  });

  const handleWatchTrailer = (movie, type) => {
    if (movie) {
      window.open(
        `https://www.youtube.com/results?search_query=${
          type === "movie" ? movie.original_title : movie.original_name
        } trailer`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900">
      <HeroSection
        movie={movie}
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
      />
      <Banner />

      <HorizontalCards
        Movies={trendingMoviesDay}
        title="Today's Must-Watch"
        subText="Movies Trending Today"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="trendingMoviesDay"
      />

      <HorizontalCards
        Movies={trendingMoviesWeek}
        title="This Week's Blockbusters"
        subText="Movies Trending This Week"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="trendingMoviesWeek"
      />

      <HorizontalCards
        Movies={topRatedMovies}
        title="Critics' Top Picks"
        subText="Highly Acclaimed Movies"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="topRatedMovies"
      />

      <HorizontalCards
        Movies={popularMovies}
        title="Audience Favorites"
        subText="Movies Everyone Loves"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="popularMovies"
      />

      <HorizontalCards
        Movies={upcomingMovies}
        title="Get Ready for the Big Screen"
        subText="Upcoming Movies"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="upcomingMovies"
      />

      <HorizontalCards
        Movies={nowPlayingMovie}
        title="In Theaters Now"
        subText="Catch These Movies Today"
        genres={genres}
        onWatchTrailer={handleWatchTrailer}
        type="movie"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="nowPlayingMovies"
      />

      <GenreSection
        genres={genres}
        title="Explore Genres"
        subText="Movies by Genre"
        handleSetGenreId={handleSetGenreId}
        type="movie"
      />

      <HorizontalCards
        Movies={topRatedTvShows}
        title="Critics' Choice"
        subText="Top Rated TV Shows"
        genres={tvGenres}
        onWatchTrailer={handleWatchTrailer}
        type="tv"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="topRatedTvShows"
      />

      <HorizontalCards
        Movies={popularTvShows}
        title="Fan Favorites"
        subText="Popular TV Shows"
        genres={tvGenres}
        onWatchTrailer={handleWatchTrailer}
        type="tv"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="popularTvShows"
      />

      <HorizontalCards
        Movies={trendingTvShowsDay}
        title="Trending Now"
        subText="TV Shows Taking Over Today"
        genres={tvGenres}
        onWatchTrailer={handleWatchTrailer}
        type="tv"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="trendingTvShowsDay"
      />

      <HorizontalCards
        Movies={trendingTvShowsWeek}
        title="This Week's Hottest"
        subText="TV Shows Everyone's Talking About"
        genres={tvGenres}
        onWatchTrailer={handleWatchTrailer}
        type="tv"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="trendingTvShowsWeek"
      />

      <HorizontalCards
        Movies={onAirTvShows}
        title="Currently Streaming"
        subText="Don't Miss These TV Shows"
        genres={tvGenres}
        onWatchTrailer={handleWatchTrailer}
        type="tv"
        handleAddToWatchList={handleAddToWatchList}
        isLoggedIn={currentUser}
        handleSetMovieId={handleSetMovieId}
        navigator="onAirTvShows"
      />

      <GenreSection
        genres={tvGenres}
        title="Explore Genres"
        subText="Tv Shows by Genre"
        handleSetGenreId={handleSetGenreId}
        type="tv"
      />

      <PersonsScrollComponent
        people={persons}
        handleSetPersonId={handleSetPersonId}
      />

      <WatchListHome
        title="WatchList"
        subText="Your WatchList"
        watchList={watchList}
        handleSetMovieId={handleSetMovieId}
        currentUser={currentUser}
      />
    </div>
  );
};

export default HomePage;
