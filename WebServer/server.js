const express = require('express');
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser');

const fs = require('fs').promises
const fs2 = require('fs')

const bcrypt = require('bcrypt')

const utils = require('./utilities/utils');

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

        if((await fs.writeFile('../login/login.txt', pswHash)) != undefined) {
            console.error('\n Error while trying to write login file')
            return response.status(500).json({message: 'error while trying to write login file'})
        }
        if((await fs.chmod('../login/login.txt', 0o000)) != undefined) {
            console.error('\n Error while trying to write login file')
            return response.status(500).json({message: 'error while updating permissions to login file'})
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
        utils.setUsrPsw(request.body.password)
        
        return response.sendStatus(200)
    }
    catch(e) {
        console.error('\nLogin ' + e)
        return response.status(500).json({message: 'error in the login system'})
    }
})

app.listen(7550, console.log('Successfully started the application, visit: http://localhost:7550'));
