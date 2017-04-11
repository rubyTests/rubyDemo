angular
    .module('rubycampusApp')
    .controller('postAddCtrl', [
        '$scope',
        '$state',
        '$rootScope',
        '$window',
        '$timeout',
        function ($scope,$state,$rootScope,$window,$timeout) {

        	$('.dropify').dropify();
        	
        	$scope.selectize_courseNew_options = ["Course 1", "Course 2", "Course 3", "Course 4", "Course 5"];
            $scope.selectize_courseNew_options.push("Create New");
            $scope.selectize_courseNew_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course',
                render: {
                    option: function (item, escape) {
                        console.log(item,"item");
                        console.log(escape,"escape");
                        return '<div class="option id="modal_header_footer"">' +
                                '<div class="text">' +
                                    '<span class="name">' + escape(item.text) + '</span>' +
                               '</div>' +
                            '</div>';
                    }
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(selectize) {
                        if(selectize=='Create New'){
                            var modal = UIkit.modal("#modal_header_footer",{bgclose: false, keyboard:false});
                            modal.show();
                            //$state.go('restricted.academics.course')
                        } 
                    });
                }
                
            };

            $scope.selectize_batch_options = ["Batch 1", "Batch 2", "Batch 3", "Batch 4", "Batch 5"];
            $scope.selectize_batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch'
            };

            $scope.selectize_category_options = ["Category One", "Category Two", "Category Three", "Category Four", "Category Five"];
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category'
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