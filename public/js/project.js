$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if (data['message'] === "success") {
            $('.login').remove();
            $('#showname').text(data.data.fullname);
        } else {
            $('.logout').remove()
        }
    })
})

function showList(project) {
    console.log(project);
    project_data = project;
    $('#project-main').empty();

    for (let i = 0; i < project.length; i++) {
        $('#project-main').append("<li class='list-group-item'></li>");
    }

    $('#project-main li')
        .attr("value", function (idx) {
            return project[idx]._id;
        })
        .append("<div class='row'></div>");

    $('#project-main .row')
        .append('<div class="projectName" ></div>')
        .append('<div class="model"></div>')

    $('.projectName')
        .append(function (idx) {
            return `<div onclick="showProject(${idx})"><p class="ma project-title">${project[idx].project_name}</p>
                    <p class ="ma">Project Type: ${project[idx].area}</p>
                    <br>
                    <p class ="ma">Location: ${project[idx].location}</p>
                    <p class ="ma">Posted by: ${project[idx].posted_by}</p>
</div>`;

        })
}

function clearBox() {
    $("#project-detail").html("");
}

function showProject(idx) {
    console.log(idx);
    console.log(project_data[idx].posted_email)
    clearBox();
    $('#project-detail')
        .append(function () {
            // console.log(project_data[idx].email)
            return `<div><p class="ma title-detail">${project_data[idx].project_name}</p>
                    <div class="col">
                    <p class ="col-3 ma posted_on"><strong>Posted on: </strong>${project_data[idx].date}</p>
                    <button type="button" class="btn btn-warning " style="margin-left: 60%" id="edit">Edit</button>
                    </div>
                    <hr>
                    <p class ="ma"><strong>Project Type: </strong>${project_data[idx].area}</p>
                    <p class ="ma"><strong>Location: </strong>${project_data[idx].location}</p>
                    <p class ="ma"><strong>Posted by: </strong>${project_data[idx].posted_by}</p>
                    <button type="button" class="btn btn-primary btn-contact" id ="projectEmail">Contact</button>
                    <hr>
                    <p class ="ma">${project_data[idx].description}</p>
                    <p class ="ma"><strong>Preferred Qualifications: \n</strong>${project_data[idx].qualifications}</p>
                        </div>`;
        })

    $('#edit').on('click',function (){
        location.href = "/project-submit.html"
    })

    $('#projectEmail').attr('href',function (idx){
        console.log("I pressed")
        return "mailto:" + project_data[idx].posted_email;
    })
}


$.getJSON("/get_all_projects").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});

//Search Bar
$.getJSON("/get_projects_by_filter").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});

let project_data;

function searchProject() {
    $.get("/get_projects_by_filter", {
        search_key: $('#search_box').val(),
    }).done((data) => {
        if (data.message === "success") {
            showList(data.data);
        }
    })
}


