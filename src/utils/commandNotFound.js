<<<<<<< HEAD
const commandNotFound = (command, args) => {
    return `Command "${command}" with args "${args}" not found`
}

export default commandNotFound;
=======
const commandNotFound = (command, args, tempGlobal) => {
    tempGlobal.exitCode = 404
    tempGlobal.output = `Command "${command}" with args "${args}" not found`
    return tempGlobal
}

export default commandNotFound;
>>>>>>> 544b6cf (almost got piping)
