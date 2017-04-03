angular
    .module('altairApp')
    .controller('buildingCtrl',
        function($compile, $scope, $timeout, $resource, DTOptionsBuilder, DTColumnDefBuilder,$http,$rootScope, $filter,$localStorage) {
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
                DTColumnDefBuilder.newColumnDef(0).withTitle('Id'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Number'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('Landmark')
            ];

            $scope.addBuilding=function(){
                $scope.titleCaption="Add";
                $scope.btnStatus="Save";
                $scope.building_id='';
                $scope.building_name='';
                $scope.build_no='';
                $scope.landmark='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editBuilding=function(res){
                $scope.titleCaption="Edit";
                $scope.btnStatus="Update";
                if(res){
                    $scope.building_id=res.ID;
                    $scope.building_name=res.NAME;
                    $scope.build_no=res.NUMBER;
                    $scope.landmark=res.LANDMARK;
                }
            }
            
            // Save Data
            $scope.saveBuildingData=function(){
                $http({
                method:'POST',
                // url: 'http://localhost/smartedu/test/institutionApi/building',
                url: $localStorage.service+'institutionApi/building',
                data: {
                    'build_id' : $scope.building_id,
                    'build_name' : $scope.building_name,
                    'bulid_no' : $scope.build_no,
                    'landmark' : $scope.landmark
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    // console.log($scope.building_id)
                    if($scope.building_id){
                        var data=$filter('filter')($scope.viewData,{ID:$scope.building_id},true);
                        data[0].NAME=$scope.building_name;
                        data[0].NUMBER=$scope.build_no;
                        data[0].LANDMARK=$scope.landmark;
                        // console.log(data);
                    }else{
                        $scope.viewData.push({ID:return_data.data.BUILDING_ID,NAME:$scope.building_name,NUMBER:$scope.build_no,LANDMARK:$scope.landmark});
                    }
                });
            }

            $scope.viewData=[];
            $http.get($localStorage.service+'institutionApi/building',{headers:{'access_token':$localStorage.access_token}})
            .success(function(response){
                $scope.viewData=response.data;
            });

            $scope.deleteBuildingData=function(id, $index){
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : "$localStorage.service+'institutionApi/building'",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                var data=response.data.message.message;
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
    );