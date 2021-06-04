const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}

// const urlParams = new URLSearchParams(window.location.search);
$('form').on('submit', function () {
    let errorMessage = null
    // $.each($('input,textarea'), function () {
    //     if (!$(this).val()) {
    //         errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
    //         $('#error_msg').text(errorMessage);
    //         return false;
    //     }
    // });
    if($("#email").val()===""){
        errorMessage = `Email cannot be empty`;
        $('#error_msg').text(errorMessage);
        return false;
    }
    if($("#password").val()===""){
        errorMessage = `Password cannot be empty`;
        $('#error_msg').text(errorMessage);
        return false;
    }
    // if (urlParams.get("error")) {
    //     $('#error_msg').text(urlParams.get("error"));
    // }
});

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