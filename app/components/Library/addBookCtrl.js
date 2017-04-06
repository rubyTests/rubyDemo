angular
    .module('rubycampusApp')
    .controller('addBookCtrl', [
        '$scope',
        function ($scope) {
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