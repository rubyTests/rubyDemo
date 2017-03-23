angular
    .module('altairApp')
    .controller('departmentCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
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
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'number',
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
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Code'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Head Of Department'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Phone'),

            ];
            $scope.get_id = [];
            $scope.empArray = [];
            $resource('app/components/employeemanagement/employee_list.json')
                .query()
                .$promise
                .then(function(emp_data) {
                    // console.log(emp_data,'emp_data');
                    $scope.empArray=emp_data;
                });

            $resource('app/components/academics/courseBatch/department.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                     angular.forEach( vm.dt_data, function(value, key){
                        $scope.hod_id=  value.HOD_profile_id;
                        // $scope.get_id.push($scope.hod_id);
                        value.empName=getEmployeeName(value.HOD_profile_id);
                        $scope.get_id.push(value.empName);
                    });

                     function getEmployeeName(id){
                            var data=$filter('filter')($scope.empArray,{id : id}, true);
                            if(data[0]) return data[0].firstname+' '+data[0].lastname;
                        }
                });
                $scope.selectize_hodProfieId_options = $scope.get_id;
                $scope.selectize_hodProfieId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Head Of Department'
                };
                 $scope.openModel = function() {
                    $scope.titCaption="Add";
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    $scope.dept_name=null;
                    $scope.dept_code=null;
                    $scope.selectize_hodProfieId=null;
                    $scope.Phone=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    $scope.titCaption="Edit";
                    if (typeof res=="undefined") return false;
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.dept_name=res.dept_name;
                    $scope.dept_code=res.dept_code;
                    $scope.selectize_hodProfieId=res.empName;
                    $scope.Phone=res.phone1;
                    $scope.id=vm.dt_data.indexOf(res);
                }
        }
    );