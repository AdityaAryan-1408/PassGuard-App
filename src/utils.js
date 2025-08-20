
import CryptoJS from 'crypto-js';


export const encryptPassword = (password, secretKey) => {
    if (!secretKey) throw new Error("A key is required for Encryption")
    const ciphertext = CryptoJS.AES.encrypt(password, secretKey).toString();
    return ciphertext;
};

export const decryptPassword = (ciphertext, secretKey) => {
    if (!secretKey) throw new Error("A key is required for Decryption")
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};