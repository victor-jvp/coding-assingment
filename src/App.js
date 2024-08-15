import { useEffect, useState, useRef } from "react";
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";
import moviesSlice, { fetchMovies } from "./data/moviesSlice.js";
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from "./constants.js";
import Header from "./components/Header.jsx";
import Movies from "./components/Movies.jsx";
import Starred from "./components/Starred.jsx";
import WatchLater from "./components/WatchLater.jsx";
import YouTubePlayer from "./components/YoutubePlayer.jsx";
import "./app.scss";
import Modal from "./components/Modal.jsx";
import { useInfiniteScroll } from "./useInfiniteScroll.tsx";

const App = () => {
  const state = useSelector((state) => state);
  const { setPage, setMovies, setNext } = moviesSlice.actions;
  const { movies } = state;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const targetRef = useRef(null);

  const scrollOptions = {
    root: null,
    rootMargin: "10px",
    threshold: 1.0,
  };

  const closeModal = () => {
    document.body.setAttribute("style", "");
    setVideoKey(null);
    setOpen(false);
  };

  const openModal = () => {
    document.body.setAttribute("style", `overflow: hidden`);
    setOpen(true);
  };

  const closeCard = () => {};

  const getSearchResults = (query) => {
    if (isLoading || !movies.next) return;
    dispatch(setMovies([]));
    setLoading(true);
    const queryPage = `&page=1`;
    if (query !== "") {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}${queryPage}&query=` + query));
      setSearchParams(createSearchParams({ search: query }));
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER + queryPage));
      setSearchParams();
    }
    setLoading(false);
  };

  const searchMovies = (query) => {
    navigate("/");
    getSearchResults(query);
    if (query === "") {
      dispatch(setNext(true));
      getMovies();
    }
  };

  const getMovies = () => {
    if (isLoading || !movies.next) return;
    const queryPage = `&page=${movies.page}`;
    setLoading(true);
    if (searchQuery) {
      dispatch(
        fetchMovies(`${ENDPOINT_SEARCH}${queryPage}&query=` + searchQuery)
      );
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER + queryPage));
    }
    setLoading(false);
    dispatch(setPage(movies.page + 1));
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  useInfiniteScroll(targetRef, scrollOptions, getMovies, isLoading);

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (videoKey) openModal();
  }, [videoKey]);

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="container">
        {isOpen &&
          (videoKey ? (
            <Modal
              isOpen={isOpen}
              handleClose={closeModal}
              content={<YouTubePlayer videoKey={videoKey} />}
            />
          ) : (
            <div style={{ padding: "30px" }}>
              <h6>No trailer available. Try another movie</h6>
            </div>
          ))}

        <Routes>
          <Route
            path="/"
            element={
              <Movies
                movies={movies}
                viewTrailer={viewTrailer}
                closeCard={closeCard}
                targetRef={targetRef}
              />
            }
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
