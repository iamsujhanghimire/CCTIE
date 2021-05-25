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
                <a class = 'memberEmail'><i class="fas fa-envelope"></i></a>
                <a class = 'memberFB'><i class = "fab fa-facebook"> </i></a>
                <a class = 'memberIG'><i class = "fab fa-instagram"> </i></a>`
    })
    $('.memberLI').attr('href', function (idx){
        return data[idx].linkedin;
    })
    // $('.fas').attr('onclick', function (idx){
    //     return window.location.href = data[idx].email;
    // })
    $('.memberFB').attr('href', function (idx){
        return data[idx].facebook;
    })
    $('.memberIG').attr('href', function (idx){
        return data[idx].instagram;
    })

    $('.memberEmail').attr('href',function (idx){
        return "mailto:" + data[idx].email;
    })
}


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

