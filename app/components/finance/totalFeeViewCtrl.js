angular
    .module('rubycampusApp')
    .controller('totalFeeViewCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$http',
        '$localStorage','$stateParams',
        function ($scope,$window,$timeout,$http,$localStorage,$stateParams) {
            
            $scope.basicDetails=[];
            $http({
                url: $localStorage.service+'FinanceAPI/fetchStudentBasicDetails',
                method : 'GET',
                params:{'profileID':$stateParams.profile_id},
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response.message,'student_details');
                $scope.basicDetails=response.message[0];
            }).error(function(data){
                console.log('error');
            });

            $http({
                url: $localStorage.service+'FinanceAPI/fetchStudentFeesDetails',
                method : 'GET',
                params:{'profileID':$stateParams.profile_id},
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response.message,'studentfee_details');
                $scope.studentFeeList=response.message;
            }).error(function(data){
                console.log('error');
            });


            // pdf generation start on 27-03-17 by vijayaraj
            $scope.singlePdfGeneartion = function(feepaymentid) {
                $http({
                    // url: $localStorage.service+'FinanceAPI/studentfeelistpdf',
                    url: $localStorage.service+'FinanceAPI/index',
                    method : 'POST',
                    data : {'feepaymentid':feepaymentid},
                    responseType : 'arraybuffer',
                    headers: {
                    'Content-type' : 'application/pdf',
                    // 'access_token':$localStorage.access_token
                    },
                    cache: true,
                }).success(function(data) {
                    var blob = new Blob([data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    var fileName = "1099.pdf";
                    var contentFile = blob;
                    $window.open(fileURL, "_blank");
                }).error(function(data){
                    console.log('error');
                });
            }
        }
    ]);