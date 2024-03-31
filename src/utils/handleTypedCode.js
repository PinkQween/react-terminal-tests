import handleCommand from "./handleCommands";

export default (key, { setGlobal, global }) => {
    let tempGlobal = {...global}

    const { input, cursorPosition, history, verticalCursorPosition } = tempGlobal

    console.log(key);
    console.log(tempGlobal);

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
    } else if (key === "ArrowUp") {
        if (verticalCursorPosition < history.length) {
            tempGlobal.input = history[verticalCursorPosition].input;
            tempGlobal.verticalCursorPosition++
        }
    } else if (key === "ArrowDown") {
        if (verticalCursorPosition < history.length) {
            tempGlobal.input = history[verticalCursorPosition].input;
            tempGlobal.verticalCursorPosition--
        } else {
            tempGlobal.input = ""
        }
    } else if (key === "Enter") {
        tempGlobal = handleCommand(input, tempGlobal);
        console.log(tempGlobal);
        tempGlobal.input = "";
        tempGlobal.cursorPosition = 0;
        tempGlobal.history.push({ input, output: tempGlobal.output });
        input.startsWith("clear") ? console.log("Not displaying clear command") : tempGlobal.displayHistory.push({ input, output: tempGlobal.output });
        tempGlobal.verticalCursorPosition = history.length;
    } else if (key.startsWith("Paste: ")) {
        tempGlobal.input = tempGlobal.input + key.replace("Paste: ", "")
    } else if (key.startsWith("Clear: ")) {
        tempGlobal.handleCommand("clear", tempGlobal);
    }

    console.log(tempGlobal);

    setGlobal(tempGlobal)

    window.scrollTo(0, document.body.scrollHeight);
}