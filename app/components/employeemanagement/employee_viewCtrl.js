angular
    .module('rubycampusApp')
    .controller('employee_viewCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        'contact_list',
        '$http',
        '$localStorage',
        function ($rootScope,$scope,$window,contact_list,$http,$localStorage) {

            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            $scope.contact_list = contact_list;

            // get all companies from array
            var all_companies = contact_list.map(function(a) {

                a.fullname=a.firstname+" "+a.lastname;
                // console.log(a.fullname,'aaaaaaaa');
                return a;
            });

            // remove duplicate companies
            function eliminateDuplicates(arr) {
                var i,
                    len=arr.length,
                    out=[],
                    obj={};

                for (i=0;i<len;i++) {
                    obj[arr[i]]=0;
                }
                for (i in obj) {
                    out.push(i);
                }
                return out;
            }

            $scope.contact_list_companies = eliminateDuplicates(all_companies);

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $scope.$apply(function () {
                    UIkit.grid($('#contact_list'),{
                        controls: '#contact_list_filter',
                        gutter: 20
                    });
                });
            })

            $scope.ViewList=[];
                $http.get($localStorage.service+'EmployeemgmntAPI/employeeProfileView',{headers:{'access_token':$localStorage.access_token}})
                .success(function(view_list){
                    $scope.ViewList=view_list.data;
                });
        }
    ]);