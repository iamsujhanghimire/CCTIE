const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#alert').text(urlParams.get("error"));
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
        $('#alert').text(errorMessage);
        return false;
    }
});