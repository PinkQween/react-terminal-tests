import handleKeyPress from './handleTypedCode';
import { useEffect, useContext, useState } from "react";
import globalsContext from './globalsContext';

const KeyPress = ({ children }) => {
    const context = useContext(globalsContext);
    const [isMetaPressed, setIsMetaPressed] = useState(false);

    useEffect(() => {
        // let timeoutId;

        const handleKeyUp = (e) => {
            console.log(e.key);
            if (e.key == "Meta") {
                setIsMetaPressed(false);
            }
        }

        const handleKeyDown = async (e) => {
            if (e.key === "Meta") {
                setIsMetaPressed(true);
            }

            if (!isMetaPressed) {
                handleKeyPress(e.key, context);
            }

            if (isMetaPressed && e.key === "v") {
                e.preventDefault();
                handleKeyDown(`Paste: ${await navigator.clipboard.readText()}`, context);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [context]);

    return children;
}

export default KeyPress;