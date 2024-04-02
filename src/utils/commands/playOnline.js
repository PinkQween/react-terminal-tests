const playOnline = async (args, tempGlobals) => {
    tempGlobals.exitCode = 1;

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    const playYouTubeVideo = async (videoId) => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
            const data = await response.json();
            console.log(data);
            if (data.items.length > 0) {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&autohide=1`;
                iframe.setAttribute('allow', 'autoplay; fullscreen'); // Set allow attribute
                document.body.appendChild(iframe);

                // Function to stop the audio playback
                const stopAudio = () => {
                    iframe.remove(); // Remove the iframe to stop the audio playback
                };

                // Return the function to stop the audio playback
                return stopAudio;
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

    // Play YouTube video
    await playYouTubeVideo(videoId);

    tempGlobals.exitCode = 0;

    return tempGlobals;
};

export default playOnline;