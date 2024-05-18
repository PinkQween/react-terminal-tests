const echo = (args, tempGlobal) => {
<<<<<<< HEAD
=======
    console.log(args);
    console.log(typeof args);
    
>>>>>>> 544b6cf (almost got piping)
    if (args[0]) {
        tempGlobal.output = args[0]

        tempGlobal.exitCode = 0
        
        return tempGlobal;
    }

    tempGlobal.output = "Please add args"

    tempGlobal.exitCode = 1

    return tempGlobal;
};

<<<<<<< HEAD
export default echo;
=======
export default echo;
>>>>>>> 544b6cf (almost got piping)
