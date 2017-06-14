$(document).ready(function () {

    $('#submit').on('click', function () {
        var title = $('#event-title').val();
        var startDate = $('#start-date').val();
        var startTime = $('#start-time').val();
        var start = new Date(startDate + " " + startTime);
        var endDate = $('#end-date').val();
        var endTime = $('#end-time').val();
        var end = new Date(endDate + " " + endTime);
        var location = $('#location').val();
        var description = $('#description').val();
        var visibility = $('input[name=privacy]:checked').val();
        var data = {
            title: title,
            start: start,
            end: end,
            location: location,
            description: description,
            visibility: visibility
        };
        $.ajax({
            url: 'http://localhost:4000/calendarUpdate',
            type: 'POST',
            contentType: 'text/plain', //'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function( data ){
                alert("Event saved")
            },
            error: function( jqXHR, textStatus, errorThrown ){
                alert(jqXHR.responseText)
                // alert("Error: Status: "+textStatus+" Message: "+errorThrown);
            }
        }).catch(function (data, status, headers, config) {
            alert(data)
        });

    });

});