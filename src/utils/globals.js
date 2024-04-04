export default {
    input: "",
    output: "",
    history: [],
    displayHistory: [],
    cursorPosition: 0,
    exitCode: 0,
    verticalCursorPosition: -1,
    loading: false,
    currentDirectory: "/",
    files: {
        name: "hannaskairipa.com",
        path: "/",
        contents: [
            "sayo-nara.wav",
            "resume.pdf",
            {
                name: "music",
                path: "/music",
                contents: [
                    "your-reality.wav",
                ]
            },
            {
                name: "GitHub",
                path: "/GitHub",
                contents: [
                    {
                        name: "PinkQween",
                        path: "/GitHub/PinkQween",
                        contents: [
                            {
                                name: "PinkQween",
                                path: "/GitHub/PinkQween/PinkQween",
                                contents: [
                                    "README.md",
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    perms: {
        "/": "rwxr-xr-x",
        "/music": "rwxr-xr-x",
        "/GitHub": "rwxr-xr-x",
        "/GitHub/PinkQween": "rwxr-xr-x",
        "/GitHub/PinkQween/PinkQween": "rwxr-xr-x",
        "/sayo-nara.wav": "rw-r--r--",
        "/resume.pdf": "rw-r--r--",
        "/music/your-reality.wav": "rw-r--r--",
        "/GitHub/PinkQween/README.md": "rw-r--r--",
    }
};