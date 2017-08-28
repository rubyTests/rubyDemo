angular
    .module('rubycampusApp')
    .controller('timetableviewCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$resource',
        '$filter',
        '$localStorage',
        '$http','setting_data','$stateParams','$timeout',
        function ($scope, uiCalendarConfig, $resource, $filter,$localStorage,$http,setting_data,$stateParams,$timeout) {
            console.log(setting_data,'setting_data',$stateParams);
            
            var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var srtday=weeks.indexOf(setting_data.result[0].START_DAY);
            var endday=weeks.indexOf(setting_data.result[0].END_DAY);

            var setStartDay;
            var setEndDay;

            StartDay=setting_data.result[0].START_DAY;
            EndDay = setting_data.result[0].END_DAY;
            $scope.selectize_options= [];
            $scope.selectize_options = weeks.slice(srtday, endday+1);
            var x = [0,1,2,3,4,5,6];
            x.splice(srtday, endday);
            $scope.hiddenDays = x;
            
            // masked inputs
            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            //modal
            var modal = UIkit.modal("#modal_header_footer");

            $scope.course_option=[];
            $scope.batch_option=[];
            $scope.dept_option=[];
            $scope.emp_option=[];
            $scope.employee_option=[];
            $scope.type_option=[];
                        
            $scope.type_option = ['Employee','Batch'];
            $scope.type_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Type',
                onInitialize: function(selectize){
                   	selectize.on('change', function(value) {
                   		uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                   	});
                }
            };

            $http({
                method:'GET',
                url: $localStorage.service+'TimetableAPI/getcourseList',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(courselist){
                $scope.course_option=[].concat(courselist.data.result);
            });

            $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.dept_option=[].concat(dept_data.message);
            });

            $scope.dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                   	selectize.on('change', function(value) {
                   		$scope.getEmployeeList(value);
                   	});
                    
                }
            };

            $scope.getEmployeeList=function(id){
                $http({
	                method:'get',
	                url: $localStorage.service+'AcademicsAPI/fetchTeacherDetailList',
	                params: {
	                    'id' : id
	                },
	                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.emp_option=return_data.data.data;
                });
            }

            $scope.emp_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Employee',
                valueField: 'EMP_ID',
                labelField: 'EMP_ANME',
                searchField: 'EMP_ANME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        $scope.timetableList(value);
                    });
                    
                }
            };
            $scope.timetableList=function(empid){
            	$http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/fetchTimetableList',
                    params:{'emp_id':empid},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(timetable_detail){
                	if(timetable_detail.data.status==true){
                		var test=timetable_detail.data.result;
	                    angular.forEach(test,function(value,key){
	                        var eventData = {
	                            title : value.STAFF_NAME+" - "+value.SUBJECT_NAME,
	                            start : moment(value.START_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
	                            end : moment(value.END_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
	                            dow : [weeks.indexOf(value.DAY)]

	                        };
	                        $scope.calendar_events.push(eventData);
	                    });
	                    $scope.eventSources = [].concat([$scope.calendar_events]);
	                    uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents');
                	}else {
            			uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                	}
                });
            }
            $scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        $scope.getBatchlist(value);
                    });
                    
                }
            };
            $scope.getBatchlist=function(courseid){
                $http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/getBatchList',
                    params:{'courseid':courseid},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(batchlist){
                    $scope.batch_option=[].concat(batchlist.data.result);
                });
            }
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'BATCH_DISPLAY_NAME',
                searchField: 'BATCH_DISPLAY_NAME',
                onInitialize: function(selectize){
               	selectize.on('change', function(value) {
                        $scope.getTimetableAllocation(value);
                    });
                    
                }
            };
            
            $scope.eventSources=[];
            $scope.getTimetableAllocation=function(batchvalue){
                $http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/fetchTimetableList',
                    params:{'batch':batchvalue},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(timetable_detail){
                	console.log(timetable_detail,'timetable_detail');
                	if(timetable_detail.data.status==true){
                		var test=timetable_detail.data.result;
	                    angular.forEach(test,function(value,key){
	                        var eventData = {
	                            title : value.STAFF_NAME+" - "+value.SUBJECT_NAME,
	                            start : moment(value.START_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
	                            end : moment(value.END_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
	                            dow : [weeks.indexOf(value.DAY)]

	                        };
	                        $scope.calendar_events.push(eventData);
	                    });
	                    $scope.eventSources = [$scope.calendar_events];
	                    uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents');
                	}else {
                		uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                	}
                });
            }
            
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
            
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            setStartDay = setting_data.result[0].START_TIME;
            setEndDay = setting_data.result[0].END_TIME;
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
                    firstDay:1,
                    hiddenDays: $scope.hiddenDays,
                    defaultView:'agendaWeek',
                    columnFormat:'ddd',
                    allDaySlot: false,
                    allDayText: "all-day",
                    scrollTime: "06:00:00",
                    slotDuration: "00:15:00",
                    minTime: setStartDay,
                    maxTime: setEndDay,
                    slotEventOverlap: !0,
                    aspectRatio: 2.1,
                    defaultDate: moment(),
                    selectable: false,
                    selectHelper: false,
                    theme:false,
                    // eventClick: function(event, jsEvent){
                    //     uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView', 'listWeek')
                    // },
                    editable: false,
                    eventLimit: true,
                    timeFormat: '(hh:mm a)',
                    timezone:'local'
                }
            };

            $scope.calendar_events = [];
            $scope.eventSources = [$scope.calendar_events];
            
            $timeout(function(){
                $scope.course=$stateParams.courseID;
            },200);
            $timeout(function(){
                $scope.batch=$stateParams.batchID;
            },3000);
        }
    ]);