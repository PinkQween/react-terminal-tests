const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

const playOnline = async (args, tempGlobals) => {
    const playYouTubeVideo = async (videoId, speed, volume) => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
            const data = await response.json();
            console.log(data);
            if (data.items.length > 0) {
                // const duration = data.items[0].contentDetails.duration;
                const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
                const audioElement = new Audio(audioUrl);
                audioElement.playbackRate = speed;
                audioElement.volume = volume;
                audioElement.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            } else {
                console.error("YouTube video not found");
            }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        }
    };

    if (args.length === 0) {
        tempGlobals.output = "Please specify YouTube video URL";
        return tempGlobals;
    }

    const youtubeUrlMatch = args[0].match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!youtubeUrlMatch) {
        tempGlobals.output = "Invalid YouTube video URL";
        return tempGlobals;
    }
    const videoId = youtubeUrlMatch[1];

    let speed = 1.0;
    let volume = 1.0;

    // Process flags and options
    for (let i = 1; i < args.length; i++) {
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
                default:
                    console.error('Unknown flag:', arg);
            }
        }
    }

    // Play YouTube video
    await playYouTubeVideo(videoId, speed, volume);

    return tempGlobals;
};

export default playOnline;
