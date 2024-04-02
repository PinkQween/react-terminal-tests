const generateTree = (directory, level = 0, isLast = true, prefix = '') => {
    let tree = '';
    const indent = '│  '.repeat(level);
    // const branch = isLast ? '└─ ' : '├─ ';

    if (!directory || !directory.contents || directory.contents.length === 0) {
        return '';
    }

    for (let i = 0; i < directory.contents.length; i++) {
        const item = directory.contents[i];
        const isSubLast = i === directory.contents.length - 1;
        const newPrefix = prefix + (isLast ? '   ' : '│  ');

        if (typeof item === 'string') {
            tree += `${indent}${isSubLast ? '└─ ' : '├─ '}${item}\n`;
        } else if (typeof item === 'object' && item.name !== undefined) {
            tree += `${indent}${isSubLast ? '└─ ' : '├─ '}${item.name}\n`;
            tree += generateTree(item, level + 1, isSubLast, newPrefix);
        }
    }

    return tree;
};

const tree = (args, tempGlobal) => {
    tempGlobal.exitCode = 1;

    let directoryPath = tempGlobal.currentDirectory; // Default to current directory

    if (args.length > 0) {
        directoryPath = args[0]; // Use provided directory path
    }

    const currentStruct = findCurrentStructure(directoryPath, tempGlobal.files);

    if (!currentStruct) {
        tempGlobal.output = "Directory not found";
        console.log("Output:", tempGlobal.output); // Log the output
        return tempGlobal;
    }

    tempGlobal.output = generateTree(currentStruct);
    console.log("Output:", tempGlobal.output); // Log the output
    tempGlobal.exitCode = 0;
    return tempGlobal;
};

export default tree;

const findCurrentStructure = (directory, structure) => {
    const parts = directory.split('/');
    console.log("Parts:", parts); // Add this line for debugging
    let currentStructure = structure;

    for (const part of parts) {
        if (!part) continue; // Skip empty parts (e.g., caused by leading or trailing slashes)
        if (!currentStructure || !currentStructure.contents) {
            console.log("Invalid current structure:", currentStructure);
            return null; // Structure not found
        }

        const foundItem = currentStructure.contents.find(item => item.name === part);
        if (!foundItem || typeof foundItem !== 'object') {
            console.log("Item not found or not a directory:", foundItem);
            return null; // Item not found or not a directory
        }

        currentStructure = foundItem; // Move to the next level
    }

    return currentStructure;
};
