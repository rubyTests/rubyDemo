angular
    .module('altairApp')
    .controller('instDetailCtrl', [
        '$scope',
        'utils',
        function ($scope,utils) {

            var $wizard_advanced_form = $('#wizard_advanced_form');

            $scope.finishedWizard = function() {
                var form_serialized = JSON.stringify( utils.serializeObject($wizard_advanced_form), null, 2 );
                UIkit.modal.alert('<p>Wizard data:</p><pre>' + form_serialized + '</pre>');
            };

            $scope.selectize_instType_options = ["K-12", "Higher Education"];
            $scope.selectize_instType_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Institution Type..'
            };
            $scope.selectize_timezone_options = ["GMT+01:00", "GMT-05:00", "GMT+05:30 ","GMT+02:00"];
            $scope.selectize_timezone_config = {
                create: false,
                maxItems: 1,
                placeholder: 'TimeZone...'
            };
            $scope.selectize_currency_options = ["INR", "MYR", "MVR","MGF","JPY", "HKD", "GWP","EUR"];
            $scope.selectize_currency_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Currency...'
            };
            $scope.selectize_nation_options = ["India", "Sri Langa", "America"];
            $scope.selectize_nation_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select natioanality...'
            };
            $scope.selectize_blood_options = ["O+ve", "A+ve","A+ve","B-ve","B+ve","O-ve"];
            $scope.selectize_blood_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Blood Group...'
            };
            $scope.selectize_cat_options = ["Category 1", "Category 2","Category 3"];
            $scope.selectize_cat_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Category...'
            };
            $scope.selectize_city_options = ["Cuddalore", "Villupuram","Puducherry","Chennai"];
            $scope.selectize_city_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select City...'
            };
            $scope.selectize_state_options = ["Tamilnadu", "Andhra Pradesh","Assam","Bihar"];
            $scope.selectize_state_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select State...'
            };

        }
    ]);