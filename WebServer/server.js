const express = require('express');
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser');

const fs = require('fs').promises
const fs2 = require('fs')

const bcrypt = require('bcrypt')

const utils = require('./utilities/utils');
const { request } = require('http');

app.use(cors())
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.redirect('http://localhost:7550/views/index.html');
});

app.route('/api/v1/signup').post( async (request, response) => {
    try {
        if(!request.body.password || request.body.password.length < 10) { 
            return response.sendStatus(402)
        }
    
        let pswHash = await bcrypt.hash(request.body.password, 10);
        
        if(!fs2.existsSync('../login')) {
            fs2.mkdirSync('../login')
        }

        await fs.writeFile('../login/login.txt', pswHash)
        await fs.chmod('../login/login.txt', 0o000)
        
        if(fs2.existsSync('../passwords')) {
            await fs.rm('../passwords', {recursive: true, force: true})
        }
    }
    catch(e) {
        console.error('\nRegistration ' + e)
        return response.status(500).json({message: 'error in the registation system'})
    }

    return response.sendStatus(200)
})

app.route('/api/v1/login').post( async (request, response) => {
    if(!request.body.password || request.body.password.length < 10) {
        return response.sendStatus(402)
    }

    try {
        if(!fs2.existsSync('../login')) {
            return response.sendStatus(401)
        }
        let pswFFile = await fs.readFile("../login/login.txt")

        if(!await bcrypt.compare(request.body.password, pswFFile.toString())) { 
            return response.sendStatus(401)
        }
        utils.Encrypter.init(request.body.password, "aes-192-cbc")

        return response.sendStatus(200)
    }
    catch(e) {
        console.error('\nLogin ' + e)
        return response.status(500).json({message: 'error in the login system'})
    }
})

const AUTHmiddleware = (req, resp, next) => {
    if(utils.Encrypter.key === " ") { 
        return resp.sendStatus(401)
    }
    next()
}

app.route('/api/v1/add-pwd').post(AUTHmiddleware, async (request, response) => {
    if(!request.body.title || !request.body.msg) {
        return response.sendStatus(402)
    }

    try {
        if(!fs2.existsSync('../passwords')) {
            fs2.mkdirSync('../passwords')
            await fs.writeFile('../passwords/pass.json', "[ ]")
            await fs.chmod('../passwords/pass.json', 0o000)
        }
        
        try {
            fs2.accessSync('../passwords/pass.json')
        }
        catch(e) {
            await fs.writeFile('../passwords/pass.json', "[ ]")
            await fs.chmod('../passwords/pass.json', 0o000)
        }
        
        let rawdata = fs2.readFileSync('../passwords/pass.json');
        let pwds = JSON.parse(rawdata);

        if(pwds.find(obj => obj.title === request.body.title)) {
            return response.sendStatus(400)
        }
        
        pwds.push({title: request.body.title, msg: utils.Encrypter.encrypt(request.body.msg)})
        let data = JSON.stringify(pwds, null, 2);
        
        fs2.writeFileSync('../passwords/pass.json', data.toString())
        return response.sendStatus(200)
    }
    catch(e) {
        console.error('\nAdd Password ' + e)
        return response.status(500).json({message: 'error in the add-pwd system'})
    }
})

app.route("/api/v1/get-passwords").get(AUTHmiddleware, (request, response) => {
    try {
        let decrArr = []

        let rawdata = fs2.readFileSync('../passwords/pass.json');
        let cripArr = JSON.parse(rawdata);
        
        cripArr.forEach(pwdObj => {
            decrArr.push({title: pwdObj.title, pwd: utils.Encrypter.dencrypt(pwdObj.msg)})
        })

        response.status(200).json({pwdList: decrArr})
    }
    catch(e) {
        console.error('\nGet Password ' + e)
        return response.sendStatus(500)
    }
})

app.route('/api/v1/del-pwd').post(AUTHmiddleware, (request, response) => {
    try {
        if(!request.body.title) { 
            return response.sendStatus(402)
        }
        try {
            fs2.accessSync('../passwords/pass.json')
        }
        catch(e) {
            return response.status(405).json({message: "you don't have passwords"})
        }
        let rawdata = fs2.readFileSync('../passwords/pass.json');
        let cripArray = JSON.parse(rawdata);

        /* check if it doesn't exist */
        if(cripArray.find(pwd => pwd.title == request.body.title) == undefined) {
            return response.status(404).json({message: "the given password doesn't exist"})
        }
        
        let newArr = cripArray.filter(pass => pass.title != request.body.title)        
        let data = JSON.stringify(newArr, null, 2);
        
        fs2.writeFileSync('../passwords/pass.json', data.toString())
        return response.sendStatus(200)
    }
    catch(e) {
        console.error('\nRemove Password ' + e)
        return response.sendStatus(500)
    }
})

app.route('/api/v1/updt-pwd').post(AUTHmiddleware, (request, response) => {
    try {
        if(!request.body.oldTitle || !request.body.newTitle || !request.body.psw) {
            return response.sendStatus(402)
        }
        try {
            fs2.accessSync('../passwords/pass.json')
        }
        catch(e) {
            return response.status(405).json({message: "you don't have passwords"})
        }
        let rawdata = fs2.readFileSync('../passwords/pass.json');
        let cripArray = JSON.parse(rawdata);

        /* check if it doesn't exist */
        if(cripArray.find(pwd => pwd.title == request.body.oldTitle) == undefined) {
            return response.status(404).json({message: "the given password doesn't exist"})
        }
        
        /* check if it has to update the title */
        if(request.body.updtTitle == "true") {
            /* check if the new title alredy exist */
            if(cripArray.find(pwd => pwd.title == request.body.newTitle) != undefined) {
                return response.status(406).json({message: "the new title already exist"})
            }
        }

        let newArr = cripArray.filter(pass => pass.title != request.body.oldTitle)
        newArr.push({title: request.body.newTitle, msg: utils.Encrypter.encrypt(request.body.psw)})

        let data = JSON.stringify(newArr, null, 2);
        fs2.writeFileSync('../passwords/pass.json', data.toString())

        return response.sendStatus(200)
    }
    catch(e) {
        console.error('\nUpdate Password ' + e)
        return response.sendStatus(500)
    }
})

app.listen(7550, console.log('Successfully started the application, visit: http://localhost:7550'));
