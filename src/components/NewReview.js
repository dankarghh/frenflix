import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import SearchResult from "./SearchResult";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";

function NewReview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { user } = useContext(AuthContext);
  const [writeReview, setWriteReview] = useState(false);
  const [movieForReview, setMovieForReview] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [review, setReview] = useState({});
  const [summary, setSummary] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [rating, setRating] = useState(Number);
  const [selectTelevision, setSelectTelevision] = useState(false);

  // states for error handling

  const [ratingErr, setRatingErr] = useState("");
  const [summaryErr, setSummaryErr] = useState("");
  const [reviewBodyErr, setReviewBodyErr] = useState("");

  const navigate = useNavigate();

  async function searchMovie(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=31dab1ca58484568ac09b8a656e2dd73&query=${searchTerm}&page=1`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchTV(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=31dab1ca58484568ac09b8a656e2dd73&query=${searchTerm}&page=1`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  }

  function checkErrs() {
    if (!rating > 0 && !rating < 6) {
      setRatingErr("Need to include rating out of 5");
    } else if (summary === "") {
      setRatingErr("");
      setSummaryErr("Please include a brief summary or tag");
    } else if (reviewBody === "") {
      setRatingErr("");
      setSummaryErr("");
      setReviewBodyErr("Please include your thoughts on the film");
    } else {
      setRatingErr("");
      setSummaryErr("");
      setReviewBodyErr("");
      return true;
    }
  }

  async function handlePublishReview() {
    if (checkErrs() !== true) {
      return;
    } else {
      try {
        await addDoc(collection(db, "reviews"), {
          movie: movieForReview,
          summary: summary,
          author: user.email,
          reviewBody: reviewBody,
          rating: rating,
          comments: [],
          upVotes: [],
          downVotes: [],
          created: new Date(),
        });
      } catch (error) {
        console.log(error);
      }

      handleCloseReviewForm();
      navigate("/newsfeed");
    }
  }

  useEffect(() => {
    async function getMovies() {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=31dab1ca58484568ac09b8a656e2dd73&language=en-US&page=1"
        );
        const data = await res.json();

        setResults(data.results);
      } catch (error) {
        console.log(error);
      }
    }
    async function getTV() {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/tv/popular?api_key=31dab1ca58484568ac09b8a656e2dd73&language=en-US&page=1"
        );
        const data = await res.json();

        setResults(data.results);
      } catch (error) {
        console.log(error);
      }
    }
    if (!selectTelevision) {
      getMovies();
    } else {
      getTV();
    }
  }, [selectTelevision]);

  const resultElements = results.map(movie => {
    return (
      <SearchResult
        key={movie.id}
        handleWriteReview={handleWriteReview}
        id={movie.id}
        title={selectTelevision ? movie.name : movie.title}
        poster_path={movie.poster_path}
        movie={movie}
      />
    );
  });

  function handleWriteReview(movie) {
    const mainDiv = document.querySelector("body");
    mainDiv.classList.add("no-overflow");
    const cover = document.querySelector(".review__search-cover");
    cover.classList.remove("hidden");
    setReview({});
    setWriteReview(true);
    setMovieForReview(movie);
    setSummary("");
    setReviewBody("");
    setRating();
  }

  function handleCloseReviewForm() {
    setWriteReview(false);
    const mainDiv = document.querySelector("body");
    mainDiv.classList.remove("no-overflow");
    const cover = document.querySelector(".review__search-cover");
    cover.classList.add("hidden");
    setWriteReview(false);
  }

  return (
    <div className="main">
      <div
        className="review__search-cover hidden"
        onClick={handleCloseReviewForm}
      ></div>
      {writeReview && (
        <form className="review__write">
          <h1>WRITE REVIEW</h1>
          <h1>
            {selectTelevision ? movieForReview.name : movieForReview.title}
          </h1>
          <div>
            <span
              onClick={e => setRating(1)}
              style={{ fill: "yellow" }}
              class="material-symbols-outlined"
            >
              {rating > 0 ? "star" : "grade"}
            </span>
            <span onClick={e => setRating(2)} class="material-symbols-outlined">
              {rating > 1 ? "star" : "grade"}
            </span>
            <span onClick={e => setRating(3)} class="material-symbols-outlined">
              {rating > 2 ? "star" : "grade"}
            </span>
            <span onClick={e => setRating(4)} class="material-symbols-outlined">
              {rating > 3 ? "star" : "grade"}
            </span>
            <span onClick={e => setRating(5)} class="material-symbols-outlined">
              {rating > 4 ? "star" : "grade"}
            </span>
          </div>
          {ratingErr && <div className="review__form-error">{ratingErr}</div>}
          <input
            onChange={e => setSummary(e.target.value)}
            placeholder="brief summary"
            value={summary}
            name="summary"
          ></input>
          {summaryErr && <div className="review__form-error">{summaryErr}</div>}
          <textarea
            onChange={e => setReviewBody(e.target.value)}
            placeholder="write review"
            value={reviewBody}
            name="reviewBody"
          ></textarea>
          {reviewBodyErr && (
            <div className="review__form-error">{reviewBodyErr}</div>
          )}
          <div className="btn-container">
            <button className="btn" onClick={handleCloseReviewForm}>
              Close
            </button>
            <button className="btn " onClick={handlePublishReview}>
              Publish
            </button>
          </div>
        </form>
      )}

      <SideNav />
      <div className="review no-overflow">
        <div className="review__selection-heading-container">
          <h2
            className={
              selectTelevision
                ? "review__selection-heading  "
                : "review__selection-heading review__selection-heading--active "
            }
            onClick={e => setSelectTelevision(false)}
          >
            Films
          </h2>
          <h2
            className={
              selectTelevision
                ? "review__selection-heading  review__selection-heading--active "
                : "review__selection-heading"
            }
            onClick={e => setSelectTelevision(true)}
          >
            Television
          </h2>
        </div>
        <div className="review__container">
          <form onSubmit={selectTelevision ? searchTV : searchMovie}>
            <input
              placeholder="...enter search term"
              onChange={e => setSearchTerm(e.target.value)}
            ></input>
            <button
              className="btn btn--search"
              type="button"
              onClick={selectTelevision ? searchTV : searchMovie}
            >
              SEARCH
            </button>
          </form>

          <div className="review__search-grid">{resultElements}</div>
        </div>
      </div>
    </div>
  );
}
export default NewReview;
