angular
    .module('rubycampusApp')
    .controller('markDetailsCtrl', [
        '$compile',
        '$scope',
        '$window',
        '$timeout',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
		'$http',
        '$localStorage',
        function ($compile,$scope,$window,$timeout,$resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$localStorage) {

            var vm = this;
            vm.selected = {};
            vm.selectAll = false;
            vm.toggleAll = toggleAll;
            vm.toggleOne = toggleOne;
            var titleHtml = '<input ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)" type="checkbox">';
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
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Term-1'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Term-2'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('OverAll')
            ];
            function toggleAll (selectAll, selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        selectedItems[id] = selectAll;
                    }
                }
            }
            function toggleOne (selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        if(!selectedItems[id]) {
                            vm.selectAll = false;
                            return;
                        }
                    }
                }
                vm.selectAll = true;
            }

			// $resource('app/components/academics/examination/marks.json')
                // .query()
                // .$promise
                // .then(function(dt_data) {
                    // vm.dt_data = dt_data;
                // });
			
			// Course and Batch Details
			
			$scope.course = [];
            $scope.batch = [];
			
			$http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
			.success(function(data){
				// $scope.deptData.push(dept_data.message);
				$scope.course = data.message;
			});
			
			$scope.fetchBatch=function(id){
				$http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
				.success(function(batch_data){
					$scope.batch=batch_data.data;
				});
			}
			
			$scope.fetchStudent=function(id){
				$http.get($localStorage.service+'ExamAPI/studentDetails',{params:{course:$scope.setMarkView.course,batch:id,getStuDetails:'OverAllMarks'},headers:{'access_token':$localStorage.access_token}})
				.success(function(response){
					//console.log(response.message,"mark response");
					vm.dt_data=response.message;
					$scope.getVal=response.message;
				});
			}
			
			$scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        //console.log(value,"value");
						$scope.fetchBatch(value);
                    });
                    
                }
            };
			
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'BATCH_DISPLAY_NAME',
                labelField: 'BATCH_DISPLAY_NAME',
				onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        //console.log(value,"value");
						$scope.fetchStudent(value);
                    });
                    
                }
            };
			
			
            $scope.selectize_courseNew_options = ["Computer Science and Engineering", "Mechanical Engineering", "Electrical Communication Engineering", "Electrical and Electronics Engineering", "Aeronautical Engineering"];
            $scope.selectize_courseNew_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course'
            };

            $scope.selectize_batch_options = ["Batch 1", "Batch 2", "Batch 3", "Batch 4", "Batch 5"];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch'
            };


            // Advanced selects

            var course_data = $scope.selectize_course_options = [
                {id: 1, title: 'Computer Science and Engineering', url: '444'},
                {id: 2, title: 'Mechanical Engineering', url: '222'},
                {id: 3, title: 'Electrical Communication Engineering', url: '222'},
                {id: 4, title: 'Electrical and Electronics Engineering', url: '222'},
                {id: 5, title: 'Aeronautical Engineering', url: '222'},
                {id: 6, title: 'Information Technology Engineering', url: '222'},
                {id: 7, title: 'Civil Engineering', url: '222'},
                {id: 8, title: 'Marine Engineering', url: '222'}
            ];

            $scope.selectize_course_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
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

            // Advanced selects

            var planets_data = $scope.selectize_planets_options = [
                {id: 1, title: 'Rafeeq', url: '444'},
                {id: 2, title: 'Saravanan', url: '222'},
                {id: 3, title: 'Gopi', url: '222'},
                {id: 4, title: 'Senthil', url: '222'},
                {id: 5, title: 'Mani', url: '222'},
                {id: 6, title: 'Vijay', url: '222'},
                {id: 7, title: 'Karthil', url: '222'},
                {id: 8, title: 'Selva', url: '222'}
            ];
        }
    ]);