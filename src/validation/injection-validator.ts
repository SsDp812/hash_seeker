
export function isNumeric(input: string): boolean {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(input);
}

export function isUUID(input: string): boolean {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(input);
}

export function isTonWalletAddress(address: string): boolean {
    const hexRegex = /^[0-9a-fA-F]{64}$/;
    const base64Regex = /^(EQ|Ef|kQ|kf)[0-9a-zA-Z_-]{46,51}$/;
    return hexRegex.test(address) || base64Regex.test(address);
}
