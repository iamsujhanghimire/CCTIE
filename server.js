const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


app.use(session({
    secret: "alongsecretonlyiknow_asdlfkhja465xzcew523",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.listen(3000, function () {
    console.log("server started at 3000");
});


const userSchema= new mongoose.Schema(
    {
        username:{
            type: String,
            unique: true,
            require: true,
            minlength: 3
        },
        password:{
            type: String,
            require: true
        },
        confirm:{
            type: String,
            require: true
        },
        fullname:{
            type: String,
            require: true
        },
        eboardpostion:{
            type: String,
            require: true
        }
    }
);
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);



app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/register', (req, res) => {
    if (req.query.error) {
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});

app.post('/register', (req, res) => {
    const newUser = {
        username: req.body.username,
        fullname: req.body.fullname,
        // profile: req.body.profile,
        // brand: req.body.brand
    };

    User.register(
        newUser,
        req.body.password,
        function (err, user) {
            if(req.body.password!== req.body.confirm){
                console.log(err);
                res.redirect("/register?error= Password must match" );
            }
            else{
                const authenticate = passport.authenticate("local");
                authenticate(req, res, function () {
                    res.redirect("/")
                });
            }
            if (err) {
                res.redirect("/register?error=" + err);


            } else {
                //write into cookies, authenticate the requests
                const authenticate = passport.authenticate("local");
                authenticate(req, res, function () {
                    res.redirect("/")
                });
            }
        }
    );

});


app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.post('/login', (req, res) => {
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(
        user,
        function(err){
            if(err){
                console.log(err);
                res.redirect('login?error=Invalid username or password');
            }else{
                const authenticate = passport.authenticate(
                    "local",
                    {
                        successRedirect:"/",
                        failureRedirect:"/login?error=Username and password don't match"
                    })
                authenticate(req, res);
            }

        }
    )
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
