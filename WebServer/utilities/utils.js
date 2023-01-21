var __user_password = " "

var __key_cripting = " "

var __algorithm = " "

var __sha = " "

const crypto = require('crypto')

exports.getUsrPsw = () => {
    return __user_password
}

exports.setUsrPsw = (psw) => {
    __user_password = psw
}

exports.setKeyCripting = (key, algorithm, sha) => {
    __algorithm = algorithm
    __sha = sha
    __key_cripting = crypto.createHash(__sha).update(String(key)).digest('base64').substr(0, 32);   
}

exports.getKeyCripting = () => {
    return __key_cripting
}

exports.encrypt = (buffer) => {      
    let iv = crypto.randomBytes(16);      
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };               
};  

exports.decrypt = (text) => { 
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');

    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString(); 
}; 