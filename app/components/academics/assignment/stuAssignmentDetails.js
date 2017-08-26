angular
.module('rubycampusApp')
.controller('assignmentDetailsCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$localStorage,$http) {
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
                    },
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    }
                ]
            })
            .withButtons([
                // {
                    // extend:    'print',
                    // text:      '<i class="uk-icon-print"></i> Print',
                    // titleAttr: 'Print'
                // },
                // {
                    // extend:    'excelHtml5',
                    // text:      '<i class="uk-icon-file-excel-o"></i> XLSX',
                    // titleAttr: ''
                // },
                // {
                    // extend:    'pdfHtml5',
                    // text:      '<i class="uk-icon-file-pdf-o"></i> PDF',
                    // titleAttr: 'PDF'
                // }
                // {
                //     text:      '<a href="" class="md-btn md-btn-primary">Add Syllabus</a>',
                //     titleAttr: 'Add Syllabus'
                // }
            ])
             .withOption('initComplete', function() {
                $timeout(function() {
                    $compile($('.dt-uikit .md-input'))($scope);
                })
            });

            // $http.get($localStorage.service+'AcademicsAPI/syllabusDetail',{headers:{'access_token':$localStorage.access_token}})
            // .success(function(syllabus_details){
            //     $scope.viewData=syllabus_details.message;
            // });

            // $resource('app/components/academics/assignment/assignment.json')
            //     .query()
            //     .$promise
            //     .then(function(dt_data) {
            //         vm.viewData = dt_data;
            //     });

            $scope.ViewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'AssignmentAPI/stuAssignmentDetail',
                params:{profileId:$localStorage.userProfile_id,roleId:$localStorage.role_id},
				headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,';return_data');
                $scope.ViewData=return_data.data.data;
                console.log($scope.ViewData,'$scope.ViewData$scope.ViewData');
            });

            $scope.deleteAssignment=function(id,$index){
            if(id){
                UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                    if(id){
                        $http({
                        method : "DELETE",
                        url : $localStorage.service+"AssignmentAPI/assignmentDetail",
                        params : {id : id},
                        headers:{'access_token':$localStorage.access_token}
                        }).then(function mySucces(response) {
                            console.log(response);
                            var data=response.data.message;
                            $scope.ViewData.splice($index, 1);
                        },function myError(response) {
                        })
                    }
                },function(){
                    // console.log("false");
                }, {
                    labels: {
                        'Ok': 'Ok'
                    }
                });
            }
        }
    }
);