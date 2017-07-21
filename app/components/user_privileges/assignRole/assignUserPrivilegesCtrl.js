angular
    .module('rubycampusApp')
    .controller('assignRolePrivilegesCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage,$state) {
        	$scope.user_role = {};
            // console.log($state.current.name,"$state.current")
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

                $scope.clearValidation = function(){
                    $('#form_validation').parsley().reset();
                }
            var vm = this;
            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
                    "<'uk-overflow-container'tr>" +
                    "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
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
                        null
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
                
                $scope.addassignRole = function() {
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                    $scope.user_role = {};
                    $scope.roleForm.$setPristine();
                };
                $scope.assignRoleEdit= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.user_role.id=res.ID;
                        $scope.user_role.roleName=res.ROLL_NAME.split(",");
                        $scope.user_role.dept_name=res.DEPT_ID;
                        $scope.user_role.employee=res.USER_ID;                        
                    }
                }

                $scope.viewData=[];
                $scope.empList=[];
                $scope.roleList=[];
                $scope.rolesDetails=[{"id":"1","role_name":"admin"},{"id":"2","role_name":"empolyee"},{"id":"3"
,"role_name":"HR"},{"id":"4","role_name":"Admin 1"}];
                // $http.get($localStorage.service+'AcademicsAPI/getRoles',{headers:{'access_token':$localStorage.access_token}})
                //     .success(function(return_data){
                //         $scope.rolesDetails=return_data.message;
                // });
                $scope.rolesDetails_config = {
                    create: false,
                    valueField: 'id',
                    labelField: 'role_name',
                    searchField: 'role_name'
                }  
                $scope.getdata=function(){
                    $http.get($localStorage.service+'AcademicsAPI/assignRoleDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(return_data){
                        $scope.roleList=return_data.message;
                        // console.log(return_data,'return_data');
                    });    
                }
                $scope.getdata();
                $http.get($localStorage.service+'AcademicsAPI/departmentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.viewData.push(return_data.message);
                    // console.log(return_data,'return_data');
                });
                $scope.getEmployeeList = function(id){
	                $http({
	                    method:'GET',
	                    url: $localStorage.service+"AcademicsAPI/fetchTeacherDetailList",
	                    params:{id:id},
	                    headers:{'access_token':$localStorage.access_token}
	                }).then(function(data){
	                    console.log(data.data.data);
	                    $scope.employee_options = data.data.data;
	                });
                }

                $scope.department_options = $scope.viewData;
                $scope.department_config = {
                    create: false,
                    maxItems: 1,
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {                            
                            if (value) {
                            	$scope.getEmployeeList(value);
                            }else{
                            	$scope.employee_options=[];
                            }
                        });
                    }
                };
                $scope.employee_options =[];
                $scope.employee_config = {
                    create: false,
                    maxItems: 1,
                    valueField: 'EMP_ID',
                    labelField: 'EMP_ANME',
                    searchField: 'EMP_ANME'
                };

                $scope.saveAssignRole=function(){
                    $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/assignRoleDetail',
                    data: $scope.user_role,
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        if(return_data.data.message.status==true){
                            console.log(return_data.data.message.message);
                            UIkit.modal("#modal_overflow").hide();
                            UIkit.notify({
                                message : return_data.data.message.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.getdata();

                        }else {
                            UIkit.modal.alert('Department Name Already Exists');
                        }
                    });
                }
                $scope.assignRoleDelete=function(id,$index){
	                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
	                    if(id){
	                        $http({
	                        method : "DELETE",
	                        url : $localStorage.service+"AcademicsAPI/assignRoleDetail",
	                        params : {id : id},
	                        headers:{'access_token':$localStorage.access_token}
	                        }).then(function mySucces(response) {
	                            
	                            if(response.data.status==true){
	                                UIkit.notify({
	                                    message : response.data.message,
	                                    status  : 'success',
	                                    timeout : 2000,
	                                    pos     : 'top-center'
	                                });
	                                $scope.roleList.splice($index, 1);
	                                $scope.getdata();
	                            }
	                            
	                        },function myError(response) {
	                        })
	                    }
	                },{
	                    labels: {
	                        'Ok': 'Ok'
	                    }
	                });
	            }
            $scope.mapVal = function(data){
                var result = data.map(function(elem){
                    return elem.role_name;
                }).join(",");
                return result;
            }
        }
    );