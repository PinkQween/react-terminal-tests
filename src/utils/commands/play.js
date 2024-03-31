import YRMP3 from './assets/play/1-13 Your Reality (Credits).mp3';
import YRFLAC from './assets/play/1-13 Your Reality (Credits).flac';
import SNMP3 from './assets/play/1-10 Sayo-nara.mp3';
import SNFLAC from './assets/play/1-10 Sayo-nara.flac';

const play = (args, tempGlobals) => {
    const audioFiles = {
        'yr': { mp3: YRMP3, flac: YRFLAC },
        'sn': { mp3: SNMP3, flac: SNFLAC }
    };

    const isValidPath = (path) => {
        // Regular expression to match Linux-like file paths with additional prefixes
        const pathRegex = /^((\/?(\.\.\/|\.\.?$|\.\/|\.?$|~\/|~$))?(\/?[^/\0]*(\/[^/\0]+)*(\.\w+)?))$/;

        return pathRegex.test(path);
    };

    const playAudio = (audioFile, speed, pitch, volume) => {
        const audioElement = new Audio();

        const song = audioElement.canPlayType("audio/flac") && audioElement.canPlayType("audio/flac") !== "no" ? audioFile.flac : audioFile.mp3;

        audioElement.src = song;
        audioElement.playbackRate = speed;
        audioElement.volume = volume;

        const detuneValue = (pitch - 1) * 100;
        audioElement.detune = detuneValue;

        audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    };

    if (args.length === 0) {
        tempGlobals.output = "Please specify audio file";
        return tempGlobals;
    }
    let filePath = '';
    let speed = 1.0;
    let volume = 1.0;
    let pitch = 1.0;

    // Process flags and options
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('-')) {
            // Handle flags and options
            switch (arg) {
                case '--speed':
                case '-s':
                    speed = parseFloat(args[++i]);
                    break;
                case '--volume':
                case '-v':
                    volume = parseFloat(args[++i]);
                    break;
                case '--pitch':
                case '-p':
                    pitch = parseFloat(args[++i]);
                    break;
                default:
                    console.error('Unknown flag:', arg);
            }
        }
    }

    filePath = args[0];

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

    let audioFile;

    if (absoluteFilePath == "/music/your-reality.wav") {
        audioFile = audioFiles.yr; // Get the corresponding audio file from imports
    } else if (absoluteFilePath == "/sayo-nara.wav") {
        audioFile = audioFiles.sn; // Get the corresponding audio file from imports
    }

    if (!audioFile) {
        return 'Corresponding audio file not found';
    }

    // const audioFile = audioFiles["/your-reality.wav"]
    // console.log(audioFiles)

    // Play the audio file
    playAudio(audioFile, speed, pitch, volume);

    return tempGlobals;
};

export default play;
