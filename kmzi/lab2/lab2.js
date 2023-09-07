const russianAlphabet = new Array(64).fill(0).map((el, index) => String.fromCharCode(0x0410 + index));

function encryptCaesar(message, alphabet, K = 3) {
    return message.split('').map(currChar => {
        const currCharInAlphabetIndex = alphabet.findIndex(char => char === currChar);

        if (currCharInAlphabetIndex === -1) {
            return currChar;
        }

        return alphabet[(currCharInAlphabetIndex - K) % alphabet.length];
    }).join('');
}

function decryptCaesar(encryptedMessage, alphabet, K = 3) {
    return encryptCaesar(encryptedMessage, alphabet, -1 * K);
}

function breakCaesar(alphabet, params) {
    if (!params.encryptedMessage) {
        return encryptCaesar(params.unencryptedMessage, alphabet, params.key);
    } 
    if (!params.unencryptedMessage) {
        return decryptCaesar(params.encryptedMessage, alphabet, params.key);
    }
    if (!params.key) {
        const firstAlphabetSymbolInUnencryptedMessage = params.unencryptedMessage.split('')
            .find(symbol => alphabet.some(alphabetSymbol => alphabetSymbol === symbol));

        if (firstAlphabetSymbolInUnencryptedMessage === undefined) {
            return null;
        }

        const correspondingSymbolInEncryptedMessage = params.encryptedMessage[params.unencryptedMessage.indexOf(firstAlphabetSymbolInUnencryptedMessage)];
        const unencryptedSymbolInAlphabetIndex = alphabet.indexOf(firstAlphabetSymbolInUnencryptedMessage);
        const encryptedSymbolInAlphabetIndex = alphabet.indexOf(correspondingSymbolInEncryptedMessage);
        return (unencryptedSymbolInAlphabetIndex - encryptedSymbolInAlphabetIndex) % alphabet.length;
    }
}