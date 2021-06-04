function load_user(user) {
    if(user.save_project){

        user.save_project.forEach((save)=>{
            console.log(save.project_name)
            $('#save_grid').append(`<li class="col-lg-3 col-md-4 col-sm-6 col-xs-12 cardholder" style="list-style-type:none">
            <p class="ma title-detail">${save.project_name}</p>
            <p class ="ma">${save.area}</p>
             <p class ="ma"> ${save.posted_by}</p>
             <a type="button" class="btn btn-custom btn-contact" id ="projectEmail" value = "${save.posted_by}">Contact</a>
                </li>`);
        });
        $('.btn-contact').on('click', function (){
            const project_email = $(this).val();
            console.log("i contacted")
            $('#projectEmail').attr('href',function (){
                return "mailto:" + project_email;
            })


    })}
}

$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if (data['message'] === "success") {
            console.log("I have saved projects")
            $('.login').remove();
            $('#showname').text(data.data.fullname);
            load_user(data['data'])
        } else {
            $('.logout').remove()
        }
    })
})

// $(document).ready(function (){
//     $.getJSON('/get_current_user').done(function (data) {
//         if (data['message'] === "success") {
//             load_user(data['data'])
//             console.log("I got the saved projects")
//         }})
// })