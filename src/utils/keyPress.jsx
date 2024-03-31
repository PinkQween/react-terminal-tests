// eslint-disable-next-line no-unused-vars
import React, { useEffect, useContext, useState, useRef } from "react"; 
import handleKeyPress from './handleTypedCode';
import globalsContext from './globalsContext';

const KeyPress = ({ children }) => {
    const context = useContext(globalsContext);
    const [isMetaPressed, setIsMetaPressed] = useState(false);

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key == "Meta") {
                setIsMetaPressed(false);
            }
        }

        const handleKeyDown = async (e) => {
            if (e.key === "\\") {
                await handleKeyPress(`Paste: ${await navigator.clipboard.readText()}`, context);
            }

            if (e.key === "Meta") {
                setIsMetaPressed(true);
            }

            if (!isMetaPressed && e.key !== "\\") {
                await handleKeyPress(e.key, context);
            }

            if (isMetaPressed && e.key === "v") {
                await handleKeyPress(`Paste: ${await navigator.clipboard.readText()}`, context);
            }
            
            if (isMetaPressed && e.key === "l") {
                e.preventDefault()
                await handleKeyPress(`Clear:`, context);
            }

            // Create a div element with a height of 300vh
            const divElement = document.createElement('div');
            divElement.style.height = '300vh';

            // Append the div to the body or any other container you want
            document.body.appendChild(divElement);

            window.screenY = window.screen.height;

            document.body.removeChild(divElement);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [context, isMetaPressed]);

    return children;
}

export default KeyPress;