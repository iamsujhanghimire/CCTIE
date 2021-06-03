const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// const error_message = urlParams.get("error_message");
const input = JSON.parse(urlParams.get("input"));


const project_idx = urlParams.get('project_idx');

if(project_idx){
    console.log(project_idx)
    $.getJSON("/get_all_projects")
        .done((data) =>{
            if(data["message"] === "success"){
                fillProject(data["data"])
                console.log(data["data"])
            }
        })
}
let project_details

function fillProject(car) {
    project_details = car[project_idx];
    console.log(car[project_idx])
    $('#project_name').val(car[project_idx].project_name);
    $('#area').val(car[project_idx].area);
    $('#people').val(car[project_idx].people);
    $('#location').val(car[project_idx].location);
    $('#description').val(car[project_idx].description);
    console.log(car[project_idx]._id)
}



$('form').on('submit', function () {
    if (project_idx) {
        $('#edit_project form').append(() => {
            const input = $(`<input>`)
                .attr("name", "_id")
                .attr("value", project_details._id);
            return input
        });
    }

});
