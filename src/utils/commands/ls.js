const ls = (args, tempGlobal, perms) => {
    tempGlobal.exitCode = 1;

    const currentDir = tempGlobal.currentDirectory;
    const targetDir = args[0] ?? currentDir;

    const path = resolvePath(currentDir, expandTilde(targetDir), tempGlobal.files);

    if (!path) {
        tempGlobal.output = "Directory not found";
        tempGlobal.currentDirectory = currentDir;
        return tempGlobal;
    }

    tempGlobal.exitCode = 0;

    const newTempGlobal = listContents(path, tempGlobal, perms);
    newTempGlobal.currentDirectory = currentDir;

    return newTempGlobal;
};

const resolvePath = (currentDir, path, root) => {
    const parts = path.split('/');
    const currentParts = currentDir.split('/').filter(Boolean);

    for (const part of parts) {
        if (part === '..') {
            if (currentParts.length > 0) {
                currentParts.pop();
            }
        } else if (part !== '.' && part !== '') {
            currentParts.push(part);
        }
    }

    const resolvedPath = '/' + currentParts.join('/');
    return findCurrentStructure(resolvedPath, root);
};

const findCurrentStructure = (directory, structure) => {
    const parts = directory.split('/').filter(Boolean);
    let currentStructure = structure;

    for (const part of parts) {
        if (!currentStructure || !currentStructure.contents) return null;

        const foundItem = currentStructure.contents.find(item => item.name === part);
        if (!foundItem || typeof foundItem !== 'object') return null;

        currentStructure = foundItem;
    }

    return currentStructure;
};

const expandTilde = (path) => {
    return path.replace(/^~($|\/)/, '/');
};

export default ls;

const directoryExists = (path, root) => {
    const checkIfSegmentExists = (struct, directory) => {
        for (const item of struct.contents) {
            if (typeof item !== "string" && item.name === directory) {
                return true;
            }
        }
        return false;
    };

    let currentDir = root;
    const parts = path.split("/").filter(part => part !== '');

    for (const part of parts) {
        if (!checkIfSegmentExists(currentDir, part)) {
            return false;
        }
        const nextDir = currentDir.contents.find(item => typeof item !== "string" && item.name === part);
        currentDir = nextDir;
    }

    return true;
};

const listContents = (directory, tempGlobal, perms) => {
    if (!directory || directory.contents.length === 0) {
        tempGlobal.output = "Directory is empty";
        return tempGlobal;
    }

    const fileList = directory.contents.filter(item => typeof item === 'string');
    const directoryList = directory.contents.filter(item => typeof item === 'object');

    const fileNames = fileList.map(file => file);
    const directoryNames = directoryList.map(dir => dir.name);

    const result = [...directoryNames, ...fileNames].join('\n');
    tempGlobal.output = result;
    return tempGlobal;
};
