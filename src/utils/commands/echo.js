const echo = (args, tempGlobal) => {
    if (args[0]) {
        tempGlobal.output = args[0]

        tempGlobal.exitCode = 0
        
        return tempGlobal;
    }

    tempGlobal.output = "Please add args"

    tempGlobal.exitCode = 1

    return tempGlobal;
};

export default echo;