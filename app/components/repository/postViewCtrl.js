angular
    .module('rubycampusApp')
    .controller('postViewCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$timeout',
        '$stateParams',
        '$resource',
        '$filter',
        '$compile',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        '$filter',
        '$http',
        '$localStorage',
        function ($scope,$rootScope,$window,$timeout,$stateParams,$resource,$filter,$compile,DTOptionsBuilder, DTColumnDefBuilder, $filter, $http, $localStorage) {
            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });
            var vm = this;
            vm.post_data = [];
            vm.selected = {};
            vm.selectAll = false;
            vm.toggleAll = toggleAll;
            vm.toggleOne = toggleOne;
            var titleHtml = '<input ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)" type="checkbox">';
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
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    })
                });

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('S.No'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Title'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Category'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Course'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Date')
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

            // $resource('data/repository/post.json')
            // .query()
            // .$promise
            // .then(function(post_data) {
            //     vm.post_data = post_data;
            // });

            $scope.viewData=[];
            $http({
                method:'GET',
                url: $localStorage.service+'RepositoryAPI/Rep_Post',
				params:{role_id:$localStorage.role_id,profileId:$localStorage.userProfile_id},
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.viewData=return_data.data.message;
                console.log($scope.viewData,'$scope.viewData');
            });

            // $scope.remove_Category = function(index){
            //     if (typeof index=="undefined") return false;
            //     vm.category_data.splice(index,1);
            // }
            $scope.deleteRepPostData=function(id, $index){
                    if(id){
                        UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                            if(id){
                                $http({
                                method : "DELETE",
                                url : $localStorage.service+'RepositoryAPI/Rep_Post',
                                params : {id : id},
                                headers:{'access_token':$localStorage.access_token}
                                }).then(function mySucces(response) {
                                    if(response.data.status==true){
                                        UIkit.notify({
                                            message : response.data.message,
                                            status  : 'success',
                                            timeout : 2000,
                                            pos     : 'top-center'
                                        });
                                    }
                                    $scope.viewData.splice($index, 1);
                                },function myError(response) {
                                  // console.log(response,'response');
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
    ]);