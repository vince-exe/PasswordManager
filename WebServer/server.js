const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.redirect('http://localhost:7550/index.html')
});

app.listen(7550, console.log('Successfully started the application, visit: http://localhost:7550'));
