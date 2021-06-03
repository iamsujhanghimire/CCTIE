function load_user(user) {
    $('#car_list').empty();
    // $('#name').text(user.fullname);
    // $('#brand').text(user.brand);
    // $('#profile_img').attr('src', user.profile);
    if(user.saves){

        user.likes.forEach((like)=>{
            console.log(like.title)
            const names=like.title;

            $('#car_list').append(`<li class="list-group-item">${names}</li>`);
        });


    }
}

$(document).ready(function (){
    $.getJSON('/get_current_user').done(function (data) {
        if (data['message'] === "success") {
            load_user(data['data'])
        }})
})