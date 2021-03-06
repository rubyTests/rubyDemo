angular
    .module('rubycampusApp')
    .controller('newsandEventsCtrl', [
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

                $scope.eventSources=[];
                $scope.getEventList=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'AcademicsAPI/newsandevents',
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
                $scope.course.push([{ID:allCourseID,NAME:"All Course"}]);
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
                    });
                    
                }
            };

            $scope.fetchBatch=function(id){
                $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                .success(function(batch_data){
                    $scope.batch=[].concat(batch_data.data);
                    var allBatchID=[];
                    angular.forEach(batch_data.data,function(value,key){
                        allBatchID.push(value.ID);
                    });
                    $scope.batch.push([{ID:allBatchID,NAME:"All Batch"}]);
                });
            }

            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME'
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
                $('#calendar_colors_wrapper').find('input').val("")
            }
            $scope.getdateobject=function(date){
                // console.log(moment(date));
                return moment(date)._d;
            }
            $scope.getEventList();
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            // $scope.addEvent=function(){
            //     var strDate=$scope.dp_start.split(".");
            //     var setStartDate=strDate[2]+"-"+strDate[1]+"-"+ strDate[0];
            //     var endDate1=$scope.dp_end.split(".");
            //     var setEndDate=endDate1[2]+"-"+endDate1[1]+"-"+ endDate1[0];
            //     $http({
            //         method:'POST',
            //         url: $localStorage.service+'AcademicsAPI/newsandevents',
            //         data:{
            //             'event_id':$scope.event_id,
            //             'usertype':$scope.usertype,
            //             'department_id':$scope.department,
            //             'course_id':$scope.course_id,
            //             'batch_id':$scope.batch_id,
            //             'title':$scope.title,
            //             'description':$scope.description,
            //             'start_date':setStartDate,
            //             'end_date':setEndDate,
            //             'starttime':moment($scope.startTime, ["hh:mm A"]).format("HH:mm"),
            //             'endtime':moment($scope.endTime, ["hh:mm A"]).format("HH:mm")
            //         },
            //         headers:{'access_token':$localStorage.access_token}
            //     }).then(function(response){
            //         // if(response.data.message.status==true){
            //             $scope.modelhide();
            //             $scope.title='';
            //             $scope.usertype='';
            //             $scope.department='';
            //             $scope.course_id='';
            //             $scope.batch_id='';
            //             $scope.description='';
            //             uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEventSources');  
            //             $scope.getEventList();
            //         // }                
            //     });
            // }
            // $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            // }
            $scope.deleteEvent=function(CurrID,$index){
                console.log(CurrID,'CurrID');
                if(CurrID){
                    var id=CurrID;
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"AcademicsAPI/newsandevents",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function(response) {
                                    if(response.data.status==true){
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                        $scope.calendar_events.splice($index, 1);
                                        uiCalendarConfig.calendars.myCalendar.fullCalendar('rerenderEvents');
                                        $scope.getEventList();
                                    }                                
                                })
                            }
                        },function(){
                             //console.log("false");
                            $scope.getEventList();
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
            }
            $scope.checkValiddata=function(start, end){
                $state.go('restricted.plugins.createEvents');
                    // $scope.eventType1="";
                    // $scope.dp_start= '';
                    // $scope.dp_end= '';
                    // $scope.startTime="00:00 am";
                    // $scope.endTime="00:00 am";
                    // $scope.description="";
                    // $scope.department="";
                    // $scope.course_id="";
                    // $scope.batch_id="";
                    // $scope.usertype="";
                    // $scope.event_id='';
                    // $scope.title="";
                    // if ( modal.isActive() ) {
                    //     modal.hide();
                    // } else {
                    //     if (start || end) {

                    //         var year=start._d.getFullYear();
                    //         var month=eval(start._d.getMonth()+1);
                    //         var day=start._d.getDate();
                    //         if (month<10){
                    //             month="0" + month;
                    //         }else{
                    //             month= month;
                    //         };
                    //         if (day<10){
                    //             dayNew="0" + day;
                    //         }else{
                    //             dayNew = day;
                    //         };

                    //         var end_year=end._d.getFullYear();
                    //         var end_month=eval(end._d.getMonth()+1);
                    //         var end_day=end._d.getDate();
                    //         if (end_month<10){
                    //             end_month="0" + end_month;
                    //         }else{
                    //             end_month= end_month;
                    //         };
                    //         if (end_day<10){
                    //             end_dayNew="0" + end_day;
                    //         }else{
                    //             end_dayNew = end_day;
                    //         };


                    //         $scope.dp_start=dayNew + "." + month + "." + year;
                    //         end_date.options.minDate = $scope.dp_start;
                    //         $scope.dp_end=end_dayNew + "." + end_month + "." + end_year;
                    //         $scope.addEvents={};
                    //         $scope.addEvents={start_date : start, end : end};
                    //     };
                    //     modal.show();
                    // }
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
                    timeFormat: '(hh:mm a)',
                    timezone:'local'
                }
            };

            $scope.events_list=[];
            $scope.calendar_events=[];
            // var count=1;
            // angular.forEach($scope.events_list, function(value, keys){
            //     angular.forEach(value.events, function(val, key){
            //         val._id=count;
            //         val.course_id=value.course2;
            //         val.course_name=value.course2_name;
            //         val.batch_id=value.batch2;
            //         val.batch_name=value.batch2_name;
            //         $scope.calendar_events.push(val);
            //         val.eventType='News';
            //         val.active="#8e24aa";
            //         count++;
            //         // console.log(val);
            //     })
            // });
            $scope.eventSources = [$scope.calendar_events];
        }
    ]);


