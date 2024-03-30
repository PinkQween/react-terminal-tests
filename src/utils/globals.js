class Globals {
    constructor() {
        this.input = "";
    }

    setInput(newInput) {
        this.input = newInput;
    }

    getInput() {
        return this.input;
    }
}

export default new Globals();