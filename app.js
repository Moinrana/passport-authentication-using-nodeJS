const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;


//connect to mongoDb
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('Connected with mongoose'))
.catch(err =>console.log('No    '+err));


//middlewares EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body Parser
app.use(express.urlencoded({ extended:false }));

//Express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success-msg');
    res.locals.error_msg = req.flash('error-msg');
    res.locals.error = req.flash('error');

    next();
});
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));





const PORT = process.env.PORT || 5000;

app.listen(PORT , console.log(`Server started at port=${PORT}`));
