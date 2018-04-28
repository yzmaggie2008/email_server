const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys')
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');


const app = express();

//tell express that it needs to make use of cookies inside of our application
app.use(
    cookieSession({
        //how long this cookie can exist inside the browser before it is automatically expired for us
        //30days need to become milliseconds
        maxAge: 30 * 24 * 60 * 60 * 1000,
        //use to encrypt our cookie
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongoURI);
//const authRoutes = require('./routes/authRoutes');
//authRoutes(app);
require('./routes/authRoutes')(app);

//either using the Heroku port using in development envirnment
//or just local host 5000
const PORT = process.env.PORT || 5000
app.listen(PORT);