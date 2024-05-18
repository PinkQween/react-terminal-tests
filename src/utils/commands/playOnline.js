// const playOnline = async (args, tempGlobals) => {
//     tempGlobals.exitCode = 1;

//     const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

//     const playYouTubeVideo = async (videoId) => {
//         try {
//             const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
//             const data = await response.json();
//             console.log(data);
//             if (data.items.length > 0) {
//                 const iframe = document.createElement('iframe');
//                 iframe.style.display = 'none';
//                 iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&autohide=1`;
//                 iframe.setAttribute('allow', 'autoplay; fullscreen'); // Set allow attribute
//                 document.body.appendChild(iframe);

//                 // Function to stop the audio playback
//                 const stopAudio = () => {
//                     iframe.remove(); // Remove the iframe to stop the audio playback
//                 };

//                 // Return the function to stop the audio playback
//                 return stopAudio;
//             } else {
//                 console.error("YouTube video not found");
//             }
//         } catch (error) {
//             console.error("Error fetching YouTube video:", error);
//         }
//     };
//     if (args.length === 0) {
//         tempGlobals.output = "Please specify YouTube video URL";
//         return tempGlobals;
//     }

//     const youtubeUrlMatch = args[0].match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
//     if (!youtubeUrlMatch) {
//         tempGlobals.output = "Invalid YouTube video URL";
//         return tempGlobals;
//     }
//     const videoId = youtubeUrlMatch[1];

//     // Play YouTube video
//     await playYouTubeVideo(videoId);

//     tempGlobals.exitCode = 0;

//     return tempGlobals;
// };

// export default playOnline;

const playOnline = async (args, tempGlobals) => {
    tempGlobals.exitCode = 1;
    let iframe; // Declare iframe here
    // const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    console.log(args)
    
    const playYouTubeVideo = async (videoId) => {
        try {
            // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
            // const data = await response.json();
            // console.log(data);
            // if (data.items.length > 0) {
                iframe = document.createElement('iframe');
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
            // } else {
            //     console.error("YouTube video not found");
            // }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        }
    };

    if (args.length === 0) {
        tempGlobals.output = "Please specify YouTube video URL";
        return tempGlobals;
    }

    let shouldWait = false;

    // Check if the wait option is present in args
    if (args.includes('--wait') || args.includes('-w')) {
        shouldWait = true;

        // Remove the wait option from args
        args = args.filter(arg => arg !== '--wait' && arg !== '-w');
    }

    // Extract the video ID from the remaining arguments
    let youtubeUrlMatch;
    let videoId;

    if (args[0].includes('v=')) {
        youtubeUrlMatch = args[0].match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (!youtubeUrlMatch) {
            tempGlobals.output = "Invalid YouTube video URL";
            return tempGlobals;
        }
        videoId = youtubeUrlMatch[1];
    } else {
        youtubeUrlMatch = args[0].match(/([a-zA-Z0-9_-]{11})/);
        if (!youtubeUrlMatch) {
            tempGlobals.output = "Invalid YouTube video URL";
            return tempGlobals;
        }
        videoId = youtubeUrlMatch[1];
    }

    // Play YouTube video
    const stopAudio = await playYouTubeVideo(videoId);

    if (shouldWait) {
        // Wait until the video is finished playing
        await new Promise(resolve => {
            const checkVideoStatus = setInterval(() => {
                if (iframe && iframe.contentWindow && iframe.contentWindow.player) {
                    const player = iframe.contentWindow.player;
                    if (player.getPlayerState() === 0) { // 0 indicates that the video has ended
                        clearInterval(checkVideoStatus);
                        stopAudio(); // Stop audio playback
                        resolve();
                    }
                }
            }, 1000);
        });
    }

    tempGlobals.exitCode = 0;

    console.log(tempGlobals)

    return tempGlobals;
};

export default playOnline;
