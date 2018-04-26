const express = require('express');
const app = express();

app.get('/', (req,res) => {
    res.send({hi: 'there'});
});

//either using the Heroku port using in development envirnment
//or just local host 5000
const PORT = process.env.PORT || 5000
app.listen(PORT);