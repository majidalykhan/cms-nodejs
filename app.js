const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/nodeProject', {useNewUrlParser:true}).then((db)=>{


    console.log('Mongo Connected');
}).catch(error=> console.log(error));


app.use(express.static(path.join(__dirname, 'public')));

// Set a View Engine
const {select, generateDate} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers:{select:select, generateDate: generateDate}}));
app.set('view engine', 'handlebars');

//Upload Middleware
app.use(upload());


//Body-Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Method Override
app.use(methodOverride('_method'));

// Loading Routes
const home = require('./routes/home/homeroutes');
const admin = require('./routes/admin/adminroutes');
const posts = require('./routes/admin/posts');

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Local Variables using Middleware
app.use((req, res, next)=>{
    res.locals.user=req.user || null;
    next();
});

//Using Routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);


app.listen(4500, ()=>
{
    console.log('Listening on Port 4500');
});