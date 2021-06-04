const mongoose = require('mongoose');
const fs = require('fs');


const rawdata = fs.readFileSync(__dirname + "/public/data/projects.json");
jsonList = JSON.parse(rawdata);

const memberraw = fs.readFileSync(__dirname + "/public/data/members.json");
memberjsonList = JSON.parse(memberraw)

const eventraw = fs.readFileSync(__dirname + "/public/data/events.json");
eventjsonList = JSON.parse(eventraw)

mongoose.connect('mongodb://localhost:27017/tieDB', {useNewUrlParser: true}, function () {
    console.log("db connected successful!")
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

// Member Schema
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


jsonList.forEach(function (project) {
    projectlist.push({
        project_name: project["project_name"],
        area: project["area"],
        people: project["people"],
        location:project["location"],
        description: project["description"],
        posted_by: project["posted_by"],
        posted_email: project["posted_email"],
        qualification: project["qualification"]
    })
});



memberjsonList.forEach(function (member) {
    memberlist.push({
        first_name: member["first_name"],
        last_name: member["last_name"],
        member_email: member["email"],
        major: member["major"],
        year: member["year"],
        position: member["position"],
        picture: member["picture"],
        interests: member["interests"],
        linkedin: member["linkedin"]
    });
});

eventjsonList.forEach(function (event) {
    eventlist.push({
        event_name: event["event_name"],
        event_location: event["event_location"],
        event_date: event["event_date"],
        event_time:event["event_time"],
        event_description: event["event_description"],
        event_rsvp: event["event_rsvp"],
        event_ref: event["event_ref"]
    });
});


Member.insertMany(memberlist, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        // mongoose.connection.close();
    }
});



Project.insertMany(projectlist, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        mongoose.connection.close();
    }
});

Event.insertMany(eventlist, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        // mongoose.connection.close();
    }
});