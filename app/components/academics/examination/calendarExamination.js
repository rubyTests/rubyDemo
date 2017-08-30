angular
    .module('rubycampusApp')
    .controller('examination', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$timeout','$localStorage','$http','$state',
        function ($scope,uiCalendarConfig,$filter,$resource, DTOptionsBuilder, DTColumnDefBuilder,$compile,$timeout,$localStorage,$http,$state) {
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
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Name'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Date'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('From'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('To'),
                    DTColumnDefBuilder.newColumnDef(3).withTitle('Action'),

                ];

                var $formValidate = $('#form_validation');
                $formValidate
                .parsley()
                .on('form:validated',function() {
                    // $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        // $scope.$apply();
                    }
                });

                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }

                $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(data){
                $scope.course = data.message;
            });
            $scope.fetchBatch=function(id){
                $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                .success(function(batch_data){
                    $scope.batchArray=batch_data.data;
                    $scope.batch=batch_data.data;
                });
            }
            
            $scope.getSub_id = [];
            $scope.fetchSubject=function(id){
                $http({
                method:'get',
                url: $localStorage.service+'AcademicsAPI/fetchSubjectDetailList',
                params:{id:id},
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.getSub_id.push(return_data.data.data);
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

                    });
                    
                }
            };
            
            $scope.get_id = [];
            $http({
            method:'get',
            url: $localStorage.service+'ExamAPI/setTerm',
            headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.get_id.push(return_data.data.message);
            });

            $scope.selectize_term_options = $scope.get_id;
            $scope.selectize_term_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Term',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                       $scope.fetchExamList(value);    
                    });
                }
            };

            $scope.fetchExamList=function(id){  
                $http({
                    method:'get',
                    url: $localStorage.service+'ExamAPI/examListBasedonTerms',
                    params:{termid:id},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.selectize_exam_options = [].concat(return_data.data.message);
                });
            }


            $scope.selectize_exam_options = [];
            $scope.selectize_exam_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Exam',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(val){
                    //console.log(val);
                }
            };
            
            $scope.selectize_subject_options = $scope.getSub_id;
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Subject',
                valueField: 'COU_ID',
                labelField: 'COURSE_NAME',
                onInitialize: function(val){
                    
                }
            };



                $scope.eventSources=[];
                $scope.getExamList=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'ExamAPI/setExamination',
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(response){
                        console.log(response.data,'response.data.message');
                        if(response.data.status==true){
                            var test=response.data.message;
                            $scope.eventSources = [];
                            // $scope.calendar_events=[];
                            angular.forEach(test,function(value,key){
                                var eventData,eventColor = $('#calendar_colors_wrapper').find('input').val();
                                var start_dateWithTime=value.DATE+" "+moment(value.START_TIME, ["HH:mm A"]).format("HH:mm A");
                                var start_dateWithEnd=value.DATE+" "+moment(value.END_TIME, ["HH:mm A"]).format("HH:mm A");
                                eventData = {
                                    title : value.TERM_NAME,
                                    start : start_dateWithTime,
                                    end : start_dateWithEnd,
                                    _id : $scope.calendar_events.length+1,
                                    color:eventColor,
                                    exam_name:value.EXAM_NAME,
                                    course_name:value.COURSE_NAME,
                                    batch_name:value.BATCH_NAME,
                                    subject_name:value.SUBJECT_NAME,
                                    table_id:value.ID,
                                    course_id:value.COURSE_ID,
                                    batch_id:value.COURSEBATCH_ID,
                                    term_id:value.SETTERM_ID,
                                    exam_id:value.CREATEEXAM_ID,
                                    subject_id:value.SUBJECT_ID,
                                    pass_mark:value.PASS_MARK,
                                    max_mark:value.MAX_MARK,
                                    dum_startTime:value.START_TIME,
                                    dum_endTime:value.END_TIME
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

            $scope.eventType=['News', 'Event'];
            var modal = UIkit.modal("#modal_header_footer");

            $scope.department=[];
            $scope.course = [];
            $scope.batch = [];
            
            $scope.user=['Student','Employee'];
            $scope.user_config = {
                create: false,
                maxItems: 1,
                placeholder:'User Type',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        console.log(value,'valuevalue');
                        $scope.course_id='';
                        $scope.department='';
                    });
                    
                }
            };
            
            $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(data){
                $scope.course = data.message;
                var allCourseID=[];
                angular.forEach(data.message,function(value,key){
                    allCourseID.push(value.ID);
                });
                console.log(allCourseID.length,'allCourseID');
            });


           
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        console.log(value,'dept-value');
                    });
                    
                }
            };
            $scope.selectize_dept_options=[];
            $http.get($localStorage.service+'AcademicsAPI/departmentDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                console.log(dept_data,'dept_data');
                $scope.selectize_dept_options=[].concat(dept_data.message);
                var allDeptID=[];
                angular.forEach(dept_data.message,function(value,key){
                    allDeptID.push(value.ID);
                });
                $scope.selectize_dept_options.push([{ID:allDeptID,NAME:"All Department"}]);
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
                        $scope.fetchBatch(value);
                        $scope.fetchSubject(value);
                    });
                    
                }
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
                format:'DD-MMM-YYYY'
            });

            var end_date = UIkit.datepicker($dp_end, {
                format:'DD-MMM-YYYY'
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
            $scope.getExamList();
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            $scope.addExam=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'ExamAPI/setExamination',
                    data:{
                        'id':$scope.id,
                        'batch_id':$scope.batch_id,
                        'subject_id':$scope.subject_id,
                        'exam_id':$scope.exam_id,
                        'passMark':$scope.passMark,
                        'maxMark':$scope.maxMark,
                        'exam_date':$scope.dp_start,
                        'starttime':moment($scope.startTime, ["hh:mm A"]).format("HH:mm"),
                        'endtime':moment($scope.endTime, ["hh:mm A"]).format("HH:mm")
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,'ressssss');
                    if(response.data.status==true){
                        $scope.modelhide();
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSources');  
                        UIkit.notify({
                            message : 'Record created successfully',
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.getExamList();
                    }                
                });
            }
            // $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            // }


            $scope.editExam=function(event){
                if (typeof event!="undefined"){
                    $scope.dp_start= $filter('date')(new Date(event.start.split(" ")[0]), "dd-MMM-yyyy");
                    $scope.id=event.table_id;
                    $scope.course_id=event.course_id;
                    $scope.batch_id=event.batch_id;
                    $scope.term_id=event.term_id;
                    $scope.exam_id=event.exam_id;
                    // $scope.subject_id=event.subject_id;
                    $scope.passMark=event.pass_mark;
                    $scope.maxMark=event.max_mark;
                    $scope.startTime=moment(event.dum_startTime, ["HH:mm A"]).format("HH:mm A");
                    $scope.endTime=moment(event.dum_endTime, ["HH:mm A"]).format("HH:mm A");
                    modal.show();
                    $timeout(function(){
                        $scope.subject_id=event.subject_id;
                    },800);
                    // if (modal.isActive() ) {
                    //     modal.hide();
                    // } else {
                    //     modal.show();
                    // }
                }
            }


            $scope.deleteEvent=function(CurrID,$index){
                console.log(CurrID,'CurrID');
                if(CurrID){
                    var id=CurrID;
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"ExamAPI/setExamination",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function(response) {
                                    console.log(response,'delete');
                                    if(response.data.status==true){
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                        $scope.calendar_events.splice($index, 1);
                                        $scope.calendar_events=[];
                                        uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                                        $scope.getExamList();
                                    }                                
                                })
                            }
                        },function(){
                             //console.log("false");
                            $scope.getExamList();
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
            }
            $scope.checkValiddata=function(start, end){
                    $scope.id="";
                    $scope.dp_start= '';
                    $scope.startTime="00:00 am";
                    $scope.endTime="00:00 am";
                    $scope.term_id="";
                    $scope.course_id="";
                    $scope.batch_id="";
                    $scope.subject_id="";
                    $scope.passMark='';
                    $scope.maxMark="";
                    if ( modal.isActive() ) {
                        modal.hide();
                    } else {
                        if (start || end) {

							var monthNames = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
						
                            var year=start._d.getFullYear();
                            // var month=eval(start._d.getMonth()+1);
                            var month=monthNames[start._d.getMonth()+1];
                            var day=start._d.getDate();
                            if (month<10){
                                month="0" + month;
                            }else{
                                month= month;
                            };
                            if (day<10){
                                dayNew="0" + day;
                            }else{
                                dayNew = day;
                            };

                            var end_year=end._d.getFullYear();
							var end_month=monthNames[end._d.getMonth()+1];
                            var end_day=end._d.getDate();
                            if (end_month<10){
                                end_month="0" + end_month;
                            }else{
                                end_month= end_month;
                            };
                            if (end_day<10){
                                end_dayNew="0" + end_day;
                            }else{
                                end_dayNew = end_day;
                            };


                            $scope.dp_start=dayNew + "-" + month + "-" + year;
                            end_date.options.minDate = $scope.dp_start;
                            $scope.dp_end=end_dayNew + "-" + end_month + "-" + end_year;
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

            $scope.events_list=[];
            $scope.calendar_events=[];
            $scope.eventSources = [$scope.calendar_events];
        }
    ]);


