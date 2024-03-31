const cd = (args, tempGlobal) => {
    const pathToGoTo = args[0];

    if (!pathToGoTo) {
        // If no path provided, set current directory to root
        tempGlobal.currentDirectory = "/";
        return tempGlobal;
    }

    if (pathToGoTo.startsWith('/') || pathToGoTo.startsWith('~')) {
        // If path starts with '/' or '~', it's an absolute path
        tempGlobal.currentDirectory = pathToGoTo;
        return tempGlobal;
    }

    if (pathToGoTo.startsWith('./')) {
        // If path starts with './', it's relative to current directory
        tempGlobal.currentDirectory += pathToGoTo.slice(tempGlobal.currentDirectory === '/' ? 2 : 1); // Remove the '.'
        return tempGlobal;
    }

    if (tempGlobal.currentDirectory == "/") tempGlobal.currentDirectory = ""
    // Otherwise, it's a relative path
    const pathSegments = pathToGoTo.split('/');
    const currentDirSegments = tempGlobal.currentDirectory.split('/');

    // Pop last directory for each '..', ensuring not to go beyond root
    for (const segment of pathSegments) {
        if (segment === '..') {
            if (currentDirSegments.length > 1) {
                currentDirSegments.pop();
            }
        } else {
            currentDirSegments.push(segment);
        }
    }

    tempGlobal.currentDirectory = currentDirSegments.join('/');

    return tempGlobal;
};

export default cd;