import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import { collection, doc, setDoc } from "firebase/firestore";

function SearchResult(props) {
  const { user } = useContext(AuthContext);

  const [hover, setHover] = useState(false);
  function handleHover() {
    setHover(true);
  }
  function handleNotHover() {
    setHover(false);
  }

  //   function addReview(movie) {
  //     console.log(movie);
  //   }

  return (
    <div
      className="review__search-img-container"
      onMouseEnter={handleHover}
      onMouseLeave={handleNotHover}
    >
      <img
        key={props.id}
        alt={props.title}
        className="review__search-img"
        src={`https://image.tmdb.org/t/p/w300/${props.poster_path}`}
      ></img>
      {hover && (
        <button
          className="btn btn--review"
          onClick={e => props.handleWriteReview(props.movie)}
        >
          review
        </button>
      )}
    </div>
  );
}

export default SearchResult;
