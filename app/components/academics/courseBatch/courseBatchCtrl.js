angular
    .module('altairApp')
    .controller('courseBatchCtrl',
       
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder, $filter) {
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Batch'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Period From'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Period To'),
            ];
          
            $scope.get_name = [];
            $resource('app/components/academics/courseBatch/course.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_data = [];
                    $scope.get_data =  dt_data;
                     angular.forEach($scope.get_data, function(value, key){
                        $scope.name=  value.course_name;
                        $scope.get_name.push($scope.name);
                    });
                });
            $resource('app/components/academics/courseBatch/courseBatch.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                    angular.forEach(vm.dt_data, function(value, key){
                        value.courseName=$scope.courseName(value.course_id);
                    });
                });
                $scope.courseName = function(id){
                    var getName=$filter('filter')($scope.get_data,{id : id },true);
                    if (getName[0]) return getName[0].course_name;
                }

                $scope.selectize_courseId_options = $scope.get_name;
                $scope.selectize_courseId_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course Name'
                };
                 $scope.openModel = function() {
                    $scope.titCaption="Add";
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    $scope.selectize_courseId=null;
                    $scope.batch_name=null;
                    $scope.period_from=null;
                    $scope.period_to=null;
                    $('.uk-modal').find('input').trigger('blur');
                };
                $scope.edit_data= function(res){
                    $scope.titCaption="Edit";
                    if (typeof res=="undefined") return false;
                    $scope.Updatebutton=true;
                    $scope.Savebutton=false;
                    $scope.selectize_courseId=res.courseName;
                    $scope.batch_name=res.cBatch_name;
                    $scope.period_from=res.period_from;
                    $scope.period_to=res.period_to;
                    $scope.id=vm.dt_data.indexOf(res);
                }

        }
    );