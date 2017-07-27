angular
    .module('rubycampusApp')
    .controller('editEventsCtrl', [
        '$scope',
        'uiCalendarConfig',
        '$filter',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$compile',
        '$timeout','$localStorage','$http','$state','$stateParams',
        function ($scope,uiCalendarConfig,$filter,$resource, DTOptionsBuilder, DTColumnDefBuilder,$compile,$timeout,$localStorage,$http,$state,$stateParams) {
            console.log($stateParams.event_id,'event_id');
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

            $http({
                method:'GET',
                url: $localStorage.service+'AcademicsAPI/newsandevents',
                params:{id:$stateParams.event_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(response){
                $scope.event_id=response.data.message[0].ID;
                $scope.usertype=response.data.message[0].USER_TYPE;
                $scope.title=response.data.message[0].TITLE;
                $scope.description=response.data.message[0].DESCRIPTION;
                $scope.dp_start=$filter('date')(new Date(response.data.message[0].STARTDATE.split(" ")[0]), "dd.MM.yyyy");
                $scope.dp_end=$filter('date')(new Date(response.data.message[0].ENDDATE.split(" ")[0]), "dd.MM.yyyy");
                $scope.startTime=moment(response.data.message[0].STARTTIME, ["HH:mm A"]).format("HH:mm A");
                $scope.endTime=moment(response.data.message[0].ENDTIME, ["HH:mm A"]).format("HH:mm A")
                $timeout(function(){
                    $scope.department=response.data.message[0].DEPT_ID;
                    $scope.course_id=response.data.message[0].COURSE_ID;
                    $scope.batch_id=response.data.message[0].BATCH_ID;
                },200);
            });

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
            
            $scope.user=['Student','Employee','All'];
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
            var allCourseID=[];
            $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(data){
                $scope.course = data.message;
                angular.forEach(data.message,function(value,key){
                    allCourseID.push(value.ID);
                });
                console.log(allCourseID.length,'allCourseID');
                $scope.course.push([{ID:allCourseID,NAME:"All Course"}]);
            });


           
            $scope.selectize_dept_config = {
                create: false,
                maxItems: null,
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
            var allDeptID=[];
            $http.get($localStorage.service+'AcademicsAPI/departmentDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.selectize_dept_options=[].concat(dept_data.message);
                angular.forEach(dept_data.message,function(value,key){
                    allDeptID.push(value.ID);
                });
                $scope.selectize_dept_options.push([{ID:allDeptID,NAME:"All Department"}]);
            });

            $scope.course_config = {
                create: false,
                maxItems: null,
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

            var allBatchID=[];
            $scope.fetchBatch=function(id){
                $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                .success(function(batch_data){
                    $scope.batch=[].concat(batch_data.data);
                    angular.forEach(batch_data.data,function(value,key){
                        allBatchID.push(value.ID);
                    });
                    $scope.batch.push([{ID:allBatchID,NAME:"All Batch"}]);
                });
            }

            $scope.batch_config = {
                create: false,
                maxItems: null,
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
                return moment(date)._d;
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
            $scope.editEvent=function(){
                var strDate=$scope.dp_start.split(".");
                var setStartDate=strDate[2]+"-"+strDate[1]+"-"+ strDate[0];
                var endDate1=$scope.dp_end.split(".");
                var setEndDate=endDate1[2]+"-"+endDate1[1]+"-"+ endDate1[0];
                $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/newsandevents',
                    data:{
                        'event_id':$scope.event_id,
                        'usertype':$scope.usertype,
                        'department_id':$scope.department,
                        'course_id':$scope.course_id,
                        'batch_id':$scope.batch_id,
                        'title':$scope.title,
                        'description':$scope.description,
                        'start_date':setStartDate,
                        'end_date':setEndDate,
                        'starttime':moment($scope.startTime, ["hh:mm A"]).format("HH:mm"),
                        'endtime':moment($scope.endTime, ["hh:mm A"]).format("HH:mm")
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    if(response.data.message.status==true){
                        $state.go('restricted.plugins.events');
                    }                
                });
            }
            $scope.calendarColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');
        }
    ]);


