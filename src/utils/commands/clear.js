const clear = (args, tempGlobal) => {
    tempGlobal.output = ""
    tempGlobal.displayHistory = []

    return tempGlobal;
};

export default clear;