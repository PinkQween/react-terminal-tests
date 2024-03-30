import * as commands from './commands';
import commandNotFound from './commandNotFound';

const handleCommand = (input) => {
    const [command, ...args] = parseCommand(input);

    if (command == "") {
        return "\n";
    }

    console.log(commands)

    for (const commandFunc of Object.values(commands)) {
        if (command.toLowerCase() == commandFunc.name.toLowerCase()) {
            return commandFunc(args);
        }
    }

    return commandNotFound(command, args);
}

const parseCommand = (input) => {
    const parts = [];
    let currentPart = '';
    let insideQuotes = false;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ' ' && !insideQuotes) {
            if (currentPart.trim()) {
                parts.push(currentPart);
            }
            currentPart = '';
        } else if (char === '\\') {
            // Handle escape character
            if (i + 1 < input.length) {
                currentPart += input[i + 1];
                i++; // Skip next character
            }
        } else {
            currentPart += char;
        }
    }

    if (currentPart.trim()) {
        parts.push(currentPart);
    }

    return parts;
}


export default handleCommand;