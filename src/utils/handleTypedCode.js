export default (key, { setGlobal, global }) => {
    const tempGlobal = {...global}

    console.log(tempGlobal);
    console.log(setGlobal);

    if (key.length === 1) {
        tempGlobal.input += key;

        console.log(tempGlobal);

        setGlobal(tempGlobal);
    } else if (key === "Backspace") {
        tempGlobal.input = tempGlobal.input.slice(0, -1);

        console.log(tempGlobal);

        setGlobal(tempGlobal);
    }
}