angular
    .module('rubycampusApp')
    .controller('materialRequestDetailsCtrl', [
    	'$rootScope',
        '$scope',
        '$window',
        '$timeout',
        'variables',
        '$http',
        '$stateParams',
        '$filter',
        '$localStorage',
        function ($rootScope,$scope,$window,$timeout,variables,$http,$stateParams,$filter,$localStorage) {

        	$http({
                method:'GET',
                url: $localStorage.service+'inventoryApi/fetchAllMaterialRequest',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(material_data){
            	console.log(material_data,'material_data');
            	$scope.matReq_data = material_data.data.data[0];
            	// $scope.matReq_dataList = material_data.data[0];

            });
        	// $http.get($localStorage.service+'inventoryApi/fetchAllMaterialRequest',
        	// 	params:{
        	// 		'id':$stateParams.id
        	// 	},
        	// 	{headers:{'access_token':$localStorage.access_token}})
        	// }
         //    .success(function(material_data){
         //        // var data1=$filter('filter')(syllabus_data.data, {SUBJECT_ID : $stateParams.id},true);
         //        //  console.log(syllabus_data.data.indexOf(data1[0]),'data');
         //        // $scope.currentActive=syllabus_data.data.indexOf(data1[0]);
         //        $scope.matReq_data = material_data.data;
         //        // $scope.notes_preview=data1[0];
         //    });

        }
    ]);