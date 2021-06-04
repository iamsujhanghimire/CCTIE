let name;
$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if (data['message'] === "success") {
            $('.login').remove();
            $('#showname').text(data.data.fullname);
            name = data.data.fullname;
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
                    <div class="row test">
                    <div class="offset-10"></div>
<!--                    <p class ="col-3 ma posted_on"><strong>Posted on: 05/28/2021</strong></p>-->
                    <div id="saveDiv" class="col-lg-1"><button type="button" class="btn btn-custom save-btn" id="save" value="${idx}">Save</button></div>
<!--                
    // <button type="button" class="btn btn-danger edt-btn col-1" id="edit" value="${idx}">Edit</button>-->
                    
                    </div>
                    <hr>
                    <p class ="ma"><strong>Project Type: </strong>${project_data[idx].area}</p>
                    <p class ="ma"><strong>Location: </strong>${project_data[idx].location}</p>
                    <p class ="ma"><strong>Posted by: </strong>${project_data[idx].posted_by}</p>
                    <a type="button" class="btn btn-custom btn-contact" id ="projectEmail">Contact</a>
                    <hr>
                    <p class ="ma">${project_data[idx].description}</p>
                    <p class ="ma"><strong>Preferred Qualifications: \n</strong>${project_data[idx].qualification}</p>
                        </div>`;
        })
    if(name === project_data[idx].posted_by){
        $('.test').append(
        `<div id="editBtn" class="col-lg-1"><button type="button" class="btn btn-custom edt-btn" id="edit" value="${idx}" >Edit</button></div>`)
    }
    $('#edit').on('click',function (){
        const projectID = $(this).val();
        // const proj =project_data[projectID]
        location.href = '/project-submit.html?project_idx='+projectID;
    })

    $('.projectName').on('click', function (){
        console.log("i contacted")
        $('#projectEmail').attr('href',function (){
        return "mailto:" + project_data[idx].posted_email;
    })
    })

    $('#save').on('click',function (){
        console.log("I saved")
        const projectID = $(this).val();
        const project= project_data[projectID]
        $.post('/save_project', {project}).done((data) =>{
            console.log(data)
            if(data["message"] === "success"){
                //likes.push(cars[carID])
                // location.reload()
                // console.log(likes)
            }else{
                location.href = data.data+"?error="+data.message;
            }


        })

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


