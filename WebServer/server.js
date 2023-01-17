const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.send('Hello World!');
});

app.listen(7550, console.log('Server is listening on port 7550, press Cntrl+C to force exit.'));
