let president_email;

$(document).ready(function (){
    $.getJSON('/get_current_user').done(function (data) {
        // console.log(data)
        if(data['message'] === "success"){
            $('.login').remove();
            $('#showname').text(data.data.fullname);
            console.log(data.data.username)
            president_email = data.data.username
            console.log(president_email)
        }else{
            // $('.btnDiv').remove()
            // $('.deleteDiv').remove()
            $('.logout').remove()
        }
    })
})

$.ajax({
    url: 'data/members.json',
    dataType: 'text'
}).done(processData);

function processData(raw) {
    const data = Papa.parse(raw.trim(), {header: true}).data;
    console.log(data);
}


function showList(member) {
    console.log(member);
    $('#members').append(`<div class="memberInfo"></div>`)
    $('.memberInfo').append(`<ul class="memberList"></ul>`)

    for (let i = 0; i < member.length; i++) {
        $('.memberList').append(`<li class = 'member list-group-item'></li>`);
    }
    $('.member').append(`<div class = "row"></div>`).attr('value', function (idx){
        return member[idx]._id;
    })

    $('.memberInfo .row').append(`<div class ="col-lg-3 imgDiv"></div> <div class ="col-lg-7 infoDiv"></div>
            <div class ="col-lg-2 deleteDiv"></div>`)
    $('.deleteDiv').append(`<button class = "btn" id = "delTeam-btn">Delete</button>`)
    $('.imgDiv').append(`<img class = "memberPic" alt = "..."/>`)
    $('.memberPic').attr('src', function (idx){
        return member[idx].picture;
    })
    $('.infoDiv')
        .append(function (idx){
            return `<h3 class="memberName">${member[idx].first_name} ${member[idx].last_name}</h3>`})
        .append(function (idx){
            return `<p class = "memberPos">${member[idx].position}</p>`})
        .append(function (idx){
            return `<p class = memberMajor><strong>Major:</strong> ${member[idx].major}</p>`})
        .append(function (idx){
            return `<p class = memberInt><strong>Interests:</strong> ${member[idx].interests}</p>`})
        .append(function (){
            return `<div class="memberSocials"></div>`})
    $('.memberSocials').append(function (){
        return `<a class = 'memberLI'><i class="fab fa-linkedin"></i></a>
                <a class = 'memberEmail'><i class="fas fa-envelope"></i></a>`
    })
    $('.memberLI').attr('href', function (idx){
        return member[idx].linkedin;
    })

    $('.memberEmail').attr('href',function (idx){
        return "mailto:" + member[idx].member_email;
    })

    $('.member .deleteDiv button').on('click', function (){
        let memberID;
        $(this).addClass('selected')
        memberID = $(this).parents('li').attr('value')

        if(memberID){
            $.post('/delete_member_by_id',{_ids: memberID})
                    .done((info) =>{
                        if(info.message === "Success"){}
                        location.href = "/eboard.html"
                    })
        }

    })
    console.log("emai;"+ president_email)
    if ( president_email == member[0].member_email){
        $('.btnDiv').show()
        $('.deleteDiv').show()
    }
    else{
        $('.btnDiv').remove()
        $('.deleteDiv').remove()
    }
}


$.getJSON("/get_new_members").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});




