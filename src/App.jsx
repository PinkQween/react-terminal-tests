// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState, useRef } from "react";
import globalsContext from "./utils/globalsContext";
import globalsTemp from './utils/globals'
import axios from "axios";

const App = () => {
  const cursorRef = useRef(null); // Ref to the cursor element
  const [cursorWidth, setCursorWidth] = useState(0); // State to store cursor width
  const [paddingWidth, setPaddingWidth] = useState(0); // State to store text padding width
  const [ip, setIP] = useState("localhost");

  const getIP = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json").catch(() => setIP("localhost"));
    setIP(res?.data?.ip ?? "localhost");
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getIP();
  }, []);

  // Effect to update cursor width when component mounts or updates
  useEffect(() => {
    if (cursorRef.current) {
      setCursorWidth(cursorRef.current.offsetWidth);
    }
  }, [cursorRef]);

  // Effect to measure text padding width when the component mounts or updates
  useEffect(() => {
    // Create a temporary span element to measure the text padding width
    const tempSpan = document.createElement("span");
    tempSpan.textContent = " "; // Single space for measurement
    tempSpan.style.visibility = "hidden";
    document.body.appendChild(tempSpan);
    setPaddingWidth(tempSpan.offsetWidth);
    document.body.removeChild(tempSpan);
  }, []);

  // Style object to move the next element after the cursor
  const afterCursorStyle = {
    marginLeft: -cursorWidth + "px",
    paddingLeft: paddingWidth + "px" // Use dynamically measured text padding width
  };

  const [globals, setGlobals] = useState(globalsTemp);

  const { global } = useContext(globalsContext);

  useEffect(() => {
    setGlobals(global);
  }, [global]);

  const inputPrefixer = (input, location) => {
    return `${ip}@hannaskairipa.com @ ${location ? location : globals.currentDirectory} $ ${input}`
  }

  // Function to render input string with cursor
  const renderInputWithCursor = () => {
    const { input, cursorPosition } = globals;

    if (input === undefined) {
      return null; // Render nothing if input is undefined
    }

    // Ensure cursor is at least one character behind in empty string
    const adjustedCursorPosition = input ? cursorPosition : 0;

    // Replace multiple spaces with visible space characters
    const sanitizedInput = input.replace(/ /g, "\u00A0");

    // Split the input string into two parts: before and after the cursor position
    const beforeCursor = sanitizedInput.slice(0, adjustedCursorPosition);
    const afterCursor = sanitizedInput.slice(adjustedCursorPosition);

    return (
      <>
        {/* Render characters before the cursor */}
        {beforeCursor !== "" && (
          <span>{inputPrefixer(beforeCursor || "\u00A0")}</span>
        ) || (
          <span>{inputPrefixer("")}</span>
        )}
        {/* Render cursor */}
        <span ref={cursorRef} className={"cursor blink"}>█</span>
        {/* Render characters after the cursor or an invisible placeholder if there are no characters */}
        <span style={afterCursorStyle}>{afterCursor || "\u00A0"}</span>
        </>
    );
  };

  // Function to render output
  const renderOutput = () => {
    const { displayHistory } = globals;

    return (
      <div className="output">
        {displayHistory.map((entry, index) => (
          <div key={index}>
            <span>{inputPrefixer(entry.input, entry.location)}</span>
            <br />
            <span>{entry.output}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="terminal">
      {renderOutput()}
      {renderInputWithCursor()}
    </div>
  );
};

export default App;
