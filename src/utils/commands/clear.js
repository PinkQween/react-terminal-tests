const clear = (args, tempGlobal) => {
    tempGlobal.output = ""
    tempGlobal.displayHistory = []

    tempGlobal.exitCode = 0

    return tempGlobal;
};

export default clear;