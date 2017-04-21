angular
    .module('rubycampusApp')
    .controller('LeaveEntitleAddCtrl',
        function($scope,$resource,$http,$localStorage,$state,$stateParams,$http,$timeout) {
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

            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                                ]
            ];

            $scope.form_dynamic = [];
            // $scope.form_dynamic.push($scope.form_template);
            $scope.form_dynamic.push({'leave_category':'','leave_count':'','valid_from': ''});
            $scope.form_dynamic_model = [];

            $scope.employeeData=[];
            $scope.leaveCategory=[];
            $scope.deptData=[];
            $scope.leaveType=[];

            $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
            .success(function(dept_data){
                $scope.deptData.push(dept_data.message);
            });
            // $http.get('http://localhost/rubyServices/api/AcademicsAPI/departmentlist')
            // .success(function(dept_data){
            //     $scope.deptData.push(dept_data.message);
            // });
            $http.get($localStorage.service+'LeavemgmntAPI/leaveType',{headers:{'access_token':$localStorage.access_token}})
            .success(function(leavetype_data){
                console.log(leavetype_data,'leavetype_data');
                $scope.leaveType.push(leavetype_data.data);
            });
            $scope.getEmployeeList=function(id){
                $http({
                method:'get',
                url: $localStorage.service+'AcademicsAPI/fetchTeacherDetailList',
                params: {
                    'id' : id
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.selectize_employee_options=return_data.data.data;
                });
            }

            $scope.selectize_dept_options =$scope.deptData;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.selectize_employee_options=[];
                        $scope.getEmployeeList(value);
                    });
                }
            };

            $scope.selectize_employee_options = [];
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Employee',
                valueField: 'EMP_ID',
                labelField: 'EMP_ANME',
                searchField: 'EMP_ANME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        
                    });
                }
            };


            $scope.selectize_leaveCat_option = $scope.leaveType;
            $scope.selectize_leaveCat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Leave Type',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function() {
                        console.log('on "change" event fired');
                    });
                }
            };

            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push({'leave_category':'','leave_count':'','valid_from': ''});
            };

            // delete section
            $scope.deleteSection = function($event,$index,del_id) {
                $event.preventDefault();
                if(del_id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(del_id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"LeavemgmntAPI/leaveEntitlementDelete",
                            params : {id : del_id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                console.log(response.data.message,'response');
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                }
                                $scope.form_dynamic_model.splice($index,1);
                                $scope.form_dynamic.splice($index,1);
                            },function myError(response) {
                                UIkit.notify({
                                    message : 'Failed',
                                    status  : 'danger',
                                    timeout : 2000,
                                    pos     : 'top-center'
                                });
                            })
                        }
                    },function(){
                        // console.log("false");
                    }, {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                }
                // $scope.form_dynamic_model.splice($index,1);
                // $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            })

            $scope.backBtn = function(){
                window.history.back();
            }

            $scope.saveLeaveEntitlement=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'LeavemgmntAPI/leaveEntitlement',
                    data: {
                        'id':$scope.leavemgnt_id,
                        'dept_id' : $scope.department_id,
                        'emp_id' : $scope.employee_id,
                        'leave_list' : $scope.form_dynamic
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.data.message,'return_data');
                    if(return_data.data.data.status==true){
                        $state.go('restricted.hr.leave_entitlement_View');
                    }
                });
            }

            $http({
            method:'get',
            url: $localStorage.service+'LeavemgmntAPI/leaveEntitlement',
            params: {
                'id' : $stateParams.empid
            },
            headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_data');
                $scope.viewData=return_data.data.message[0];
                $scope.leavemgnt_id=$stateParams.empid;           
                $timeout(function() {
                    $scope.department_id=return_data.data.message[0].DEPT_ID;                    
                },100);
                 $timeout(function() {
                    $scope.employee_id=return_data.data.message[0].EMP_PROFILE_ID;                    
                },500);
                
            });

            $http({
            method:'get',
            url: $localStorage.service+'LeavemgmntAPI/fetchEmployeeLeaveType',
            params: {
                'id' : $stateParams.empid
            },
            headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data.data.message,'list11');
                // $scope.categoryList=return_data.data.message;
                $timeout(function() {
                    $scope.form_dynamic=return_data.data.message;
                },500);
            });
        }
    );
