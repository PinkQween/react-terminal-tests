const echo = (args, tempGlobal) => {
    if (args[0]) {
        tempGlobal.output = args[0]
        return tempGlobal;
    }

    tempGlobal.output = "Please add args"

    return tempGlobal;
};

export default echo;