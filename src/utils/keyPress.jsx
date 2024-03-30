import handleKeyPress from './handleTypedCode';
import { useEffect, useReducer } from "react";
import { sleep } from './misc'

const KeyPress = ({ children }) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        document.addEventListener('keydown', async e => {
            handleKeyPress(e.key);
            await sleep(1000);
            forceUpdate();
        });

        return () => {
            document.addEventListener('keydown', async e => {
                handleKeyPress(e.key);
                await sleep(1000);
                forceUpdate();
            });
        };
    }, []);

    return children;
}

export default KeyPress;