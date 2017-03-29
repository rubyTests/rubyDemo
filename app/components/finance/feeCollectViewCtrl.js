angular
    .module('altairApp')
    .controller('feeCollectViewCtrl', [
        '$scope',
        '$window',
        '$timeout',
        'struct_data',
        '$filter',
        function ($scope,$window,$timeout,struct_data,$filter) {
            $scope.totalAmount = 0;
            $scope.newData = [
                        // {FeeStructure_Name:'',FeeItemCount:[{Fee_Item_Name:''},{Fee_Item_Name:''}]}
                        // {FeeStructure_Name:'Fee Structure 2',FeeItemCount:[{Fee_Item_Name:'Tution Fee'},{Fee_Item_Name:'Tution Fee1'}]},
                        // {FeeStructure_Name:'Fee Structure 3',FeeItemCount:[{Fee_Item_Name:'Tution Fee'},{Fee_Item_Name:'Tution Fee1'}]}
                        ];
            $scope.form_template = [
                [
                    {
                        'type': 'text',
                        'name': 'firstName',
                        'label': 'First Name'
                    },
                    {
                        'type': 'text',
                        'name': 'lastName',
                        'label': 'Last Name'
                    }
                ],
                [
                    {
                        'type': 'text',
                        'name': 'company',
                        'label': 'Company'
                    }
                ],
                [
                    {
                        'type': 'radio',
                        'label': 'Gender',
                        'name': 'gender',
                        'inputs': [
                            {
                                'label': 'Man',
                                'value': 'man'
                            },
                            {
                                'label': 'Woman',
                                'value': 'woman'
                            }
                        ]
                    },
                    {
                        'type': 'switch',
                        'label': 'Contact',
                        'inputs': [
                            {
                                'label': 'Email',
                                'name': 'switch_email'
                            },
                            {
                                'label': 'Phone',
                                'name': 'switch_phone'
                            }
                        ]
                    }
                ],
                [
                    {
                        'type': 'selectize',
                        'name': 'city',
                        'position': 'bottom',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'placeholder': 'City...'
                        },
                        'data': [
                            {
                                "value": "city_a",
                                "title": "City A"
                            },
                            {
                                "value": "city_b",
                                "title": "City B"
                            },
                            {
                                "value": "city_c",
                                "title": "City C"
                            },
                            {
                                "value": "city_d",
                                "title": "City D"
                            },
                            {
                                "value": "city_e",
                                "title": "City E"
                            }
                        ]
                    },
                    {
                        'type': 'selectize',
                        'name': 'country',
                        'config': {
                            'valueField': 'value',
                            'labelField': 'title',
                            'create': false,
                            'maxItems': 1,
                            'placeholder': 'Country...'
                        },
                        'data': [
                            {
                                "value": "country_a",
                                "title": "Country A"
                            },
                            {
                                "value": "country_b",
                                "title": "Country B"
                            },
                            {
                                "value": "country_c",
                                "title": "Country C"
                            },
                            {
                                "value": "country_d",
                                "title": "Country D"
                            },
                            {
                                "value": "country_e",
                                "title": "Country E"
                            }
                        ]
                    }
                ]
            ];

            $scope.form_dynamic = [];
            $scope.form_dynamic.push($scope.form_template);

            $scope.form_dynamic_model = [];

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

            $scope.selectize_paymode_options = ["Cash", "Cheque", "DD","Others"];
            $scope.selectize_paymode_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Payment Mode'
            };

            $scope.selectize_fine_options = ["Tution Fee Fine", "Book Fee Fine", "Hostel Fine"];
            $scope.selectize_fine_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Fine'
            };

            // Advanced selects

            $scope.struct_data = struct_data;

            var feeStruct_data = $scope.selectize_feeStruct_options = struct_data;

            $scope.selectize_feeStruct_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'id',
                labelField: 'FeeStructure_Name',
                searchField: 'FeeStructure_Name',
                create: false,
                placeholder: 'Select Fee Structure...',
                render: {
                    option: function(feeStruct_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(feeStruct_data.FeeStructure_Name) + '</span><br>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                },
                onDelete:function(values){
                    var data = $filter('filter')($scope.struct_data, {id : values[0]}, true);
                    var Dataindex=$scope.newData.indexOf(data[0]);
                    // console.log(Dataindex,"Dataindex");
                    $scope.newData.splice(Dataindex,1);
                    // console.log($scope.newData,"newData");
                },
                onInitialize: function(selectize){
                    selectize.on('change', function(selectize) {
                        if(selectize){
                            var splitVal = selectize.split(',');
                            var total = 0;
                            $scope.feesItem=[];
                            for($i=0;$i<splitVal.length;$i++){
                                var selectizeData = $filter('filter')($scope.struct_data, {id : splitVal[$i]});
                                var temparray=[];
                                angular.forEach(selectizeData[0].FeeItemCount, function(value,keys){
                                    temparray[keys]={fees:value.Amount};
                                    total+=parseInt(value.Amount);
                                    $scope.feesItem[$i]=temparray;
                                });
                                if ($scope.newData.indexOf(selectizeData[0])==-1) $scope.newData.push(selectizeData[0]);
                            }                        
                            $scope.totalAmount = total;
                            $scope.totalPaid = total;    
                        }
                        
                        
                    });
                }
            };

            // Advanced selects

            var planets_data = $scope.selectize_planets_options = [
                {id: 1, title: 'Rafeeq', url: '444'},
                {id: 2, title: 'Saravanan', url: '222'},
                {id: 3, title: 'Gopi', url: '222'},
                {id: 4, title: 'Senthil', url: '222'},
                {id: 5, title: 'Mani', url: '222'},
                {id: 6, title: 'Vijay', url: '222'},
                {id: 7, title: 'Karthil', url: '222'},
                {id: 8, title: 'Selva', url: '222'}
            ];

            $scope.selectize_planets_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                create: false,
                placeholder: 'Student Name / Admission No',
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.title) + '</span><br>' +
                            '<span class="title Addition uk-text-muted uk-text-small">' + escape(planets_data.url) + '</span>' +
                            '</div>';
                    }
                    // item: function(planets_data, escape) {
                    //     return '<div class="item"><a href="' + escape(planets_data.url) + '" target="_blank">' + escape(planets_data.title) + '</a></div>';
                    // }
                }
            };

            $scope.checkbox_demo_1 = true;

            $scope.forms_advanced = {
                "input_error": "Something wrong",
                "input_ok": "All ok",
                "ionslider_1": 23,
                "ionslider_2": {
                    "from": 160,
                    "to": 592
                },
                "ionslider_3": 40,
                "ionslider_4": {
                    "from": 20,
                    "to": 80
                },
                selectize_planets: ["2", "3"]
            };


            // $timeout(function() {
            //     var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            //     $scope.forms_advanced.datepicker = utc;
            // }, 1000);

            var $maskedInput = $('.masked_input');
            if($maskedInput.length) {
                $maskedInput.inputmask();
            }

            $scope.changePaid = function () {
                var total = 0;
                angular.forEach($scope.feesItem, function(value,keys){
                    angular.forEach(value, function(value1,keys1){
                        total+=parseInt(value1.fees);
                    });
                });
                $scope.totalPaid=total;
            };

        }
    ]);