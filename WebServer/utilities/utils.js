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
    // Create an initialization vector             
    const iv = crypto.randomBytes(16);         
           
    // Create a new cipher using the algorithm, key, and iv              
    const cipher = crypto.createCipheriv(__algorithm, __key_cripting, iv);         
           
    // Create the new (encrypted) buffer          
    return Buffer.concat([iv, cipher.update(buffer), cipher.final()]);                
};  

exports.decrypt = (encrypted) => { 
    // Get the iv: the first 16 bytes 
    const iv = encrypted.slice(0, 16); 

    // Get the rest         
    encrypted = encrypted.slice(16);         

    // Create a decipher         
    const decipher = crypto.createDecipheriv(__algorithm, __key_cripting, iv); 

    // Actually decrypt it 
    return Buffer.concat([decipher.update(encrypted), decipher.final()]); 
}; 