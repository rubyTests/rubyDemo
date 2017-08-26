angular
    .module('rubycampusApp')
    .controller('addAllocationCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$filter',
        '$http',
        '$state',
        '$rootScope',
        '$localStorage',
        function ($scope, $window, $timeout,$filter, $http, $state, $rootScope, $localStorage) {
            var $formValidate = $('#form_validation');
            $formValidate
                .parsley()
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });

                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }
                var date = new Date();
                $scope.reg_date=$filter('date')(date,'dd-MMM-yyyy');
                $timeout(function(){
                    // date range
                    var $dp_end = $('#uk_dp_end');

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'DD-MMM-YYYY'
                    });
                    $dp_end.on('change',function() {
                        start_date.options.minDate = $dp_end.val();
                    });
                },100);
            $scope.btnStatus="Save";
            $scope.selectize_usertype_options = ['Student','Employee'];
            $scope.selectize_usertype_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Resident',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                    
                    });
                }
            };
                $scope.deptData=[];
                $scope.course_data=[];
                $scope.batch_data=[];
            
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(dept_data){
                    $scope.deptData.push(dept_data.message);
                });
                
                $scope.selectize_deptId_options =$scope.deptData;
                $scope.selectize_deptId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Department',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getEmployeeList(value);
                        });
                    }
                };
                $scope.getEmployeeList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelEmployeeDetail',
                    params: {
                        'deptId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.result,'return_datareturn_data');
                        $scope.selectize_employee_options=return_data.data.result;
                    });
                }
                $scope.selectize_employee_options =[];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Employee',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                        });
                    }
                };
                $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
                .success(function(course_data){
                    console.log(course_data,'course_data');
                    $scope.selectize_courseId_options=course_data.message;
                });
                
                $scope.selectize_courseId_options =[];
                $scope.selectize_courseId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.batchData(value);
                        });
                    }
                };
                
                $scope.batchData=function(id){
                    $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                    .success(function(batch_data){
                        $scope.selectize_batchId_options=batch_data.data;
                    });
                }
                
                $scope.selectize_batchId_options =[];
                $scope.selectize_batchId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Batch',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            //console.log(value);
                            $scope.getStudentList(value);
                        });
                    }
                };
                 $scope.getStudentList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelStudentDetail',
                    params: {
                        'batchId' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        //console.log(return_data,'return_data11');
                        $scope.selectize_student_options=return_data.data.result;
                    });
                }
                
                $scope.selectize_student_options =[];
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Student',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                        });
                    }
                };
                // $scope.empName =[];
                // $http.get($localStorage.service+'EmployeemgmntAPI/employeeProfileView',{headers:{'access_token':$localStorage.access_token}})
                // .success(function(user_data){
                //     $scope.empName.push(user_data.data);
                // });
                // $scope.selectize_employee_options =$scope.empName;
                // $scope.selectize_employee_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Employee',
                //     valueField: 'PROFILE_ID',
                //     labelField: 'EMPLOYEE_NAME',
                //     searchField: 'EMPLOYEE_NAME',
                //     onInitialize: function(selectize){
                //         selectize.on('change', function(value) {
                            
                //         });
                //     }
                // };
                // $scope.studentName =[];
                // $http.get($localStorage.service+'HostelAPI/hostelStudentDetail',{headers:{'access_token':$localStorage.access_token}})
                // .success(function(user_data){
                //     $scope.studentName.push(user_data.result);
                // });
                // $scope.selectize_student_options =$scope.studentName;
                // $scope.selectize_student_config = {
                //     create: false,
                //     maxItems: 1,
                //     placeholder: 'Student',
                //     valueField: 'ID',
                //     labelField: 'NAME',
                //     searchField: 'NAME',
                //     onInitialize: function(selectize){
                //         selectize.on('change', function(value) {
                            
                //         });
                //     }
                // };
                $scope.refreshLoad=function(){
                    $scope.hostelName =[];
                    $http.get($localStorage.service+'HostelAPI/hostelView',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(user_data){
                            $scope.hostelName.push(user_data.message);
                    });
                }
                $scope.hostelName =[];
                $http.get($localStorage.service+'HostelAPI/hostelView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    //console.log(user_data,'hostellll');
                    if(user_data.status==false){
                        $scope.hostelName.push({ID:0,NAME:'Add Hostel'});
                    }else{
                        $scope.hostelName.push(user_data.message);
                    }
                    
                });
                $scope.selectize_hname_options =$scope.hostelName;
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Hostel',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    render: {
                        option: function (item, escape) {
                             //console.log(item,"item");
                            // console.log(escape,"escape");
                            if(item.ID==0){
                                return '<div class="option">' +
                                            '<div class="text">' +
                                                '<i class="uk-icon-plus linkClr"></i>' + '<span class="linkClrtxt">' + escape(item.NAME) + '</span>' +
                                           '</div>' +
                                        '</div>';
                            }else{
                                 return '<div class="option">' +
                                            '<div class="text">' +
                                                '<span class="name">' + escape(item.NAME) + '</span>' +
                                           '</div>' +
                                        '</div>';
                            }
                           
                        }
                    },
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value,"change");
                            $scope.getBlocksList(value);
                            if(value==0){
                                var modal = UIkit.modal("#AddHostel_modal",{bgclose: false, keyboard:false});
                                modal.show();
                               
                            } 
                            
                        });
                    }
                };
               
                $scope.selectize_block_options =[];
                $scope.selectize_block_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Block',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            $scope.getRoomList(value);
                        });
                    }
                };
                $scope.selectize_room_options =[];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Room',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            
                        });
                    }
                };
                $scope.getBlocksList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'HostelAPI/hostelBlocks',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        $scope.selectize_block_options=return_data.data.message;
                    });
                }
                 $scope.getRoomList=function(id){
                    $http({
                    method:'get',
                    url: $localStorage.service+'InstitutionAPI/roomDetails',
                    params: {
                        'id' : id
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        //console.log(return_data,'rooomm');
                        $scope.selectize_room_options=return_data.data.data;
                    });
                }
                $scope.saveAllocation=function(){
                    if($scope.selectize_usertype=='Student'){
                        $scope.selectize_profileId=$scope.selectize_stu_profileId
                    }else{
                        $scope.selectize_profileId=$scope.selectize_emp_profileId
                    }
                    $http({
                    method:'POST',
                    url: $localStorage.service+'HostelAPI/allocation',
                    data: {
                        'id' : $scope.hidden_id,
                        'type' : $scope.selectize_usertype,
                        'profileId' : $scope.selectize_profileId,
                        'buildingId' : $scope.selectize_hname,
                        'blockId' : $scope.selectize_block,
                        'roomId' : $scope.selectize_room,
                        'date' : $scope.reg_date
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.status==true){

                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
            
                            $timeout(function(){
                                $state.go('restricted.hostel.allocation');
                                $scope.refreshTable();
                            },200);
                        }else {
                            //UIkit.modal.alert('Course & Batch Name Already Exists');
                        }
                    }, function error(response) {
                        UIkit.modal.alert('Profile Name Already Assigned');
                    });
                }

                //Add Hostel
                $scope.buildingId =[];
                $http.get($localStorage.service+'InstitutionAPI/building',{headers:{'access_token':$localStorage.access_token}})
                .success(function(user_data){
                    $scope.buildingId.push(user_data.data);
                });

                $scope.selectize_buildingId_options =$scope.buildingId;
                $scope.selectize_buildingId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Building',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            // $scope.selectize_courseName_options=[];
                            // $scope.getNameList(value);
                        });
                    }
                };
                $scope.saveHostelSettings=function(){  
                $http({
                method:'POST',
                url: $localStorage.service+'HostelAPI/hostel',
                data: {
                    'id' : $scope.hidden_id,
                    'name' : $scope.hostel_name,
                    'buildingId' : $scope.selectize_bname
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    //console.log(return_data,'return_data');
                    if($scope.btnStatus=='Save'){
                        UIkit.modal("#AddHostel_modal").hide();
                        UIkit.notify({
                            message : 'Hostel Allocated Successfully',
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.hostel.addAllocation');
                            $scope.refreshTable();
                            $scope.refreshLoad();
                        },200);
                    }else {
                    }
                    
                }, function error(response) {
                    UIkit.modal.alert('Building Already Assigned');
                });
            }

          
            






            ///////////////
            // var d=new Date();
            // var year=d.getFullYear();
            // var month=d.getMonth()+1;
            // var day=d.getDate();
            // if (month<10){
            // month="0" + month;
            // };
            // if (day<10){
            //     dayNew = "0" + day;
            // }else{
            //     dayNew = day;
            // };
            
            // $scope.date=dayNew + "." + month + "." + year;
            // $scope.invoice_date = $scope.date;
           

            // var $maskedInput = $('.masked_input');
            // if($maskedInput.length) {
            //     $maskedInput.inputmask();
            // }

            // $scope.changePaid = function () {
            //     var Paidtotal = 0;
            //     var Fixedtotal = 0;
            //     angular.forEach($scope.feesItem, function(value,keys){
            //         angular.forEach(value, function(value1,keys1){
            //             Paidtotal+=parseInt(value1.fees);
            //             Fixedtotal+=parseInt(value1.fixedFee);
            //         });
            //     });
            //     $scope.totalPaid=Paidtotal;
            //     $scope.totalAmount = Fixedtotal;
            // };

            // $scope.newRowObj = {
            //         item_name : '',
            //         item_code : '',
            //         quantity : '',
            //         unitprice : '',
            //         totalPrice : ''
            //     };
            // $scope.items=[];
            // $scope.items.push($scope.newRowObj);
            // $scope.addRow = function(){
            //     $scope.items.push({ 'item_name': '', 'item_code' : '', 'quantity' : '', 'unitprice' : '', 'totalprice' : '' });
            // }

            // $scope.removeRow = function(index){
            //     $scope.items.splice(index,1);
            // }

            // $scope.backBtn = function(){
            //     window.history.back();
            // }

        }
    ]);