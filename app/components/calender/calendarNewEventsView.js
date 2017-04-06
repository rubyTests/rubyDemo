angular
    .module('altairApp')
    .controller('calendareventsCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$timeout',
        function ($scope,uiCalendarConfig,$filter,$resource, DTOptionsBuilder, DTColumnDefBuilder,$compile,$timeout) {
            $scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!$scope.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers')
                // Active Buttons extension
                .withColumnFilter({
                    aoColumns: [
                        null,
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                       null
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                    DTColumnDefBuilder.newColumnDef(1).withTitle('Course'),
                    DTColumnDefBuilder.newColumnDef(2).withTitle('Batch'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Type'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Name'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Date'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('From'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('To'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Action'),

                ];
            $scope.colorcode=["#d81b60","#8e24aa","#5e35b1","#3949ab","#1e88e5","#039be5","#0097a7","#00897b","#43a047","#689f38","#ef6c00","#f4511e","#6d4c41","#757575","#546e7a","red"];
            $scope.toggle=true;
            $scope.openTable=function(){
                $scope.toggle=!$scope.toggle;
            }
            // masked inputs
            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }
            $scope.forms_advanced={
                startTime:"00:00",
                endTime:"00:00"
            };

            $scope.eventType=['News', 'Event'];
            var modal = UIkit.modal("#modal_header_footer");

            $scope.department=[];
            $scope.course = [];
            $scope.batch = [];
            
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            $resource('data/calendar/department.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.department = response;
            });
            $resource('data/calendar/course.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.course = response;
            });
            $resource('data/calendar/courseBatch.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.batchArray = response;
            });
            $scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course...',
                valueField: 'id',
                labelField: 'course_name',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                            if(value==''){
                                $scope.batch=[]
                            }else {
                               var data=$filter('filter')($scope.batchArray, {course_id : value});
                               if (data.length > 0)
                                
                                $scope.batch.push(data);
                            }
                        });
                    
                }
            };
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                valueField: 'id',
                labelField: 'cBatch_name',
            };
            $scope.randID_generator = function() {
                var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                return randLetter + Date.now();
            };

            $scope.color_picker = function(object,pallete) {
                if(object) {
                    var cp_id = $scope.randID_generator(),
                        cp_pallete = pallete ? pallete : ['#e53935','#d81b60','#8e24aa','#5e35b1','#3949ab','#1e88e5','#039be5','#0097a7','#00897b','#43a047','#689f38','#ef6c00','#f4511e','#6d4c41','#757575','#546e7a'],
                        cp_pallete_length = cp_pallete.length,
                        cp_wrapper = $('<div class="cp_altair" id="'+cp_id+'"/>');

                    for(var $i=0;$i<cp_pallete_length;$i++) {
                        cp_wrapper.append('<span data-color=' + cp_pallete[$i] + ' style="background:' + cp_pallete[$i] + '"></span>');
                    }

                    cp_wrapper.append('<input type="hidden">');

                    $('body').on('click', '#T1489421677871 span',function() {
                        $(this)
                            .addClass('active_color')
                            .siblings().removeClass('active_color')
                            .end()
                            .closest('.cp_altair').find('input').val($(this).attr('data-color'));
                    });
                    return object.append(cp_wrapper);

                }
            };
            // date range
            var $dp_start = $('#uk_dp_start'),
                $dp_end = $('#uk_dp_end');

            var start_date = UIkit.datepicker($dp_start, {
                format:'DD.MM.YYYY'
            });

            var end_date = UIkit.datepicker($dp_end, {
                format:'DD.MM.YYYY'
            });

            $dp_start.on('change',function() {
                end_date.options.minDate = $dp_start.val();
                console.log($dp_start.val(),"$dp_start.val()")
            });

            $dp_end.on('change',function() {
                start_date.options.maxDate = $dp_end.val();
            });
            $scope.modelhide=function(){
                modal.hide();
                $scope.eventType1="";
                $scope.forms_advanced={
                    startTime:"00:00",
                    endTime:"00:00"
                };
                $scope.input_default="";
                $scope.forms_advanced.day="";
                $('#calendar_colors_wrapper').find('input').val("")
            }
            $scope.getdateobject=function(date){
                // console.log(moment(date));
                return moment(date)._d;
            }
            // $scope.addEvent=function(){
            //     var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
            //     var temp_start_date=$scope.dp_start.split(".");
            //     var temp_end_date=$scope.dp_end.split(".");
            //     var start_date=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0];
            //     var end_date=temp_end_date[2]+"-"+eval(temp_end_date[1])+"-"+ temp_end_date[0];
            //     var startTime=$scope.forms_advanced.startTime.split(":");
            //     var endTime=$scope.forms_advanced.endTime.split(":");
            //     eventData = {
            //         title : $scope.input_default,
            //         start : moment(start_date).startOf('day').add(startTime[0], 'hours').add(startTime[1], 'minutes').format('YYYY-MM-DD HH:mm'),
            //         end : moment(end_date).startOf('day').add(endTime[0], 'hours').add(endTime[0], 'minutes').format('YYYY-MM-DD HH:mm'),
            //         color: eventColor ? eventColor : '',
            //         eventType1:$scope.eventType1
            //     };
            //     uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', eventData, true); // stick? = true
            //     $scope.modelhide();
            //     // console.log(parseInt($scope.forms_advanced.startTime.split(":")[1])+12);
            //     // eventData = {
            //     //     title: $scope.input_default,
            //     //     start: moment(start_date).utcOffset("+05:30").startOf('day').add(startTime, 'hours').format('YYYY-MM-DD HH:mm'),
            //     //     end: moment(end_date).utcOffset("+05:30").startOf('day').add(endTime, 'hours').format('YYYY-MM-DD HH:mm'),
            //     //     color: eventColor
            //     // };
            //     // $scope.calendar_events.push(eventData);
            //     // $scope.forms_advanced.startTime="";
            //     // $scope.forms_advanced.endTime="";
            //     // $('#calendar_colors_wrapper').find('input').val("")
            //     // console.log($scope.calendar_events,"$scope.calendar_events");
            // }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            $scope.addEvent=function(){
                var COURSE_NAME=$filter('filter')($scope.course, {id: $scope.forms_advanced.course2});
                var BATCH_NAME=$filter('filter')($scope.batchArray, {id : $scope.forms_advanced.batch2});
                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                var temp_start_date=$scope.dp_start.split(".");
                var temp_end_date=$scope.dp_end.split(".");
                var start_dateWithTime=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0]+" "+$scope.forms_advanced.startTime;
                var start_dateWithEnd=temp_end_date[2]+"-"+eval(temp_end_date[1])+"-"+ temp_end_date[0]+" "+$scope.forms_advanced.endTime;
                
                eventData = {
                    title : $scope.forms_advanced.input_default,
                    start : moment(start_dateWithTime, ['YYYY-MM-DD HH:mm A']).locale('en').format('YYYY-MM-DD HH:mm A'),
                    end : moment(start_dateWithEnd, ['YYYY-MM-DD HH:mm A']).locale('en').format('YYYY-MM-DD HH:mm A'),
                    _id : $scope.calendar_events.length+1,
                    course_id : $scope.course2,
                    course_name : COURSE_NAME[0].course_name,
                    batch_id : $scope.batch2,
                    batch_name : BATCH_NAME[0].cBatch_name,
                    eventType : $scope.eventType1,
                    color:eventColor
                };
                $scope.calendar_events.push(eventData);
                uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents'); // stick? = true
                $scope.modelhide();
                
                $scope.course2=[];
                $scope.batch2=[];
                $scope.input_default="";
                $scope.forms_advanced.startTime="";
                $scope.forms_advanced.endTime="";
                // $('#calendar_colors_wrapper').find('input').val("")
                // console.log($scope.calendar_events,"$scope.calendar_events");
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            $scope.editEvent=function(event){
                if (typeof event!="undefined"){
                    $scope.forms_advanced.input_default=event.title;
                    $scope.dp_start= $filter('date')(new Date(event.start.split(" ")[0]), "dd.MM.yyyy");
                    $scope.dp_end= $filter('date')(new Date(event.end.split(" ")[0]), "dd.MM.yyyy");
                    $scope.startTime=event.start.split(" ")[1]+" "+event.start.split(" ")[2];
                    $scope.endTime=event.end.split(" ")[1]+" "+event.end.split(" ")[2];
                    $scope.description=event.description;
                    $scope.forms_advanced.course2=event.course_id;
                    $scope.forms_advanced.batch2=event.batch_id;
                    $scope.eventType1=event.eventType;
                    $scope.active=event.active;
                     if ( modal.isActive() ) {
                        modal.hide();
                    } else {
                        modal.show();
                    }
                    // $scope.checkValiddata();
                }
            }
            $scope.deleteEvent=function(event){
                // console.log(parentkey, childkey, event)
                if (typeof event!="undefined") {
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        // console.log("true");
                        $scope.calendar_events.splice(event, 1);
                        // console.log($scope.events_list,"$scope.events_list");
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                        
                    },function(){
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
            }
            $scope.checkValiddata=function(start, end){
                    $scope.eventType1="";
                    $scope.forms_advanced.input_default="";
                    $scope.dp_start= $filter('date')(new Date(), "dd.MM.yyyy");
                    $scope.dp_end= $filter('date')(new Date(), "dd.MM.yyyy");
                    $scope.startTime="00:00 am";
                    $scope.endTime="00:00 am";
                    $scope.description="";
                    $scope.forms_advanced.course2="";
                    $scope.forms_advanced.batch2="";
                    $scope.eventType1="";
                    $scope.active="";
                    // $scope.course2=[];
                    // $scope.batch2=[];
                    // $scope.input_default="";
                    // $scope.forms_advanced.startTime="00:00 am";
                    // $scope.forms_advanced.endTime="00:00 am";
                    // var modal = UIkit.modal("#modal_header_footer");
                    if ( modal.isActive() ) {
                        modal.hide();
                    } else {
                        // $scope.dp_start='';
                        // $scope.dp_end='';
                        if (start || end) {
                            $scope.dp_start=start._d.getDate()+"."+eval(start._d.getMonth()+1)+"."+start._d.getFullYear();
                            // console.log($scope.dp_start);
                            end_date.options.minDate = $scope.dp_start;
                            $scope.dp_end=end._d.getDate()+"."+eval(end._d.getMonth()+1)+"."+end._d.getFullYear();
                            $scope.addEvents={};
                            $scope.addEvents={start_date : start, end : end};    
                        };
                        modal.show();
                    }
            }
            $scope.uiConfig = {
                calendar: {
                    header: {
                        left: 'title',
                        center: '',
                        right: 'month,agendaWeek,agendaDay,listWeek prev,next'
                    },
                    buttonIcons: {
                        prev: 'md-left-single-arrow',
                        next: 'md-right-single-arrow',
                        prevYear: 'md-left-double-arrow',
                        nextYear: 'md-right-double-arrow'
                    },
                    buttonText: {
                        today: ' ',
                        month: ' ',
                        week: ' ',
                        day: ' '
                    },
                    defaultView:'month',
                    columnFormat:'ddd',
                    allDaySlot: false,
                    allDayText: "all-day",
                    scrollTime: "06:00:00",
                    slotDuration: "00:30:00",
                    minTime: "09:00:00",
                    maxTime: "18:00:00",
                    slotEventOverlap: !0,
                    aspectRatio: 2.1,
                    defaultDate: moment(),
                    selectable: true,
                    selectHelper: true,
                    displayEventEnd:true,
                    disableResizing:true,
                    eventResize: function(event, delta, revertFunc) {
                            revertFunc();
                    },
                    eventClick: function(event){
                       uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView', 'listWeek')
                    },
                    select: function (start, end) {
                        $scope.checkValiddata(start, end);
                    },
                    eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                            UIkit.modal.confirm('Are you sure to move?', function(e) {
                                // console.log("true");
                            },function(){
                                revertFunc();
                            }, {
                                labels: {
                                    'Ok': 'Ok'
                                }
                            });
                    },
                    editable: true,
                    eventLimit: true,
                    timeFormat: '(hh:mm a)'
                }
            };

            $scope.events_list=[
            {
                course2:1,
                course2_name:"Information Technology",
                batch2:1, 
                batch2_name:'CSE A',events:[
                    { 
                        "title": "Machanical Symposium",
                        "start": "2017-04-08 09:00 AM",
                        "end": "2017-04-08 14:00 PM",
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.",
                        "_id": 1,
                        "backgroundColor":"#ff0000"
                    },
                    { 
                        "title": "Ethical Hacking Workshop", 
                        "start": "2017-03-31 09:00 AM", 
                        "end": "2017-03-31 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 2 
                    },
                    { 
                        "title": "Maths Workshop", 
                        "start": "2017-04-01 09:00 AM", 
                        "end": "2017-04-01 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 3 
                    },
                    { 
                        "title": "Science Workshop", 
                        "start": "2017-04-02 09:00 AM", 
                        "end": "2017-04-02 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 4 
                    },
                    { 
                        "title": "Social Science", 
                        "start": "2017-04-03 09:00 AM", 
                        "end": "2017-04-03 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 5 
                    }]
            },
            {
                course2:3,
                course2_name:"Mechanical Engineering",
                batch2:3, 
                batch2_name:'CSE C',events:[
                    { 
                        "title": "Applied Thermodynamics Workshop",
                        "start": "2017-04-08 09:00 AM",
                        "end": "2017-04-08 14:00 PM",
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.",
                        "_id": 1,
                        "backgroundColor":"#ff0000"
                    },
                    { 
                        "title": "English Workshop", 
                        "start": "2017-03-31 09:00 AM", 
                        "end": "2017-03-31 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 2 
                    },
                    { 
                        "title": "Maths Workshop", 
                        "start": "2017-04-01 09:00 AM", 
                        "end": "2017-04-01 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 3 
                    },
                    { 
                        "title": "Science Workshop", 
                        "start": "2017-04-02 09:00 AM", 
                        "end": "2017-04-02 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 4 
                    },
                    { 
                        "title": "Social Science Workshop", 
                        "start": "2017-04-03 09:00 AM", 
                        "end": "2017-04-03 14:00 PM", 
                        "description": "It was drinking more than thinking that drew people to the original symposia and that gave us the word symposium. The ancient Greeks would often follow a banquet with a drinking party they called a 'symposium.' That name came from 'symposium.' a verb that combines pinein, meaning 'to drink,' with the prefix syn-, meaning 'together.' Originally, English speakers only used 'symposium' to refer to such an ancient Greek party, but in the 18th century British gentlemen's clubs started using the word for gatherings in which intellectual conversation was fueled by drinking. By the 19th century, 'symposium' had gained the more sober sense we know today, describing meetings in which the focus is more on the exchange of ideas and less on imbibing.", 
                        "_id": 5 
                    }]
            }];
            $scope.calendar_events=[];
            var count=1;
            angular.forEach($scope.events_list, function(value, keys){
                angular.forEach(value.events, function(val, key){
                    val._id=count;
                    val.course_id=value.course2;
                    val.course_name=value.course2_name;
                    val.batch_id=value.batch2;
                    val.batch_name=value.batch2_name;
                    $scope.calendar_events.push(val);
                    val.eventType='News';
                    val.active="#8e24aa";
                    count++;
                    // console.log(val);
                })
            });
            $scope.eventSources = [$scope.calendar_events];
        }
    ]);


