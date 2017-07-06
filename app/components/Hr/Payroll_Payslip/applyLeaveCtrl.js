angular
    .module('rubycampusApp')
    .controller('applyLeaveCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter,$http,$localStorage) {
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
            vm.apllicationData=[];
            $scope.leaveTypeArray=[];
            $scope.employee_array=[];
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
                        // {
                        //     type: 'text',
                        //     bRegex: true,
                        //     bSmart: true
                        // },
                        // {
                        //     type: 'text',
                        //     bRegex: true,
                        //     bSmart: true
                        // },
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

                var modal = UIkit.modal("#open_leavecategory",{bgclose: false, keyboard:false});

                $scope.addleavecategory=function(){
                    $scope.tit_caption="Add";
                    $scope.status="Save";
                    $scope.employee_id='';
                    $scope.leave_type='';
                    $scope.description='';
                    $scope.from_date='';
                    $scope.upto_date='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                
               
                $scope.leaveType=[];
                $scope.ViewDetas=[];
                $scope.refreshTable=function(){
                   $http({
                    method:'GET',
                    url: $localStorage.service+'LeavemgmntAPI/applyLeave',
                    params: {
                        'id' : 1
                    },
                    headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.message,'return_data');
                        $scope.ViewDetas=return_data.data.message;
                    }); 
                }
                $scope.refreshTable();

                $http({
                    method:'GET',
                    url: $localStorage.service+'LeavemgmntAPI/leaveTypelistandcount',
                    params: {
                        'id' : 1
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    $scope.leaveType.push(return_data.data.message);
                });

                $scope.selectize_leavetype_options = $scope.leaveType;
                $scope.selectize_leavetype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Leave Type',
                    valueField: 'LEAVE_TYPE_ID',
                    labelField: 'LEAVE_CATEGORY',
                    searchField: 'LEAVE_CATEGORY',
                    onInitialize: function(selectize){
                        selectize.on('change', function() {
                            console.log('on "change" event fired');
                        });
                    }
                };

                $scope.applyLeaves=function(){
                    var fromdate=$scope.from_date;
                    var upto_date=$scope.upto_date;
                    var start = moment(fromdate,["MM-DD-YYYY"]);
                    var end = moment(upto_date,["MM-DD-YYYY"]);
                    var total_days=start.diff(end, "days");
                    console.log(total_days,'total_days');
                    $http({
                        method:'POST',
                        url: $localStorage.service+'LeavemgmntAPI/applyLeave',
                        data: {
                            // 'employee_id' : $scope.employee_id,
                            'employee_id' : 1,
                            'leave_typeID' : $scope.leave_type,
                            'from_date' : $scope.from_date,
                            'upto_date' : $scope.upto_date,
                            'description' : $scope.description,
                            'total_leave':total_days
                        },
                        headers:{'access_token':$localStorage.access_token}
                    }).then(function(return_data){
                        console.log(return_data.data.data,'return_data');
                        if(return_data.data.data.status==true){
                            UIkit.modal("#open_leavecategory").hide();
                            UIkit.notify({
                                message : return_data.data.data.message,
                                status  : 'success',
                                timeout : 2000,
                                pos     : 'top-center'
                            });
                            $scope.emailSending(1);
                            $scope.refreshTable();
                            // $scope.emailSending(return_data.data.data.APPLY_ID);
                            
                        }
                    });
                }

                $timeout(function(){
                    $scope.emailSending=function(Emp_PROF_ID){
                        $http({
                            method:'POST',
                            url: $localStorage.service+'EmployeemgmntAPI/sendEmail',
                            data:{
                                'emp_prof_Id':Emp_PROF_ID,
                            },
                            headers:{'access_token':$localStorage.access_token}
                        }).then(function(response){
                            console.log(response,'response');
                        });
                    }
                },200);
        }
    );