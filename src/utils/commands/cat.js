import PinkQween from './assets/cat/PinkQween.md.js'

// eslint-disable-next-line no-unused-vars
const cat = (args, tempGlobals) => {
    console.log(PinkQween)

    const files = {
        'pq': PinkQween
    };

    const isValidPath = (path) => {
        // Regular expression to match Linux-like file paths with additional prefixes
        const pathRegex = /^((\/?(\.\.\/|\.\.?$|\.\/|\.?$|~\/|~$))?(\/?[^/\0]*(\/[^/\0]+)*(\.\w+)?))$/;

        return pathRegex.test(path);
    };

    if (args.length === 0) {
        tempGlobals.output = "Please specify audio file";
        return tempGlobals;
    }
    let filePath = args[0];

    if (!isValidPath(filePath)) {
        tempGlobals.output = "Invalid path";
        return tempGlobals;
    }

    const mapPath = (filePath) => {
        const traverse = (structure, targetFile, lastStruct) => {
            for (const items of Object.values(structure)) {
                for (const i in items) {
                    const item = (typeof i !== 'string') ? items[i] : items;
                    console.log(typeof item)
                    if (typeof item === 'string') {
                        console.log(item)
                        console.log(targetFile.split("/")[targetFile.split("/").length - 1])
                        console.log(item == '/sayo-nara.wav')
                        if (item === targetFile.split("/")[targetFile.split("/").length - 1]) {
                            console.log('yay')
                            console.log(lastStruct)
                            console.log(item)
                            const absolutePath = (lastStruct.path == "/" ? "" : lastStruct.path) + "/" + item;

                            console.log(absolutePath)

                            return absolutePath;
                        }
                    } else if (typeof item === 'object') {
                        console.log(item)
                        console.log(structure)
                        const result = traverse(item, targetFile, structure);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        };

        const findCurrentStructure = (directory, structure) => {
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


        const resolvePath = (directory, path) => {
            const parts = path.split('/');
            let resolvedPath = directory.split('/');

            for (const part of parts) {
                if (part === '.' || part === '') {
                    // Ignore current directory notation
                    continue;
                } else if (part === '..') {
                    // Move up one directory level
                    resolvedPath.pop();
                } else {
                    // Add directory or file name
                    resolvedPath.push(part);
                }
            }

            return resolvedPath.join('/');
        };

        const expandTilde = (path) => {
            tempGlobals.currentDirectory = ""
            // Replace '~' with root directory path '/'
            return path.replace(/^~($|\/)/, '/');
        };

        if (tempGlobals.currentDirectory == "/") {
            tempGlobals.currentDirectory = ""
        }

        console.log(resolvePath(tempGlobals.currentDirectory, expandTilde(filePath)));

        const currentStruct = findCurrentStructure(resolvePath(tempGlobals.currentDirectory, expandTilde(filePath)), tempGlobals.files);

        console.error("structure:");
        console.warn(currentStruct);
        // console.log(findCurrentStructure(resolvePath(tempGlobals.currentDirectory, expandTilde(filePath)), tempGlobals.files));

        if (!currentStruct) {
            return null; // If current directory not found, return null
        }

        // Start traversal from the current structure
        return traverse(currentStruct, resolvePath(tempGlobals.currentDirectory, expandTilde(filePath)), currentStruct);
    };

    const absoluteFilePath = mapPath(filePath);
    console.log(absoluteFilePath)

    if (!absoluteFilePath) {
        return 'Audio file not found';
    }

    let string;

    if (absoluteFilePath == "/GitHub/PinkQween/PinkQween/README.md") {
        string = files.pq;
    }

    if (!string) {
        return 'Corresponding audio file not found';
    }

    // const audioFile = audioFiles["/your-reality.wav"]
    // console.log(audioFiles)

    // Play the audio file

    tempGlobals.output = string;

    return tempGlobals;
};

export default cat;
