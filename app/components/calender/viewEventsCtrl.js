angular
    .module('rubycampusApp')
    .controller('viewEventsCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$timeout','$localStorage','$http','$state','$stateParams',
        function ($scope,uiCalendarConfig,$filter,$resource, DTOptionsBuilder, DTColumnDefBuilder,$compile,$timeout,$localStorage,$http,$state,$stateParams) {

                $scope.eventSources=[];
                $scope.getEventList=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'AcademicsAPI/newsandevents',
                        params:{id:$stateParams.event_id},
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(response){
                        console.log(response.data,'response.data.message',response.data.message.status);
                        if(response.data.status==true){
                            var test=response.data.message;
                            $scope.eventSources = [];
                            angular.forEach(test,function(value,key){
                                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                                var start_dateWithTime=value.STARTDATE+" "+moment(value.STARTTIME, ["HH:mm A"]).format("HH:mm A");
                                var start_dateWithEnd=value.ENDDATE+" "+moment(value.ENDTIME, ["HH:mm A"]).format("HH:mm A");
                                // console.log(start_dateWithTime,'start_dateWithEnd',start_dateWithEnd);
                                eventData = {
                                    title : value.TITLE,
                                    start : start_dateWithTime,
                                    end : start_dateWithEnd,
                                    _id : $scope.calendar_events.length+1,
                                    eventType : $scope.eventType1,
                                    color:eventColor,
                                    batch_id:value.BATCH_ID,
                                    course_id:value.COURSE_ID,
                                    department:value.DEPT_ID,
                                    description:value.DESCRIPTION,
                                    event_id:value.ID,
                                    user_type:value.USER_TYPE
                                };
                                $scope.calendar_events.push(eventData);
                            });
                            $scope.eventSources =[].concat([$scope.calendar_events]);
                            uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                        }else {
                            $scope.calendar_events=[];
                            $scope.eventSources =[].concat([$scope.calendar_events]);
                            uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                        }
                    });
                }

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
            $scope.startTime="00:00";
            $scope.endTime="00:00";
            var modal = UIkit.modal("#modal_header_footer");
            
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
                $('#calendar_colors_wrapper').find('input').val("")
            }
            $scope.getdateobject=function(date){
                // console.log(moment(date));
                return moment(date)._d;
            }
            $scope.getEventList();
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            
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

            $scope.events_list=[];
            $scope.calendar_events=[];
            
            $scope.eventSources = [$scope.calendar_events];
        }
    ]);


