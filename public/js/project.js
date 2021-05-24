$(document).ready(function (){
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if(data['message'] === "success"){
            $('.login').remove();
            $('#showname').text(data.data.fullname);
        }else{
            $('.logout').remove()
        }
    })
})

function showList(project) {
    console.log(project);
    $('#project-main').empty();

    for (let i = 0; i < project.length; i++) {
        $('#project-main').append("<li class='list-group-item'></li>");
    }

    $('#project-main li')
        .attr("value", function (idx) {
            return project[idx]._id;
        })
        .append("<div class='row'></div>");
    //
    // $('#car_list .row').addClass(function (idx) {
    //     if (idx % 2 === 0) {
    //         return 'even_row';
    //     } else {
    //         return 'odd_row';
    //     }
    // });

    $('#project-main .row')
        .append('<div class="col-4 projectName" ></div>')
        .append('<div class="col-8 model"></div>')


    $('.projectName')
        .append(function (idx) {
            return `<p class="ma">${project[idx].project_name}</p>
                    <p class ="ma">${project[idx].area}</p>
                    <p class ="ma">${project[idx].posted_by}</p>`;

        })

}

$.getJSON("/get_all_projects").done(function (data) {
    console.log("I got the projects")
    if (data.message === "success") {
        showList(data["data"]);
    }
});


