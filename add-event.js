$(document).ready(function () {

    $('#submit').on('click', function () {
        var title = $('#event-title').val();
        var startDate = $('#start-date').val();
        var startTime = $('#start-time').val();
        var endDate = $('#end-date').val();
        var endTime = $('#end-time').val();
        var location = $('#location').val();
        var description = $('#description').val();
        var visibility = $('input[name=privacy]:checked').val();
        alert("You pressed my button :)");

    });

});