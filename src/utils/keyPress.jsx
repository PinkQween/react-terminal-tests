import handleKeyPress from './handleTypedCode';
import { useEffect, useContext } from "react";
import globalsContext from './globalsContext';

const KeyPress = ({ children }) => {
    const context = useContext(globalsContext)

    useEffect(() => {
        // let timeoutId;

        const handleKeyDown = async (e) => {
            // clearTimeout(timeoutId);
            // timeoutId = setTimeout(async () => {
            //     try {
                    handleKeyPress(e.key, context);
            //     } catch (error) {
            //         console.error("Error handling key press:", error);
            //         // Handle error appropriately, e.g., show an error message
            //     }
            // }, 10); // Adjust the delay as needed (e.g., 10 milliseconds)
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // clearTimeout(timeoutId);
        };
    }, [context]);

    return children;
}

export default KeyPress;