import handleCommand from "../handleCommands";

const run = async ({ global, setGlobal }) => {
    const tempGlobal = global;

    const commands = [
        // "echo test",
        // "echo Hello",
    ]

    // let didLast = false;

    tempGlobal.displayHistory = []

    for (const i in commands) {
        const command = commands[i];

        // if (didLast) {
        //     break;
        // }

        // if (i >= command.length - 2) {
        //     didLast = true;
        // }

        console.error(i);
        console.error(command);

        const tempOutput = await handleCommand(command, tempGlobal)

        const output = tempOutput.output;

        tempGlobal.displayHistory.push({ output });

        console.log(tempGlobal.displayHistory);
    }

    console.log(tempGlobal.displayHistory);

    setGlobal(tempGlobal);
}

export default run;