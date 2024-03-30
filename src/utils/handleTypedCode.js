import globals from './globals'

export default (key) => {
    if (key.length === 1) {
        globals.setInput(globals.input + key)
    }
}