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
        posted_by: String,
        posted_email: String,
        qualification: String
    }
)
const Project = mongoose.model('project', projectSchema);
projectlist = []

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
        save_project:[{
            project_name: String,
            area: String,
            posted_by: String,
            posted_email: String
        }]
    }
);
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

const eventSchema = new mongoose.Schema({
        event_name: String,
        event_location: String,
        event_date: String,
        event_time:String,
        event_description: String,
        event_rsvp: String,
        event_ref: String
    }
)

const Event = mongoose.model('Event', eventSchema);
eventlist = []

const memberSchema = new mongoose.Schema({
        first_name: String,
        last_name: String,
        member_email: String,
        major:String,
        year: String,
        position: String,
        picture:String,
    interests: String,
    linkedin: String
    }
)

const Member = mongoose.model('Member', memberSchema);
memberlist = []


var loginName;
var loginEmail;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});


app.get('/get_current_user', function (req,res){
    if(req.isAuthenticated()) {
        loginName = req.user.fullname;
        loginEmail = req.user.username;
    }
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
            // console.log(data);
        }
    });
});

app.get("/get_all_events", function (req, res) {
    // console.log("I am in get all projects")
    Event.find(function (err, data) {
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

app.get("/get_new_members", function (req, res) {
    // console.log("I am in get all projects")
    Member.find(function (err, data) {
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

//Submit New Project

app.get('/submit_project', (req, res) => {  if (req.isAuthenticated()) {
    res.redirect("/project-submit.html");
} else {
 res.redirect("/login?error=You need to login first")
}
});

app.get("/profile", (req, res) => {
    //This page can be viewed only after login
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/profile.html");
    } else {
        res.sendFile("/login.html?error=You need to login first");
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
        posted_email: loginEmail,
        qualification: req.body.qualification
    }
    console.log("save:" + req.body._id)
    if(req.body._id){
        console.log("I am in edit")
        Project.updateOne(
            {_id: req.body._id},
            {$set: project},
            {runValidators:true},
            (err, info) =>{
                if(err){
                    console.log(err.message);
                    res.redirect("/project-submit.html?error_message=" + JSON.stringify(err.errors))
                }else{
                    console.log(info);
                    res.redirect("/project.html");
                }
            }
        )
    }
    else {
        const np = new Project(project);
        np.save(
            (err, new_project) => {
                if (err) {
                    console.log(err["message"]);
                    res.redirect("/project-submit.html?error_message=" + err["message"] + "&input=" + JSON.stringify(project))
                } else {
                    console.log(new_project._id);
                    res.redirect("/project.html");
                }
            })
    }

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

app.get('/submit_project', (req, res) => {  if (req.isAuthenticated()) {
    res.redirect("/project-submit.html");
} else {
    res.redirect("/login?error=You need to login first")
}
});

app.post('/new-event',(req, res) => {
    const event = {
        event_name: req.body.event_name,
        event_location: req.body.event_location,
        event_date: req.body.event_date,
        event_time:req.body.event_time,
        event_description: req.body.event_description,
        event_rsvp: "http://" + req.body.rsvp + "/",
        event_ref: "http://" + req.body.reference + "/"
    }
    console.log("save: " + event)
    const ne = new Event(event);
    ne.save(
        (err, new_project) =>{
            if (err){
                console.log(err["message"]);
                res.redirect("/create-email.html?error_message=" + err["message"] + "&input=" + JSON.stringify(event))
            }else{
                console.log(new_project._id);
                res.redirect("/events.html");
            }
        })

});

app.get("/get_events_by_filter", (req, res) => {
    let sk = req.query.search_key;
    console.log(sk);
    Event.find({
        $and: [
            {event_name: {$regex: sk}}
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



app.post('/new-member',(req, res) => {
    const member = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        member_email: req.body.member_email,
        major:req.body.major,
        year: req.body.year,
        position: req.body.position,
        picture:req.body.picture,
        interests: req.body.interests,
        linkedin: req.body.linkedin
    }
    console.log("save: " + req.body._id)
    const nm = new Member(member);
    nm.save(
        (err, new_member) =>{
            if (err){
                console.log(err["message"]);
                res.redirect("/new-member.html?error_message=" + err["message"] + "&input=" + JSON.stringify(member))
            }else{
                console.log(new_member._id);
                res.redirect("/eboard.html");
            }
        })

});

//Deleting Members
app.post('/delete_member_by_id', (req, res) => {
    Member.deleteOne(
        {"_id":{$in:req.body._ids}},
        {},
        (err) => {
            if(err){
                res.send({"message":"database error"})
            }else{
                res.send({
                    "message":"Success"
                })
            }})
});

//End of Submit New Project

//Submit New Event

//End of Submit New Project

app.post('/save_project', (req, res) => {
    if (req.isAuthenticated()) {
        // const project_id=req.body.stock_num;
        const project = {
            project_name: req.body.project.project_name,
            area: req.body.project.area,
            posted_by:req.body.project.posted_by,
            posted_email: req.body.project.posted_email
        }
        // console.log(project_save);
        User.updateOne(
            {_id: req.user._id, 'saves.project_name': {$ne: project.project_name}},
            {
                $push: {save_project: project}
            },
            {},
            (err, info) => {
                if (err) {
                    res.send({
                        message: "database error"
                    });
                } else {
                    res.send({
                        message: "success"
                    })
                }})
    } else {
        res.send({
            message: "login required",
            data: ("/login")
        })
    }
});


