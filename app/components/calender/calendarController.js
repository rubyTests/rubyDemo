angular
    .module('rubycampusApp')
    .controller('calendarCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$resource',
        '$filter',
        function ($scope, uiCalendarConfig, $resource, $filter) {
            var weeks = $scope.selectize_options = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $scope.staffData = ['Staff1', 'Staff2', 'Staff3', 'Staff4', 'Staff5', 'Staff6', 'Staff7'];
            
            // masked inputs

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            //modal

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
            $scope.forms_advanced={
                startTime:"00:00",
                endTime:"00:00"
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
            $scope.addEvent=function(){
                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                // var temp_start_date=$scope.dp_start.split(".");
                // var temp_end_date=$scope.dp_end.split(".");
                // var start_date=temp_start_date[2]+"-"+eval(temp_start_date[1])+"-"+ temp_start_date[0];
                // var end_date=temp_end_date[2]+"-"+eval(temp_end_date[1])+"-"+ temp_end_date[0];
                // var startTime=$scope.forms_advanced.startTime.split(":")[0]+"."+parseInt($scope.forms_advanced.startTime.split(":")[1])+12;
                // var endTime=$scope.forms_advanced.endTime.split(":")[0]+"."+parseInt($scope.forms_advanced.endTime.split(":")[1])+12;
                // var startTime=$scope.forms_advanced.startTime;
                // var endTime=$scope.forms_advanced.endTime;
                // console.log(parseInt($scope.forms_advanced.startTime.split(":")[1])+12);
                var day=$scope.forms_advanced.day;
                var weeks1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                eventData = {
                    title : $scope.input_default,
                    start : $scope.forms_advanced.startTime,
                    end : $scope.forms_advanced.endTime,
                    dow : [weeks1.indexOf(day)],
                    color: eventColor ? eventColor : ''

                };
                uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                $scope.modelhide();
                // uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
                // $scope.calendar_events.push(eventData);
                // console.log($scope.calendar_events,"$scope.calendar_events");
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');

            $scope.uiConfig = {
                calendar: {
                    header: {
                        left: '',
                        center: '',
                        right: 'agendaWeek,agendaDay,listWeek'
                    },
                    viewRender: function(view) {
                        var title = "<h1 style='font-size:24px;line-height:48px'>Cse First Year</h1>";
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
                    defaultView:'agendaWeek',
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
                    theme:false,
                    eventRender: function(event, element) {
                        element.bind('dblclick', function() {
                            var message;
                            if(!$scope.department1){
                                message="department";
                            }else if(!$scope.course1){
                                message="course";
                            }else if(!$scope.batch1){
                                message="batch";
                            }
                            if (!message){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    // console.log("true");
                                    uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                                },function(){
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }else{
                                UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                                },function(){
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }
                        });
                    },
                    // eventClick: function(event){
                    //    uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                    // },
                    select: function (start, end) {
                        var message;
                        if(!$scope.department1){
                            message="department";
                        }else if(!$scope.course1){
                            message="course";
                        }else if(!$scope.batch1){
                            message="batch";
                        }
                        if (!message) {
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
                        }else{
                            UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                            },function(){
                            }, {
                                labels: {
                                    'Ok': 'Ok'
                                }
                            });
                        }
                        
                    },
                    eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                        var message;
                        if(!$scope.department1){
                            message="department";
                        }else if(!$scope.course1){
                            message="course";
                        }else if(!$scope.batch1){
                            message="batch";
                        }
                        if (!message) {
                            UIkit.modal.confirm('Are you sure?', function(e) {
                                // console.log("true");
                            },function(){
                                revertFunc();
                            }, {
                                labels: {
                                    'Ok': 'Ok'
                                }
                            });
                        }else{
                            UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                                 revertFunc();
                            },function(){
                                revertFunc();
                            }, {
                                labels: {
                                    'Ok': 'Ok'
                                }
                            });
                        }
                    },
                    editable: true,
                    eventLimit: true,
                    timeFormat: '(HH)(:mm)'
                }
            };

            $scope.calendar_events = [
                {
                    title: 'Lunch',
                    start: moment().startOf('day').add(09, 'hours').format('YYYY-MM-DD HH:mm'),
                    start: moment().startOf('day').add(12, 'hours').format('YYYY-MM-DD HH:mm'),
                    color: '#d84315',
                    dow: [1,4] 
                }
            ];

            $scope.eventSources = [$scope.calendar_events];

        }
    ]);


