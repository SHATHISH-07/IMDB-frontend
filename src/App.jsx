import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import SignUpSection from "./components/SignUpSection";
import LoginSection from "./components/LoginSection";
import WatchList from "./components/WatchList";
import user from "./services/user";
import login from "./services/login";
import watchList from "./services/watchList";
import trendingMovie from "./services/movies/trendingMovie";
import getNowPlayingMovie from "./services/movies/nowPlaying";
import genre from "./services/movies/genre";
import genreTv from "./services/tvShows/genreTv";
import getTopRatedMovie from "./services/movies/topRatedMovie";
import getPopularMovie from "./services/movies/popularMovie";
import getUpcomingMovie from "./services/movies/upcomingMovie";
import getOnAirTv from "./services/tvShows/onAirTv";
import getPopularTv from "./services/tvShows/popularTv";
import getTopRatedTv from "./services/tvShows/topRatedTv";
import trendingTv from "./services/tvShows/trendingTv";
import movieSearch from "./services/movies/movieSearch";
import searchTv from "./services/tvShows/searchTv";
import getTvCredits from "./services/tvShows/tvCredits";
import getMovieCredits from "./services/movies/movieCredits";
import getMovieImage from "./services/movies/movieImage";
import getMovieVideo from "./services/movies/movieVideo";
import getMovieReview from "./services/movies/movieReview";
import getRecommendMovie from "./services/movies/recommendMovie";
import getTvVideo from "./services/tvShows/tvVideos";
import getTvReview from "./services/tvShows/tvReview";
import getTvShowImage from "./services/tvShows/tvShowImage";
import getRecommendTv from "./services/tvShows/recommendTv";
import IndividualCardDetails from "./components/IndividualCardDetails";
import getMovieCollections from "./services/movies/movieCollection";
import AllCardShow from "./components/AllCardShow";
import AllPersonShow from "./components/AllPersonShow";
import IndividualPerson from "./components/IndividualPerson";

import person from "./services/persons/person";
import SearchResults from "./components/SearchResults";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [trendingMoviesDay, setTrendingMoviesDay] = useState([]);
  const [trendingMoviesWeek, setTrendingMoviesWeek] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovie, setNowPlayingMovie] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingTvShowsDay, setTrendingTvShowsDay] = useState([]);
  const [trendingTvShowsWeek, setTrendingTvShowsWeek] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [onAirTvShows, setOnAirTvShows] = useState([]);
  const [persons, setPersons] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [detailedShowCard, setDetailedShowCard] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [type, setType] = useState("");
  const [videos, setVideos] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState();
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [collections, setCollections] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genreTvShows, setGenreTvShows] = useState([]);
  const [movieGenreId, setMovieGenreId] = useState(28);
  const [tvGenreId, setTvGenreId] = useState(10759);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [personId, setPersonId] = useState();
  const [personData, setPersonData] = useState();

  const navigate = useNavigate();

  const handleSetMovieId = (movieId, type) => {
    setMovieId(movieId);
    setType(type);
  };

  const handleSetGenreId = (genreId, type) => {
    if (type === "movie") {
      setMovieGenreId(genreId);
    } else if (type === "tv") {
      setTvGenreId(genreId);
    }
  };

  const handleSetPersonId = (personId) => {
    setPersonId(personId);
  };

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

  // Handle login
  const handleLogin = async ({ username, password }) => {
    try {
      const loggedInUser = await login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(loggedInUser));
      watchList.setToken(loggedInUser.token);

      setCurrentUser(loggedInUser);
      navigate("/");

      return true; // Indicate successful login
    } catch (error) {
      console.error("Error logging in:", error.message);
      return error.message; // Return the error message for display
    }
  };

  // Handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setCurrentUser(null);
    watchList.setToken(null);
    navigate("/");
  };

  // Handle sign up
  const handleSignUp = async ({ username, password, name }) => {
    try {
      const newUser = await user.create({ username, password, name });
      window.localStorage.setItem("loggedUser", JSON.stringify(newUser));

      navigate("/login");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Fetch logged in user
  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem("loggedUser");
      if (loggedUserJSON) {
        const loggedInUser = JSON.parse(loggedUserJSON);
        setCurrentUser(loggedInUser);
        watchList.setToken(loggedInUser.token);
      }
    } catch (error) {
      console.error("Failed to retrieve logged in user:", error);
    }
  }, []);

  // Watchlist
  const handleAddToWatchList = async (movie, type) => {
    const movieData = {
      movieId: movie.id,
      title: type === "movie" ? movie.title : movie.name,
      poster_path: movie.poster_path,
      mediaType: type,
      rating: movie.vote_average,
      releasedAt: type === "movie" ? movie.release_date : movie.first_air_date,
    };

    const isAlreadyInWatchlist = watchlist.some(
      (item) => item.movieId === movie.id
    );
    if (isAlreadyInWatchlist) {
      console.log("Movie is already in the watchlist");
      return;
    }

    try {
      const newWatchList = await watchList.create(movieData);
      setWatchlist((prevWatchlist) => [...prevWatchlist, newWatchList]);
    } catch (error) {
      console.error("Error adding movie to watch list:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleRemoveFromWatchList = async (movieId) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((movie) => movie.movieId !== movieId)
    );

    try {
      await watchList.remove(movieId);

      fetchWatchList();
    } catch (error) {
      console.error("Error removing movie from watch list:", error);

      setWatchlist((prevWatchlist) => [
        ...prevWatchlist,
        watchlist.find((movie) => movie.movieId === movieId),
      ]);
    }
  };

  const fetchWatchList = async () => {
    try {
      const watchListItems = await watchList.getAll();
      setWatchlist(watchListItems);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWatchList();
    }
  }, [currentUser]);

  // Fetch card details
  const fetchCardDetails = async () => {
    if (!movieId) return;

    try {
      const response =
        type === "movie"
          ? await movieSearch.getMovieById(movieId)
          : await searchTv.getTvById(movieId);

      setDetailedShowCard(response);
      localStorage.setItem("detailedShowCard", JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, [movieId, type]);

  useEffect(() => {
    const savedDetails = localStorage.getItem("detailedShowCard");
    if (savedDetails) {
      setDetailedShowCard(JSON.parse(savedDetails));
    }
  }, []);

  //Fetch Movie Collection
  const fetchCollection = async () => {
    try {
      if (!detailedShowCard?.belongs_to_collection?.id) {
        console.error("No collection data available.");
        return;
      }

      const id = detailedShowCard.belongs_to_collection.id;
      const response = await getMovieCollections(id);

      setCollections(response.parts || []);

      localStorage.setItem("collection", JSON.stringify(response.parts || []));
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchCollection();
    }
  }, [detailedShowCard]);

  useEffect(() => {
    const savedCollection = localStorage.getItem("collection");
    if (savedCollection) {
      setCollections(JSON.parse(savedCollection));
    }
  }, []);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response =
        type === "movie"
          ? await getMovieReview(movieId)
          : await getTvReview(movieId);

      setReviews(response.results);
      localStorage.setItem("reviews", JSON.stringify(response.results));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchReviews();
    }
  }, [movieId]);

  useEffect(() => {
    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Fetch cast
  const fetchCast = async () => {
    try {
      const response =
        type === "movie"
          ? await getMovieCredits(movieId)
          : await getTvCredits(movieId);

      setCredits(response);
      localStorage.setItem("cast", JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching cast:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchCast();
    }
  }, [movieId]);

  useEffect(() => {
    const savedCast = localStorage.getItem("cast");
    if (savedCast) {
      setCredits(JSON.parse(savedCast));
    }
  }, []);

  // Fetch Images
  const fetchImages = async () => {
    try {
      const response =
        type === "movie"
          ? await getMovieImage(movieId)
          : await getTvShowImage(movieId);

      setImages(response.backdrops);
      localStorage.setItem("images", JSON.stringify(response.backdrops));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchImages();
    }
  }, [movieId]);

  useEffect(() => {
    const savedImages = localStorage.getItem("images");
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Fetch Videos
  const fetchVideos = async () => {
    try {
      const response =
        type === "movie"
          ? await getMovieVideo(movieId)
          : await getTvVideo(movieId);

      setVideos(response.results);
      localStorage.setItem("videos", JSON.stringify(response.results));
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchVideos();
    }
  }, [movieId]);

  useEffect(() => {
    const savedVideos = localStorage.getItem("videos");
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  // Fetch Recommendations
  const fetchRecommendations = async () => {
    try {
      const response =
        type === "movie"
          ? await getRecommendMovie(movieId)
          : await getRecommendTv(movieId);

      setRecommendations(response.results);
      localStorage.setItem("recommendations", JSON.stringify(response.results));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchRecommendations();
    }
  }, [movieId]);

  useEffect(() => {
    const savedRecommendations = localStorage.getItem("recommendations");
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }
  }, []);

  //Fetch Movie Genres
  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      try {
        const [genresResponse, genresMovieResponse] = await Promise.all([
          genre.getAllGenresMovie(),
          genre.getMovieByGenre(movieGenreId, page),
        ]);
        setGenres(genresResponse || []);
        setGenreMovies(genresMovieResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGenresAndMovies();
  }, [movieGenreId, page]);

  //Fetch Tv Genres
  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      try {
        const [genresResponse, genresTvResponse] = await Promise.all([
          genreTv.getAllGenresTv(),
          genreTv.getTvByGenre(tvGenreId, page),
        ]);
        setTvGenres(genresResponse || []);
        setGenreTvShows(genresTvResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGenresAndMovies();
  }, [tvGenreId, page]);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!personId) return;

      try {
        const personDetailsData = await person.fetchPersonById(personId);
        setPersonData(personDetailsData);
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };

    fetchPersonDetails();
  }, [personId]);

  // Fetch movie, tv, and genre data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetching Movies
        const trendingMoviesDayResponse =
          await trendingMovie.getTrendingMovieByDay(page);
        setTrendingMoviesDay(trendingMoviesDayResponse.results || []);

        const trendingMoviesWeekResponse =
          await trendingMovie.getTrendingMovieByWeek(page);
        setTrendingMoviesWeek(trendingMoviesWeekResponse.results || []);

        const topRatedMoviesResponse = await getTopRatedMovie(page);
        setTopRatedMovies(topRatedMoviesResponse.results || []);

        const popularMoviesResponse = await getPopularMovie(page);
        setPopularMovies(popularMoviesResponse.results || []);

        const nowPlayingMovieResponse = await getNowPlayingMovie(page);
        setNowPlayingMovie(nowPlayingMovieResponse.results || []);

        const upcomingMoviesResponse = await getUpcomingMovie(page);
        setUpcomingMovies(upcomingMoviesResponse.results || []);

        // Fetching TV Shows
        const trendingTvShowsDayResponse = await trendingTv.getTrendingTvByDay(
          page
        );
        setTrendingTvShowsDay(trendingTvShowsDayResponse.results || []);

        const trendingTvShowsWeekResponse =
          await trendingTv.getTrendingTvByWeek(page);
        setTrendingTvShowsWeek(trendingTvShowsWeekResponse.results || []);

        const topRatedTvShowsResponse = await getTopRatedTv(page);
        setTopRatedTvShows(topRatedTvShowsResponse.results || []);

        const popularTvShowsResponse = await getPopularTv(page);
        setPopularTvShows(popularTvShowsResponse.results || []);

        const onAirTvShowsResponse = await getOnAirTv(page);
        setOnAirTvShows(onAirTvShowsResponse.results || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Fetching popular persons
  useEffect(() => {
    const fetchPopularPersons = async () => {
      try {
        const popularPersonsResponse = await person.fetchPopularPersons(page);
        setPersons(popularPersonsResponse.results || []);
      } catch (error) {
        console.error("Error fetching popular persons:", error);
      }
    };

    fetchPopularPersons();
  }, [page]);

  const handleNextPage = () => setPage(page + 1);
  const handlePreviousPage = () => setPage(page - 1);

  return (
    <div>
      <NavBar
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleSetMovieId={handleSetMovieId}
        page={page}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        genres={genres}
        tvGenres={tvGenres}
      />

      {loading ? (
        <div>
          <div className="flex justify-center items-center h-screen  bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-700 dark:border-blue-400 "></div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                trendingMoviesDay={trendingMoviesDay}
                trendingMoviesWeek={trendingMoviesWeek}
                topRatedMovies={topRatedMovies}
                popularMovies={popularMovies}
                nowPlayingMovie={nowPlayingMovie}
                upcomingMovies={upcomingMovies}
                trendingTvShowsDay={trendingTvShowsDay}
                trendingTvShowsWeek={trendingTvShowsWeek}
                topRatedTvShows={topRatedTvShows}
                popularTvShows={popularTvShows}
                onAirTvShows={onAirTvShows}
                persons={persons}
                genres={genres}
                tvGenres={tvGenres}
                handleAddToWatchList={handleAddToWatchList}
                currentUser={currentUser}
                handleSetMovieId={handleSetMovieId}
                handleSetGenreId={handleSetGenreId}
                handleSetPersonId={handleSetPersonId}
                watchList={watchlist}
              />
            }
          />

          <Route
            path="/signup"
            element={<SignUpSection handleSignUp={handleSignUp} />}
          />

          <Route
            path="/login"
            element={<LoginSection handleLogin={handleLogin} />}
          />

          <Route
            path="/watchlist"
            element={
              <WatchList
                watchlist={watchlist}
                onRemove={handleRemoveFromWatchList}
                handleSetMovieId={handleSetMovieId}
              />
            }
          />

          <Route
            path={`/cardDetails/:id`}
            element={
              <IndividualCardDetails
                handleSetPersonId={handleSetPersonId}
                handleAddToWatchList={handleAddToWatchList}
                detailedShowCard={detailedShowCard}
                reviews={reviews}
                credits={credits}
                images={images}
                videos={videos}
                recommendations={recommendations}
                genres={genres}
                tvGenres={tvGenres}
                collections={collections}
                type={type}
                currentUser={currentUser}
                handleSetMovieId={handleSetMovieId}
                onWatchTrailer={handleWatchTrailer}
              />
            }
          />

          <Route
            path="/search/results"
            element={
              <SearchResults
                title="Search Results"
                subText="Search Results"
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/trendingMoviesDay"
            element={
              <AllCardShow
                title="Trending Movies"
                subText="Trending Movies of the day"
                movies={trendingMoviesDay}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/trendingMoviesWeek"
            element={
              <AllCardShow
                title="Trending Movies"
                subText="Trending Movies of the week"
                movies={trendingMoviesWeek}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/topRatedMovies"
            element={
              <AllCardShow
                title="Top Rated Movies"
                subText="Top Rated Movies"
                movies={topRatedMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/popularMovies"
            element={
              <AllCardShow
                title="Popular Movies"
                subText="Popular Movies"
                movies={popularMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/upcomingMovies"
            element={
              <AllCardShow
                title="Upcoming Movies"
                subText="Upcoming Movies"
                movies={upcomingMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/nowPlayingMovies"
            element={
              <AllCardShow
                title="Now Playing Movies"
                subText="Now Playing Movies"
                movies={nowPlayingMovie}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/topRatedTvShows"
            element={
              <AllCardShow
                title="Top Rated TV Shows"
                subText="Top Rated TV Shows"
                movies={topRatedTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/popularTvShows"
            element={
              <AllCardShow
                title="Popular TV Shows"
                subText="Popular TV Shows"
                movies={popularTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/trendingTvShowsDay"
            element={
              <AllCardShow
                title="Trending TV Shows"
                subText="Trending TV Shows of the week"
                movies={trendingTvShowsDay}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/trendingTvShowsWeek"
            element={
              <AllCardShow
                title="Trending TV Shows"
                subText="Trending TV Shows of the week"
                movies={trendingTvShowsWeek}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/onAirTvShows"
            element={
              <AllCardShow
                title="On Air TV Shows"
                subText="On Air TV Shows"
                movies={onAirTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/movie/Action"
            element={
              <AllCardShow
                title="Action Movies"
                subText="Action Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />

          <Route
            path="/movie/Adventure"
            element={
              <AllCardShow
                title="Adventure Movies"
                subText="Adventure Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Animation"
            element={
              <AllCardShow
                title="Animation Movies"
                subText="Animation Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/comedy"
            element={
              <AllCardShow
                title="Comedy Movies"
                subText="Comedy Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Crime"
            element={
              <AllCardShow
                title="Crime Movies"
                subText="Crime Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Documentary"
            element={
              <AllCardShow
                title="=Documentary Movies"
                subText="Documentary Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Drama"
            element={
              <AllCardShow
                title="Drama Movies"
                subText="Drama Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Family"
            element={
              <AllCardShow
                title="Family Movies"
                subText="Family Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Fantasy"
            element={
              <AllCardShow
                title="Fantasy Movies"
                subText="Fantasy Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/History"
            element={
              <AllCardShow
                title="History Movies"
                subText="History Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Horror"
            element={
              <AllCardShow
                title="Horror Movies"
                subText="Horror Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Music"
            element={
              <AllCardShow
                title="Music Movies"
                subText="Music Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Mystery"
            element={
              <AllCardShow
                title="Mystery Movies"
                subText="Mystery Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Romance"
            element={
              <AllCardShow
                title="Romance Movies"
                subText="Romance Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Science Fiction"
            element={
              <AllCardShow
                title="Sci-Fi Movies"
                subText="Sci-Fi Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/TV Movie"
            element={
              <AllCardShow
                title="Tv Movies"
                subText="Tv Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Thriller"
            element={
              <AllCardShow
                title="Thriller Movies"
                subText="Thriller Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/War"
            element={
              <AllCardShow
                title="War Movies"
                subText="War Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/movie/Western"
            element={
              <AllCardShow
                title="Western Movies"
                subText="Western Movies"
                movies={genreMovies}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={genres}
                type="movie"
              />
            }
          />
          <Route
            path="/tv/Action & Adventure"
            element={
              <AllCardShow
                title="Action & Adventure Tv Shows"
                subText="Action & Adventure Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Animation"
            element={
              <AllCardShow
                title="Animation Tv Shows"
                subText="Animation Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />
          <Route
            path="/tv/Comedy"
            element={
              <AllCardShow
                title="Comedy Tv Shows"
                subText="Comedy Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />
          <Route
            path="/tv/Crime"
            element={
              <AllCardShow
                title="Crime Tv Shows"
                subText="Crime Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Documentary"
            element={
              <AllCardShow
                title="Documentary Tv Shows"
                subText="Documentary Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Drama"
            element={
              <AllCardShow
                title="Drama Tv Shows"
                subText="Drama Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Family"
            element={
              <AllCardShow
                title="Family Tv Shows"
                subText="Family Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Kids"
            element={
              <AllCardShow
                title="Kids Tv Shows"
                subText="Kids Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Mystery"
            element={
              <AllCardShow
                title="Mystery Tv Shows"
                subText="Mystery Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/News"
            element={
              <AllCardShow
                title="News Tv Shows"
                subText="News Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Reality"
            element={
              <AllCardShow
                title="Reality Tv Shows"
                subText="Reality Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Sci-Fi & Fantasy"
            element={
              <AllCardShow
                title="Sci-Fi & Fantasy Tv Shows"
                subText="Sci-Fi & Fantasy Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/tv/Soap"
            element={
              <AllCardShow
                title="Soap Tv Shows"
                subText="Soap Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />
          <Route
            path="/tv/Talk"
            element={
              <AllCardShow
                title="Talk Tv Shows"
                subText="Talk Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />
          <Route
            path="/tv/War & Politics"
            element={
              <AllCardShow
                title="War & Politics Tv Shows"
                subText="War & Politics Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />
          <Route
            path="/tv/Western"
            element={
              <AllCardShow
                title="Western Tv Shows"
                subText="Western Tv Shows"
                movies={genreTvShows}
                handleSetMovieId={handleSetMovieId}
                handleAddToWatchList={handleAddToWatchList}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentUser={currentUser}
                genres={tvGenres}
                type="tv"
              />
            }
          />

          <Route
            path="/person/popular"
            element={
              <AllPersonShow
                title="Spotlight on Popular Personalities"
                subText="Dive into the world of renowned individuals and discover their achievements."
                persons={persons}
                handleSetPersonId={handleSetPersonId}
                page={page}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            }
          />

          <Route
            path="/person/:personId"
            element={<IndividualPerson personDetails={personData} />}
          />
        </Routes>
      )}

      <Footer currentUser={currentUser} />
    </div>
  );
};

export default App;
