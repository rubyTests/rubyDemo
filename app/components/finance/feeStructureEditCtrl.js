angular
    .module('rubycampusApp')
    .controller('feeStructureEditCtrl', [
        '$scope',
        '$window',
        '$timeout',
        '$localStorage',
        '$http',
        '$filter',
        '$state','$stateParams',
        function ($scope,$window,$timeout,$localStorage,$http,$filter,$state,$stateParams) {
            console.log($stateParams,'ddddd');
            $scope.itemType_array=[];
            $scope.checkValid=function(value){
                if(typeof value.FEE_ITEM_ID!="undefined"){
                    value.errorMessage=false;
                    var data=$filter('filter')($scope.itemType_array,{FEE_ITEM_ID:value.FEE_ITEM_ID},true);
                    if (data.length != 1) {
                        value.FEE_ITEM_ID="";
                        value.errorMessage=true;
                    }
                    // console.log(value,"defined")
                }else{
                    // console.log(value,"undefined")
                    value.FEE_ITEM_ID={};
                    value.errorMessage=true;
                }
            }

            $scope.form_dynamic = [];
            $scope.form_dynamic.push({'FEE_ITEM_ID':'','AMOUNT':'','DUE_DATE':'','FREQUENCY':'','FEE_FINE_ID':''});
            $scope.form_dynamic_model = [];

            $scope.cloneSection1=function(){
                $scope.form_dynamic.push({'FEE_ITEM_ID':'','AMOUNT':'','DUE_DATE':'','FREQUENCY':'','FEE_FINE_ID':''});
            }
            // delete section
            $scope.deleteSection = function($event,$index,currArray) {
                console.log(currArray,'currArray');
                var id=currArray.ID;
                if(id){
                    UIkit.modal.confirm('Are you sure to delete ?', function(e) {
                        if(id){
                            $http({
                            method : "DELETE",
                            url : $localStorage.service+"FinanceAPI/particularFeeStructure",
                            params : {id : id},
                            headers:{'access_token':$localStorage.access_token}
                            }).then(function mySucces(response) {
                                console.log(response,'response');
                                if(response.data.status==true){
                                    UIkit.notify({
                                        message : response.data.message,
                                        status  : 'success',
                                        timeout : 2000,
                                        pos     : 'top-center'
                                    });
                                    $event.preventDefault();
                                    $scope.form_dynamic_model.splice($index,1);
                                    $scope.form_dynamic.splice($index,1);
                                }
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
                }else {
                    $event.preventDefault();
                    $scope.form_dynamic_model.splice($index,1);
                    $scope.form_dynamic.splice($index,1);
                }


                // $event.preventDefault();
                // $scope.form_dynamic_model.splice($index,1);
                // $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });


            $http({
                url: $localStorage.service+'FinanceAPI/editFeeStructure',
                method : 'GET',
                params:{
                    'id':$stateParams.Assign_Id
                },
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                console.log(response.message,'editdata');
                $scope.editView=response.message[0];
                $scope.structure_id=response.message[0].ID;
                $scope.structure_name=response.message[0].NAME;
                // $scope.assigned_to=response.message[0].ASSIGN_TO;
                $timeout(function(){
                    // $scope.coursedata=response.message[0].COURSEID;
                    // $scope.batch_id=response.message[0].BATCHID;
                    // $scope.coursedata=response.message[0].COURSE_ID;
                    // $scope.batch_id=response.message[0].BATCH_ID;

                    $scope.form_dynamic=response.message[0].fee_item;
                    $scope.itemType_array=response.message[0].fee_item;
                    // console.log($scope.form_dynamic);
                    angular.forEach($scope.form_dynamic, function(value, keys){
                        console.log(value, "value");
                        var due_date = value.DUE_DATE.split("-");
                        value.DUE_DATE = due_date[1]+"."+due_date[2]+"."+due_date[0];
                    })
                },200);
                $timeout(function(){
                    // $scope.form_dynamic=response.message[0].fee_item;
                    // $scope.itemType_array=response.message[0].fee_item;
                    $('#form_validation').find('input').trigger('blur');
                },1500);
            }).error(function(data){
                console.log('error');
            });


            $scope.feesitemList=[];
            $http({
                url: $localStorage.service+'FinanceAPI/feeItem',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                // console.log(response,'feeitem');
                $scope.feesitemList.push(response.message);
            }).error(function(data){
                console.log('error');
            });

            $scope.selectize_feeItem_options =$scope.feesitemList;
            $scope.selectize_feeItem_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fee Item',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $('#form_validation').parsley().validate();
                    });
                }
            };

            

            $scope.selectize_freq_options = ["Annualy", "Monthly", "Weekly"];
            $scope.selectize_freq_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Frequency',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $('#form_validation').parsley().validate();
                    });
                }
            };

            $scope.feeFineList=[];
            $http({
                url: $localStorage.service+'FinanceAPI/feeFine',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                // console.log(response,'feefine');
                $scope.feeFineList.push(response.message);
            }).error(function(data){
                console.log('error');
            });
            $scope.selectize_fine_options = $scope.feeFineList;
            $scope.selectize_fine_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fine',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $('#form_validation').parsley().validate();
                    });
                }
            };


            // Advanced selects
            $scope.courseList=[];
            $http({
                url: $localStorage.service+'FinanceAPI/fetchCourseDetails',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                // console.log(response,'course');
                $scope.courseList.push(response.message);
            }).error(function(data){
                console.log('error');
            });

           
            // Advanced selects
            $scope.studentList=[];
            $http({
                url: $localStorage.service+'FinanceAPI/fetchStudent',
                method : 'GET',
                headers: { 'access_token':$localStorage.access_token},
            }).success(function(response) {
                // console.log(response.message,'success');
                $scope.studentList.push(response.message);
            }).error(function(data){
                console.log('error');
            });

            var planets_data = $scope.selectize_student_options = $scope.studentList;
            $scope.selectize_student_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'PROFILE_ID',
                labelField: 'STUDENT_NAME',
                searchField: ['STUDENT_NAME','ADMISSION_NO'],
                create: false,
                placeholder: 'Student Name / Admission No',
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.STUDENT_NAME) + '</span><br>' +
                            '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.ADMISSION_NO) + '</span>' +
                            '</div>';
                    }
                }
            };

            $scope.initradioVal = function(){
                // return $scope.assigned_to == 'Course';
            }
             var $formValidate = $('#form_validation');
                $formValidate
                .parsley()
                .on('form:validated',function() {
                    // $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        // $scope.$apply();
                    }
                });

                $scope.clearValidation=function(){
                    $('#form_validation').parsley().reset();
                }
            $scope.saveFeeStructure=function(){
                console.log('yes');
            }

            

            $scope.cloneSection = function($event,$index,ITemArray) {
                var ArrayD=$scope.itemType_array[$index];
                console.log(ArrayD,'ArrayD');
                if (typeof ArrayD!="undefined") {
                    ArrayD.FEE_ITEM_ID=ArrayD.FEE_ITEM_ID || {};
                    if (ArrayD.FEE_ITEM_ID!="" && Object.keys(ArrayD.FEE_ITEM_ID).length!=0 && typeof ArrayD.AMOUNT!="undefined" && ArrayD.AMOUNT!="" && typeof ArrayD.DUE_DATE!="undefined" && ArrayD.DUE_DATE!="" && typeof ArrayD.FREQUENCY!="undefined" && ArrayD.FREQUENCY!="") {
                        $event.preventDefault();
                        $scope.form_dynamic.push({'FEE_ITEM_ID':'','AMOUNT':'','DUE_DATE':'','FREQUENCY':'','FEE_FINE_ID':''});
                    }else{
                        fillform();
                    }
                }else {
                    fillform();      
                }
            };
            function fillform(){
                UIkit.notify({
                    message : 'Please Fill current form',
                    status  : 'warning',
                    timeout : 1000,
                    pos     : 'top-center'
                });
            }

            $scope.checkDateValidation=function(data){
                if(data){
                    $timeout(function() {
                        $('#form_validation').parsley().validate();
                    }, 100);
                }else {
                    console.log(data,'true');
                }
            }

            $scope.course_options =$scope.courseList;
            $scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'COURSE_ID',
                labelField: 'COUSE_NAME',
                searchField: 'COUSE_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.getBatchList(value);
                    });
                }
            };
            $scope.getBatchList=function(courseID){
                $http({
                    url: $localStorage.service+'FinanceAPI/fetchBatchList',
                    method : 'GET',
                    params:{
                        'course_id':courseID
                    },
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    console.log(response.message,'batch');
                    $scope.batch_options=[];
                    $scope.batch_options.push(response.message);
                }).error(function(data){
                    console.log('error');
                });
            }
            $scope.batch_options =[];
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Batch',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        $scope.getStudentdetails(value);
                    });
                }
            };
            $scope.assignStatus=false;
            $scope.getStudentdetails=function(batchID){
                $http({
                    url: $localStorage.service+'FinanceAPI/getStudentList',
                    method : 'GET',
                    params:{'batch_id':batchID},
                    headers: { 'access_token':$localStorage.access_token},
                }).success(function(response) {
                    $scope.studentViewBatch=response.message;
                    $scope.assignStatus=true;
                }).error(function(data){
                    console.log('error');
                });
            }
            $scope.studentCheck=false;
            $scope.studentData=[];  
            $scope.saveFeeStructure=function(){
                // console.log($scope.studentData,'datadata');
                angular.forEach($scope.itemType_array, function(value, keys){
                    var due_date = value.DUE_DATE.split(".");
                    value.DUE_DATE = due_date[2]+"-"+due_date[0]+"-"+due_date[1];
                });
                $http({
                    method:'POST',
                    url: $localStorage.service+'FinanceAPI/feeStructure',
                    data: {
                        'stru_id' : $scope.structure_id,
                        'structure_name' : $scope.structure_name,
                        // 'assigned_to' : $scope.assigned_to,
                        // 'studentData': $scope.studentData,
                        // 'student':$scope.student_id,
                        // 'batch':$scope.batch_id,
                        'feedata' : $scope.itemType_array
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'success');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.finance.fee.feeStructureDetails');
                        },200);
                    }else {
                        UIkit.modal.alert('Structure Name Already Exists');
                    }
                    
                });
            };
            $scope.arrayData=[];
            $scope.saveData=function(){
                console.log('res',$scope.arrayData);  
            }
        }
    ]);