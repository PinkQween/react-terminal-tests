const commandNotFound = (command, args, tempGlobal) => {
    tempGlobal.exitCode = 404
    tempGlobal.output = `Command "${command}" with args "${args}" not found`
    return tempGlobal
}

export default commandNotFound;
