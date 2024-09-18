import NodeRSA from 'node-rsa';

export const generateRSAKeys = () => {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    return { publicKey, privateKey };
};

export const encryptRSA = (text, publicKey) => {
    const key = new NodeRSA(publicKey);
    return key.encrypt(text, 'base64');
};

export const decryptRSA = (encryptedText, privateKey) => {
    const key = new NodeRSA(privateKey);
    return key.decrypt(encryptedText, 'utf8');
};
