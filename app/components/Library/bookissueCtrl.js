angular
    .module('rubycampusApp')
    .controller('bookissueCtrl',
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

                $scope.selectize_usertype_options = ['Student','Employee'];
                $scope.selectize_usertype_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Type'
                };

                $scope.selectize_employee_options = ['Vijay Raj','Karthik Selvam','Mani Vannan','Senthil Kumar','Mani Kandan','Junaid Muhammed'];
                $scope.selectize_employee_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select User'
                };

                $scope.selectize_hname_options = ['Mens Hostel','Ladies Hostel'];
                $scope.selectize_hname_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Hostel'
                };

                $scope.selectize_room_options = ['Room 1','Room 2','Room 3','Room 4','Room 5','Room 6','Room 7'];
                $scope.selectize_room_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Room'
                };
                 $resource('app/components/Library/book_details.json')
                .query()
                .$promise
                .then(function(allac_data) {
                    $scope.viewData=allac_data;
                });

                $scope.addAllocation=function(){
                    $scope.titlecaption="Add";
                    $scope.btnStatus="Save";
                    $scope.category='';
                    $scope.sec_code='';
                    $('.uk-modal').find('input').trigger('blur');
                }
                $scope.editAllocation=function(data){
                    $scope.titlecaption="Edit";
                    $scope.btnStatus="Update";
                    if (data) {
                        $scope.category=data.category;
                        $scope.sec_code=data.sec_code;
                    }
                }
        }
    );