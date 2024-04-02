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
    const currentDir = tempGlobal.currentDirectory;
    const currentStruct = findCurrentStructure(currentDir, tempGlobal.files);

    if (!currentStruct) {
        tempGlobal.output = "Directory not found";
        return tempGlobal;
    }

    console.log(currentStruct);

    if (args.length === 0) {
        // No directory specified, list contents of current directory
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
    console.log(directory);

    const parts = directory.split('/');
    let parentDirectory = parts.slice(0, -1).join('/');

    if (parentDirectory == "") {
        parentDirectory = "/";
    }

    console.log(parentDirectory)
    console.log(structure.path)
    console.log(parentDirectory == structure.path)

    if (parentDirectory === structure.path) {
        return structure;
    }

    console.log("contents")
    console.log(structure.contents)

    for (const i in structure.contents) {
        if (typeof structure.contents[i] != "string") {
            return findCurrentStructure(directory, structure.contents[i]);
        }
    }

    console.error('no return called yet');
    console.log(structure)
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
