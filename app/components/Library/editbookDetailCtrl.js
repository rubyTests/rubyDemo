angular
    .module('rubycampusApp')
    .controller('editbookDetailCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$resource',
        '$filter',
        '$compile',
        '$location',
        '$stateParams',
        '$state',
        '$localStorage',
        '$http',
        function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location,$stateParams,$state,$localStorage,$http) {

            $scope.deptData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'AcademicsAPI/departmentlist',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.deptData.push(return_data.data.message);
            })

            $scope.selectize_dept_options =$scope.deptData;
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };

            $scope.CategoryData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'LibraryAPI/lCategory',
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

            $scope.SubjectData=[];
            $http({
                method : 'GET',
                url : $localStorage.service+'AcademicsAPI/fetchSubjectData',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.SubjectData.push(return_data.data.data);
            })

            $scope.selectize_subject_options =$scope.SubjectData;
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Subject',
                valueField: 'ID',
                labelField: 'NAME',
                searchField: 'NAME',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        console.log(value);
                    });
                }
            };


            $scope.book_data = [];
            $http({
                method:'GET',
                url: $localStorage.service+'LibraryAPI/lBook',
                params: {
                    'id' : $stateParams.id,
                },
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                console.log(return_data,'return_datareturn_data');
                $scope.book_data = return_data.data.message[0];
                $scope.book_id = $scope.book_data.ID;
                $scope.book_name = $scope.book_data.NAME;
                $scope.book_author = $scope.book_data.AUTHOR;
                $scope.book_isbn_no = $scope.book_data.ISBN;
                $scope.book_regulation = $scope.book_data.REGULATION;
                $scope.book_publish_year = $scope.book_data.YEAROFPUBLISHED;
                $scope.book_pulisher = $scope.book_data.PUBLISHER;
                $scope.book_edition = $scope.book_data.EDITION;
                $scope.book_rack_no = $scope.book_data.RACKNO;
                $scope.book_price = $scope.book_data.PRICE;
                $scope.book_quantity = $scope.book_data.C_QUANTITY;
                $scope.book_image = $scope.book_data.IMAGE;
                $timeout(function(){
                    $scope.selectize_dept = $scope.book_data.DEPT_ID;
                    $scope.selectize_category = $scope.book_data.CATEGORY_ID;
                    $scope.selectize_subject = $scope.book_data.SUBJECT_ID;
                },200);
                // $scope.grn_id = $scope.grn_data.ID;
                // $scope.grn_number = $scope.grn_data.GRN_NUMBER;
                // $scope.grn_date = $scope.grn_data.GRN_DATE;
                // $scope.selectize_purchaseOrder = $scope.grn_data.PURCHASE_ORDER_ID;
                // $scope.invoice_number = $scope.grn_data.INVOICE_NO;
                // $scope.invoice_date = $scope.grn_data.INVOICE_DATE;
                // $scope.purchaseOrderItem_options = $scope.grn_data.grn_items;
            });

            $scope.updateBookDetails = function(){
                var $fileInput = $('.dropify-preview').find('img').attr('src');
                $http({
                    method : 'POST',
                    url : $localStorage.service+'LibraryAPI/lBook',
                    data : {
                        'book_id' : $scope.book_id,
                        'name' : $scope.book_name,
                        'categoryId' : $scope.selectize_category,
                        'deptId' : $scope.selectize_dept,
                        'subjectId' : $scope.selectize_subject,
                        'author' : $scope.book_author,
                        'regulation' : $scope.book_regulation,
                        'yearOfPublished' : $scope.book_publish_year,
                        'ISBN' : $scope.book_isbn_no,
                        'publisher' : $scope.book_publisher,
                        'edition' : $scope.book_edition,
                        'price' : $scope.book_price,
                        'rackNO' : $scope.book_rack_no,
                        'currentQuantity' : $scope.book_quantity,
                        // 'totalQuantity' : $scope.invoice_date,
                        'image' : $fileInput
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
                    console.log(return_data,'return_datareturn_datakkk');
                    if(return_data.data.status==true){
                        UIkit.notify({
                            message : return_data.data.message,
                            status  : 'success',
                            timeout : 2000,
                            pos     : 'top-center'
                        });
                        $timeout(function(){
                            $state.go('restricted.library.bookviewdetails');
                        },200);
                    }else {
                        UIkit.modal.alert('Already Exists');
                    }
                })
            }

            $('.dropify').dropify({
                tpl: {
                    wrap:            '<div class="dropify-wrapper"></div>',
                    loader:          '<div class="dropify-loader"></div>',
                    message:         '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                    preview:         '<div class="dropify-preview"><span class="dropify-render"><img src="'+$scope.book_image+'"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                    //preview:         '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                    filename:        '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                    clearButton:     '<button type="button" class="dropify-clear">{{ remove }}</button>',
                    errorLine:       '<p class="dropify-error">{{ error }}</p>',
                    errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
                }
            });

            $scope.backBtn=function(){
                window.history.back();
            }
        }
    ]);