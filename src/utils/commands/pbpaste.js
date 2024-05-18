const pbpaste = async (args, global) => {
    // Create a copy of the global object to avoid direct mutation
    const tempGlobal = { ...global };

    try {
        // Attempt to read text from the clipboard
        const clipboardText = await navigator.clipboard.readText();
        
        // Store the clipboard text in the global object (or do something with it)
        tempGlobal.output = clipboardText;

        // Set the exit code to 0, indicating success
        tempGlobal.exitCode = 0;
    } catch (error) {
        // Handle any errors (e.g., permission issues)
        console.error('Failed to read clipboard contents:', error);

        // Set the exit code to 1, indicating failure
        tempGlobal.exitCode = 1;
    }

    // Return the modified global object
    return tempGlobal;
};

export default pbpaste;
