// // import * as commands from './commands';
// import commandNotFound from './commandNotFound';
// import { cd, play, clear, echo, playOnline, open, pwd, cat, ls } from './commands';

// const handleCommand = async (input, tempGlobals) => {
//     const commands = { cd, play, clear, echo, playOnline, open, pwd, cat, ls }

//     const [command, ...args] = parseCommand(input);

//     let tempGlobal = tempGlobals

//     console.warn(tempGlobals);

//     if (command?.trim() == "" || command == undefined) {
//         tempGlobals.output = ""
//         return tempGlobals;
//     }

//     console.log(commands)

//     if (command?.toLowerCase() == "play-online") {
//         return await commands.playOnline(args, tempGlobal);
//     }

//     for (const commandFunc of Object.values(commands)) {
//         if (command?.toLowerCase() == commandFunc.name.toLowerCase()) {
//             tempGlobals = await commandFunc(args, tempGlobal);
//             return tempGlobals
//         }
//     }

//     tempGlobals.output = commandNotFound(command, args);

//     return tempGlobals;
// }

// const parseCommand = (input) => {
//     const parts = [];
//     let currentPart = '';
//     let insideQuotes = false;

//     for (let i = 0; i < input.length; i++) {
//         const char = input[i];

//         if (char === '"') {
//             insideQuotes = !insideQuotes;
//         } else if (char === ' ' && !insideQuotes) {
//             if (currentPart.trim()) {
//                 parts.push(currentPart);
//             }
//             currentPart = '';
//         } else if (char === '\\') {
//             // Handle escape character
//             if (i + 1 < input.length) {
//                 currentPart += input[i + 1];
//                 i++; // Skip next character
//             }
//         } else {
//             currentPart += char;
//         }
//     }

//     if (currentPart.trim()) {
//         parts.push(currentPart);
//     }

//     return parts;
// }


// export default handleCommand;



import * as commands from './commands';
import commandNotFound from './commandNotFound';

const handleCommand = async (input, tempGlobals) => {
    if (input?.trim() == "" || input == undefined) {
        tempGlobals.output = ""
        return tempGlobals;
    }

    let outputs = [];
    let tempGlobal = tempGlobals;
    let commandsToExecute = input.split(/\s*(\|\||\|&&|&&|\|\|)\s*/);
    let param = ""

    for (let i = 0; i < commandsToExecute.length; i++) {
        const commandStr = commandsToExecute[i].trim();
        const [command, ...args] = parseCommand(commandStr);

        console.log('Before executing command:', command, 'tempGlobal.currentDirectory:', tempGlobal.currentDirectory);
        
        if (command !== "|" && command !== "||" && command !== "&&") {
            if (command.toLowerCase() === "play-online") {
                tempGlobal = await commands.playOnline(args, tempGlobal, param);
                outputs.push(tempGlobal.outputs ?? "");
            } else if (commands[command.toLowerCase()]) {
                tempGlobal = (await commands[command.toLowerCase()](args, tempGlobal, param));
                outputs.push(tempGlobal.outputs ?? "");
            } else {
                tempGlobal = (await commandNotFound(command, args, param));
                outputs.push(tempGlobal.outputs ?? "");
            }
        }

        console.log('After executing command:', command, 'tempGlobal.currentDirectory:', tempGlobal.currentDirectory);

        if (i < commandsToExecute.length - 1) {
            const operator = commandsToExecute[i + 1];
            if (operator === '&&' && tempGlobal.exitCode !== 0) {
                break; // Stop execution if the previous command failed
            } else if (operator === '||' && tempGlobal.exitCode === 0) {
                break; // Stop execution if the previous command succeeded
            } else if (operator === "|") {
                param = tempGlobal.output;
            }
        }
    }

    // tempGlobal.output = outputs.join("");

    for (const i in outputs) {
        tempGlobal.output += "\n" + outputs[i];
    }

    console.log(tempGlobal)

    return tempGlobal;
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
