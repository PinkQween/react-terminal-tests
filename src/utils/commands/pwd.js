const pwd = (args, global) => {
    const tempGlobal = global

    console.log(args.length === 0);
    if (args) {
        tempGlobal.output = tempGlobal.currentDirectory;
    } else {
        console.log("There are args");
    }

    return tempGlobal;
};

export default pwd;