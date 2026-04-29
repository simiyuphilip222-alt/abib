import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <FaSearch className="search-bar__icon" />
      <input
        type="search"
        placeholder="Search for products, collections, and gift sets"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default SearchBar;
