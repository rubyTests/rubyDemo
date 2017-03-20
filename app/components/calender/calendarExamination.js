angular
    .module('altairApp')
    .controller('examination', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        function ($scope,uiCalendarConfig,$filter,$resource) {
            // masked inputs
            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            // $scope.department = ['department1', 'department2', 'department3', 'department4', 'department5', 'department6', 'department7'];
            // $scope.course = ['course1', 'course2', 'course3', 'course4', 'course5', 'course6', 'course7'];
            // $scope.batch = ['batch1', 'batch2', 'batch3', 'batch4', 'batch5', 'batch6', 'batch7'];
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
                $scope.courseArray = response;
            });
            $resource('data/calendar/courseBatch.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.batchArray = response;
            });
            $scope.department_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                valueField: 'id',
                labelField: 'dept_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value==''){
                            $scope.course=[]
                        }else{
                            $scope.course=[]
                            var data=$filter('filter')($scope.courseArray, {dept_id: value});
                            if (data.length > 0)
                                $scope.course.push(data);
                        }
                    });
                }
            };
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
            var modal = UIkit.modal("#modal_header_footer");
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            $scope.forms_advanced={
                startTime:"00:00",
                endTime:"00:00"
            };
            $scope.modelhide=function(){
                modal.hide();
                $scope.forms_advanced={
                    startTime:"00:00",
                    endTime:"00:00"
                };
                $scope.input_default="";
                $scope.forms_advanced.day="";
                $('#calendar_colors_wrapper').find('input').val("")
            }
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
            $scope.addEvent=function(){
                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                var temp_start_date=$scope.dp_start.split(".");
                // var temp_end_date=$scope.dp_end.split(".");
                var start_date=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0];
                // var end_date=temp_end_date[2]+"-"+eval(temp_end_date[1])+"-"+ temp_end_date[0];
                var startTime=$scope.forms_advanced.startTime.split(":");
                var endTime=$scope.forms_advanced.endTime.split(":");
                // console.log(parseInt($scope.forms_advanced.startTime.split(":")[1])+12);
                
                eventData = {
                    title : $scope.input_default,
                    start : moment(start_date).startOf('day').add(startTime[0], 'hours').add(startTime[1], 'minutes').format('YYYY-MM-DD HH:mm'),
                    end : moment(start_date).startOf('day').add(endTime[0], 'hours').add(endTime[0], 'minutes').format('YYYY-MM-DD HH:mm')

                };
                uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                $scope.modelhide();
                // $scope.calendar_events.push(eventData);
                // $scope.input_default="";
                // $scope.forms_advanced.startTime="";
                // $scope.forms_advanced.endTime="";
                // $('#calendar_colors_wrapper').find('input').val("")
                // console.log($scope.calendar_events,"$scope.calendar_events");
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');

            $scope.uiConfig = {
                calendar: {
                    header: {
                        left: '',
                        center: '',
                        right: 'month,agendaWeek,agendaDay,listWeek prev,next'
                    },
                    viewRender: function(view) {
                        var title = "<h1 style='font-size:24px;line-height:48px'>Examination Schedules</h1>";
                        $(".fc-left").html(title);
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
                    eventRender: function(event, element) {
                        element.bind('dblclick', function() {
                             UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                // console.log("true");
                                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                            },function(){
                            }, {
                                labels: {
                                    'Ok': 'Ok'
                                }
                            });     
                        });
                      // element.bind('dblclick', function() {
                      //    // alert('double click!');
                      //    uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                      // });
                    },
                    // eventClick: function(event){
                    //    uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                    // },
                    select: function (start, end) {
                        // console.log(start);
                        var modal = UIkit.modal("#modal_header_footer");
                        if ( modal.isActive() ) {
                            modal.hide();
                        } else {
                            $scope.dp_start=start._d.getDate()+"."+eval(start._d.getMonth()+1)+"."+start._d.getFullYear();
                            // console.log($scope.dp_start);
                            end_date.options.minDate = $scope.dp_start;
                            $scope.dp_end=end._d.getDate()+"."+eval(end._d.getMonth()+1)+"."+end._d.getFullYear();
                            $scope.addEvents={};
                            $scope.addEvents={start_date : start, end : end};
                            modal.show();
                        }
                    },
                    eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                        UIkit.modal.confirm('Are you sure?', function(e) {
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
                    disableResizing:true,
                    disableDragging:true,
                    timeFormat: '(HH)(:mm)'
                }
            };

            $scope.calendar_events = [
                {
                    title: 'Raj',
                    start: moment().startOf('month').add(25, 'days').format('YYYY-MM-DD')
                },
                {
                    title: 'Vimal',
                    start: moment().startOf('month').add(3, 'days').format('YYYY-MM-DD'),
                    end: moment().startOf('month').add(7, 'days').format('YYYY-MM-DD')
                },
                {
                    id: 999,
                    title: 'vijay',
                    start: moment().startOf('month').add(8, 'days').format('YYYY-MM-DD'),
                    // color: '#689f38'
                },
                {
                    id: 999,
                    title: 'Mani',
                    start: moment().startOf('month').add(15, 'days').format('YYYY-MM-DD'),
                    // color: '#689f38'
                },
                {
                    title: 'Karthik',
                    start: moment().startOf('day').add(14, 'hours').format('YYYY-MM-DD HH:mm'),
                    end: moment().startOf('day').add(15, 'hours').format('YYYY-MM-DD HH:mm')
                },
                {
                    title: 'vijay',
                    start: moment().startOf('month').add(14, 'days').add(10, 'hours').format('YYYY-MM-DD HH:mm'),
                    // color: '#7b1fa2'
                },
                {
                    title: 'Vinoth',
                    start: moment().startOf('day').add(11, 'hours').format('YYYY-MM-DD HH:mm'),
                    // color: '#d84315'
                },
                {
                    title: 'Vimal',
                    start: moment().startOf('day').add(8, 'hours').format('YYYY-MM-DD HH:mm'),
                    // color: '#7b1fa2'
                }
            ];

            $scope.eventSources = [$scope.calendar_events];

        }
    ]);


