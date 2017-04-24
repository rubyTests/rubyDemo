angular
    .module('rubycampusApp')
    .controller('assignCtrl',
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Assessment'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),

            ];

            var modal = UIkit.modal("#modal_overflow",{bgclose: false, keyboard:false});
            
            $scope.get_id = [];
            $scope.course_data = [];
            $resource('app/components/academics/examination/assign.json')
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
                
			$resource('app/components/academics/examination/setweightage.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.get_id.push(dt_data);
                });
                $scope.selectize_assessment_options = $scope.get_id;
                $scope.selectize_assessment_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Assessment',
					valueField: 'id',
                    labelField: 'assessment',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
				
			$resource('app/components/academics/courseBatch/course.json')
                .query()
                .$promise
                .then(function(dt_data) {
                    $scope.course_data.push(dt_data);
                });
                $scope.selectize_course_options = $scope.course_data;
                $scope.selectize_course_config = {
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Course',
					valueField: 'id',
                    labelField: 'course_name',
					onInitialize: function(val){
                        console.log(val);
                    }
                };
				
			// Advanced selects

            var course_data = $scope.selectize_course_options = [
                {id: 1, title: 'Computer Science and Engineering'},
                {id: 2, title: 'Mechanical Engineering'},
                {id: 3, title: 'Electrical Communication Engineering'},
                {id: 4, title: 'Electrical and Electronics Engineering'},
                {id: 5, title: 'Aeronautical Engineering'},
                {id: 6, title: 'Information Technology Engineering'},
                {id: 7, title: 'Civil Engineering'},
                {id: 8, title: 'Marine Engineering'}
            ];

            $scope.selectize_course_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                create: false,
                placeholder: 'Course Name',
                render: {
                    option: function(course_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(course_data.title) + '</span><br>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
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
       

			//$scope.name=$scope.selectize_weightage+" "+$scope.selectize_course;

        }
    );