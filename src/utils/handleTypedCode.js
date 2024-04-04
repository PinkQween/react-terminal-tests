import handleCommand from "./handleCommands";

export default async (key, { setGlobal, global }) => {
    let tempGlobal = { ...global }

    const { input, cursorPosition, history, verticalCursorPosition, currentDirectory } = tempGlobal;

    console.log(key);
    console.log(tempGlobal);

    console.log(key === "ArrowUp")

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
    } else if (key?.length === 1) {
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
        if (verticalCursorPosition < history.length - 1) {
            tempGlobal.verticalCursorPosition = tempGlobal.verticalCursorPosition + 1
            console.log(tempGlobal.history[verticalCursorPosition])
            tempGlobal.input = tempGlobal.history[tempGlobal.verticalCursorPosition].input;
        } else {
            console.log("No more history");
        }
    } else if (key === "ArrowDown") {
        if (verticalCursorPosition > 0) {
            tempGlobal.verticalCursorPosition = tempGlobal.verticalCursorPosition - 1;
            tempGlobal.input = tempGlobal.history[tempGlobal.verticalCursorPosition].input;
        } else {
            tempGlobal.input = ""
        }
    } else if (key === "Enter") {
        tempGlobal.output = ""
        tempGlobal.loading = true
        setGlobal(tempGlobal);
        tempGlobal.displayHistory.push({ input })
        tempGlobal = await handleCommand(input, tempGlobal);
        tempGlobal.loading = false
        tempGlobal.displayHistory.pop()
        console.log(tempGlobal);
        tempGlobal.input = "";
        tempGlobal.cursorPosition = 0;
        tempGlobal.history.unshift({ input, output: tempGlobal.output, location: currentDirectory });
        input.startsWith("clear") ? console.log("Not displaying clear command") : tempGlobal.displayHistory.push({ input, output: tempGlobal.output, location: currentDirectory });
        tempGlobal.verticalCursorPosition = -1;
    } else if (key.startsWith("Paste: ")) {
        const pastedText = key.replace("Paste: ", "");
        tempGlobal.input = input.slice(0, cursorPosition) + pastedText + input.slice(cursorPosition);
        tempGlobal.cursorPosition += pastedText.length; // Adjust cursor position
    } else if (key.startsWith("Clear: ")) {
        tempGlobal.handleCommand("clear", tempGlobal);
    } else if (key.startsWith("RMLast: ")) {
        // needs to be implemented
    }

    console.log(tempGlobal);

    setGlobal(tempGlobal)

    window.scrollTo(0, document.body.scrollHeight);
}