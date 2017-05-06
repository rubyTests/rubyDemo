angular
    .module('rubycampusApp')
    .controller('itemViewCtrl', [
        '$scope',
        '$rootScope',
        'products_data',
        function ($scope,$rootScope,products_data) {
            $('.dropify').dropify();

            $('.dropify-fr').dropify({
                messages: {
                    default: 'Glissez-déposez un fichier ici ou cliquez',
                    replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                    remove:  'Supprimer',
                    error:   'Désolé, le fichier trop volumineux'
                }
            });
            $scope.addleavecategory=function(){
                $scope.tit_caption="Add";
                $scope.status="Save";
                $scope.selectize_employee='';
                $scope.selectize_leavetype='';
                $scope.description='';
                $scope.from_date='';
                $scope.upto_date='';
                $scope.total_leave='';
                $scope.leave_status='';
                $('.uk-modal').find('input').trigger('blur');
            }
            $scope.editLeaveCategory=function(data){
                $scope.tit_caption="Edit";
                $scope.status="update";
                if (data) {
                    $scope.products=data;
                }
            }
            // products data
            $scope.products_data = products_data;

            $scope.pageSize = 5;

            $scope.filter_category_options = [
                
                {
                    value: 'Category 1',
                    title: 'Category 1'
                },
                {
                    value: 'Category 2',
                    title: 'Category 2'
                },
                {
                    value: 'Category 3',
                    title: 'Category 3'
                }
            ];

            $scope.filter_category_config = {
                create: false,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Item Category...'
            };
            $scope.filter_category_config_one = {
                create: false,
                maxItems:1,
                valueField: 'value',
                labelField: 'title',
                placeholder: 'Item Category...'
            };

            $scope.filterData = {
                category: ["Category 1","Category 2","Category 3"]
            };

            $scope.filter_pageSize = ['5', '10', '15'];

        }
    ])
;
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};