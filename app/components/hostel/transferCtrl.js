angular
    .module('rubycampusApp')
    .controller('transferCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$filter) {
            var vm = this;
            $scope.viewData=[];
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
                    placeholder: 'Select Resident'
                };

                $scope.selectize_employee_options = ['Vijay Raj','Karthik Selvam','Mani Vannan','Senthil Kumar','Mani Kandan','Junaid Muhammed'];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Employee'
                };

                $scope.selectize_student_options = ['Vijay Raj','Karthik Selvam','Mani Vannan','Senthil Kumar','Mani Kandan','Junaid Muhammed'];
                $scope.selectize_student_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Student'
                };

                $scope.selectize_hname_options = ['Mens Hostel','Ladies Hostel'];
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Building'
                };

                $scope.selectize_block_options = ['Block A','Block B','Block C','Block D','Block E'];
                $scope.selectize_block_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Blocks'
                };

                $scope.selectize_room_options = ['Room 1','Room 2','Room 3','Room 4','Room 5','Room 6','Room 7'];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Room'
                };

                 $resource('app/components/hostel/alloacation.json')
                .query()
                .$promise
                .then(function(allac_data) {
                    $scope.viewData=allac_data;
                });

                $scope.addAllocation=function(){
                    $scope.btnStatus="Save";
                    $scope.selectize_usertype='';
                    $scope.selectize_employee='';
                    $scope.selectize_student='';
                    $scope.selectize_hname='';
                    $scope.selectize_room='';
                    $scope.transfer_date='';
                    $scope.selectize_block='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editAllocation=function(data){
                    $scope.btnStatus="Update";
                    if (data) {
                        $scope.selectize_usertype=data.type;
                        $scope.selectize_employee=data.name;
                        $scope.selectize_student=data.name;
                        $scope.selectize_hname=data.h_name;
                        $scope.selectize_room=data.room;
                        $scope.selectize_block=data.block;
                        $scope.transfer_date=data.reg_date;
                    }
                }
        }
    );