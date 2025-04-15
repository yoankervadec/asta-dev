//
// client/src/components/InputBox/index.jsx

import React, { useState } from "react";
import styles from "./styles.module.css";

const InputBox = ({ inputValue, setInputValue, onEnter, dataList = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState("");

  const updateSuggestion = (value) => {
    if (value) {
      const matches = dataList.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
      setSelectedIndex(matches.length > 0 ? 0 : -1);
      setSuggestion(matches.length > 0 ? matches[0] : "");
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
      setSuggestion("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    updateSuggestion(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const finalValue =
        selectedIndex !== -1 ? suggestions[selectedIndex] : inputValue.trim();
      if (onEnter && finalValue) {
        onEnter(finalValue);
        setInputValue("");
      }
      setSuggestions([]);
      setSelectedIndex(-1);
      setSuggestion("");
    } else if (event.key === "Tab" && suggestion) {
      event.preventDefault();
      setInputValue(suggestion);
      setSuggestions([]);
      setSelectedIndex(-1);
      setSuggestion("");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
        setSuggestion(suggestions[selectedIndex + 1] || suggestions[0]);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
        setSuggestion(
          suggestions[selectedIndex - 1] || suggestions[suggestions.length - 1]
        );
      }
    }
  };

  return (
    <div className={styles.inputBoxContainer}>
      <label htmlFor="inputBox">Input&nbsp;:</label>
      <div className={styles.autocompleteWrapper}>
        <input
          type="text"
          id="inputBox"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {suggestion && suggestion !== inputValue && (
          <span className={styles.suggestionText}>{suggestion}</span>
        )}
      </div>
    </div>
  );
};

export default InputBox;
