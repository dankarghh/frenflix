import React, { useState, useContext } from "react";
import AuthContext from "../AuthContext";

function SearchResult(props) {
  const [hover, setHover] = useState(false);
  function handleHover() {
    setHover(true);
  }
  function handleNotHover() {
    setHover(false);
  }

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
