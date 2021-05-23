const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}
$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
            return false
        }
    });
    if (errorMessage !== null) {
        $('#error_msg').text(errorMessage);
        return false;
    }
});

