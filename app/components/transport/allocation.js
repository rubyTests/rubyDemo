angular
    .module('rubycampusApp')
    .controller('routeAllocationCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage,$filter) {
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
                        }
                    ]
                })
                .withButtons([
                    {
                        extend:    'print',
                        text:      '<i class="uk-icon-print"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                        titleAttr: ''
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                        titleAttr: 'PDF'
                    }
                ])
                 .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            $scope.selectize_usertype_options = ['Student','Employee'];
            $scope.selectize_usertype_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Resident',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.refreshStudent();  
                    });
                }
            };
            $scope.viewData=[];
                $scope.refreshTable=function(){
                    $http({
                        method:'GET',
                        url: $localStorage.service+'TransportAPI/routeAllocation',
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(view_data){
                        console.log(view_data,'view_data1');
                        
                        $scope.viewData=view_data.data.message;
                    });
                }
            $scope.refreshTable();
            $scope.vehicleName=[];
                $http.get($localStorage.service+'TransportAPI/vehicle',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.vehicleName.push(return_data.message);
                });
                $scope.selectize_vehicleName_options = $scope.vehicleName;
                $scope.selectize_vehicleName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Vehicle Name',
                    valueField: 'ID',
                    labelField: 'NAME',
                    onInitialize: function(val){
                    }
                };
			    $scope.stop_name=[];
                $http.get($localStorage.service+'TransportAPI/routeStops',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.stop_name.push(return_data.message);
                });    
				$scope.selectize_stopsName_options = $scope.stop_name;
                $scope.selectize_stopsName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Stop Name',
					valueField: 'ID',
                    labelField: 'NAME',
					onInitialize: function(val){
                    }
                };
				
			$scope.student_name=[];
            $scope.refreshStudent = function(){
    			$http.get($localStorage.service+'ProfileAPI/studentlist',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    //console.log(return_data,'student_name');
                    $scope.student_name.push(return_data.result);
                }); 
            } 
            $scope.refreshStudent();  
			$scope.selectize_stdName_options = $scope.student_name;
            $scope.selectize_stdName_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Student Name',
				valueField: 'ID',
                labelField: 'Name',
				onInitialize: function(val){
                    console.log(val);
                }
            };
            $scope.employee_name=[];
            $http.get($localStorage.service+'EmployeemgmntAPI/getEmployeeList',{headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    console.log(return_data,'employee_name');
                    $scope.employee_name.push(return_data.result);
                });  
            $scope.selectize_employee_options =$scope.employee_name;
            $scope.selectize_employee_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Employee',
                valueField: 'ID',
                labelField: 'EMP_NAME',
                searchField: 'EMP_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                    });
                }
            };
            $scope.openModel = function() {
                $scope.refreshStudent();
                var date = new Date();
                var startDate=$filter('date')(date,'dd.MM.yyyy');  
                $scope.buttonStatus='Save';
                $scope.clearValidation();
                $scope.allocateData={
                    selectize_usertype:"",
                    selectize_emp_profileId:"",
                    selectize_stdName:"",
                    selectize_stopsName:"",
                    selectize_vehicleName:"",
                    startDate:startDate
                };
                $('.uk-modal').find('input').trigger('blur');
            };
            $scope.edit_data= function(res){
                if (typeof res=="undefined") return false;
                console.log(res,"messsssssssssss");
                $scope.buttonStatus='Update';
                var date = res.JOINING_DATE.split("-");
                var formatedDate = date[1]+"."+date[2]+"."+date[0];

                $scope.allocateData={
                    id:res.ID,
                    selectize_usertype:res.RESIDENT_TYPE,
                    selectize_emp_profileId:res.PROFILENAME,
                    selectize_stdName:res.PROFILE_ID,
                    selectize_stopsName:res.ROUTESTOP_ID,
                    selectize_vehicleName:res.VEHICLE_ID,
                    startDate:formatedDate
                };
                
            }
            $scope.allocateData={}
            $scope.addAllocation=function(){
                if($scope.allocateData.selectize_usertype=='Student'){
                    $scope.selectize_profileId=$scope.allocateData.selectize_stdName
                }else{
                    $scope.selectize_profileId=$scope.allocateData.selectize_emp_profileId
                }
                var date = $scope.allocateData.startDate.split(".");
                var formatedDate = date[2]+"-"+date[0]+"-"+date[1];
                $http({
                method:'POST',
                url: $localStorage.service+'TransportAPI/routeAllocation',
                data: {
                    'id' : $scope.allocateData.id,
                    'type' : $scope.allocateData.selectize_usertype,
                    'profileId' :  $scope.selectize_profileId,
                    'stopname' : $scope.allocateData.selectize_stopsName,
                    'vehicleName' : $scope.allocateData.selectize_vehicleName,
                    'startDate' : formatedDate
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_datareturn_data');
                    if(return_data.data.status==true){
                        UIkit.modal("#modal_overflow").hide();
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $scope.refreshTable();
                        $scope.refreshStudent();  
                    }else {
                        // // UIkit.notify('Course Name Already Exists','danger');
                        // UIkit.modal.alert('Course Name Already Exists');
                    }
                });
            }
                $scope.deleteRouteTiming=function(id,$index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+"TransportAPI/routeAllocation",
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    //console.log(response.data.message.message,'delete');
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $scope.viewData.splice($index, 1);
                                    $scope.refreshTable();
                                    $scope.refreshStudent();  
                                },function myError(response) {
                                })
                            }
                        },function(){
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
       



        }
    );