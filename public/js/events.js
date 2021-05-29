$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if (data['message'] === "success") {
            $('.login').remove();
            $('#showname').text(data.data.fullname);
        } else {
            $('.logout').remove()
        }
    })
})

function showList(event) {
    // console.log(event);
    event_data = event;
    $('#event-main').empty();

    for (let i = 0; i < event.length; i++) {
        $('#event-main').append("<li class='list-group-item'></li>");
    }

    $('#event-main li')
        .attr("value", function (idx) {
            return event[idx]._id;
        })
        .append("<div class='row'></div>");


    $('#event-main .row').addClass(function (idx) {
        if (idx % 2 === 0) {
            return 'even_row';
        } else {
            return 'odd_row';
        }
    });

    $('#event-main .row')
        .append('<div class="eventName" ></div>')
        .append('<div class="model"></div>')

    $('.eventName')
        .append(function (idx) {
            return `<div onclick="showEvent(${idx})"><p class="ma project-title">${event[idx].event_name}</p>
                    <p class ="ma">Date: ${event[idx].event_date} | Time: ${event[idx].event_time}  </p>
                    <p class ="ma">Location: ${event[idx].event_location}</p>
</div>`;
        })
    $('.buttonDiv')
        .append(function (idx) {
            return `<input type="button" class="btn btn-outline-primary button" value="Show More" style="margin-right: 50%">`
        });

    $('.button').on('click', function () {
        const carId = $(this).parents('li').attr("value");
        console.log(carId);
        location.href = "detail.html?car_id=" + carId;
    });
}

function clearBox() {
    $("#event-detail").html("");
}

function showEvent(idx) {
    console.log(idx);
    // console.log(event_data[idx].email)
    clearBox();
    $('#event-detail')
        .append(function () {
            // console.log(project_data[idx].email)
            return `<div><p class="ma title-detail">${event_data[idx].event_name}</p>
                    <hr>
                    <p class ="ma"><strong>Date: </strong>${event_data[idx].event_date}</p>
                    <p class ="ma"><strong>Time: </strong>${event_data[idx].event_time}</p>
                    <p class ="ma"><strong>Location: </strong>${event_data[idx].event_location}</p>
<!--                    <p class ="ma"><strong>Posted by: </strong>${event_data[idx].posted_by}</p>-->
                    <button type="button" class="btn btn-primary btn-contact" class = "projectEmail">RSVP</button>
                    <button type="button" class="btn btn-primary btn-contact" class = "projectEmail">Learn More</button>
                    <hr>
                    <p class ="ma">${event_data[idx].event_description}</p>
                        </div>`;
        })
    // $('.btn').on('click',function (idx){
    //     console.log("I clicked the button")
    //     location.href("mailto:" + project_data[idx].email);
    // })
}


$.getJSON("/get_all_events").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});

//Search Bar
$.getJSON("/get_events_by_filter").done(function (data) {
    if (data.message === "success") {
        showList(data["data"]);
    }
});

let event_data;

function searchEvent() {
    $.get("/get_events_by_filter", {
        search_key: $('#search_box').val(),
    }).done((data) => {
        if (data.message === "success") {
            showList(data.data);
        }
    })
}


