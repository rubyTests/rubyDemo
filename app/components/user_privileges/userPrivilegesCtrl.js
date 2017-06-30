angular
    .module('rubycampusApp')
    .controller('userPrivilegesCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$compile',
        'variables',
        'ts_data',
        '$resource',
        '$filter',
        '$localStorage',
        '$http',
        function ($scope,$rootScope,$timeout,$compile,variables,ts_data,$resource,$filter,$localStorage,$http) {
            $scope.listcategory=[{id:1,role:'Student'}, {id:2,role:'Employee'}];
            $scope.emplyees=[{id:1,user:'user 1'}, {id:2,user:'user 2'}, {id:3,user:'user 3'}, {id:4,user:'user 4'}];
            $scope.table_data = ts_data;
            $scope.markedStudent=[];
            $scope.getData=function(item){
                item.remark= item.remark || '';
                item.duration=item.duration || '';
                $scope.modalData=item;
                var modal = UIkit.modal("#modal_header_footer");
                if ( modal.isActive() ) {
                    modal.hide();
                } else {
                    if(item.row_select==true){
                        modal.show();
                    }else{
                        UIkit.modal.confirm('Are you sure remove this student?', function(e) {
                            var indexof=$scope.markedStudent.indexOf(item);
                            $scope.markedStudent.splice(indexof,1);
                            // console.log($scope.markedStudent,"removed");
                        },function(){
                            item.row_select=true;
                        }, {
                            labels: {
                                'Ok': 'Ok'
                            }
                        });
                    }
                }
                // $scope.row_select=false;
            }
            $scope.department=[];
            $scope.course = [];
            $scope.batch = [];
            
            $scope.selectize_config = {
                create: false,
                maxItems: 1
            };
            $resource('data/calendar/department.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.department = response;
            });
            $resource('data/calendar/course.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.course = $scope.courseArray = response;
            });
            $resource('data/calendar/courseBatch.json')
            .query()
            .$promise
            .then(function(response) {
                $scope.batchArray = response;
            });
            $scope.department_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Department...',
                valueField: 'id',
                labelField: 'dept_name',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                        if(value==''){
                            $scope.course=[]
                        }else{
                            $scope.course=[]
                            var data=$filter('filter')($scope.courseArray, {dept_id: value});
                            if (data.length > 0)
                                $scope.course.push(data);
                        }
                    });
                }
            };
            $scope.course_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Course...',
                valueField: 'id',
                labelField: 'course_name',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                            if(value==''){
                                $scope.batch=[]
                            }else {
                               var data=$filter('filter')($scope.batchArray, {course_id : value});
                               if (data.length > 0)
                                
                                $scope.batch.push(data);
                            }
                        });
                    
                }
            };
            $scope.batch_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Batch...',
                valueField: 'id',
                labelField: 'cBatch_name',
            };
            $scope.userConfig = {
                create: false,
                valueField: 'id',
                labelField: 'user',
                onInitialize: function(selectize){
                   selectize.on('change', function(value) {
                            if(value==''){
                                $scope.userDetails=[]
                            }else {
                                $scope.userDetails=value;
                            }
                        });
                    
                }
            };
            $scope.getStatus=function(status){
                $scope.multipleSelectBox=status;
            };
            $scope.multipleSelectBox=false;
            $scope.categoryConfig = {
                create: false,
                maxItems: 1,
                valueField: 'id',
                labelField: 'role',
                onInitialize: function(selectize){
                    selectize.on('change', function(value) {
                            if(value==''){
                                $scope.course=[]
                                $scope.emplyee=[];
                            }else{
                                $scope.course = [];
                                if (value=='1') {
                                    $scope.course = $scope.courseArray;    
                                };                                
                                $scope.courseSelect=null;
                                $scope.emplyee=$scope.emplyees;
                            }
                        });
                    }
                };
            $scope.addstudent=function(){
                $scope.markedStudent.push($scope.modalData);
                // console.log($scope.markedStudent,"added");
            }
            $scope.checkboxdata={};
            $scope.showConfimation=function(){
                $scope.user_data=[];
                $scope.user_data.push({'user_details':{category:$scope.category, module:$scope.module, courseSelect:$scope.courseSelect, batchselected:$scope.submenusselected, user:$scope.userDetails}});
                var data =$filter('filter')($scope.menus,function(value){
                    return value.addOption==true || value.editOption==true || value.deleteOption==true || value.viewOption==true;
                });
                $scope.user_data.push({'menu_details':data});
                console.log($scope.user_data,"user_data");
                $http({
                    method:'POST',
                    url: $localStorage.service+"UserMenuAPI/userPrivileges",
                    data:{data:$scope.user_data},
                    headers:{'access_token':$localStorage.access_token}
                }).then(function(data){
                    console.log(data);
                });
            }
            $http({
                method:'GET',
                url: $localStorage.service+"UserMenuAPI/menuDetails",
                headers:{'access_token':$localStorage.access_token}
            }).then(function(data){
                console.log(data);
            });
            $scope.selctedCheckBox="Test";
            $scope.menus=[];
            $("#tree").fancytree({
                checkbox: false,
                titlesTabbable: true,
                quicksearch: true,
                // source : sourcedata,
                source: { url: $localStorage.service+"UserMenuAPI/menuDetails",headers:{'access_token':$localStorage.access_token}},

                extensions: ["table", "gridnav"],
                table: {
                    indentation: 20,
                    nodeColumnIdx: 2,
                    checkboxColumnIdx: 0
                },
                gridnav: {
                    autofocusInput: false,
                    handleCursorKeys: true
                },
                createNode: function(event, data) {
                    var node = data.node;
                    var menuDetails={id:node.data.id, link:node.data.link, title:node.title, icon:node.icon, submenu_id:node.data.submenu_id, menu_id:node.data.menu_id, key:node.key};
                    $scope.menus.push(menuDetails);
                    // console.log(menuDetails);
                    $tdList = $(node.tr).find(">td");
                    if( node.isFolder() ) {
                        // console.log($tdList,"$tdList.eq(2)");
                        $tdList.eq(2)
                            .prop("colspan", 6)
                            .nextAll().remove();
                    }
                }
            });
            $("#tree").delegate("input[type=checkbox]", "click", function(e){
                var node = $.ui.fancytree.getNode(e),
                   $input = $(e.target);
                var data=$filter('filter')($scope.menus, {key: node.key}, true);
                if($input.is(":checked")){
                    $scope.$apply(function () {
                        data[0][$input.attr('name')] = true;
                    });
                    
                    console.log(data[0]);
                }else{
                    $scope.$apply(function () {
                        data[0][$input.attr('name')] = false;
                    });
                }
                // console.log(data[0][$input.attr('name')]);
            });
     }       
    ]);