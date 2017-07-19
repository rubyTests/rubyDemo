angular
    .module('rubycampusApp')
    .controller('editTimetableCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$resource',
        '$filter',
        '$localStorage',
        '$http','setting_data','$timeout','$stateParams',
        function ($scope, uiCalendarConfig, $resource, $filter,$localStorage,$http,setting_data,$timeout,$stateParams) {
            console.log(setting_data,'setting_data');
            var sendStartTime;
            var sendEndTime;

             var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var srtday=weeks.indexOf(setting_data.result[0].START_DAY);
                var endday=weeks.indexOf(setting_data.result[0].END_DAY);
                setStarttime=setting_data.result[0].START_TIME;
                setEndtime=setting_data.result[0].END_TIME;

                $scope.TimeStart=setting_data.result[0].START_TIME;
                $scope.TimeEnd=setting_data.result[0].END_TIME;
                console.log($scope.TimeEnd, "==", $scope.TimeStart)

                StartDay=setting_data.result[0].START_DAY;
                // console.log(setting_data.result[0].START_DAY, "setting_data.result[0].START_DAY");
                EndDay = setting_data.result[0].END_DAY;
                $scope.selectize_options= [];
                // for (var i = srtday; i <= endday; i++) {
                //     $scope.selectize_options.push(weeks[i]);
                // }
                $scope.selectize_options = weeks.slice(srtday, endday+1);
                var x = [0,1,2,3,4,5,6];
                x.splice(srtday, endday);
                $scope.hiddenDays = x;
                // var hiddenDaysrendar = [];
                // for (var i = 0; i <= 6; i++) {
                //     if( srtday > i && endday < i ){
                //         $scope.selectize_options.push(weeks[i]);
                //     }else {
                //         hiddenDaysrendar.push(i);
                //     }
                // }
                // console.log($scope.selectize_options,"$scope.selectize_options");
                // $scope.selectize_options= [].concat(week_adding);
            
            // $timeout(function(){
                // var $formValidate = $('#timetable');
                // $formValidate
                // .parsley()
                // .on('form:validated',function() {
                //     $scope.$apply();
                // })
                // .on('field:validated',function(parsleyField) {
                //     if($(parsleyField.$element).hasClass('md-input')) {
                //         $scope.$apply();
                //     }
                // });    
            // })

            $scope.clearValidation=function(){
                $('#timetable').parsley().reset();
            }

            $scope.staffData = ['Staff1', 'Staff2', 'Staff3', 'Staff4', 'Staff5', 'Staff6', 'Staff7'];
            
            // masked inputs
            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            //modal
            // var modal = UIkit.modal("#modal_header_footer");
            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});

            $scope.course_option=[];
            $scope.batch_option=[];
            $scope.subject_option=[];
            $scope.employee_option=[];
            
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            var setStarttime;
            var setEndtime;
            var setStartDay;
            var setEndDay;

            // $http({
            //     method:'GET',
            //     url: $localStorage.service+'TimetableAPI/timetableSetting',
            //     headers:{'access_token':$localStorage.access_token}
            // }).then(function(response){
            //     var weeks1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            //     var srtday=weeks1.indexOf(response.data.result[0].START_DAY);
            //     var endday=weeks1.indexOf(response.data.result[0].END_DAY);
            //     setStarttime=response.data.result[0].START_TIME;
            //     setEndtime=response.data.result[0].END_TIME;
            //     setStartDay=response.data.result[0].START_DAY;
            //     setEndDay = response.data.result[0].END_DAY;
            //     var week_adding=[];
            //     for (var i = srtday; i <= endday; i++) {
            //         week_adding.push(weeks1[i]);
            //     }
            //     $scope.selectize_options= [].concat(week_adding);
            // });

            $http({
                method:'GET',
                url: $localStorage.service+'TimetableAPI/getcourseList',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(courselist){
                console.log(courselist.data.result,'courselist');
                $scope.course_option=[].concat(courselist.data.result);
            });

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
                        $scope.getSubject(value);
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
                    // console.log(batchlist.data.result,'batchlist');
                    $scope.batch_option=[].concat(batchlist.data.result);
                });
            }
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                            $scope.getTimetableAllocation(value);
                        });
                    
                }
            };

            $scope.getSubject=function(courseid){
                $http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/getSubjectList',
                    params:{'courseid':courseid},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(subjectlist){
                    console.log(subjectlist.data.result,'subjectlist');
                    $scope.subject_option=[].concat(subjectlist.data.result);
                });
            }

            $scope.subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Subject',
                valueField: 'SUBJECT_ID',
                labelField: 'SUBJECT_NAME',
                searchField: 'SUBJECT_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.getStaffList(value);
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
                    console.log(timetable_detail.data,'timetable_detailtimetable_detail');
                    var test=timetable_detail.data.result;
                    angular.forEach(test,function(value,key){
                        var eventData = {
                            title : value.STAFF_NAME+" - "+value.SUBJECT_NAME,
                            start : moment(value.START_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
                            end : moment(value.END_TIME, ["HH:mm:ss"]).format("HH:mm:ss"),
                            dow : [weeks.indexOf(value.DAY)],
                            courseid:value.COURSE_ID,
                            batchid:value.BATCH_ID,
                            tableid:value.ID,
                            profileid:value.PROFILE_ID,
                            setDays:value.DAY,
                            subjectid:value.SUBJECT_ID,
                            starttime:value.START_TIME,
                            endtime:value.END_TIME
                        };
                        $scope.calendar_events.push(eventData);
                    });
                    $scope.eventSources = [$scope.calendar_events];
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                });
            }


            $scope.getStaffList=function(subjectid){
                $http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/getEmployeelistList',
                    params:{'subjectid':subjectid},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(employee_list){
                    console.log(employee_list.data.result,'employee_list');
                    $scope.employee_option=[].concat(employee_list.data.result);
                });
            }

            $scope.employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Staff',
                valueField: 'PROF_ID',
                labelField: 'EMPLOYEE_NAME',
                searchField: 'EMPLOYEE_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        // $scope.getStaffList(value);
                    });
                    
                }
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
            $scope.updateTimetable=function(){
                $http({
                    method:'GET',
                    url: $localStorage.service+'TimetableAPI/timetableDetails',
                    params:{
                        'employee_id':$scope.employee_id,
                        'setday':$scope.day,
                        // 'starttime':moment($scope.startTime, ["hh:mm A"]).format("HH:mm"),
                        // 'endtime':moment($scope.endTime, ["hh:mm A"]).format("HH:mm")
                        'starttime':moment($scope.startTimeData1, ["hh:mm A"]).format("HH:mm:ss"),
                        'endtime':moment($scope.endTimeData1, ["hh:mm A"]).format("HH:mm:ss")
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,'response');
                    if(response.data.status==true){
                        UIkit.modal.confirm('Timetable Already created', function(e) {
                        },function(){
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }else {
                        // console.log($scope.startTime,'$scope.startTime-',$scope.endTime,'$scope.endTime');
                        // var st_time=moment($scope.startTime, ["hh:mm A"]).format("HH:mm");
                        // var end_times=moment($scope.endTime, ["hh:mm A"]).format("HH:mm");
                        // console.log(st_time,'st_time-',end_times,'end_times');
                        $http({
                            method:'POST',
                            url: $localStorage.service+'TimetableAPI/timetableDetails',
                            data:{
                                'tableid':$scope.table_id,
                                'course_id':$scope.course,
                                'batch_id':$scope.batch,
                                'subject_id':$scope.subject,
                                'employee_id':$scope.employee_id,
                                'day':$scope.day,
                                'starttime':moment($scope.startTimeData1, ["hh:mm A"]).format("HH:mm:ss"),
                                'endtime':moment($scope.endTimeData1, ["hh:mm A"]).format("HH:mm:ss")
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).then(function(response){
                            console.log(response,'response');
                            if(response.data.message.status==true){
                                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                                var day=$scope.day;
                                var weeks1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                var s = new Date();
                                eventData = {
                                    title : $scope.subject,
                                    start : moment($scope.startTimeData1, ["hh:mm A"]).format("hh:mm"),
                                    end : moment($scope.endTimeData1, ["hh:mm A"]).format("hh:mm"),
                                    dow : [weeks1.indexOf(day)],
                                    color: eventColor ? eventColor : ''

                                };
                                uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                                $scope.modelhide();
                            }
                        });
                    }
                });

                


                // var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                // var day=$scope.day;
                // var weeks1 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                //  var s = new Date();
                // eventData = {
                //     title : $scope.subject,
                //     start : moment($scope.startTime, ["hh:mm A"]).format("hh:mm"),
                //     end : moment($scope.endTime, ["hh:mm A"]).format("hh:mm"),
                //     dow : [weeks1.indexOf(day)],
                //     color: eventColor ? eventColor : ''

                // };
                // uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                // $scope.modelhide();
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            setStartDay = setting_data.result[0].START_TIME;
            setEndDay = setting_data.result[0].END_TIME;
            console.log(setStartDay,"setEndDay",setEndDay,"setEndDay");
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
                    selectable: true,
                    selectHelper: true,
                    theme:false,
                    eventClick: function(event, jsEvent){
                        // uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView', 'listWeek')
                        // console.log(event,'event');
                        $scope.endTimeData1 = moment(event.endtime,["HH:mm:ss"]).format("hh:mm A");
                        $scope.startTimeData1 = moment(event.starttime,["HH:mm:ss"]).format("hh:mm A");
                        // alert(event.starttime);
                        $scope.table_id=event.tableid;
                        $scope.employee_id=event.profileid;
                        $scope.subject=event.subjectid;
                        $scope.day=event.setDays;
                        modal.show();                        
                        // console.log($scope.setTimeEnd,"$scope.setTimeEnd");
                        // $scope.endTime=event.end._d;
                        // $scope.$apply();
                    },
                    // eventRender: function(event, element) {
                    //     element.bind('dblclick', function() {
                    //         var message;
                    //         if(!$scope.department1){
                    //             message="department";
                    //         }else if(!$scope.course1){
                    //             message="course";
                    //         }else if(!$scope.batch1){
                    //             message="batch";
                    //         }
                    //         if (!message){
                    //             UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                    //                 // console.log("true");
                    //                 uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                    //             },function(){
                    //             }, {
                    //                 labels: {
                    //                     'Ok': 'Ok'
                    //                 }
                    //             });
                    //         }else{
                    //             UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                    //             },function(){
                    //             }, {
                    //                 labels: {
                    //                     'Ok': 'Ok'
                    //                 }
                    //             });
                    //         }
                    //     });
                    // },
                    // eventClick: function(event){
                    //    uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents',event._id);
                    // },
                    select: function (start, end) {
                        // alert();
                        // var message;
                        // if(!$scope.course){
                        //     message="course";
                        // }else if(!$scope.batch){
                        //     message="batch";
                        // }
                        // if (!message) {
                        //     var modal = UIkit.modal("#modal_header_footer");
                        //     if ( modal.isActive() ) {
                        //         modal.hide();
                        //     } else {
                        //         // $scope.forms_advanced.day = [weeks[start._d.getDay()].value];
                        //         // $scope.dp_start=start._d.getDate()+"."+eval(start._d.getMonth()+1)+"."+start._d.getFullYear();
                        //         // end_date.options.minDate = $scope.dp_start;
                        //         // $scope.forms_advanced.startTime = moment(start._d).format("hh:mm A");
                        //         // $scope.dp_end=end._d.getDate()+"."+eval(end._d.getMonth()+1)+"."+end._d.getFullYear();
                        //         // $scope.addEvents={};
                        //         // $scope.addEvents={start_date : start, end : end};
                        //         // modal.show();

                        //         $scope.day=StartDay;
                        //         $scope.startTime=moment(setStarttime, ["hh:mm A"]).format("hh:mm A");
                        //         $scope.endTime=moment(setEndtime, ["hh:mm A"]).format("hh:mm A");
                        //         sendStartTime=$scope.startTime;
                        //         modal.show();
                        //     }    
                        // }else{
                        //     UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                        //     },function(){
                        //     }, {
                        //         labels: {
                        //             'Ok': 'Ok'
                        //         }
                        //     });
                        // }
                        
                    },
                    eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                        revertFunc();
                    },
                    // eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) {
                    //     var message;
                    //     if(!$scope.course){
                    //         message="course";
                    //     }else if(!$scope.batch){
                    //         message="batch";
                    //     }
                    //     if (!message) {
                    //         UIkit.modal.confirm('Are you sure?', function(e) {
                    //             // console.log("true");
                    //         },function(){
                    //             revertFunc();
                    //         }, {
                    //             labels: {
                    //                 'Ok': 'Ok'
                    //             }
                    //         });
                    //     }else{
                    //         UIkit.modal.confirm('Please select '+message+' ?', function(e) {
                    //              revertFunc();
                    //         },function(){
                    //             revertFunc();
                    //         }, {
                    //             labels: {
                    //                 'Ok': 'Ok'
                    //             }
                    //         });
                    //     }
                    // },
                    editable: true,
                    eventLimit: true,
                    timeFormat: '(hh:mm a)',
                    timezone:'local'
                }
            };

            $scope.calendar_events = [
                // {
                //     title: 'Lunch',
                //     start: moment().startOf('day').add(09, 'hours').format('HH:mm:ss'),
                //     end: moment().startOf('day').add(12, 'hours').format('HH:mm:ss'),
                //     color: '#d84315',
                //     dow: [1,4] 
                // }
            ];


            $timeout(function(){
                $scope.course=$stateParams.courseID;
            },200);
            $timeout(function(){
                $scope.batch=$stateParams.batchID;
            },3000);


            $scope.eventSources = [$scope.calendar_events];

            $scope.openTimetableModel=function(){
                // $scope.course;
                // $scope.batch;
                // UIkit.modal("#modal_header_footer").show();

                $scope.subject='';
                $scope.employee_id='';
                $scope.day=null;
                $scope.startTime='';
                $scope.endTime='';
                if($scope.startTime==''){
                    $scope.disabledVal='true';
                }else {
                    $scope.disabledVal='false';
                }

                var message;
                        if(!$scope.course){
                            message="course";
                        }else if(!$scope.batch){
                            message="batch";
                        }
                        if (!message) {
                            var modal = UIkit.modal("#modal_header_footer");
                            if ( modal.isActive() ) {
                                modal.hide();
                            } else {
                                $scope.day=StartDay;
                                $scope.startTime=moment(setStarttime, ["hh:mm A"]).format("hh:mm A");
                                $scope.endTime=moment(setEndtime, ["hh:mm A"]).format("hh:mm A");
                                sendStartTime=$scope.startTime;
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
            }
        }
    ])
    // .directive('ngRestrictTime', function(){
    //     return{
    //         restrict:'C',
    //         scope:true
    //     }
    // })
    .directive('checkStartTime',function(){
        return{
                restrict:"E",
                // scope:true,
                scope:{
                    'startTimeData':'=',
                    'endTimeData':'=',
                    'setTimeStart':'=',
                    'setTimeEnd':'='
                },
                // require: 'ngModel',
                templateUrl:'app/components/academics/timetable/startTimeTemplate.html',
                controller:function($scope){
                   
                    $scope.checkValidData = function(){
                        var minTime = moment($scope.setTimeStart,["HH:mm:ss"])._d;
                        var maxTime = moment($scope.setTimeEnd,["HH:mm:ss"])._d;
                        $scope.endTimeData1 = $scope.endTimeData || $scope.setTimeEnd;
                        // alert($scope.endTimeData);
                        var endTime = moment($scope.endTimeData1,["hh:mm A"])._d;
                        var currentTime = $scope.startTimeData;
                        $scope.startTimeData = currentTime;
                        currentTime = moment(currentTime,["hh:mm A"])._d;
                        console.log($scope.setTimeStart,"currentTime");
                        
                        console.log(minTime, "===", currentTime,"datadatadata");
                        if (minTime.getTime() <= currentTime.getTime()  && currentTime.getTime() <= maxTime.getTime() && currentTime.getTime() < endTime.getTime()) {
                            console.log(currentTime,"correct");
                        }else{
                            $scope.startTimeData="";
                            console.log(currentTime,"wrong");
                        }
                    }
                },
                link:function($scope, element, attr){
                    element.find('input').inputmask();
                    $scope.$watch('startTimeData',function(newVal, oldVal){
                        var currentTime = moment(newVal,["HH:mm:ss"]).format("hh:mm A");
                        $scope.startTimeData1=currentTime;
                    });
                }
            }
    })
    .directive('checkEndTime',function(){
        return{
            restrict:"E",
            // scope:true,
            scope:{
                    'startTimeData':'=',
                    'endTimeData':'=',
                    'setTimeStart':'=',
                    'setTimeEnd':'='
                },
            // require: 'ngModel',
            templateUrl:'app/components/academics/timetable/endTimeTemplate.html',
            controller:function($scope){
                $scope.checkValidData = function(){
                    var currentTime = $scope.endTimeData;
                    $scope.endTimeData = currentTime;
                    var data = moment(currentTime,["hh:mm A"])._d;
                    var startTime = moment($scope.startTimeData,["hh:mm A"])._d;

                    var minTime = moment($scope.setTimeStart,["HH:mm:ss"])._d;
                    var maxTime = moment($scope.setTimeEnd,["HH:mm:ss"])._d;
                    console.log(minTime, "===", data,"datadatadata");
                    if (minTime.getTime() <= data.getTime()  && data.getTime() <= maxTime.getTime() && data.getTime() > startTime.getTime()) {
                        console.log(currentTime,"correct");
                    }else{
                        $scope.endTimeData = "";
                        console.log(currentTime,"wrong");
                    }
                }
            },
            link:function($scope, element, attr){
                element.find('input').inputmask();
                $scope.$watch('endTimeData',function(newVal, oldVal){
                    var currentTime = moment(newVal,["HH:mm:ss"]).format("hh:mm A");
                    $scope.endTimeData1=currentTime;
                });
            }
        }
    })

