export default (key, { setGlobal, global }) => {
    const tempGlobal = {...global}

    const { input, cursorPosition } = tempGlobal

    console.log(key);

    if (key === "Backspace") {
        // Handle backspace key
        if (cursorPosition > 0) {
            // Remove character before the cursor
            tempGlobal.input = input.slice(0, cursorPosition - 1) + input.slice(cursorPosition);
            tempGlobal.cursorPosition--;
        }
    } else if (key === "Delete") {
        // Handle delete key
        if (cursorPosition < input.length) {
            // Remove character after the cursor
            tempGlobal.input = input.slice(0, cursorPosition) + input.slice(cursorPosition + 1);
        }
    } else if (key.length === 1) {
        // Handle regular key press
        // Insert character at the cursor position
        tempGlobal.input = input.slice(0, cursorPosition) + key + input.slice(cursorPosition);
        tempGlobal.cursorPosition++;
    } else if (key === "ArrowLeft") {
        if (cursorPosition > 0) {
            tempGlobal.cursorPosition--
        }
    } else if (key === "ArrowRight") {
        if (cursorPosition < input.length) {
            tempGlobal.cursorPosition++
        }
    } else if (key === "Space") {
        tempGlobal.input = input.slice(0, cursorPosition) + " " + input.slice(cursorPosition);
        tempGlobal.cursorPosition++;
    }

    setGlobal(tempGlobal)
}