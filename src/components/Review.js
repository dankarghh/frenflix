import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import SearchResult from "./SearchResult";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

function Review() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState({});
  const { user } = useContext(AuthContext);
  const [writeReview, setWriteReview] = useState(false);
  const [movieForReview, setMovieForReview] = useState({});

  const [review, setReview] = useState({});
  const [summary, setSummary] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [rating, setRating] = useState(Number);

  // states for error handling

  const [ratingErr, setRatingErr] = useState("");
  const [summaryErr, setSummaryErr] = useState("");
  const [reviewBodyErr, setReviewBodyErr] = useState("");

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
        });
      } catch (error) {
        console.log(error);
      }

      setWriteReview(false);
    }
  }

  useEffect(() => {
    async function getMovies() {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=31dab1ca58484568ac09b8a656e2dd73&language=en-US&page=1"
        );
        const data = await res.json();

        setTrendingMovies(data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getMovies();
  }, []);

  const resultElements = results.map(movie => {
    return (
      <SearchResult
        handleWriteReview={handleWriteReview}
        id={movie.id}
        title={movie.title}
        poster_path={movie.poster_path}
        movie={movie}
      />
    );
  });

  function handleWriteReview(movie) {
    setReview({});
    setWriteReview(true);
    setMovieForReview(movie);
    setSummary("");
    setReviewBody("");
    setRating();
  }

  return (
    <div className="review">
      <form onSubmit={searchMovie}>
        <input
          placeholder="type movie name"
          onChange={e => setSearchTerm(e.target.value)}
        ></input>
        <button className="btn" type="button" onClick={searchMovie}>
          SEARCH
        </button>
      </form>
      {writeReview && (
        <div className="review__write">
          <h1>WRITE REVIEW</h1>
          <h1>{movieForReview.title}</h1>
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
            <button className="btn" onClick={e => setWriteReview(false)}>
              Close
            </button>
            <button className="btn " onClick={handlePublishReview}>
              Publish
            </button>
          </div>
        </div>
      )}
      <div className="review__search-cover"></div>
      <div className="review__search-grid">{resultElements}</div>
    </div>
  );
}
export default Review;
