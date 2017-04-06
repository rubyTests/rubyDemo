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
        'notes_data',
        function ($scope,$rootScope,$timeout,$resource,$filter,$compile,$location,$stateParams,notes_data) {
             var empReturndata=$filter('filter')(notes_data, {id : parseInt($stateParams.id)}, true);
             // console.log(empReturndata[0].id,'empReturndata');
             $scope.bookname=empReturndata[0].BookName;
             $scope.selectize_dept=empReturndata[0].Department;
             $scope.selectize_category=empReturndata[0].Category;
             $scope.selectize_subject=empReturndata[0].Subject;
             $scope.author=empReturndata[0].Author;
             $scope.book_image=empReturndata[0].CoverImage;
             $scope.isbn_no=empReturndata[0].ISBN;
             $scope.regulation=empReturndata[0].Regulation;
             $scope.publish_year=empReturndata[0].YearOfPublished;
             $scope.pulisher=empReturndata[0].Publisher;
             $scope.edition=empReturndata[0].Edition;
             $scope.rack_no=empReturndata[0].RakNo;
             $scope.price=empReturndata[0].Price;
             $scope.curr_qty=empReturndata[0].currentQuantity;
             $scope.ViewData=empReturndata;
            $('.dropify').dropify();
            $('.dropify-fr').dropify({
                messages: {
                    default: 'Glissez-déposez un fichier ici ou cliquez',
                    replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                    remove:  'Supprimer',
                    error:   'Désolé, le fichier trop volumineux'
                }
            });
            $scope.selectize_dept_options = ["Computer Science and Engineering", "Information Technology","Electrical and Electronics Engineering","Civil Engineering","Mechanical Engineering"];
            $scope.selectize_dept_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...'
            };
            $scope.selectize_category_options = ["Technology", "Science","History","Journals","Dictionaries"];
            $scope.selectize_category_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category...'
            };
            $scope.selectize_subject_options = ["Data Structures and Algorithms", "Computer Networking","Laws Of Thermodynamics","Electronic Circuits","Computer Programming","Basic civil and mechanical engineering"];
            $scope.selectize_subject_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Subject...'
            };

            $scope.backBtn=function(){
                window.history.back();
            }
        }
    ]);