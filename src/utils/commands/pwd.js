const pwd = (args, global) => {
    const tempGlobal = global

    console.log(args);

    if (args.length > 1) {
        tempGlobal.output = tempGlobal.currentDirectory;
    } else {
        const absolutePath = getAbsolutePath(args, tempGlobal);

        console.log("args! " + absolutePath);

        if (!directoryExists(absolutePath, tempGlobal.files)) {
            tempGlobal.output = "Directory doesn't exist";
        } else {
            tempGlobal.output = absolutePath;
        }
    }

    return tempGlobal;
};

export default pwd;

const getAbsolutePath = (args, tempGlobalTemp) => {
    let pathToGoTo = args[0];

    if (!pathToGoTo) {
        return "/";
    }

    if (pathToGoTo.startsWith('/') || pathToGoTo.startsWith('~')) {
        if (pathToGoTo.startsWith('~')) {
            pathToGoTo = pathToGoTo.replace("~", "/");
        }

        return pathToGoTo;
    }

    if (pathToGoTo.startsWith('./')) {
        // If path starts with './', it's relative to current directory
        let relativePath = pathToGoTo.slice(2); // Remove the './'
        const parts = relativePath.split('/');
        for (const part of parts) {
            if (part === '..') {
                // Move up one directory
                if (tempGlobalTemp.currentDirectory !== '/') {
                    tempGlobalTemp.currentDirectory = tempGlobalTemp.currentDirectory
                        .split('/')
                        .slice(0, -1)
                        .join('/');
                }
            } else {
                // Append directory name
                return tempGlobalTemp.currentDirectory + (tempGlobalTemp.currentDirectory === '/' ? '' : '/') + part;
            }
        }
    }

    if (tempGlobalTemp.currentDirectory == "/") tempGlobalTemp.currentDirectory = ""
    // Otherwise, it's a relative path
    const pathSegments = pathToGoTo.split('/');
    const currentDirSegments = tempGlobalTemp.currentDirectory.split('/');

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

    tempGlobalTemp.currentDirectory = currentDirSegments.join('/');

    if (tempGlobalTemp.currentDirectory == "") {
        return "/"
    }

    return tempGlobalTemp.currentDirectory;
}

const directoryExists = (path, root) => {
    const checkIfSegmentExists = (struct, directory) => {
        for (const item of struct.contents) {
            if (typeof item !== "string" && item.name === directory) {
                return true; // Return true if the directory is found
            }
        }
        return false; // Directory not found
    };

    let currentDir = root;
    const parts = path.split("/").filter(part => part !== ''); // Split path and remove empty parts

    for (const part of parts) {
        if (!checkIfSegmentExists(currentDir, part)) {
            return false; // Directory doesn't exist
        }
        const nextDir = currentDir.contents.find(item => typeof item !== "string" && item.name === part);
        currentDir = nextDir; // Move to the next directory
    }

    return true; // Directory exists
};