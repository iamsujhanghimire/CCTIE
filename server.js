require('dotenv').config()

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
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/tieDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

app.listen(3000, function () {
    console.log("server started at 3000");
});

const projectSchema = new mongoose.Schema({
        project_name: String,
        area: String,
        people: String,
        location:String,
        description: String,
        posted_by: String
    }
)
const Project = mongoose.model('project', projectSchema);
projectlist = []
var loginName;
var loginEmail;

const userSchema= new mongoose.Schema(
    {
        fullname:{
            type: String,
            require: true
        },
        eboardpostion:{
            type: String,
            require: true
        },
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
    }
);
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});


app.get('/get_current_user', function (req,res){
    loginName = req.user.fullname;
    loginEmail = req.user.username;
    console.log(loginName)
    console.log(loginEmail)
    if(req.isAuthenticated()){
        res.send({
            message: "success",
            data: req.user
        })
    }else{
        res.send({
            message: "failure",
            data: {}
        })
    }
});

app.get("/get_all_projects", function (req, res) {
    // console.log("I am in get all projects")
    Project.find(function (err, data) {
        if (err) {
            console.log("ERROR")
            res.send({
                "message": "internal database error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
            console.log(data);
        }
    });
});


app.get('/register', (req, res) => {
    if (req.query.error) {
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});


app.post('/register', (req, res) => {
    const newUser={username: req.body.username, fullname: req.body.fullname, eboardpostion: req.body.eboardpostion
    };
    console.log(newUser);
    User.register(
        newUser,
        req.body.password,
        function(err, user){
            if(err){
                console.log(err);
                res.redirect("/register?error="+err);
            }else{
                //write into cookies, authenticate the requests
                const authenticate = passport.authenticate("local");
                authenticate(req,res, function (){
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
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(
        user,
        function (err) {
            if(err){
                console.log(err);
                res.redirect('login?error=Invalid username or password');

            }else{
                const authenticate = passport.authenticate("local", {
                    successRedirect: "/",
                    failureRedirect: "/login?error=Username or password does not match"})
                authenticate(req,res)
            }
        }
    )
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.get('/submit_project', (req, res) => {  if (req.isAuthenticated()) {
    res.redirect("/project-submit.html");
} else {
 res.redirect("/login?error=You need to login first")
}
});

app.post('/new-project',(req, res) => {
    const project = {
        project_name: req.body.project_name,
        area: req.body.area,
        people: req.body.people,
        location: req.body.location,
        description: req.body.description,
        posted_by:loginName,
        email: loginEmail
    }
    console.log("save: " + req.body._id)
    const np = new Project(project);
        np.save(
            (err, new_project) =>{
                if (err){
                    console.log(err["message"]);
                    res.redirect("/project-submit.html?error_message=" + err["message"] + "&input=" + JSON.stringify(project))
                }else{
                    console.log(new_project._id);
                    res.redirect("/project.html");
                }
            })

});

app.get("/get_projects_by_filter", (req, res) => {
    let sk = req.query.search_key;
    console.log(sk);
    Project.find({
        $and: [
            {project_name: {$regex: sk}}
        ]
    }, (err, data) =>{
        if (err) {
            res.send(
                {
                    "message": "db_error",
                    "data": []
                })
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
        console.log(data);
    });
});