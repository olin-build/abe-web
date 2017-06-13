$(document).ready(function() {

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        weekends: true,
        header: {
          left: 'title',
          center:'',
          right:'today prev,next'

        }
    })

});
