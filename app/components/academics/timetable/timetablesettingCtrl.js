angular
    .module('rubycampusApp')
    .controller('timetablesetting', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        '$compile',
        '$location',
        '$http',
        '$localStorage','$state',
        function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location,$http,$localStorage,$state) {
            $scope.selectize_start_options = ['Monday',' Tuesday','Wednesday','Thursday','Friday','Saturday'];
            $scope.selectize_start_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Start Day'
            };
            $scope.selectize_end_options = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            $scope.selectize_end_config = {
                create: false,
                maxItems: 1,
                placeholder: 'End Day',
                // valueField: 'ID',
                // labelField: 'NAME',
                // onInitialize: function(selectize){
                //     selectize.on('change', function(value) {
                //         console.log(value);
                //     });
                // }
            };

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.startTime="00:00",
            $scope.endTime="00:00";

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

            $http({
                method:'GET',
                url: $localStorage.service+'TimetableAPI/timetableSetting',
                headers:{'access_token':$localStorage.access_token}
                }).then(function(response){
                    console.log(response,'response');
                    $scope.setting_id=response.data.result[0].ID;
                    $scope.start_day=response.data.result[0].START_DAY;
                    $scope.end_day=response.data.result[0].END_DAY;
                    $scope.startTime=moment(response.data.result[0].START_TIME, ["HH:mm"]).format("hh:mm A");
                    $scope.endTime=moment(response.data.result[0].END_TIME, ["HH:mm"]).format("hh:mm A");
                });
                
                
            $scope.saveSetting=function(){
                $http({
                method:'POST',
                url: $localStorage.service+'TimetableAPI/timetableSetting',
                data: {
                    'setting_id' : $scope.setting_id,
                    'start_day' : $scope.start_day,
                    'end_day' : $scope.end_day,
                    'startTime' : moment($scope.startTime, ["hh:mm A"]).format("HH:mm"),
                    'endTime' : moment($scope.endTime, ["hh:mm A"]).format("HH:mm"),
                },
                headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_data');
                    if(return_data.data.status==true){
                        $scope.setting_id=return_data.data.message.SETTING_ID;
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $state.go('restricted.academics.timetable.timetableView');
                    }else {
                        UIkit.notify({
                            message : 'Failed',
                            status  : 'danger',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                    }
                });
            }
        }
    ]);