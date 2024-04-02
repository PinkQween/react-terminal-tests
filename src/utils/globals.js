export default {
    input: "",
    output: "",
    history: [],
    displayHistory: [],
    cursorPosition: 0,
    verticalCursorPosition: -1,
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
    }
};