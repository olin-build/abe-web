$(document).ready(function() {

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        weekends: true,
        // events: '/myfeed.php',
        //fake events to play with:
        events: [
           {
               title  : 'event1',
               start  : '2017-06-13',
               //rendering : "background",
               decription : "blue"
           },
           {
               title  : 'event2',
               start  : '2017-06-05',
               end    : '2017-06-07',
               description : "blue"
           },
           {
               title  : 'event3',
               start  : '2017-06-09T12:30:00',
               allDay : false, // will make the time show
               description : "blue"
           }
       ],

        header: {
          left: 'title',
          center:'',
          right:'today prev,next'

        },
        eventRender: function(event, element) {
         element.css('color', event.description);
       },
    })

});
