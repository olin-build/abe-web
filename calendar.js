var main=function() {

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
               description : "blue",
           },
           {
               title  : 'event2',
               start  : '2017-06-05',
               end    : '2017-06-07',
               description : "blue",
               tag: "FWOP",
           },
           {
               title  : 'event3',
               start  : '2017-06-09T12:30:00',
               allDay : false, // will make the time show
               description : "blue",
               tag: "BAJA",
           }
       ],

        header: {
          left: 'title',
          center:'',
          right:'today prev,next'

        },
        eventRender: function(event, element) {
          if(event.tag === "FWOP"){
         element.css('background-color', event.description);
         element.css('border-color', event.description);
       }
       else if(event.tag === "BAJA"){
         element.css('background-color', 'red');
         element.css('border-color', 'red');
         //event.eventBackgroundColor = 'red'
         //event.rendering = "background"
       }
       },
    })

makeDropdown()

}

var makeDropdown=function(){
  $('.fc-toolbar .fc-left').append(
    $('<div>').attr('id','labels-dropdown'));
    $('#labels-dropdown').addClass('btn-group');
    $('#labels-dropdown').append(
      $('<button>').addClass('fc-button fc-state-default fc-corner-left fc-corner-right dropdown-toggle'));
    $('.dropdown-toggle').attr('type','button').attr('data-toggle','dropdown').attr('aria-haspopup', 'true').attr('aria-expanded','false');
    $('.dropdown-toggle').text('Action');
    $('.dropdown-toggle').append(
      $('<span>').addClass('caret')
    );
    $('#labels-dropdown').append(
      $('<ul>').attr('id','labels-dropdown-inner'));
    $('#labels-dropdown-inner').addClass('dropdown-menu');
    $('#labels-dropdown-inner').append(
    $('<li>').append(
    $('<a>').attr('href','#').text('Action')
    ),
    $('<li>').append(
    $('<a>').attr('href','#').text('Another Action')
    ));
      }




$(document).ready(main);
