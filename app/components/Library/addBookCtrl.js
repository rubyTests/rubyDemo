angular
    .module('rubycampusApp')
    .controller('addBookCtrl', [
        '$scope',
        '$timeout',
        '$resource',
        '$compile',
        '$filter',
        '$http',
        '$rootScope',
        '$localStorage',
        '$state',
        function ($scope, $timeout, $resource, $compile, $filter, $http, $rootScope, $localStorage, $state) {
            $('.dropify').dropify();
            $('.dropify-fr').dropify({
                messages: {
                    default: 'Glissez-déposez un fichier ici ou cliquez',
                    replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                    remove:  'Supprimer',
                    error:   'Désolé, le fichier trop volumineux'
                }
            });

            $http({
                method : 'GET',
                url : $localStorage.service+'LibraryAPI/autoGenBookCode',
                headers:{'access_token':$localStorage.access_token}
            }).then(function(return_data){
                $scope.bookcode = return_data.data.message[0];
                console.log($scope.bookcode.AUTO_CODE,'$scope.bookcode');
                if(!$scope.bookcode.AUTO_CODE){
                    $scope.book_code = 1001;
                }else{
                    $scope.book_code = 1001 + parseInt($scope.bookcode.AUTO_CODE);
                }
            })

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

            $scope.saveBookDetails = function(){
                var $fileInput = $('.dropify-preview').find('img').attr('src');
                $http({
                    method : 'POST',
                    url : $localStorage.service+'LibraryAPI/lBook',
                    data : {
                        'book_id' : $scope.book_id,
                        'name' : $scope.book_name,
                        'code' : $scope.book_code,
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
                        'totalQuantity' : $scope.book_quantity,
                        // 'totalQuantity' : $scope.invoice_date,
                        'image' : $fileInput
                    },
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(return_data){
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

            $scope.backBtn=function(){
                window.history.back();
            }
        }
    ]);