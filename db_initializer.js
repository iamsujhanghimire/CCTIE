const mongoose = require('mongoose');
const fs = require('fs');


const rawdata = fs.readFileSync(__dirname + "/public/data/projects.json");
jsonList = JSON.parse(rawdata);

mongoose.connect('mongodb://localhost:27017/tieDB', {useNewUrlParser: true}, function () {
    console.log("db connected successful!")
});

const projectSchema = new mongoose.Schema({
    project_name: String,
    area: String,
    people: String,
    discription: String,
    posted_by: String
    }
)

const Project = mongoose.model('project', projectSchema);
projectlist = []

jsonList.forEach(function (project) {
    projectlist.push({
        "project_name": project["project_name"],
        "area": project["area"],
        "people": project["people"],
        "discription": project["discription"],
        "posted_by": project["posted_by"]
    })
});



// jsonList.forEach(function (course) {
//     projectlist.push({
//         "project_name": project["project_name"],
//         "area": project["area"],
//         "people": project["people"],
//         "discription": project["discription"],
//         "posted_by": project["year"]
//     });
// });

Project.insertMany(projectlist, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        mongoose.connection.close();
    }
});