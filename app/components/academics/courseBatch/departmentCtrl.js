angular
    .module('rubycampusApp')
    .controller('departmentCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage,$state) {
            
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
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

                var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
                
                $scope.addDepartment = function() {
                    $scope.clearValidation();
                    $scope.titCaption="Add";
                    $scope.btnStatus="Save";
                    $scope.dept_id='';
                    $scope.dept_name='';
                    $scope.dept_code='';
                    $scope.hod_prof_id='';
                    $scope.room_id='';
                    $scope.phone_no='';
                    $('.inputName').trigger('blur'); 
                    $timeout(function(){
                        $scope.shouldBeOpen = true;    
                    },500);
                    // $('.uk-modal').find('input').trigger('blur');
                    $scope.deptFORM.$setPristine();
                };
                $scope.editDepartment= function(res){
                    $scope.clearValidation();
                    $scope.titCaption="Edit";
                    $scope.btnStatus="Update";
                    if(res){
                        $scope.dept_id=res.ID;
                        $scope.dept_name=res.NAME;
                        $scope.dept_code=res.CODE;
                        $scope.phone_no=res.PHONE;
                        $scope.hod_prof_id=res.empProfile[0].ID || '';
                        $scope.room_id=res.roomData[0].ID || '';
                        
                    }
                }

                $scope.viewData=[];
                $scope.empList=[];
                $scope.roomList=[];
                $scope.getdata=function(){
                    $http.get($localStorage.service+'AcademicsAPI/departmentDetail',{headers:{'access_token':$localStorage.access_token}})
                    .success(function(return_data){
                        $scope.viewData=return_data.message;
                        // console.log(return_data,'return_data');
                    });    
                }
                $scope.getdata();
                $http.get($localStorage.service+'InstitutionAPI/room',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.roomList.push(return_data.data);
                });

                $http.get($localStorage.service+'SettingAPI/employeeList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.empList.push(return_data.data);
                });

                $scope.selectize_hodProfieId_options =$scope.empList;
                $scope.selectize_hodProfieId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select HOD',
                    valueField: 'PROFILE_ID',
                    labelField: 'FULLNAME',
                    searchField: 'FULLNAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                        });
                    }
                };

                $scope.selectize_roomid_options =$scope.roomList;
                $scope.selectize_roomid_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Room',
                    valueField: 'ID',
                    labelField: 'NAME',
                    searchField: 'NAME',
                    onInitialize: function(selectize){
                        selectize.on('change', function(value) {
                            console.log(value);
                        });
                    }
                };

                $scope.saveDeaprtment=function(){
                    $http({
                    method:'POST',
                    url: $localStorage.service+'AcademicsAPI/departmentDetail',
                    data: {
                        'DEPT_ID' : $scope.dept_id,
                        'DEPT_NAME' : $scope.dept_name,
                        'DEPT_CODE' : $scope.dept_code,
                        'DEPT_ROOM_ID' : $scope.room_id,
                        'DEPT_HOD' : $scope.hod_prof_id,
                        'DEPT_PHONE' : $scope.phone_no
                    },
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
                            // console.log($localStorage.coursePath,'path');
                            if($localStorage.coursePath==true){
                                $localStorage.coursePath=false;
                                $state.go('restricted.academics.course');
                            }

                        }else {
                            UIkit.modal.alert('Department Name Already Exists');
                        }
                    });
                }
                   $scope.deleteDepartment=function(id,$index){
                $http({
                    method : "get",
                    url : $localStorage.service+"AcademicsAPI/departmentDetailCheck",
                    params : {id : id},
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function mySucces(response) {
                        if(response.data.status==true){
                            if(id){
                                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                                    if(id){
                                        $http({
                                        method : "DELETE",
                                        url : $localStorage.service+"AcademicsAPI/departmentDetail",
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
                                                $scope.viewData.splice($index, 1);
                                                  $scope.getdata();
                                            }
                                            
                                        },function myError(response) {
                                        })
                                    }
                                },function(){
                                    console.log("false");
                                    $scope.getdata();
                                }, {
                                    labels: {
                                        'Ok': 'Ok'
                                    }
                                });
                            }

                        }
                    },function myError(response) {
                        UIkit.modal.alert(response.data.message);
                    })
            }
        }
    );