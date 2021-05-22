const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.listen(3000, function () {
    console.log("server started at 3000");
});

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
