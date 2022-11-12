const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/config').MongoURL;

mongoose.connect(db)
    .then(() => console.log('mongo db connected...'))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));
app.use(session({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require('./config/passport');
passportConfig(passport);

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


app.use(expressLayouts);
app.use('/', indexRoute);
app.use('/users', usersRoute);


app.listen(PORT, console.log(`app listening on port ${PORT}`));