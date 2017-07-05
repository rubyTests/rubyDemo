angular
    .module('rubycampusApp')
    .controller('assignmentEditCtrl', [
        '$scope',
        '$rootScope',
        '$timeout','$filter','$compile','$stateParams','$state','$localStorage','$http',
        function ($scope,$rootScope,$timeout, $filter,$compile,$stateParams,$state,$localStorage,$http) {
            
            $scope.courseData=[];
            $scope.batchData=[];
            $scope.getSub_id = [];
            $http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(data){
                $scope.courseData.push(data.message);
            });
            
            $scope.fetchBatch=function(id){
                $http.get($localStorage.service+'AcademicsAPI/fetchbatchDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                .success(function(batch_data){
                    $scope.selectize_batch_options=batch_data.data;
                });
                
                $http.get($localStorage.service+'AcademicsAPI/fetchSubjectDetailList',{params:{id:id},headers:{'access_token':$localStorage.access_token}})
                .success(function(return_data){
                    $scope.selectize_subject_options = return_data.data;
                });
            }
            
            $scope.selectize_course_options =$scope.courseData;
            $scope.selectize_course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course...',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                        $scope.fetchBatch(value);
                        //$scope.fetchSubject(value);
                    });
                    
                }
            };
            
            $scope.selectize_batch_options=[];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                    console.log(value,'Batch');
                    });
                }
            };

            $scope.selectize_subject_options = [];
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Subject',
                valueField: 'COU_ID',
                labelField: 'COURSE_NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(val) {
                        console.log(val,'Subject');
                    });
                }
            };

            $http({
              method : "GET",
              url : $localStorage.service+"AssignmentAPI/assignmentDetail",
              params :{id : $stateParams.id},
              headers:{'access_token':$localStorage.access_token}
            }).then(function mySucces(rerurn_data) {
                $scope.assign_id=rerurn_data.data.data[0].ID;
                $scope.assign_name=rerurn_data.data.data[0].NAME;
                $scope.assign_content=rerurn_data.data.data[0].CONTENT;
                $scope.assign_dueDate=rerurn_data.data.data[0].DUE_DATE;
                $timeout(function(){
                    $scope.assign_courseID=rerurn_data.data.data[0].COURSE_ID;
                    $scope.assign_batchID=rerurn_data.data.data[0].BATCH_ID;
                    $scope.assign_subjectID=rerurn_data.data.data[0].SUBJECT_ID;
                },200);
            },function myError(response){
                console.log(response);
            });

            $scope.updateAssignmentDetails=function(){
                $http({
                    method:'POST',
                    url: $localStorage.service+'AssignmentAPI/assignmentDetail',
                    data: {
                        'id' : $scope.assign_id,
                        'name' : $scope.assign_name,
                        'content' : $scope.assign_content,
                        'course_id' : $scope.assign_courseID,
                        'batch_id' : $scope.assign_batchID,
                        'subject_id' : $scope.assign_subjectID,
                        'due_date' : $scope.assign_dueDate
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data.data.message);
                    if(return_data.data.status==true){
                        $state.go('restricted.academics.assignment');
                    }
                });
            }

            $scope.selectize_clone_config = {
                plugins: {
                    'tooltip': ''
                }
            };

            $timeout( function(){ 
                // $('.mce-ico.mce-i-resize').parents('.mce-container-body.mce-flow-layout').hide();
            }, 4000);

            // clone section
            $scope.cloneSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic.push($scope.form_template);
            };

            // delete section
            $scope.deleteSection = function($event,$index) {
                $event.preventDefault();
                $scope.form_dynamic_model.splice($index,1);
                $scope.form_dynamic.splice($index,1);
            };

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                altair_uikit.reinitialize_grid_margin();
            });

            // $scope.tinymce_content ='<img alt="" src="assets/img/gallery/Image01.jpg" style="float:left; height:173px; margin-right:16px; margin-bottom: 16px; width:260px" />'+
            //     '<h1>Header</h1>'+
            //     'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur deleniti ducimus, eos fugit, mollitia neque praesentium quia quisquam quos sapiente voluptatem voluptatibus voluptatum. Assumenda consectetur deleniti doloremque fuga harum illum molestiae nisi possimus quidem vero. A accusantium alias aliquam animi cum doloremque eos est facilis illo, illum inventore ipsam itaque laboriosam maiores modi mollitia necessitatibus nemo non omnis perferendis quam quia, repellendus rerum vel veritatis voluptas voluptate? Aliquid asperiores at atque autem beatae consequatur culpa delectus eaque earum error et fugiat incidunt laborum libero molestias natus nobis odit optio, perspiciatis possimus quas saepe sapiente sed sint sit temporibus vel voluptatem. Adipisci alias assumenda dolorum eligendi enim, facilis ipsum iusto perferendis quod ratione repellat reprehenderit suscipit voluptatem. Cumque debitis eum facere facilis fugiat quo repellat sed veniam voluptas voluptate? Adipisci aliquid asperiores culpa laboriosam sint unde velit veritatis vero, voluptatibus? Accusantium aperiam aspernatur assumenda at consectetur consequuntur cupiditate dicta ducimus earum ex exercitationem explicabo fugit id illo inventore iste magnam minima molestiae mollitia nam nihil nobis officiis omnis perspiciatis porro praesentium provident quibusdam quidem quo ratione reiciendis sed sunt tempora tempore ullam, ut veritatis! Ab, aliquid asperiores cum et impedit, labore obcaecati perferendis quae, quas recusandae sint suscipit vitae voluptatem.';

            $scope.tinymce_options = {
                skin_url: 'assets/skins/tinymce/material_design',
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste"
                ],
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                file_picker_callback : elFinderBrowser
            }

            function elFinderBrowser (callback, value, meta) {
                tinymce.activeEditor.windowManager.open({
                    file: '/file_manager/fm_tinymce.html',// use an absolute path!
                    title: 'File Manager',
                    width: 920,
                    height: 440,
                    resizable: 'yes'
                }, {
                    oninsert: function (file, elf) {
                        var url, reg, info;

                        // URL normalization
                        url = file.url;
                        reg = /\/[^/]+?\/\.\.\//;
                        while(url.match(reg)) {
                            url = url.replace(reg, '/');
                        }

                        // Make file info
                        info = file.name + ' (' + elf.formatSize(file.size) + ')';

                        // Provide file and text for the link dialog
                        if (meta.filetype == 'file') {
                            callback(url, {text: info, title: info});
                        }

                        // Provide image and alt text for the image dialog
                        if (meta.filetype == 'image') {
                            callback(url, {alt: info});
                        }

                        // Provide alternative source and posted for the media dialog
                        if (meta.filetype == 'media') {
                            callback(url);
                        }
                    }
                });
                return false;
            }
           
            $scope.backBtn = function(){
                window.history.back();
            }
        }
    ]);