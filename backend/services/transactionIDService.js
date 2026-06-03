export const generateTransactionID = (uuid) => {
    // Remove hyphens and take first 10 hex characters (5 bytes)
    const cleanUUID = uuid.replace(/-/g, '').substring(0, 10);
    if (cleanUUID.length !== 10) return "TXN-INVALID";

    // Custom base32 alphabet (no ambiguous characters)
    const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

    // Convert hex to big integer
    let num = BigInt(`0x${cleanUUID}`);
    let base32 = '';

    // Convert to 8-character base32
    for (let i = 0; i < 8; i++) {
        const index = num % 32n;
        base32 = ALPHABET[index] + base32;
        num /= 32n;
    }

    // Calculate checksum (sum of character positions mod 10)
    const checksum = [...base32].reduce((sum, char) => {
        const pos = ALPHABET.indexOf(char);
        return sum + pos;
    }, 0) % 10;

    return `TXN-${base32}-${checksum}`;
};

// console.log(generateTransactionID("420b697d-cbd2-43ae-a28e-7bee1b50fe1f"))