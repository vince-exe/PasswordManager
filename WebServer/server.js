const express = require('express');
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser');

const fs = require('fs').promises
const fs2 = require('fs')

const bcrypt = require('bcrypt')

const utils = require('./utilities/utils');
const { allowedNodeEnvironmentFlags, title } = require('process');
const { response } = require('express');

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
        
        let pwds = require('../passwords/pass.json')

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
        let cripArr = require('../passwords/pass.json')

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

app.listen(7550, console.log('Successfully started the application, visit: http://localhost:7550'));
