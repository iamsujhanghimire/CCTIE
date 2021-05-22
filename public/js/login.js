const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}
