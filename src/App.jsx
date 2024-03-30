import { useContext, useEffect, useState } from "react";
import globalsContext from "./utils/globalsContext";

const App = () => {
  const [globals, setGlobals] = useState({});

  const { global } = useContext(globalsContext);

  useEffect(() => {
    setGlobals(global);
  }, [global]);

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
      <div className="terminal">
        {/* Render characters before the cursor */}
        {beforeCursor != "" &&
          <span>{beforeCursor || "\u00A0"}</span>
        }
        {/* Render cursor */}
        <span className={"cursor" + (input ? " blink" : " blink")}>█</span>
        {/* Render characters after the cursor or an invisible placeholder if there are no characters */}
        <span>{afterCursor || "\u00A0"}</span>
      </div>
    );
  };

  return renderInputWithCursor();
};

export default App;