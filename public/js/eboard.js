$.ajax({
    url: 'data/members.csv',
    dataType: 'text'
}).done(processData);

function processData(raw) {
    const data = Papa.parse(raw.trim(), {header: true}).data;
    console.log(data);
    // Adding UL and List Element
    $('#members').append(`<ul class = "membersList"></ul>`)
    for (const member of data) {
        console.log(member)
        $('.membersList')
            .append(`<li class = 'memberInfo list-group-item'></li>`)
    }

    // Filling LI with information and pictures

    $('.memberInfo').append(`<div class = "row"></div>`)
    $('.memberInfo .row').append(`<div class ="col-lg-3 imgDiv"></div> <div class ="col-lg-9 infoDiv"></div>`)
    $('.imgDiv').append(`<img class = "memberPic" alt = "..."/>`)
    $('.memberPic').attr('src', function (idx){
        return data[idx].picture;
    })
    $('.infoDiv')
        .append(function (idx){
            return `<h3 class="memberName">${data[idx].first_name} ${data[idx].last_name}</h3>`})
        .append(function (idx){
            return `<p class = "memberPos">${data[idx].position}</p>`})
        .append(function (idx){
            return `<p class = memberMajor><strong>Major:</strong> ${data[idx].major}</p>`})
        .append(function (idx){
            return `<p class = memberInt><strong>Interests:</strong> ${data[idx].interests}</p>`})
        .append(function (idx){
            return `<div class="memberSocials"></div>`})
    $('.memberSocials').append(function (idx){
        return `<a class = 'memberLI'><i class="fab fa-linkedin"></i></a>
                <a class = 'memberEmail'><i class="fas fa-envelope"></i></a>`
    })
    $('.memberLI').attr('href', function (idx){
        return data[idx].linkedin;
    })

    $('.memberEmail').attr('href',function (idx){
        return "mailto:" + data[idx].email;
    })
}

$.getJSON("/get_new_members").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});

//
// function showList(member) {
//     console.log(member);
//     for (let i = 0; i < member.length; i++) {
//         $('#membersList').append(`<li class = 'memberInfo list-group-item'></li>`);
//     }
//     $('.memberInfo').append(`<div class = "row"></div>`)
//     $('.memberInfo .row').append(`<div class ="col-lg-3 imgDiv"></div> <div class ="col-lg-9 infoDiv"></div>`)
//     $('.imgDiv').append(`<img class = "memberPic" alt = "..."/>`)
//     $('.memberPic').attr('src', function (idx){
//         return member[idx].picture;
//     })
//     $('.infoDiv')
//         .append(function (idx){
//             return `<h3 class="memberName">${member[idx].first_name} ${member[idx].last_name}</h3>`})
//         .append(function (idx){
//             return `<p class = "memberPos">${member[idx].position}</p>`})
//         .append(function (idx){
//             return `<p class = memberMajor><strong>Major:</strong> ${member[idx].major}</p>`})
//         .append(function (idx){
//             return `<p class = memberInt><strong>Interests:</strong> ${member[idx].interests}</p>`})
//         .append(function (idx){
//             return `<div class="memberSocials"></div>`})
//     $('.memberSocials').append(function (idx){
//         return `<a class = 'memberLI'><i class="fab fa-linkedin"></i></a>
//                 <a class = 'memberEmail'><i class="fas fa-envelope"></i></a>`
//     })
//     $('.memberLI').attr('href', function (idx){
//         return member[idx].linkedin;
//     })
//
//     $('.memberEmail').attr('href',function (idx){
//         return "mailto:" + member[idx].email;
//     })
// }
//
//





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

