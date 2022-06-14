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

  const userReviewsRef = doc(db, "reviews", `${user?.email}`);

  async function handlePublishReview() {
    await updateDoc(userReviewsRef, {
      reviews: arrayUnion({
        id: movieForReview.id,
        movie: movieForReview,
        summary: summary,
        reviewBody: reviewBody,
        rating: rating,
        comments: [],
      }),
    });

    setWriteReview(false);
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
          <input
            onChange={e => setRating(e.target.value)}
            type="number"
            min="0"
            max="5"
            placeholder="rating"
            name="rating"
            value={rating}
          ></input>
          <input
            onChange={e => setSummary(e.target.value)}
            placeholder="brief summary"
            value={summary}
            name="sumamry"
          ></input>
          <textarea
            onChange={e => setReviewBody(e.target.value)}
            placeholder="write review"
            value={reviewBody}
            name="reviewBody"
          ></textarea>
          <div className="btn-container">
            <button className="btn" onClick={e => setWriteReview(false)}>
              close
            </button>
            <button className="btn" onClick={handlePublishReview}>
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
