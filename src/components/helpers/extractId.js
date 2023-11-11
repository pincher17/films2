function extractDigits(inputString) {
    const match = inputString.match(/^\d+/);
        return (+match[0]);
    
}

export default extractDigits