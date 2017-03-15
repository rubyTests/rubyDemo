angular
    .module('altairApp')
    .controller('subjectCtrl',
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
                DTColumnDefBuilder.newColumnDef(0).withTitle('Subject'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Code'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Subject Type'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Total Hours')
            ];
            //     .newOptions()
            //     // .withDisplayLength(10)
            //     // .withColumnFilter({
            //     //     aoColumns: [
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'text',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         },
            //     //         {
            //     //             type: 'number',
            //     //             bRegex: true,
            //     //             bSmart: true
            //     //         }
            //     //     ]
            //     // })
            //     .withButtons([
            //         {
            //             extend:    'copyHtml5',
            //             text:      '<i class="uk-icon-files-o"></i> Copy',
            //             titleAttr: 'Copy'
            //         },
            //         {
            //             extend:    'print',
            //             text:      '<i class="uk-icon-print"></i> Print',
            //             titleAttr: 'Print'
            //         },
            //         {
            //             extend:    'excelHtml5',
            //             text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
            //             titleAttr: ''
            //         },
            //         {
            //             extend:    'csvHtml5',
            //             text:      '<i class="uk-icon-file-text-o"></i> CSV',
            //             titleAttr: 'CSV'
            //         },
            //         {
            //             extend:    'pdfHtml5',
            //             text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
            //             titleAttr: 'PDF'
            //         }
            //     ])
            //     .withOption('initComplete', function() {
            //         $timeout(function() {
            //             $compile($('.dt-uikit .md-input'))($scope);
            //         })
            //     });
            // vm.dtColumnDefs = [
            //     DTColumnDefBuilder.newColumnDef(0),
            //     DTColumnDefBuilder.newColumnDef(1),
            //     DTColumnDefBuilder.newColumnDef(2),
            //     DTColumnDefBuilder.newColumnDef(3),
            //     DTColumnDefBuilder.newColumnDef(4),
            //     DTColumnDefBuilder.newColumnDef(5)
            // ];

            //Validation 
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
            //End Validation
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
               
            $resource('app/components/academics/courseBatch/subject.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    vm.dt_data = dt_data;
                    angular.forEach(vm.dt_data, function(value, key){
                        value.course_name=$scope.courseName(value.course_id);
                    });
                    // console.log(vm.dt_data,"vm.dt_data");

                });
           
           
                $scope.courseName = function(id){
                    var getName=$filter('filter')($scope.get_data,{id : id },true);
                    if (getName[0]) return getName[0].course_name;
                }
                $scope.selectize_subType_options = ["Regular", "Daily"];
                $scope.selectize_subType_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Subject Type...'
                };

                //console.log($scope.get_name,"checkkkkkkkkkkk");
                $scope.selectize_courseName_options = $scope.get_name;
               // $scope.selectize_courseName_options = ["cs", "mech"];
              
                $scope.selectize_courseName_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Course Name'
                };
                $scope.openModel = function() {
                    //$scope.buttonStatus='Save';
                    $scope.Savebutton=true;
                    $scope.Updatebutton=false;
                    // $scope.subject_name=null;
                    // $scope.sub_code=null;
                    // $scope.selectize_subType=null;
                    // $scope.selectize_courseName=null;
                    // $scope.total_hours=null;
                  };
                    vm.dt_data = [];
                    $scope.saveSubjects=function(){

                        var data = {
                            sub_name:$scope.subject_name,
                            sub_code:$scope.sub_code,
                            sub_type:$scope.selectize_subType,
                            course_name:$scope.selectize_courseName,
                            total_hours:$scope.total_hours
                        };  
                        vm.dt_data.push(data);
                        //clearFunction();  
                    };
                    // function clearFunction(){
                    //     $scope.subject_name="",
                    //     $scope.sub_code="",
                    //     $scope.selectize_subType="",
                    //     $scope.selectize_courseName="",
                    //     $scope.total_hours=""
                    // }
                    //vm.dt_data = [].concat($scope.save_data);
                    $scope.remove_data = function(index) {

                       var index = vm.dt_data.indexOf(index);
                       console.log(index);
                       vm.dt_data.splice(index, 1);  
                    }
                    $scope.edit_data= function(res){
                        console.log(res,"messsssssssssss");
                        //$scope.buttonStatus='Update';
                        $scope.Updatebutton=true;
                        $scope.Savebutton=false;
                        $scope.subject_name=res.sub_name;
                        $scope.sub_code=res.sub_code;
                        $scope.selectize_subType=res.sub_type;
                        $scope.selectize_courseName=res.course_name;
                        $scope.total_hours=res.total_hours;
                        $scope.id=vm.dt_data.indexOf(res);
                        //console.log($scope.id);
                    }
                    $scope.Update_data= function () {
                        //alert('in');
                        console.log(vm.dt_data[$scope.id].sub_name);
                        vm.dt_data[$scope.id].sub_name=$scope.subject_name;
                        vm.dt_data[$scope.id].sub_code=$scope.sub_code;
                        vm.dt_data[$scope.id].sub_type=$scope.selectize_subType;
                        vm.dt_data[$scope.id].course_name=$scope.selectize_courseName;
                        vm.dt_data[$scope.id].total_hours=$scope.total_hours;
                       // clearFunction();  
                        
                    }

               
    
               




        }
    );