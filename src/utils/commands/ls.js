// eslint-disable-next-line no-unused-vars
const listContents = (directory, tempGlobal, perms) => {
    if (directory.contents.length === 0) {
        tempGlobal.output = "Directory is empty";
        return tempGlobal;
    }

    const fileList = directory.contents.filter(item => typeof item === 'string');
    const directoryList = directory.contents.filter(item => typeof item === 'object');

    const fileNames = fileList.map(file => {
        const filePath = directory.path === '/' ? directory.path + file : directory.path + '/' + file;
        console.log(filePath);
        // return `${perms[filePath]} ${file}`;
        return file
    });
    const directoryNames = directoryList.map(dir => {
        const dirPath = dir.path || directory.path;
        console.log(dirPath);
        // return `${perms[dirPath]} ${dir.name}/`;
        return dir.name;
    });

    const result = [...directoryNames, ...fileNames].join('\n');

    tempGlobal.output = result;
    return tempGlobal;
};

const ls = (args, tempGlobal, perms) => {
    tempGlobal.exitCode = 1;

    const currentDir = tempGlobal.currentDirectory;
    const currentStruct = findCurrentStructure(currentDir, tempGlobal.files);

    if (!currentStruct) {
        tempGlobal.output = "Directory not found";
        return tempGlobal;
    }

    console.log(currentStruct);

    if (args.length === 0) {
        // No directory specified, list contents of current directory
        tempGlobal.exitCode = 0;
        return listContents(currentStruct, tempGlobal, perms);
    } else {
        // Directory argument specified, find the specified directory and list its contents
        const directoryName = args[0];
        const targetDirectory = findDirectory(directoryName, currentStruct);

        if (!targetDirectory) {
            tempGlobal.output = `Directory '${directoryName}' not found`;
            return tempGlobal;
        }

        return listContents(targetDirectory, tempGlobal, perms);
    }
};

const findCurrentStructure = (directory, structure) => {
    const parts = directory.split('/');
    let currentStructure = structure;

    for (const part of parts) {
        if (!part) continue; // Skip empty parts (e.g., caused by leading or trailing slashes)
        if (!currentStructure || !currentStructure.contents) return null; // Structure not found

        const foundItem = currentStructure.contents.find(item => item.name === part);
        if (!foundItem || typeof foundItem !== 'object') return null; // Item not found or not a directory

        currentStructure = foundItem; // Move to the next level
    }

    return currentStructure;
};

const findDirectory = (directoryName, structure) => {
    for (const item of structure.contents) {
        if (typeof item === "object" && item.name === directoryName) {
            return item;
        }
    }
    return null;
};

export default ls;
