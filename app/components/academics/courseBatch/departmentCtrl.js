angular
    .module('altairApp')
    .controller('departmentCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
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
                // .withButtons([
                //     {
                //         extend:    'copyHtml5',
                //         text:      '<i class="uk-icon-files-o"></i> Copy',
                //         titleAttr: 'Copy'
                //     },
                //     {
                //         extend:    'print',
                //         text:      '<i class="uk-icon-print"></i> Print',
                //         titleAttr: 'Print'
                //     },
                //     {
                //         extend:    'excelHtml5',
                //         text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                //         titleAttr: ''
                //     },
                //     {
                //         extend:    'csvHtml5',
                //         text:      '<i class="uk-icon-file-text-o"></i> CSV',
                //         titleAttr: 'CSV'
                //     },
                //     {
                //         extend:    'pdfHtml5',
                //         text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                //         titleAttr: 'PDF'
                //     }
                // ]);
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Department'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Code'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Head Of Department'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Phone'),

            ];
            $scope.get_id = [];
            $resource('app/components/academics/courseBatch/department.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                     angular.forEach( vm.dt_data, function(value, key){
                        $scope.hod_id=  value.HOD_profile_id;
                        //console.log($scope.hod_id);
                        $scope.get_id.push($scope.hod_id);
                    });
                });
                $scope.selectize_hodProfieId_options = $scope.get_id;
                $scope.selectize_hodProfieId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Head Of Department'
                };
                 $scope.openModel = function() {
                    //$scope.buttonStatus='Save';
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    $scope.dept_name=null;
                    $scope.dept_code=null;
                    $scope.selectize_hodProfieId=null;
                    $scope.Phone=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    if (typeof res=="undefined") return false;
                    //console.log(res,"messsssssssssss");
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.dept_name=res.dept_name;
                    $scope.dept_code=res.dept_code;
                    $scope.selectize_hodProfieId=res.HOD_profile_id;
                    $scope.Phone=res.phone1;
                    $scope.id=vm.dt_data.indexOf(res);
                }
       



        }
    );