angular
    .module('rubycampusApp')
    .controller('postAddCtrl', [
        '$scope',
        '$state',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter',
        '$http',
        '$rootScope',
        '$localStorage',
        function ($scope, $state, $rootScope, $window, $timeout, $filter, $http, $rootScope, $localStorage) {

        	$('.dropify').dropify();
        	
        	$http.get($localStorage.service+'AcademicsAPI/courseDetail',{headers:{'access_token':$localStorage.access_token}})
            .success(function(course_data){
                $scope.selectize_courseId_options=course_data.message;
            });
                
            $scope.selectize_courseId_options =[];
            $scope.selectize_courseId_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Course',
                valueField: 'ID',
                labelField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.CategoryData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'RepositoryAPI/Rep_Category',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.CategoryData.push(return_data.data.message);
            })

            $scope.selectize_category_options =$scope.CategoryData;
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };



            $scope.saveRepPostDetails = function(){
                // var $fileInput = $('.dropify-preview').find('img').attr('src');
                var $fileInput = document.getElementById('input-file-a').files[0];
                var formdata = new FormData();
                formdata.append('file', $fileInput);
                formdata.append('rep_id', $scope.rep_id);
                formdata.append('rep_title', $scope.rep_title);
                formdata.append('rep_content', $scope.rep_content);
                formdata.append('courseId', $scope.selectize_category);
                formdata.append('categoryId', $scope.selectize_courseId);
                console.log(formdata,"formdata");
                $http({
                    method : 'POST',
                    url : $localStorage.service+'RepositoryAPI/Rep_Post',
                    data: formdata,
                    // data : {
                    //     'rep_id' : $scope.rep_id,
                    //     'rep_title' : $scope.rep_title,
                    //     'rep_upload_file' : $fileInput,
                    //     'rep_content' : $scope.rep_content,
                    //     'categoryId' : $scope.selectize_category,
                    //     'courseId' : $scope.selectize_courseId
                    // },
                    headers:{'access_token':$localStorage.access_token, 'Content-Type': undefined}
                }).then(function(return_data){
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.repository.postView');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }


            $scope.selectize_batch_options = ["Batch 1", "Batch 2", "Batch 3", "Batch 4", "Batch 5"];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch'
            };

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

angular.module('rubycampusApp').directive('courseDirective',function(){
    return {
        restrict: 'E',
        controller: 'courseCtrl',
        controllerAs: 'cCtrl',
        templateUrl: 'app/components/academics/courseBatch/SenCourse.html',
    };
});