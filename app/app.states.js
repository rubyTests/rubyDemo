rubycampusApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/login', '/')
                .otherwise('/');

            $stateProvider
            // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/views/error.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })
            // -- LOGIN PAGE --
                .state("login", {
					url: "/",
					templateUrl: 'app/components/pages/customeloginView.html',
					controller: 'loginCtrl',   
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {   
							return $ocLazyLoad.load([
								'lazy_uikit',
								'lazy_iCheck',
								'app/components/pages/loginController.js'
							]);
						}]
					},
					data: {
                        pageTitle: 'Login'
                    }
				})
				.state("forgotpassword", {
					url: "/forgotpassword",
					templateUrl: 'app/components/pages/forgotpassword.html',
					controller: 'loginCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {   
							return $ocLazyLoad.load([
								'lazy_uikit',
								'lazy_iCheck',
								'app/components/pages/loginController.js'
							]);
						}]
					}
				})
            // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    url: "",
                    templateUrl: 'app/views/restricted.html',
					controller: 'mainCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_KendoUI'
                            ]);
                        }]
                    }
                })
            // -- DASHBOARD --
                .state("restricted.dashboard", {
                    url: "/dashboard",
                    templateUrl: 'app/components/dashboard/dashboardView.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_clndr',
                                'lazy_charts_c3',
                                'app/components/dashboard/dashboardController.js'
                            ], {serie: true} );
                        }],
                        sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        todo_data: function($http){
                            return $http({ method: 'GET', url: 'data/todo_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })

                // Added By Senthil 24/04/2017

                .state("restricted.mainStudashboard", {
                    url: "/mainStudashboard",
                    templateUrl: 'app/components/dashboard/mainStudashboard.html',
                    // controller: 'mainStudashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_clndr',
                                'lazy_charts_c3',
                                'app/components/dashboard/mainStudashboardCtrl.js'
                            ], {serie: true} );
                        }],
                        sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        todo_data: function($http){
                            return $http({ method: 'GET', url: 'data/todo_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Student Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })

                // End

                // Added By Senthil 25/04/2017

                .state("restricted.quickLinksView", {
                    url: "/quickLinksView",
                    templateUrl: 'app/components/Dashboard/quickLinksView.html',
                    controller: 'quickLinksViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_iCheck',
                                'lazy_tree',
                                'app/components/dashboard/quickLinksViewCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Tree'
                    }
                })

                // End

                ///RUBY CAMPUS Hr payroll and paygroup state  by Manikandan///
                .state("restricted.hr", {
                    template: '<div ui-view autoscroll="false"/>',
                    url :"/hr",
                    abstract: true
                })
                // .state("restricted.hr.payrollpayslip", {
                //     template: '<div ui-view autoscroll="false"/>',
                //     abstract: true
                // })
                .state("restricted.hr.payitem", {
                    url: "/payitem",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payitem.html',
                    controller: 'tables_examplesCtrl',
                    resolve: {
                        Pay_item: function($http){
                            return $http({method: 'GET', url: 'app/components/Hr/Payroll_Payslip/Payroll_temData/PayItem.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'xeditable','smart-table','smart-filter',
                                'app/components/Hr/Payroll_Payslip/payitem.js',
                            ]);
                        }]
                    }
                })
                .state("restricted.hr.Structure", {
                    url: "/payStructure",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/PayStructure.html',
                    controller: 'PayStructure',
                    resolve: {
                        Pay_item: function($http){
                            return $http({method: 'GET', url: 'app/components/Hr/Payroll_Payslip/Payroll_temData/PayStructure.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'xeditable','smart-table',
                                'app/components/Hr/Payroll_Payslip/PayStructure.js'
                            ]);
                        }]
                    }
                })
                .state("restricted.hr.AddPayCategory",{
                    url: "/AddpayCategory",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/PayCategory.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                            	'lazy_parsleyjs',
                            	'smart-filter',
                                'app/components/Hr/Payroll_Payslip/PayCategoryController.js'
                            ]);
                        }]
                    },
                    
                })

                .state("restricted.hr.EditPayCategory",{
                    url: "/EditpayCategory/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/EditPayCategory.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                            	'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/EditPayCategoryCtrl.js'
                            ]);
                        }]
                    },
                    params:{id:null}
                })
                .state("restricted.hr.ViewPayGroup",{
                    url: "/View-PayGroup/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/ViewPayGroup.html',
                    controller : 'ViewPayGroupCtrl',
                    parmas :{id:null},
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/Hr/Payroll_Payslip/ViewPayGroupCtrl.js'
                            ]);
                        }]
                    }
                    
                })
                .state("restricted.hr.ViewGroupEmployee",{
                    url: "/ViewGroup Employee/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/PayGroupEmployee.html',
                    // controller : 'PayGroupEmployeeCtrl',
                    parmas :{id:null},
                    resolve: {
                        // params:{'id': {value:null}},
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables','smart-filter',
                                'app/components/Hr/Payroll_Payslip/PayGroupEmployeeCtrl.js'
                            ]);
                        }]
                    }
                    
                })
                .state("restricted.hr.StructureGroup", {
                    url: "/payGroup",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/PayGroup.html',
                    // controller :'dt_default',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables','smart-filter',
                                'app/components/Hr/Payroll_Payslip/PayGroupController.js'
                            ]);
                        }]
                    }
                })
                .state("restricted.Library", {
                    url: "/Library",
                    templateUrl: 'app/components/Library/Library_gridView.html',
                    controller: 'Library_gridController',
                    resolve: {
                        products_data: function($http){
                            return $http({method: 'GET', url: 'app/components/Library/books/book.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/Library/Library_gridController.js'
                            ]);
                        }]
                    }
                })
                .state("restricted.BookDetail", {
                    url: "/BookDetail/{id}/{indexId}",
                    templateUrl: 'app/components/Library/Book_detailsView.html',
                    controller: 'BookDetailController',
                    parmas:{
                    'id': {value: null},
                    'indexId':{value:null}
                    },
                    resolve: {
                        Book_Details: function($http){
                            return $http({method: 'GET', url: 'app/components/Library/books/book.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/Library/BookDetailController.js');
                        }]
                    }
                })

                // calendar state added by manikandan on 20/03/2017 
                .state("restricted.plugins.calendar", {
                    url: "/calendar",
                    templateUrl: 'app/components/calender/calendarView.html',
                    controller: 'calendarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_masked_inputs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/calender/calendarController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Calendar'
                    }
                })
                .state("restricted.plugins.examination", {
                    url: "/examination",
                    templateUrl: 'app/components/calender/calendarExamination.html',
                    controller: 'examination',
                    resolve: {
                         user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_parsleyjs',
                                'lazy_character_counter',
                                'lazy_masked_inputs',
                                'lazy_datatables',
                                'lazy_charts_metricsgraphics',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/calender/calendarExamination.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Calendar'
                    }
                })
                .state("restricted.plugins.events", {
                    url: "/events",
                    templateUrl: 'app/components/calender/calendarNewEventsView.html',
                    controller: 'calendareventsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_character_counter',
                                'lazy_parsleyjs',
                                'lazy_masked_inputs',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/calender/calendarNewEventsView.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Calendar'
                    }
                })


                ///RUBY STATE CAMPUS END by Manikandan//


                // -- FORMS --
                .state("restricted.forms", {
                    url: "/forms",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.forms.regular", {
                    url: "/regular",
                    templateUrl: 'app/components/forms/regularView.html',
                    controller: 'regularCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/forms/regularController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Regular Elements'
                    }
                })
                .state("restricted.forms.advanced", {
                    url: "/advanced",
                    templateUrl: 'app/components/forms/advancedView.html',
                    controller: 'advancedCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/forms/advancedController.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Advanced Elements'
                    }
                })
                .state("restricted.forms.dynamic", {
                    url: "/dynamic",
                    templateUrl: 'app/components/forms/dynamicView.html',
                    controller: 'dynamicCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/forms/dynamicController.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Dynamic Elements'
                    }
                })
                .state("restricted.forms.file_input", {
                    url: "/file_input",
                    templateUrl: 'app/components/forms/file_inputView.html',
                    controller: 'file_inputCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_dropify',
                                'app/components/forms/file_inputController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'File Input (dropify)'
                    }
                })
                .state("restricted.forms.file_upload", {
                    url: "/file_upload",
                    templateUrl: 'app/components/forms/file_uploadView.html',
                    controller: 'file_uploadCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/forms/file_uploadController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'File Upload'
                    }
                })
                .state("restricted.forms.validation", {
                    url: "/validation",
                    templateUrl: 'app/components/forms/validationView.html',
                    controller: 'validationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/components/forms/validationController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Validation'
                    }
                })
                .state("restricted.forms.wizard", {
                    url: "/wizard",
                    templateUrl: 'app/components/forms/wizardView.html',
                    controller: 'wizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'app/components/forms/wizardController.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Wizard'
                    }
                })
                .state("restricted.forms.wysiwyg_ckeditor", {
                    url: "/wysiwyg_ckeditor",
                    templateUrl: 'app/components/forms/wysiwyg_ckeditorView.html',
                    controller: 'ckeditorCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/forms/wysiwyg_ckeditorController.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'ckEditor'
                    }
                })
                .state("restricted.forms.wysiwyg_tinymce", {
                    url: "/wysiwyg_tinymce",
                    templateUrl: 'app/components/forms/wysiwyg_tinymceView.html',
                    controller: 'tinymceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_tinymce',
                                'app/components/forms/wysiwyg_tinymceController.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'tinyMCE'
                    }
                })
                .state("restricted.forms.wysiwyg_inline", {
                    url: "/wysiwyg_inline",
                    templateUrl: 'app/components/forms/wysiwyg_ckeditorInlineView.html',
                    controller: 'ckeditorInlineCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/forms/wysiwyg_ckeditorInlineController.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'ckEditor inline'
                    }
                })

            // -- LAYOUT --
                .state("restricted.layout", {
                    url: "/layout",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.layout.top_menu", {
                    url: "/top_menu",
                    templateUrl: 'app/components/layout/top_menuView.html',
                    controller: 'top_menuCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/layout/top_menuController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Top Menu'
                    }
                })
                .state("restricted.layout.full_header", {
                    url: "/full_header",
                    templateUrl: 'app/components/layout/full_headerView.html',
                    controller: 'full_headerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/layout/full_headerController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Full Header'
                    }
                })

            // -- KENDO UI --
                .state("restricted.kendoui", {
                    url: "/kendoui",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('lazy_KendoUI');
                        }]
                    }
                })
                .state("restricted.kendoui.autocomplete", {
                    url: "/autocomplete",
                    templateUrl: 'app/components/kendoUI/autocompleteView.html',
                    controller: 'autocompleteCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/autocompleteController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Autocomplete (kendoUI)'
                    }
                })
                .state("restricted.kendoui.calendar", {
                    url: "/calendar",
                    templateUrl: 'app/components/kendoUI/calendarView.html',
                    controller: 'calendarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/calendarController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Calendar (kendoUI)'
                    }
                })
                .state("restricted.kendoui.colorpicker", {
                    url: "/colorPicker",
                    templateUrl: 'app/components/kendoUI/colorPickerView.html',
                    data: {
                        pageTitle: 'ColorPicker (kendoUI)'
                    }
                })
                .state("restricted.kendoui.combobox", {
                    url: "/combobox",
                    templateUrl: 'app/components/kendoUI/comboboxView.html',
                    controller: 'comboboxCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/comboboxController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Combobox (kendoUI)'
                    }
                })
                .state("restricted.kendoui.datepicker", {
                    url: "/datepicker",
                    templateUrl: 'app/components/kendoUI/datepickerView.html',
                    controller: 'datepickerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/datepickerController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Datepicker (kendoUI)'
                    }
                })
                .state("restricted.kendoui.datetimepicker", {
                    url: "/datetimepicker",
                    templateUrl: 'app/components/kendoUI/datetimepickerView.html',
                    controller: 'datetimepickerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/datetimepickerController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Datetimepicker (kendoUI)'
                    }
                })
                .state("restricted.kendoui.dropdown_list", {
                    url: "/dropdown_list",
                    templateUrl: 'app/components/kendoUI/dropdown_listView.html',
                    controller: 'dropdownListCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/dropdown_listController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Dropdown List (kendoUI)'
                    }
                })
                .state("restricted.kendoui.masked_input", {
                    url: "/masked_input",
                    templateUrl: 'app/components/kendoUI/masked_inputView.html',
                    controller: 'maskedInputCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/masked_inputController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Masked Input (kendoUI)'
                    }
                })
                .state("restricted.kendoui.menu", {
                    url: "/menu",
                    templateUrl: 'app/components/kendoUI/menuView.html',
                    controller: 'menuCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/menuController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Menu (kendoUI)'
                    }
                })
                .state("restricted.kendoui.multiselect", {
                    url: "/multiselect",
                    templateUrl: 'app/components/kendoUI/multiselectView.html',
                    controller: 'multiselectCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/multiselectController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Multiselect (kendoUI)'
                    }
                })
                .state("restricted.kendoui.numeric_textbox", {
                    url: "/numeric_textbox",
                    templateUrl: 'app/components/kendoUI/numeric_textboxView.html',
                    controller: 'numericTextboxCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/numeric_textboxController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Numeric textbox (kendoUI)'
                    }
                })
                .state("restricted.kendoui.panelbar", {
                    url: "/panelbar",
                    templateUrl: 'app/components/kendoUI/panelbarView.html',
                    data: {
                        pageTitle: 'PanelBar (kendoUI)'
                    }
                })
                .state("restricted.kendoui.timepicker", {
                    url: "/timepicker",
                    templateUrl: 'app/components/kendoUI/timepickerView.html',
                    data: {
                        pageTitle: 'Timepicker (kendoUI)'
                    }
                })
                .state("restricted.kendoui.toolbar", {
                    url: "/toolbar",
                    templateUrl: 'app/components/kendoUI/toolbarView.html',
                    controller: 'toolbarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/toolbarController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Toolbar (kendoUI)'
                    }
                })
                .state("restricted.kendoui.window", {
                    url: "/window",
                    templateUrl: 'app/components/kendoUI/windowView.html',
                    controller: 'windowCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/kendoUI/windowController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Window (kendoUI)'
                    }
                })
            // -- COMPONENTS --
                .state("restricted.components", {
                    url: "/components",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }"/>',
                    abstract: true,
                    ncyBreadcrumb: {
                        label: 'Components'
                    }
                })
                .state("restricted.components.accordion", {
                    url: "/accordion",
                    controller: 'accordionCtrl',
                    templateUrl: 'app/components/components/accordionView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/accordionController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Accordion (components)'
                    }
                })
                .state("restricted.components.autocomplete", {
                    url: "/autocomplete",
                    templateUrl: 'app/components/components/autocompleteView.html',
                    controller: 'autocompleteCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/autocompleteController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Autocomplete (components)'
                    }
                })
                .state("restricted.components.breadcrumbs", {
                    url: "/breadcrumbs",
                    templateUrl: 'app/components/components/breadcrumbsView.html',
                    controller: 'breadcrumbsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/breadcrumbsController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Breadcrumbs (components)'
                    },
                    ncyBreadcrumb: {
                        label: 'Breadcrumbs'
                    }                })
                .state("restricted.components.buttons", {
                    url: "/buttons",
                    templateUrl: 'app/components/components/buttonsView.html',
                    data: {
                        pageTitle: 'Buttons (components)'
                    }
                })
                .state("restricted.components.buttons_fab", {
                    url: "/buttons_fab",
                    templateUrl: 'app/components/components/fabView.html',
                    data: {
                        pageTitle: 'Buttons FAB (components)'
                    }
                })
                .state("restricted.components.cards", {
                    url: "/cards",
                    templateUrl: 'app/components/components/cardsView.html',
                    controller: 'cardsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/cardsController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Cards (components)'
                    }
                })
                .state("restricted.components.colors", {
                    url: "/colors",
                    templateUrl: 'app/components/components/colorsView.html',
                    data: {
                        pageTitle: 'Colors (components)'
                    }
                })
                .state("restricted.components.common", {
                    url: "/common",
                    templateUrl: 'app/components/components/commonView.html',
                    data: {
                        pageTitle: 'Common (components)'
                    }
                })
                .state("restricted.components.dropdowns", {
                    url: "/dropdowns",
                    templateUrl: 'app/components/components/dropdownsView.html',
                    data: {
                        pageTitle: 'Dropdowns (components)'
                    }
                })
                .state("restricted.components.dynamic_grid", {
                    url: "/dynamic_grid",
                    templateUrl: 'app/components/components/dynamic_gridView.html',
                    data: {
                        pageTitle: 'Dynamic Grid (components)'
                    }
                })
                .state("restricted.components.footer", {
                    url: "/footer",
                    templateUrl: 'app/components/components/footerView.html',
                    controller: 'footerCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/footerController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Footer (components)'
                    }
                })
                .state("restricted.components.grid", {
                    url: "/grid",
                    templateUrl: 'app/components/components/gridView.html',
                    data: {
                        pageTitle: 'Grid (components)'
                    }
                })
                .state("restricted.components.icons", {
                    url: "/icons",
                    templateUrl: 'app/components/components/iconsView.html',
                    data: {
                        pageTitle: 'Icons (components)'
                    }
                })
                .state("restricted.components.list_grid_view", {
                    url: "/list_grid_view",
                    templateUrl: 'app/components/components/list_gridView.html',
                    controller: 'list_gridCtrl',
                    resolve: {
                        products_data: function($http){
                            return $http({method: 'GET', url: 'data/ecommerce_products.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/list_gridController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Lists/Grid View (components)'
                    }
                })
                .state("restricted.components.lists", {
                    url: "/lists",
                    templateUrl: 'app/components/components/listsView.html',
                    data: {
                        pageTitle: 'Lists (components)'
                    }
                })
                .state("restricted.components.modal", {
                    url: "/modal",
                    templateUrl: 'app/components/components/modalView.html',
                    data: {
                        pageTitle: 'Modals/Lightboxes (components)'
                    }
                })
                .state("restricted.components.nestable", {
                    url: "/nestable",
                    templateUrl: 'app/components/components/nestableView.html',
                    controller: 'nestableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/nestableController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Nestable (components)'
                    }
                })
                .state("restricted.components.notifications", {
                    url: "/notifications",
                    templateUrl: 'app/components/components/notificationsView.html',
                    controller: 'notificationsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/notificationsController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Notifications (components)'
                    }
                })
                .state("restricted.components.panels", {
                    url: "/panels",
                    templateUrl: 'app/components/components/panelsView.html',
                    data: {
                        pageTitle: 'Panels (components)'
                    }
                })
                .state("restricted.components.preloaders", {
                    url: "/preloaders",
                    templateUrl: 'app/components/components/preloadersView.html',
                    controller: 'preloadersCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/components/preloadersController.js');
                        }]
                    },
                    data: {
                        pageTitle: 'Preloaders (components)'
                    }
                })
                .state("restricted.components.slider", {
                    url: "/slider",
                    templateUrl: 'app/components/components/sliderView.html',
                    data: {
                        pageTitle: 'Slider (components)'
                    }
                })
                .state("restricted.components.slideshow", {
                    url: "/slideshow",
                    templateUrl: 'app/components/components/slideshowView.html',
                    data: {
                        pageTitle: 'Slideshow (components)'
                    }
                })
                .state("restricted.components.sortable", {
                    url: "/sortable",
                    templateUrl: 'app/components/components/sortableView.html',
                    controller: 'sortableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_dragula',
                                'app/components/components/sortableController.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Sortable (components)'
                    }
                })
                .state("restricted.components.switcher", {
                    url: "/switcher",
                    templateUrl: 'app/components/components/switcherView.html',
                    data: {
                        pageTitle: 'Switcher (components)'
                    }
                })
                .state("restricted.components.tables_examples", {
                    url: "/tables_examples",
                    templateUrl: 'app/components/components/tables_examplesView.html',
                    controller: 'tables_examplesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/components/tables_examplesController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Tables Examples (components)'
                    }
                })
                .state("restricted.components.tables", {
                    url: "/tables",
                    templateUrl: 'app/components/components/tablesView.html',
                    data: {
                        pageTitle: 'Tables (components)'
                    }
                })
                .state("restricted.components.tabs", {
                    url: "/tabs",
                    templateUrl: 'app/components/components/tabsView.html',
                    data: {
                        pageTitle: 'Tabs (components)'
                    }
                })
                .state("restricted.components.tooltips", {
                    url: "/tooltips",
                    templateUrl: 'app/components/components/tooltipsView.html',
                    data: {
                        pageTitle: 'Tooltips (components)'
                    }
                })
                .state("restricted.components.typography", {
                    url: "/typography",
                    templateUrl: 'app/components/components/typographyView.html',
                    data: {
                        pageTitle: 'Typography (components)'
                    }
                })
            // -- E-COMMERCE --
                .state("restricted.ecommerce", {
                    url: "/ecommerce",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.ecommerce.product_details", {
                    url: "/product_details",
                    templateUrl: 'app/components/ecommerce/product_detailsView.html',
                    controller: 'productCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/ecommerce/productController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Product Details'
                    }
                })
                .state("restricted.ecommerce.product_edit", {
                    url: "/product_edit",
                    templateUrl: 'app/components/ecommerce/product_editView.html',
                    controller: 'productCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/ecommerce/productController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Product Edit'
                    }
                })
                .state("restricted.ecommerce.products_list", {
                    url: "/products_list",
                    templateUrl: 'app/components/ecommerce/products_listView.html',
                    controller: 'products_listCtrl',
                    resolve: {
                        products_data: function($http){
                            return $http({method: 'GET', url: 'data/ecommerce_products.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/ecommerce/products_listController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Products List'
                    }
                })
                .state("restricted.ecommerce.products_grid", {
                    url: "/products_grid",
                    templateUrl: 'app/components/ecommerce/products_gridView.html',
                    controller: 'products_gridCtrl',
                    resolve: {
                        products_data: function($http){
                            return $http({method: 'GET', url: 'data/ecommerce_products.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/ecommerce/products_gridController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Products Grid'
                    }
                })
            // -- PLUGINS --
                .state("restricted.plugins", {
                    url: "/plugins",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                // .state("restricted.plugins.calendar", {
                //     url: "/calendar",
                //     templateUrl: 'app/components/plugins/calendarView.html',
                //     controller: 'calendarCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'lazy_fullcalendar',
                //                 'app/components/plugins/calendarController.js'
                //             ]);
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Calendar'
                //     }
                // })
                .state("restricted.plugins.code_editor", {
                    url: "/code_editor",
                    templateUrl: 'app/components/plugins/code_editorView.html',
                    controller: 'code_editorCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_codemirror',
                                'app/components/plugins/code_editorController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Code Editor'
                    }
                })
                .state("restricted.plugins.charts", {
                    url: "/charts",
                    templateUrl: 'app/components/plugins/chartsView.html',
                    controller: 'chartsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_chartist',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_c3',
                                'app/components/plugins/chartsController.js'
                            ], {serie: true});
                        }],
                        mg_chart_linked_1: function($http){
                            return $http({ method: 'GET', url: 'data/mg_brief-1.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        mg_chart_linked_2: function($http){
                            return $http({ method: 'GET', url: 'data/mg_brief-2.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        mg_confidence_band: function($http){
                            return $http({ method: 'GET', url: 'data/mg_confidence_band.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        mg_currency: function($http){
                            return $http({ method: 'GET', url: 'data/mg_some_currency.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Charts'
                    }
                })
                .state("restricted.plugins.charts_echarts", {
                    url: "/echarts",
                    templateUrl: 'app/components/plugins/charts_echartsView.html',
                    controller: 'charts_echartsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_echarts',
                                'app/components/plugins/charts_echartsController.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Charts (echarts)'
                    }
                })
                .state("restricted.plugins.context_menu", {
                    url: "/context_menu",
                    templateUrl: 'app/components/plugins/context_menuView.html',
                    controller: 'context_menuCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_context_menu',
                                'app/components/plugins/context_menuController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Context Menu'
                    }
                })
                .state("restricted.plugins.datatables", {
                    url: "/datatables",
                    templateUrl: 'app/components/plugins/datatablesView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/pluginatatablesController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Datatables'
                    }
                })
                .state("restricted.plugins.diff_view", {
                    url: "/diff_view",
                    templateUrl: 'app/components/plugins/diff_viewView.html',
                    controller: 'diff_viewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_diff',
                                'app/components/plugins/diff_viewController.js'
                            ],{serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Diff View'
                    }
                })
                .state("restricted.plugins.filemanager", {
                    url: "/filemanager",
                    controller: 'filemanagerCtrl',
                    templateUrl: 'app/components/plugins/filemanagerView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_filemanager',
                                'app/components/plugins/filemanagerController.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'FileManager'
                    }
                })
                .state("restricted.plugins.gantt_chart", {
                    url: "/gantt_chart",
                    controller: 'gantt_chartCtrl',
                    templateUrl: 'app/components/plugins/gantt_chartView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_gantt_chart',
                                'app/components/plugins/gantt_chartController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Gantt Chart'
                    }
                })
                .state("restricted.plugins.google_maps", {
                    url: "/google_maps",
                    templateUrl: 'app/components/plugins/google_mapsView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_google_maps',
                                'app/components/plugins/google_mapsController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Google Maps'
                    }
                })
                .state("restricted.plugins.image_cropper", {
                    url: "/image_cropper",
                    templateUrl: 'app/components/plugins/image_cropperView.html',
                    controller: 'image_cropperCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_image_cropper',
                                'app/components/plugins/image_cropperController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Google Maps'
                    }
                })
                .state("restricted.plugins.idle_timeout", {
                    url: "/idle_timeout",
                    templateUrl: 'app/components/plugins/idle_timeoutView.html',
                    controller: 'idle_timeoutCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_idle_timeout',
                                'app/components/plugins/idle_timeoutController.js'
                            ],{serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Idle Timeout'
                    }
                })
                .state("restricted.plugins.push_notifications", {
                    url: "/push_notifications",
                    templateUrl: 'app/components/plugins/push_notificationsView.html',
                    controller: 'push_notificationsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // push.js
                                'bower_components/push.js/push.min.js',
                                'app/components/plugins/push_notificationsController.js'
                            ],{serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Push Notifications'
                    }
                })
                .state("restricted.plugins.tablesorter", {
                    url: "/tablesorter",
                    templateUrl: 'app/components/plugins/tablesorterView.html',
                    controller: 'tablesorterCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/plugins/tablesorterController.js'
                            ],{serie:true});
                        }],
                        ts_data: function($http){
                            return $http({ method: 'GET', url: 'data/tablesorter.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Tablesorter'
                    }
                })
                .state("restricted.plugins.tour", {
                    url: "/tour",
                    templateUrl: 'app/components/plugins/tourView.html',
                    controller: 'tourCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_tour',
                                'app/components/plugins/tourController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Tour'
                    }
                })
                .state("restricted.plugins.tree", {
                    url: "/tree",
                    templateUrl: 'app/components/plugins/treeView.html',
                    controller: 'treeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_iCheck',
                                'lazy_tree',
                                'app/components/plugins/treeController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Tree'
                    }
                })
                .state("restricted.plugins.vector_maps", {
                    url: "/vector_maps",
                    templateUrl: 'app/components/plugins/vector_mapsView.html',
                    controller: 'vector_mapsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_vector_maps',
                                'app/components/plugins/vector_mapsController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Vector Maps'
                    }
                })

            // -- PAGES --
                .state("restricted.pages", {
                    url: "/pages",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    abstract: true
                })
                .state("restricted.pages.blank", {
                    url: "/blank",
                    templateUrl: 'app/components/pages/blankView.html',
                    data: {
                        pageTitle: 'Blank Page'
                    }
                })
                .state("restricted.pages.chat", {
                    url: "/chat",
                    templateUrl: 'app/components/pages/chatView.html',
                    controller: 'chatCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/chatController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Chat'
                    }
                })
                .state("restricted.pages.chatboxes", {
                    url: "/chatboxes",
                    templateUrl: 'app/components/pages/chatboxesView.html',
                    controller: 'chatboxesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/chatboxesController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Chatboxes'
                    }
                })
                .state("restricted.pages.contact_list", {
                    url: "/contact_list",
                    templateUrl: 'app/components/pages/contact_listView.html',
                    controller: 'contact_listCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/contact_listController.js'
                            ],{serie: true});
                        }],
                        contact_list: function($http){
                            return $http({ method: 'GET', url: 'data/contact_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Contact List'
                    }
                })
                .state("restricted.pages.contact_list_horizontal", {
                    url: "/contact_list_horizontal",
                    templateUrl: 'app/components/pages/contact_list_horizontalView.html',
                    controller: 'contact_list_horizontalCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/contact_list_horizontalController.js'
                            ],{serie: true});
                        }],
                        contact_list: function($http){
                            return $http({ method: 'GET', url: 'data/contact_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Contact List Horizontal'
                    }
                })
                .state("restricted.pages.gallery", {
                    url: "/gallery",
                    templateUrl: 'app/components/pages/galleryView.html',
                    controller: 'galleryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/galleryController.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Gallery'
                    }
                })
                .state("restricted.pages.help", {
                    url: "/help",
                    templateUrl: 'app/components/pages/helpView.html',
                    controller: 'helpCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/helpController.js'
                            ],{serie: true});
                        }],
                        help_data: function($http){
                            return $http({ method: 'GET', url: 'data/help_faq.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Help Center'
                    }
                })
                .state("restricted.pages.invoices", {
                    url: "/invoices",
                    abstract: true,
                    templateUrl: 'app/components/pages/invoices_listView.html',
                    controller: 'invoicesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/pages/invoicesController.js');
                        }],
                        invoices_data: function($http){
                            return $http({ method: 'GET', url: 'data/invoices_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    }
                })
                .state("restricted.pages.invoices.list", {
                    url: "/list",
                    views: {
                        'ivoice_content': {
                            templateUrl: 'app/components/pages/invoices_blankView.html',
                            controller: 'invoicesCtrl'
                        }
                    },
                    data: {
                        pageTitle: 'Invoices'
                    }
                })
                .state("restricted.pages.invoices.details", {
                    url: "/details/{invoiceId:[0-9]{1,4}}",
                    views: {
                        'ivoice_content': {
                            templateUrl: 'app/components/pages/invoices_detailView.html',
                            controller: 'invoicesCtrl'
                        }
                    },
                    params: { hidePreloader: true }
                })
                .state("restricted.pages.invoices.add", {
                    url: "/add",
                    views: {
                        'ivoice_content': {
                            templateUrl: 'app/components/pages/invoices_addView.html',
                            controller: 'invoicesCtrl'
                        }
                    },
                    params: { hidePreloader: true }
                })
                .state("restricted.pages.mailbox", {
                    url: "/mailbox",
                    templateUrl: 'app/components/pages/mailboxView.html',
                    controller: 'mailboxCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/pages/mailboxController.js');
                        }],
                        messages: function($http){
                            return $http({ method: 'GET', url: 'data/mailbox_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Mailbox'
                    }
                })
                .state("restricted.pages.notes", {
                    url: "/notes",
                    templateUrl: 'app/components/pages/notesView.html',
                    controller: 'notesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/notesController.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'data/notes_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Notes'
                    }
                })
                .state("restricted.pages.pricing_tables", {
                    url: "/pricing_tables",
                    templateUrl: 'app/components/pages/pricing_tablesView.html',
                    data: {
                        pageTitle: 'Pricing Tables'
                    }
                })
                .state("restricted.pages.scrum_board", {
                    url: "/scrum_board",
                    templateUrl: 'app/components/pages/scrum_boardView.html',
                    controller: 'scrum_boardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_dragula',
                                'app/components/pages/scrum_boardController.js'
                            ],{serie: true});
                        }],
                        tasks_list: function($http){
                            return $http({ method: 'GET', url: 'data/tasks_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Scrum Board'
                    }
                })
                .state("restricted.pages.search_results", {
                    url: "/search_results",
                    templateUrl: 'app/components/pages/search_resultsView.html',
                    controller: 'search_resultsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'js!https://maps.google.com/maps/api/js',
                                'lazy_google_maps',
                                'app/components/pages/search_resultsController.js'
                            ],{serie: true})
                        }]
                    },
                    data: {
                        pageTitle: 'Search Results'
                    }
                })
                .state("restricted.pages.sticky_notes", {
                    url: "/sticky_notes",
                    templateUrl: 'app/components/pages/sticky_notesView.html',
                    controller: 'sticky_notesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/sticky_notesController.js'
                            ],{serie: true})
                        }]
                    },
                    data: {
                        pageTitle: 'Sticky Notes'
                    }
                })
                .state("restricted.pages.settings", {
                    url: "/settings",
                    templateUrl: 'app/components/pages/settingsView.html',
                    controller: 'settingsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/pages/settingsController.js')
                        }]
                    },
                    data: {
                        pageTitle: 'Settings'
                    }
                })
                .state("restricted.pages.snippets", {
                    url: "/snippets",
                    templateUrl: 'app/components/pages/snippetsView.html',
                    controller: 'snippetsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/snippetsController.js'
                            ]);
                        }],
                        snippets_data: function($http){
                            return $http({ method: 'GET', url: 'data/snippets.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Snippets'
                    }
                })
                .state("restricted.pages.todo", {
                    url: "/todo",
                    templateUrl: 'app/components/pages/todoView.html',
                    controller: 'todoCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/todoController.js'
                            ]);
                        }],
                        todo_data: function($http){
                            return $http({ method: 'GET', url: 'data/todo_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'User profile'
                    }
                })
                .state("restricted.pages.user_profile", {
                    url: "/user_profile",
                    templateUrl: 'app/components/pages/user_profileView.html',
                    controller: 'user_profileCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/user_profileController.js'
                            ]);
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'User profile'
                    }
                })
                .state("restricted.pages.user_edit", {
                    url: "/user_edit",
                    templateUrl: 'app/components/pages/user_editView.html',
                    controller: 'user_editCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'assets/js/custom/uikit_fileinput.min.js',
                                'app/components/pages/user_editController.js'
                            ],{serie: true});
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        groups_data: function($http){
                            return $http({ method: 'GET', url: 'data/groups_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'User edit'
                    }
                })
                .state("restricted.pages.issues", {
                    url: "/issues",
                    abstract: true,
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_tablesorter',
                                'app/components/pages/issuesController.js'
                            ]);
                        }],
                        issues_data: function($http){
                            return $http({ method: 'GET', url: 'data/issues.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    }
                })
                .state("restricted.pages.issues.list", {
                    url: "/list",
                    templateUrl: 'app/components/pages/issues_listView.html',
                    controller: 'issuesCtrl',
                    data: {
                        pageTitle: 'Issues List'
                    }
                })
                .state("restricted.pages.issues.details", {
                    url: "/details/{issueId:[0-9]{1,4}}",
                    controller: 'issuesCtrl',
                    templateUrl: 'app/components/pages/issue_detailsView.html',
                    data: {
                        pageTitle: 'Issue Details'
                    }
                })
                .state("restricted.pages.blog", {
                    url: "/blog",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    controller: 'blogCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/blogController.js'
                            ]);
                        }],
                        blog_articles: function($http){
                            return $http({ method: 'GET', url: 'data/blog_articles.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    abstract: true
                })
                .state("restricted.pages.blog.list", {
                    url: "/list",
                    controller: 'blogCtrl',
                    templateUrl: 'app/components/pages/blog_listView.html',
                    data: {
                        pageTitle: 'Blog List'
                    }
                })
                .state("restricted.pages.blog.article", {
                    url: "/article/{articleId:[0-9]{1,4}}",
                    controller: 'blogCtrl',
                    templateUrl: 'app/components/pages/blog_articleView.html',
                    data: {
                        pageTitle: 'Blog Article'
                    }
                })

                // Added by Senthil 10-03-17
                .state("restricted.setting", {
                    url: "/setting",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.setting.institution_view", {
                    url: "/institution_view",
                    templateUrl: 'app/components/setting/InstitutionTable_View.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'app/components/setting/institution_tableViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Building'
                    }
                })
                .state("restricted.setting.institutionDetails", {
                    url: "/institutionDetails",
                    templateUrl: 'app/components/setting/institution_details.html',
                    controller: 'instDetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_masked_inputs',
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'ng-pattern',
                                'assets/js/custom/uikit_profileFileinput.js',
                                'app/components/setting/instDetailCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Institiution Details'
                    }
                })
				
				.state("restricted.setting.institutionDetailsView", {
                    url: "/institutionDetailsView",
                    templateUrl: 'app/components/setting/institution_detailsView.html',
                    controller: 'institution_detailsViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_wizard',
                                'ng-pattern',
                                'assets/js/custom/uikit_fileinput.js',
                                'app/components/setting/institution_detailsViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Institiution View Details'
                    }
                })

                .state("restricted.setting.institutionEdit", {
                    url: "/institutionEdit/{id}",
                    templateUrl: 'app/components/setting/instEdit_view.html',
                    controller: 'insteditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'ng-pattern',
                                'assets/js/custom/uikit_fileinput.js',
                                'app/components/setting/insteditCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Institiution Eidt'
                    },
                    params:{id:null}
                })


                .state("restricted.setting.building", {
                    url: "/building",
                    templateUrl: 'app/components/setting/building/buildingview.html',
                    // controller: 'buildingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
								'lazy_parsleyjs',
                                'app/components/setting/building/buildingCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Building'
                    }
                })
                .state("restricted.setting.buildingblock", {
                    url: "/buildingblock",
                    templateUrl: 'app/components/setting/building/buildingblockview.html',
                    // controller: 'buildingblockCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
								'lazy_parsleyjs',
                                'app/components/setting/building/buildingblockCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Building Block'
                    }
                })
                .state("restricted.setting.room", {
                    url: "/room",
                    templateUrl: 'app/components/setting/building/roomview.html',
                    // controller: 'roomCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
								'lazy_parsleyjs',
                                'app/components/setting/building/roomCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Room'
                    }
                })

                // Added by Senthil 13-03-17
                .state("restricted.finance", {
                    url: "/finance",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                .state("restricted.finance.fee", {
                    url: "/fee",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                .state("restricted.finance.fee.feeStructureDetails", {
                    url: "/feeStructureDetails",
                    templateUrl: 'app/components/finance/feeStructureDetails.html',
                    // controller: 'feeStructureCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/feeStructureCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Structure Details'
                    }
                })

                .state("restricted.finance.fee.feeStructureAdd", {
                    url: "/feeStructureAdd",
                    templateUrl: 'app/components/finance/feeStructureAdd.html',
                    controller: 'feeStructureAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                            	'lazy_parsleyjs',
                            	'smart-filter',
                                'app/components/finance/feeStructureAddCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Structure Add'
                    }
                })

                .state("restricted.finance.fee.feeStructureEdit", {
                    url: "/feeStructureEdit/{Assign_Id}",
                    templateUrl: 'app/components/finance/feeStructureEdit.html',
                    controller: 'feeStructureEditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                            	'smart-filter',
                                'app/components/finance/feeStructureEditCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Structure Edit'
                    }
                })

                .state("restricted.finance.fee.assignedFeeStructure", {
                    url: "/assignedFeeStructure",
                    templateUrl: 'app/components/finance/assignedfeestructureView.html',
                    // controller: 'assignedfeestructureViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/finance/assignedfeestructureViewCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Assigned Fee Structure'
                    }
                })

                .state("restricted.finance.fee.showAssignedFeeStructure", {
                    url: "/showAssignedFeeStructure/{strc_id}",
                    templateUrl: 'app/components/finance/showAssignedstudentview.html',
                    controller: 'showAssignedstudentviewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/finance/showAssignedstudentviewCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Assigned Fee Structure'
                    },
                    params:{strc_id:null}
                })

                .state("restricted.finance.fee.assignFeeStructure", {
                    url: "/assignFeeStructure",
                    templateUrl: 'app/components/finance/assignFeeStructure.html',
                    controller: 'assignFeeStructureCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/finance/assignFeeStructureCtrl.js'
                            ],{serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Fee Structure'
                    }
                })

                .state("restricted.finance.fee.feeStructureView", {
                    url: "/feeStructureView/{Assign_Id}",
                    templateUrl: 'app/components/finance/feeStructureView.html',
                    controller: 'feeStructureViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                            	'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/finance/feeStructureViewCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Dynamic Elements'
                    }
                })

                .state("restricted.finance.fee.feeCollectionDetails", {
                    url: "/feeCollectionDetails",
                    templateUrl: 'app/components/finance/feeCollectionDetails.html',
                    controller: 'feeCollectionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'smart-filter',
                                'app/components/finance/feeCollectionCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Structure Details'
                    }
                })

                .state("restricted.finance.fee.feeCollectView", {
                    url: "/feeCollectView/{student_feeid}",
                    templateUrl: 'app/components/finance/feeCollectView.html',
                    controller: 'feeCollectViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables','smart-filter','lazy_parsleyjs',
                                'app/components/finance/feeCollectViewCtrl.js'
                            ], {serie:true});
                        }],
                        // struct_data: function($http){
                        //     return $http({ method: 'GET', url: 'data/finance/feestructureNew.json' })
                        //         .then(function (getdata) {
                        //             return getdata.data;
                        //         });
                        // },
                    },
                    data: {
                        pageTitle: 'Fee Structure Details'
                    },
                    params:{student_feeid:null}
                })

                .state("restricted.finance.fee.feeReport", {
                    url: "/feeReport",
                    templateUrl: 'app/components/finance/feeReport.html',
                    controller: 'feeReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/feeReportCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Report'
                    }
                })

                .state("restricted.finance.fee.feeDefaulter", {
                    url: "/feeDefaulter",
                    templateUrl: 'app/components/finance/feeDefaulter.html',
                    // controller: 'feeDefaulterCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/feeDefaulterCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Report'
                    }
                })

                .state("restricted.finance.fee.totalFeeView", {
                    url: "/totalFeeView/{profile_id}",
                    templateUrl: 'app/components/finance/totalFeeView.html',
                    controller: 'totalFeeViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/totalFeeViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Total Fee Details'
                    },
                    params:{profile_id:null}
                })

                .state("restricted.finance.fee.feeStructView", {
                    url: "/feeStructView/{feepaymentId}",
                    templateUrl: 'app/components/finance/feeStructView.html',
                    controller: 'feeStructViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/finance/feeStructViewCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Structure View'
                    },
                    params:{feepaymentId:null}
                })

                .state("restricted.finance.fee.receiptView", {
                    url: "/receiptView/{feepaymentid}",
                    templateUrl: 'app/components/finance/receiptView.html',
                    controller: 'receiptViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/finance/receiptViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    },
                    params:{feepaymentid:null}
                })

                // .state("restricted.finance.fee.parentReceiptView", {
                //     url: "/parentReceiptView",
                //     templateUrl: 'app/components/finance/parentReceiptView.html',
                //     controller: 'parentReceiptViewCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'app/components/finance/parentReceiptViewCtrl.js'
                //             ], {serie:true});
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Fee Reciept Details'
                //     }
                // })

                // Added By Senthil 17/04/2017

                .state("restricted.finance.fee.parentReceiptDetailView", {
                    url: "/parentReceiptDetailView/{PAYMENT_ID}",
                    templateUrl: 'app/components/finance/parentReceiptDetailView.html',
                    controller: 'parentReceiptViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/finance/parentReceiptDetailViewCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    },
                    params:{PAYMENT_ID:null}
                })

                .state("restricted.finance.fee.parentReceiptView", {
                    url: "/parentReceiptView",
                    templateUrl: 'app/components/finance/parentReceiptView.html',
                    controller: 'parentReceiptViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/finance/parentReceiptViewCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                // End

                // Added By Senthil 18/04/2017

                .state("restricted.empCourseSubView", {
                    url: "/empCourseSubView",
                    templateUrl: 'app/components/employeemanagement/empCourseSubView.html',
                    controller: 'empCourseSubViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/employeemanagement/empCourseSubViewCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/empCourseSub.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                .state("restricted.birthdayListView", {
                    url: "/birthdayListView",
                    templateUrl: 'app/components/employeemanagement/birthdayListView.html',
                    controller: 'birthdayListViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/employeemanagement/birthdayListViewCtrl.js'
                            ]);
                        }],
                        contact_list: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/student_details.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                .state("restricted.stuExamReport", {
                    url: "/stuExamReport",
                    templateUrl: 'app/components/student/stuExamReport.html',
                    controller: 'stuExamReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'lazy_charts_chartist',
                                
                                'app/components/student/stuExamReportCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/stuExamReport.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                // End

                .state("restricted.finance.fee.feeitemDetails", {
                    url: "/feeitemDetails",
                    templateUrl: 'app/components/finance/feeitemDetails.html',
                    // controller: 'feeitemCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/finance/feeitemCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Item Details'
                    }
                })

                .state("restricted.finance.fee.fineDetails", {
                    url: "/fineDetails",
                    templateUrl: 'app/components/finance/fineDetails.html',
                    // controller: 'fineCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/fineCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fine Details'
                    }
                })

                .state("restricted.finance.fee.fineAdd", {
                    url: "/addFine",
                    templateUrl: 'app/components/finance/fineAdd.html',
                    controller: 'fineAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/finance/fineAddCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fine Add Details'
                    }
                })

                .state("restricted.finance.fee.fineEdit", {
                    url: "/EditFine/{Row_Id}",
                    templateUrl: 'app/components/finance/fineEdit.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/finance/fineEditCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fine Edit Details'
                    }
                })

                //Added By senthil 28/03/2017

                .state("restricted.repository", {
                    url: "/repository",
                    template: '<div ui-view autoscroll="false"/>',
                    controller: 'repositoryCtrl',
                    abstract: true,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/repository/repositoryCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Repository'
                    }
                })

                .state("restricted.repository.categoryView", {
                    url: "/categoryView",
                    templateUrl: 'app/components/repository/categoryView.html',
                    // controller: 'categoryViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/repository/categoryViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Repository Category View'
                    }
                })

                .state("restricted.repository.postView", {
                    url: "/postView",
                    templateUrl: 'app/components/repository/postView.html',
                    // controller: 'postViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/repository/postViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Repository Post View'
                    }
                })

                .state("restricted.repository.postAdd", {
                    url: "/postAdd",
                    templateUrl: 'app/components/repository/postAdd.html',
                    // controller: 'postViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_tinymce',
                                'lazy_dropify',
                                'lazy_parsleyjs',
                                'app/components/repository/postAddCtrl.js',
                                'app/components/academics/courseBatch/courseCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Repository Post View'
                    }
                })

                .state("restricted.repository.postEdit", {
                    url: "/postEdit/{id}",
                    templateUrl: 'app/components/repository/postEdit.html',
                    controller: 'postEditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_dropify',
                                'lazy_tinymce',
                                'lazy_parsleyjs',
                                'app/components/repository/postEditCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Add Books'
                    },
                    params:{id:null}
                })

                .state("restricted.repository.repositoryView", {
                    url: "/repositoryView",
                    templateUrl: 'app/components/repository/repositoryView.html',
                    controller: 'repositoryViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/repository/repositoryViewCtrl.js'
                            ], {serie:true});
                        }],
                        repository_articles: function($http){
                            return $http({ method: 'GET', url: 'data/repository/post.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Repository View'
                    }
                })

                .state("restricted.repository.repositoryDetail", {
                    url: "/repositoryDetail/{ReposId}",
                    controller: 'repositoryDetailCtrl',
                    templateUrl: 'app/components/repository/repositoryDetail.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/repository/repositoryDetailCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Repository Detail'
                    }
                })

                // Added by Senthil 05-04-17

                .state("restricted.mails", {
                    url: "/mails",
                    templateUrl: 'app/components/message/mails.html',
                    controller: 'mailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('app/components/message/mailsCtrl.js');
                        }],
                        messages: function($http){
                            return $http({ method: 'GET', url: 'data/mailbox_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Mailbox'
                    }
                })

                .state("restricted.mails.mailDetails", {
                    url: "/details/{mailId:[0-9]{1,4}}",
                    views: {
                        'mail_content': {
                            templateUrl: 'app/components/message/mailDetails.html',
                            controller: 'mailsCtrl'
                        }
                    },
                    params: { hidePreloader: true }
                })

                .state("restricted.mails.mailList", {
                    url: "/inbox/{fold}",
                    views: {
                        'mail_content': {
                            templateUrl: 'app/components/message/mailList.html',
                            controller: 'mailsCtrl'
                        }
                    },
                    params: { fold:null,hidePreloader: true }
                })

                .state("restricted.studentDashboard", {
                    url: "/studentDashboard",
                    controller: 'studentDashboardCtrl',
                    templateUrl: 'app/components/student/studentDashboard.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_clndr',
                                'lazy_charts_c3',
                                'app/components/student/studentDashboardCtrl.js'
                            ], {serie:true});
                        }],
                        sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        todo_data: function($http){
                            return $http({ method: 'GET', url: 'data/todo_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        help_data: function($http){
                            return $http({ method: 'GET', url: 'data/help_faq.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        assign_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/stuAssignment.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Student Dashboard'
                    }
                })

                //Added By Senthil 17/04/2017

                .state("restricted.notificationList", {
                    url: "/notificationList",
                    templateUrl: 'app/components/notification/notificationList.html',
                    controller: 'notificationListCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/notification/notificationListCtrl.js'
                            ], {serie:true});
                        }],
                        messages: function($http){
                            return $http({ method: 'GET', url: 'data/mailbox_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Notification List View'
                    }
                })

                .state("restricted.employeeDashboard", {
                    url: "/employeeDashboard",
                    controller: 'employeeDashboardCtrl',
                    templateUrl: 'app/components/employeemanagement/employeeDashboard.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_clndr',
                                'lazy_charts_c3',
                                'app/components/employeemanagement/employeeDashboardCtrl.js'
                            ], {serie:true});
                        }],
                        sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        todo_data: function($http){
                            return $http({ method: 'GET', url: 'data/todo_datanew.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        help_data: function($http){
                            return $http({ method: 'GET', url: 'data/help_faq.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        assign_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/empAssignment.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Student Dashboard'
                    }

                })

                // Added by Vijayaraj 08-03-17
                .state("restricted.employeemanagement", {
                    url: "/employeemanagement",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                .state("restricted.employeemanagement.admission", {
                    url: "/admission",
                    templateUrl: 'app/components/employeemanagement/employee_admission.html',
                    controller: 'empAdmCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'assets/js/custom/uikit_fileinput.min.js',
                                'app/components/employeemanagement/empAdmissionCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Employee Admission'
                    }
                })
                .state("restricted.employeemanagement.profile", {
                    url: "/profile/{emp_id}",
                    templateUrl: 'app/components/employeemanagement/employee_profile.html',
                    controller: 'employee_profileCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/employeemanagement/employee_profileCtrl.js'
                            ]);
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Employee Profile'
                    },
                    params:{emp_id:null}
                })
                .state("restricted.employeemanagement.employee_editprofile", {
                    url: "/employee_editprofile/{emp_id}",
                    templateUrl: 'app/components/employeemanagement/profile_edit.html',
                    controller: 'employeetprofile_edit',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                            	'lazy_parsleyjs',
                                'assets/js/custom/uikit_fileinput.min.js',
                                'app/components/employeemanagement/profile_editCtrl.js'
                            ],{serie: true});
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Employee Profile'
                    },
                    params:{emp_id:null}
                })
                .state("restricted.employeemanagement.employee_view", {
                    url: "/employee_view",
                    templateUrl: 'app/components/employeemanagement/employee_view_details.html',
                    controller: 'employee_viewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/employeemanagement/employee_viewCtrl.js'
                            ],{serie: true});
                        }],
                        contact_list: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Employee View'
                    }
                })
                .state("restricted.employeemanagement.employee_profile_tableview", {
                    url: "/employee_profile_tableview",
                    templateUrl: 'app/components/employeemanagement/employee_table_view.html',
                    controller: 'employeetable_viewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/employeemanagement/employeetable_viewCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Employee List'
                    }
                })
                .state("restricted.student", {
                    url: "/student",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.student.admission", {
                    url: "/admission",
                    templateUrl: 'app/components/student/student_admisson.html',
                    controller: 'studentadmisionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'assets/js/custom/uikit_fileinput.js',
                                'app/components/student/studentadmisionCtrl.js',
                                // 'app/components/student/cameraCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Student Admission'
                    }
                })
				
				.state("restricted.student.admissionEdit", {
                    url: "/admissionEdit",
                    templateUrl: 'app/components/student/studentAdmisson_edit.html',
                    controller: 'studentAdmisson_editCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'assets/js/custom/uikit_fileinput.js',
                                'app/components/student/studentAdmisson_edit.js',
                                // 'app/components/student/cameraCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Student Admission Edit'
                    }
                })
				
                .state("restricted.student.student_profile", {
                    url: "/student_profile/{stu_id}",
                    templateUrl: 'app/components/student/student_profile.html',
                    controller: 'studentprofileCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/student/studentprofileCtrl.js'
                            ]);
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Student Profile'
                    },
                    params:{stu_id:null}
                })
                .state("restricted.student.student_editprofile", {
                    url: "/student_editprofile/{stu_id}",
                    templateUrl: 'app/components/student/profile_edit.html',
                    controller: 'studentprofile_edit',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
								'lazy_parsleyjs',
                                'assets/js/custom/uikit_fileinput.js',
                                'app/components/student/profile_editCtrl.js'
                            ],{serie: true});
                        }],
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Student Profile'
                    },
                    params:{stu_id:null}
                })
                .state("restricted.student.student_view", {
                    url: "/student_view",
                    templateUrl: 'app/components/student/student_view.html',
                    //controller: 'studentviewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/student/studentviewCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Student View'
                    }
                })

                .state("restricted.student.student_list", {
                    url: "/student_list",
                    templateUrl: 'app/components/student/student_view_details.html',
                    controller: 'studentlistCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/student/studentlistCtrl.js'
                            ],{serie: true});
                        }],
                        contact_list: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/student_details.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Employee View'
                    }
                })

                .state("restricted.student.assignTeacher", {
                    url: "/assignTeacher",
                    templateUrl: 'app/components/academics/courseBatch/assignTeacher.html',
                    //controller: 'assignTeacherCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
								'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/courseBatch/assignTeacherCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Teacher'
                    }
                })
                // Added By Senthil 12/04/2017

                .state("restricted.student.stuApplyLeave", {
                    url: "/stuApplyLeave",
                    // controller: 'stuApplyLeaveCtrl',
                    templateUrl: 'app/components/academics/attendance/stuApplyLeave.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
								'lazy_parsleyjs',
								'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/attendance/stuApplyLeaveCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Student Apply Leave'
                    }

                })


                // Academics added by vijayaraj
                .state("restricted.academics", {
                    url: "/academics",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.academics.syllabus_view", {
                    url: "/syllabus_view",
                    templateUrl: 'app/components/academics/syllabus_view.html',
                    // controller: 'syllabusviewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'app/components/academics/syllabusviewCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Syllabus View'
                    }
                })
                .state("restricted.academics.syllabus_add", {
                    url: "/syllabus_add",
                    templateUrl: 'app/components/academics/syllabus_add.html',
                    controller: 'syllabusaddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'lazy_parsleyjs',
                                'lazy_tinymce',
                                'app/components/academics/syllabusaddCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Syllabus Add'
                    }
                })
                .state("restricted.academics.syllabus_edit", {
                    url: "/syllabus_edit/{id}",
                    templateUrl: 'app/components/academics/syllabus_edit.html',
                    controller: 'syllabuseditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'lazy_tinymce',
                                'lazy_parsleyjs',
                                'app/components/academics/syllabuseditCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Syllabus Add'
                    },
                    params:{id:null}
                })
                .state("restricted.academics.syllabus_viewlist", {
                    url: "/syllabus_viewlist/{syllabus_id}",
                    templateUrl: 'app/components/academics/syllabus_details_view.html',
                    controller: 'syllabusdetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/academics/syllabusdetailCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/academics/syllabus.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Syllabus View'
                    },
                    params:{syllabus_id:null}
                })
                .state("restricted.academics.view_syllabus_details", {
                    url: "/view_syllabus_details",
                    templateUrl: 'app/components/academics/student_syllabus_view.html',
                    controller: 'student_syllabusCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'app/components/academics/student_syllabusCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Syllabus View'
                    }
                })
                .state("restricted.academics.view_syllabusDetails", {
                    url: "/view_syllabusDetails/{id}",
                    templateUrl: 'app/components/academics/student_syllabus_viewlist.html',
                    controller: 'studentsyllabusdetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/academics/studentsyllabusdetailCtrl.js'
                            ]);
                        }],
                        // notes_data: function($http){
                        //     return $http({ method: 'GET', url: 'app/components/academics/subject_notes.json' })
                        //         .then(function (data) {
                        //             return data.data;
                        //         });
                        // }
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/academics/syllabus.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Syllabus View'
                    },
                    params:{id:null}
                })
				
				// Student and parent view of subject
				.state("restricted.academics.studentSubjectView", {
                    url: "/studentSubjectView",
                    templateUrl: 'app/components/academics/studentView/student_syllabus_viewlist.html',
                    controller: 'studentsyllabusdetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/academics/studentView/studentsyllabusdetailCtrl.js'
                            ]);
                        }],
						notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/academics/syllabus.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Subject&Syllabus View'
                    }
                })
				
                .state("restricted.academics.markattendance", {
                    url: "/attendance",
                    templateUrl: 'app/components/academics/attendance/studentAttendanceView.html',
                    controller: 'markattendanceCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/academics/attendance/studentAttendanceController.js'
                            ],{serie:true});
                        }],
                        ts_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/Hr/Payroll_Payslip/Payroll_temData/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Mark Attendance'
                    }
                })
				
				// Student Attendance Report
				.state("restricted.academics.studentreport", {
					url: "/student-report",
					templateUrl: 'app/components/academics/attendance/studentReportView.html',
					controller: 'studentreportCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'bower_components/angular-resource/angular-resource.min.js',
								'lazy_ionRangeSlider',
								'lazy_tablesorter',
								'app/components/academics/attendance/studentReportController.js'
							],{serie:true});
						}],
						ts_data: function($http){
							return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
								.then(function (data) {
									return data.data;
								});
						}
					},
					data: {
						pageTitle: 'Overall Attendance Report'
					}
				})
				.state("restricted.academics.reportforstudent", {
					url: "/reportforstudent/{id:[0-9]{1,4}}",
					templateUrl: 'app/components/academics/attendance/singlestudentReport.html',
					controller: 'reportforstudentCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'bower_components/angular-resource/angular-resource.min.js',
								'lazy_ionRangeSlider',
								'lazy_tablesorter',
								'lazy_charts_chartist',
								'lazy_charts_c3',
								'app/components/academics/attendance/singlestudentReportController.js'
							],{serie:true});
						}]
					},
					data: {
						pageTitle: 'Attendance Report'
					},
					params:{id:null}
				})
				
				.state("restricted.academics.studentleaveapprove", {
					url: "/student-leaveApprove",
					templateUrl: 'app/components/academics/attendance/studentleaveapprove.html',
					controller: 'studentleaveapproveCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'bower_components/angular-resource/angular-resource.min.js',
								'lazy_ionRangeSlider',
								'lazy_tablesorter',
								'app/components/academics/attendance/studentleaveapprove.js'
							],{serie:true});
						}],
						ts_data: function($http){
							return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
								.then(function (data) {
									return data.data;
								});
						}
					},
					data: {
						pageTitle: 'Approve Leave'
					}
				})
				
				.state("restricted.academics.approveforstudentleave", {
					url: "/approveforstudentleave/{id:[0-9]{1,4}}",
					templateUrl: 'app/components/academics/attendance/approveforstudentleave.html',
					controller: 'approveforstudentleaveCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'bower_components/angular-resource/angular-resource.min.js',
								'lazy_ionRangeSlider',
								'lazy_tablesorter',
								'lazy_charts_chartist',
								'lazy_charts_c3',
								'app/components/academics/attendance/approveforstudentleave.js'
							],{serie:true});
						}]
					},
					data: {
						pageTitle: 'Attendance Report'
					},
					params:{id:null}
				})
				
                .state("restricted.academics.empattendancemark", {
                    url: "/empolyee-attendance",
                    templateUrl: 'app/components/plugins/employeeAttendance.html',
                    controller: 'tablesorterCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/plugins/employeeAttendanceController.js'
                            ],{serie:true});
                        }],
                        ts_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Tablesorter'
                    }
                })
                //Added by gnanamani
                //  .state("restricted.academics", {
                //     url: "/academics",
                //     template: '<div ui-view autoscroll="false"/>',
                //     abstract: true
                // })
                .state("restricted.academics.course", {
                    url: "/course",
                    templateUrl: 'app/components/academics/courseBatch/course.html',
                    // controller: 'courseCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'ng-pattern',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/courseBatch/courseCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Course'
                    }
                })
                 .state("restricted.academics.courseBatches", {
                    url: "/courseBatches",
                    templateUrl: 'app/components/academics/courseBatch/courseBatch.html',
                    //controller: 'courseBatchCtrl',
                    resolve: {
                           
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // 'bower_components/angular-resource/angular-resource.min.js',
                                //'xeditable',
                                //'smart-table',
                                'ng-pattern',
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/courseBatch/courseBatchCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'CourseBatches'
                    }
                })
                .state("restricted.academics.subjects", {
                    url: "/subjects",
                    templateUrl: 'app/components/academics/courseBatch/subject.html',
                    //controller: 'subjectCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'ng-pattern',
                                'lazy_datatables',
                                'app/components/academics/courseBatch/subjectCtrl.js'
                            ], {serie:true});
                        }],
                    },
                    data: {
                        pageTitle: 'Subjects'
                    }
                })
                .state("restricted.academics.syllabus", {
                    url: "/syllabus",
                    templateUrl: 'app/components/academics/courseBatch/syllabus.html',
                    controller: 'syllabusCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                //'app/components/academics/forms/wysiwyg_ckeditorController.min.js',
                                'lazy_datatables',
                                'ng-pattern',
                                'lazy_parsleyjs',
                                'app/components/academics/courseBatch/syllabusCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Syllabus'
                    }
                })
                .state("restricted.academics.addSyllabus", {
                    url: "/addSyllabus",
                    templateUrl: 'app/components/academics/courseBatch/addSyllabus.html',
                    // controller: 'syllabusCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'ng-pattern',
                                'lazy_parsleyjs',
                                'app/components/academics/courseBatch/addSyllabus.js'
                            ], {serie:true});
                        }]
                    }
                    // data: {
                    //     pageTitle: 'Add Syllabus'
                    // }
                })
                .state("restricted.academics.department", {
                    url: "/department",
                    templateUrl: 'app/components/academics/courseBatch/department.html',
                    // controller: 'departmentCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'ng-pattern',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/courseBatch/departmentCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Department'
                    }
                })
                				
				// Academics Examination by karthik @ 21.03.2017 3.12 PM
				.state("restricted.academics.examination", {
                    url: "/examination",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
				
				.state("restricted.academics.examination.setgrading", {
                    url: "/setgrading",
                    templateUrl: 'app/components/academics/examination/setgrading.html',
                    //controller: 'setgradingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/setgrading.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Set Grading'
                    }
                })
				
				.state("restricted.academics.examination.setexam", {
                    url: "/setexam",
                    templateUrl: 'app/components/academics/examination/setexam.html',
                    // controller: 'setexamCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/setexam.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Set Exam'
                    }
                })
				
				// .state("restricted.academics.examination.setassessment", {
                    // url: "/setassessment",
                    // templateUrl: 'app/components/academics/examination/setassessment.html',
                    // // controller: 'setassessmentCtrl',
                    // resolve: {
                        // deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            // return $ocLazyLoad.load([
                                // 'bower_components/angular-resource/angular-resource.min.js',
                                // 'lazy_datatables',
                                // 'app/components/academics/examination/setassessment.js'
                            // ], {serie:true});
                        // }]
                    // },
                    // data: {
                        // pageTitle: 'Set Assessment'
                    // }
                // })
				
				.state("restricted.academics.examination.setweightage", {
                    url: "/setweightage",
                    templateUrl: 'app/components/academics/examination/setweightage.html',
                    // controller: 'setweightageCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/setweightage.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Set Weightages'
                    }
                })
				
				.state("restricted.academics.examination.assign", {
                    url: "/assign",
                    templateUrl: 'app/components/academics/examination/assign.html',
                    //controller: 'assignCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/assign.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Exam'
                    }
                })
				
				.state("restricted.academics.examination.markDetails", {
                    url: "/markDetails",
                    templateUrl: 'app/components/academics/examination/markDetails.html',
                    controller: 'markDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/markDetails.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Student Mark Details'
                    }
                })
				
				.state("restricted.academics.examination.AddMarkDetails", {
                    url: "/AddMarkDetails",
                    templateUrl: 'app/components/academics/examination/AddMarkDetails.html',
                    controller: 'addMarkDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/AddMarkDetails.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Enter Student Marks'
                    }
                })
				
				// Exam module  setTerm
				
				.state("restricted.academics.examination.setTerm", {
                    url: "/setTerm",
                    templateUrl: 'app/components/academics/examination/setTerm.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/setTerm.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Set Term'
                    }
                })
				
				.state("restricted.academics.examination.createExam", {
                    url: "/createExam",
                    templateUrl: 'app/components/academics/examination/createExam.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/createExam.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Exam'
                    }
                })
				
				.state("restricted.academics.examination.setassessment", {
                    url: "/setassessment",
                    templateUrl: 'app/components/academics/examination/setassessment1.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/setassessment1.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Set Assessment'
                    }
                })
				
				.state("restricted.academics.examination.setexamination", {
                    url: "/examination",
                    templateUrl: 'app/components/academics/examination/calendarExamination.html',
                    controller: 'examination',
                    resolve: {
                         user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_parsleyjs',
                                'lazy_character_counter',
                                'lazy_masked_inputs',
                                'lazy_datatables',
                                'lazy_charts_metricsgraphics',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/academics/examination/calendarExamination.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Exam Calendar'
                    }
                })
				
				.state("restricted.academics.examination.assessmentList", {
                    url: "/assessmentList",
                    templateUrl: 'app/components/academics/examination/assessmentList.html',
                    controller: 'assessmentListCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/assessmentList.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assessment Mark List'
                    }
                })
				
				.state("restricted.academics.examination.assessmentMark", {
                    url: "/assessmentMark",
                    templateUrl: 'app/components/academics/examination/assessmentMark.html',
                    controller: 'assessmentMarkCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/assessmentMark.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assessment Marks'
                    }
                })
				
				.state("restricted.academics.examination.examMark", {
                    url: "/examMark",
                    templateUrl: 'app/components/academics/examination/examMark.html',
                    controller: 'examMarkCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/examMark.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Exam Marks'
                    }
                })
				
				// Student Exam Report 
				
				.state("restricted.academics.examination.stuExamReport", {
                    url: "/stuExamReport",
                    templateUrl: 'app/components/academics/examination/stuExamReport.html',
                    controller: 'stuExamReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'lazy_charts_chartist',
                                
                                'app/components/academics/examination/stuExamReportCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/academics/examination/stuExamReport.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                // Added By Senthil 20/04/2017 

                .state("restricted.academics.examination.EnterMarkView", {
                    url: "/EnterMarkView",
                    templateUrl: 'app/components/academics/examination/enterMarkView.html',
                    controller: 'enterMarkViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/examination/enterMarkViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Enter Student Marks'
                    }
                })

                // End
				
				.state("restricted.academics.examination.individualMarkReport", {
					url: "/individualMarkReport/{id:[0-9]{1,4}}",
					templateUrl: 'app/components/academics/examination/individualMarkReport.html',
					controller: 'individualMarkReportCtrl',
					resolve: {
						deps: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'bower_components/angular-resource/angular-resource.min.js',
								'lazy_ionRangeSlider',
								'lazy_tablesorter',
								'app/components/academics/examination/individualMarkReport.js'
							],{serie:true});
						}],
						ts_data: function($http){
							return $http({ method: 'GET', url: 'app/components/student/profile.json' })
								.then(function (data) {
									return data.data;
								});
						}
					},
					data: {
						pageTitle: 'individual Mark Report'
					}
				})

                // Added By Senthil 12-04-2017

                .state("restricted.academics.assignment", {
                    url: "/assignment",
                    templateUrl: 'app/components/academics/assignment/assignmentDetails.html',
                    //controller: 'assignCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/assignment/assignmentDetailsCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assignment Details'
                    }
                })
				
				.state("restricted.academics.stuassignment", {
                    url: "/stuassignment",
                    templateUrl: 'app/components/academics/assignment/stuAssignmentDetails.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/assignment/stuAssignmentDetails.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assignment Details'
                    }
                })
				
				.state("restricted.academics.stuAssignmentViewDetail", {
                    url: "/stuAssignmentViewDetail/{id}",
                    templateUrl: 'app/components/academics/assignment/stuAssignmentViewDetail.html',
                    controller: 'stuAssignmentViewDetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/academics/assignment/stuAssignmentViewDetailCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/stuAssignment.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Assignment View'
                    },
                    params:{id:null}
                })

                .state("restricted.academics.assignmentAdd", {
                    url: "/assignmentAdd",
                    templateUrl: 'app/components/academics/assignment/assignmentAdd.html',
                    controller: 'assignmentAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_tinymce',
                                'app/components/academics/assignment/assignmentAddCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assignment Add'
                    }
                })

                .state("restricted.academics.assignmentEdit", {
                    url: "/assignmentEdit/{id}",
                    templateUrl: 'app/components/academics/assignment/assignmentEdit.html',
                    controller: 'assignmentEditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_tinymce',
                                'app/components/academics/assignment/assignmentEditCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assignment Edit'
                    },
                    params:{id:null}
                })

                .state("restricted.academics.assignmentView", {
                    url: "/assignmentView/{id}/{assess}",
                    templateUrl: 'app/components/academics/assignment/assignmentView.html',
                    controller: 'assignmentViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/academics/assignment/assignmentViewCtrl.js'
                            ],{serie:true});
                        }],
                        ts_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/Hr/Payroll_Payslip/Payroll_temData/profile.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Tablesorter'
                    },
                    params:{id:null,assess:null}
                })

                .state("restricted.stuAssignmentView", {
                    url: "/stuAssignmentView",
                    templateUrl: 'app/components/student/stuAssignmentView.html',
                    controller: 'stuAssignmentViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_ionRangeSlider',
                                'lazy_tablesorter',
                                'app/components/student/stuAssignmentViewCtrl.js'
                            ]);
                        }],
                        notes_data: function($http){
                            return $http({ method: 'GET', url: 'app/components/student/stuAssignment.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Syllabus View'
                    },
                    params:{id:null}
                })

                // .state("restricted.stuAssignmentView.list", {
                //     url: "/list",
                //     views: {
                //         'ivoice_content': {
                //             templateUrl: 'app/components/student/stuAssignmentBlankView.html',
                //             controller: 'stuAssignmentViewCtrl'
                //         },
                //         'ivoice_content1': {
                //             templateUrl: 'app/components/student/stuAssignmentBlankView.html',
                //             controller: 'stuAssignmentViewCtrl'
                //         }
                //     },
                //     data: {
                //         pageTitle: 'Assignment View'
                //     }
                // })

                // .state("restricted.stuAssignmentViewDetail", {
                    // url: "/stuAssignmentViewDetail",
                    // templateUrl: 'app/components/student/stuAssignmentViewDetail.html',
                    // controller: 'stuAssignmentViewDetailCtrl',
                    // resolve: {
                        // deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            // return $ocLazyLoad.load([
                                // 'bower_components/angular-resource/angular-resource.min.js',
                                // 'lazy_ionRangeSlider',
                                // 'lazy_tablesorter',
                                // 'app/components/student/stuAssignmentViewDetailCtrl.js'
                            // ]);
                        // }],
                        // notes_data: function($http){
                            // return $http({ method: 'GET', url: 'app/components/student/stuAssignment.json' })
                                // .then(function (data) {
                                    // return data.data;
                                // });
                        // }
                    // },
                    // data: {
                        // pageTitle: 'Syllabus View'
                    // },
                    // params:{id:null}
                // })

                // HR Module Added by Vijayaraj 17-03-17

                .state("restricted.hr.config", {
                    template: '<div ui-view autoscroll="false"/>',
                    url :"/config",
                    abstract: true
                })

                .state("restricted.hr.config.category", {
                    url: "/category",
                    templateUrl: 'app/components/Hr/configuration/category.html',
                    // controller: 'employeecategoryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/Hr/configuration/categoryCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Employee category'
                    }
                })
                .state("restricted.hr.config.position", {
                    url: "/position",
                    templateUrl: 'app/components/Hr/configuration/position.html',
                    // controller: 'employeecategoryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/Hr/configuration/positionCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Employee position'
                    }
                })

                .state("restricted.hr.assign_employee",{
                    url: "/assign_employee",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/assignEmployee.html',
                    controller : 'assignEmployeeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/assignEmployeeCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Employee'
                    }                  
                })
                .state("restricted.hr.add_employee_details",{
                    url: "/add_employee_details/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/addEmployee_data.html',
                    controller : 'addassignemployeeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/addassignemployeeCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Employee'
                    },
                    params:{id:null}                
                })

                .state("restricted.hr.view_employee_paydetails",{
                    url: "/view_employee_paydetails/{assign_id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/viewemployee_paydetails.html',
                    controller : 'viewemployee_PaydetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/viewemployee_PaydetailsCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{assign_id:null}                
                })

                .state("restricted.hr.payslipGenaration_view", {
                    url: "/payslipGenaration_view",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslip_generation.html',
                    // controller: 'payslipGenerationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipGenerationCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Payslip Generation View'
                    }
                })
                .state("restricted.hr.payslipgeneration_viewdetails",{
                    url: "/payslipgeneration_viewdetails/{gen_id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/viewpayslip_generation.html',
                    controller : 'viewpayslip_genetationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_KendoUI',
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/viewpayslip_genetationCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'View Payslip Generation'
                    },
                    params:{gen_id:null}        
                })
                .state("restricted.hr.showpayslipdetails",{
                    url: "/showpayslipdetails/{pay_id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipgeneration_table.html',
                    // controller : 'payslipgen_tableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipgen_tableCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'View Payslip Generation'
                    },
                    params:{pay_id:null}        
                })
                .state("restricted.hr.payslipdetails_view",{
                    url: "/payslipdetails_view/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipdetails_view_for_pdf.html',
                    controller : 'payslipview_for_pdfCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/payslipview_for_pdfCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{id:null}                
                })
                .state("restricted.hr.payslipreject_view",{
                    url: "/payslipreject_view/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipreject_to_revert.html',
                    controller : 'payslipreject_to_revertCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/payslipreject_to_revertCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{id:null}                
                })
                .state("restricted.hr.rejectpayslip", {
                    url: "/rejectpayslip",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/rejectPayslip.html',
                    // controller: 'rejectPayslipCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/rejectPayslipCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'reject payslip'
                    }
                })
                .state("restricted.finance.approvepayslip", {
                    url: "/approvepayslip",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/approvePayslip.html',
                    // controller: 'approvePayslipCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/approvePayslipCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Approve payslip'
                    }
                })
                // Calendar
                .state("restricted.calendar", {
                    url: "/calendar",
                    templateUrl: 'app/components/plugins/calendarView.html',
                    controller: 'calendarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'app/components/plugins/calendarController.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Calendar'
                    }
                })

                // Finance payslip modified 21-03-17 by vijayaraj
                .state("restricted.finance.payslipGenaration_view", {
                    url: "/payslipGenaration_view",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslip_generation.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipGenerationCtrl.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Payslip Generation View'
                    }
                })
                .state("restricted.finance.showpayslipdetails",{
                    url: "/showpayslipdetails/{pay_id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipgeneration_table.html',
                    // controller : 'payslipgen_tableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipgen_tableCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'View Payslip Generation'
                    },
                    params:{pay_id:null}        
                })
                .state("restricted.finance.payslipdetails_view",{
                    url: "/payslipdetails_view/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipdetails_view_for_pdf.html',
                    controller : 'payslipview_for_pdfCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/payslipview_for_pdfCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{id:null}                
                })

                .state("restricted.finance.reportpayslipdetails",{
                    url: "/reportpayslipdetails/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipdetails_reportview.html',
                    controller : 'payslipview_reportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/payslipview_reportCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{id:null}                
                })

                .state("restricted.hr.reportpayslipdetails",{
                    url: "/reportpayslipdetails/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipdetails_reportview.html',
                    controller : 'payslipview_reportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/payslipview_reportCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{id:null}                
                })
                .state("restricted.finance.payslipviewdetails",{
                    url: "/payslipviewdetails/{payslipid}/{empid}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/financepayslipdetails_view_for_pdf.html',
                    controller : 'payslipview_for_pdfCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/financepayslipview_for_pdfCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'view Employee Pay details'
                    },
                    params:{payslipid:null,empid:null}                
                })
                // payslip Report Added by Vijayaraj 21-03-17

                .state("restricted.finance.payslipReport",{
                    url: "/payslipReport",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipReport.html',
                    controller : 'payslipReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipReportCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Payslip Report'
                    }                  
                })

                .state("restricted.hr.payslipReport",{
                    url: "/payslipReport",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/payslipReport.html',
                    controller : 'payslipReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/payslipReportCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Payslip Report'
                    }                  
                })
                .state("restricted.hr.payitem_details", {
                    url: "/payitem_details",
                    templateUrl: 'app/components/Hr/configuration/payItem.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/Hr/configuration/payItemCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Pay Item'
                    }
                })

                // Leave management started 22-03-17
                .state("restricted.hr.leavetype", {
                    url: "/leavetype",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/LeaveCategory.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/LeaveCategoryCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Leave Types'
                    }
                })
                // .state("restricted.hr.leave_category", {
                //     url: "/leave_category",
                //     templateUrl: 'app/components/Hr/Payroll_Payslip/LeaveCategory.html',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'lazy_parsleyjs',
                //                 'app/components/Hr/Payroll_Payslip/LeaveCategoryCtrl.js'
                //             ], {serie:true});
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Leave Category'
                //     }
                // })

                .state("restricted.hr.leave_application", {
                    url: "/leave_application",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/leaveapplication.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/leaveapplicationCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Leave Application'
                    }
                })
                .state("restricted.hr.leave_entitlement_View", {
                    url: "/leave_entitlement_View",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/assign_leave_category_view.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/assignleavecategoryviewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assign leave Category'
                    }
                })

                //Added by Senthil 02/05/2017

                .state("restricted.inventory", {
                    template: '<div ui-view autoscroll="false"/>',
                    url :"/inventory",
                    abstract: true
                })

                .state("restricted.inventory.storeCategory", {
                    url: "/storeCategoryView",
                    templateUrl: 'app/components/inventory/storeCategoryView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/storeCategoryViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Store Category View'
                    }
                })

                .state("restricted.inventory.store", {
                    url: "/storeView",
                    templateUrl: 'app/components/inventory/storeView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/storeViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Store View'
                    }
                })

                .state("restricted.inventory.itemCategory", {
                    url: "/itemCategoryView",
                    templateUrl: 'app/components/inventory/itemCategoryView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/itemCategoryViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Item Category View'
                    }
                })

                .state("restricted.inventory.supplierType", {
                    url: "/supplierTypeView",
                    templateUrl: 'app/components/inventory/supplierTypeView.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/supplierTypeViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Supplier Type View'
                    }
                })

                // .state("restricted.inventory.item", {
                //     url: "/itemView",
                //     templateUrl: 'app/components/inventory/itemView.html',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'lazy_parsleyjs',
                //                 'app/components/inventory/itemViewCtrl.js'
                //             ], {serie:true});
                //         }]
                //     },
                //     data: {
                //         pageTitle: 'Supplier Type View'
                //     }
                // })

                .state("restricted.inventory.item", {
                    url: "/assets",
                    templateUrl: 'app/components/inventory/itemView.html',
                    controller: 'itemViewCtrl',
                        resolve: {
                            products_data: function($http){
                                return $http({method: 'GET', url: 'app/components/inventory/assets.json'})
                                    .then(function (data) {
                                        return data.data;
                                    });
                            },
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_pagination',
                                    'lazy_dropify',
                                    'lazy_parsleyjs',
                                    'app/components/inventory/itemViewCtrl.js'
                                ], { serie: true } );
                            }]
                        },
                        data: {
                            pageTitle: 'Item List'
                        }
                })

                .state("restricted.inventory.storeItem", {
                    url: "/StoreItemView",
                    templateUrl: 'app/components/inventory/storeItemView.html',
                    controller: 'storeItemViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/storeItemViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Store Item View'
                    }
                })

                .state("restricted.inventory.supplier", {
                    url: "/SupplierView",
                    templateUrl: 'app/components/inventory/supplierView.html',
                    controller: 'supplierViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/supplierViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Supplier View'
                    }
                })

                .state("restricted.inventory.purchaseOrderView", {
                    url: "/purchaseOrderView",
                    templateUrl: 'app/components/inventory/purchaseOrderView.html',
                    controller: 'purchaseOrderViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/purchaseOrderViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order View'
                    }
                })

                .state("restricted.inventory.purchaseOrderAdd", {
                    url: "/purchaseOrderAdd",
                    templateUrl: 'app/components/inventory/purchaseOrderAdd.html',
                    controller: 'purchaseOrderAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/purchaseOrderAddCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Add'
                    }
                })

                .state("restricted.inventory.purchaseOrderDetails", {
                    url: "/purchaseOrderDetails/{id}",
                    templateUrl: 'app/components/inventory/purchaseOrderDetails.html',
                    controller: 'purchaseOrderDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/purchaseOrderDetailsCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Detail View'
                    }
                })

                .state("restricted.inventory.purchaseOrderReceipt", {
                    url: "/purchaseOrderReceipt",
                    templateUrl: 'app/components/inventory/purchaseOrderReceipt.html',
                    controller: 'purchaseOrderReceiptCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/purchaseOrderReceiptCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                .state("restricted.inventory.grnView", {
                    url: "/grnView",
                    templateUrl: 'app/components/inventory/grnView.html',
                    controller: 'grnViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/grnViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'GRN View'
                    }
                })

                .state("restricted.inventory.grnAdd", {
                    url: "/grnAdd",
                    templateUrl: 'app/components/inventory/grnAdd.html',
                    controller: 'grnAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/grnAddCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Add'
                    }
                })

                .state("restricted.inventory.grnEdit", {
                    url: "/grnEdit/{id}",
                    templateUrl: 'app/components/inventory/grnEdit.html',
                    controller: 'grnEditCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/grnEditCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Add'
                    }
                })

                .state("restricted.inventory.grnDetail", {
                    url: "/grnDetail",
                    templateUrl: 'app/components/inventory/grnDetail.html',
                    controller: 'grnDetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/grnDetailCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Add'
                    }
                })

                .state("restricted.inventory.billingView", {
                    url: "/billingView",
                    templateUrl: 'app/components/inventory/billingView.html',
                    controller: 'billingViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/billingViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Add'
                    }
                })

                .state("restricted.inventory.billingAdd", {
                    url: "/billingAdd",
                    templateUrl: 'app/components/inventory/billingAdd.html',
                    controller: 'billingAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/billingAddCtrl.js'
                            ], {serie:true});
                        }],
                        struct_data: function($http){
                            return $http({ method: 'GET', url: 'data/finance/feestructureNew.json' })
                                .then(function (getdata) {
                                    return getdata.data;
                                });
                        },
                    },
                    data: {
                        pageTitle: 'Billing Add'
                    }
                })

                .state("restricted.inventory.billingDetails", {
                    url: "/billingDetails/{id}",
                    templateUrl: 'app/components/inventory/billingDetails.html',
                    controller: 'billingDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/billingDetailsCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Billing Detail View'
                    }
                })

                .state("restricted.inventory.billingReceipt", {
                    url: "/billingReceipt",
                    templateUrl: 'app/components/inventory/billingReceipt.html',
                    controller: 'billingReceiptCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/billingReceiptCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Reciept Details'
                    }
                })

                .state("restricted.inventory.materialRequestView", {
                    url: "/materialRequestView",
                    templateUrl: 'app/components/inventory/materialRequestView.html',
                    controller: 'materialRequestViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/materialRequestViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Material Request View'
                    }
                })

                .state("restricted.inventory.materialRequestAdd", {
                    url: "/materialRequestAdd",
                    templateUrl: 'app/components/inventory/materialRequestAdd.html',
                    controller: 'materialRequestAddCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/inventory/materialRequestAddCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Material Request Add'
                    }
                })

                .state("restricted.inventory.materialRequestDetails", {
                    url: "/materialRequestDetails/{id}",
                    templateUrl: 'app/components/inventory/materialRequestDetails.html',
                    controller: 'materialRequestDetailsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/materialRequestDetailsCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Purchase Order Detail View'
                    }
                })

                .state("restricted.inventory.materialRequestReceipt", {
                    url: "/materialRequestReceipt",
                    templateUrl: 'app/components/inventory/materialRequestReceipt.html',
                    controller: 'materialRequestReceiptCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/inventory/materialRequestReceiptCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Material Request Receipt'
                    }
                })

                .state("restricted.inventory.reportView", {
                    url: "/reportView",
                    templateUrl: 'app/components/inventory/reportView.html',
                    controller: 'reportViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/inventory/reportViewCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Report View'
                    }
                })

                // End

                //Added by Senthil 01/04/2017 

                .state("restricted.hr.LeaveEntitleAdd", {
                    url: "/LeaveEntitleAdd",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/LeaveEntitleAdd.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/LeaveEntitleAddCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'LeaveEntitlement Add'
                    }
                })

                .state("restricted.hr.applyLeave", {
                    url: "/apply_leave",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/applyLeave.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/applyLeaveCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Leave Category'
                    }
                })

                .state("restricted.finance.leaveStatusChange", {
                    url: "/leaveStatusChange/{empid}/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/leaveStatusChange.html',
                    controller: 'leaveStatusChangeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/leaveStatusChangeCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Dynamic Elements'
                    },
                    params:{empid:null,id:null}
                })

                // End

                .state("restricted.hr.assignleavecategory", {
                    url: "/assignleavecategory",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/assignleaveCategory.html',
                    controller: 'assignleaveCategoryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/assignleaveCategoryCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Assign Category'
                    }
                })
                .state("restricted.hr.showleavecategory", {
                    url: "/showleavecategory/{id}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/leavecategory_related_employee_details.html',
                    // controller: 'leaveCatRelatedEmpCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/Hr/Payroll_Payslip/leaveCatRelatedEmpCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'leave Category'
                    },
                    params:{id:null}   
                })
                .state("restricted.hr.assignleavevategory_viewDetails", {
                    url: "/assignleavevategory_viewDetails/{empid}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/viewassignleavecategory_for_employee.html',
                    controller: 'feeStructureViewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/Hr/Payroll_Payslip/viewassignLeaveCategory_for_empCtrl.js'
                            ] );
                        }]
                    },
                    data: {
                        pageTitle: 'Dynamic Elements'
                    },
                    params:{empid:null}
                })
				
			// Added by manivannan @ 24.03.2017 8.16PM
			.state("restricted.plugins.employeereport", {
				url: "/employee-report",
				templateUrl: 'app/components/plugins/Report/employeeReportView.html',
				controller: 'tablesorterCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_ionRangeSlider',
							'lazy_tablesorter',
							'app/components/plugins/Report/employeeReportController.js'
						],{serie:true});
					}],
					ts_data: function($http){
						return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
							.then(function (data) {
								return data.data;
							});
					}
				},
				data: {
					pageTitle: 'Tablesorter'
				}
			})
			.state("restricted.plugins.reportforemployee", {
				url: "/reportforemployee/{id:[0-9]{1,4}}",
				templateUrl: 'app/components/plugins/Report/singleemployeeReport.html',
				controller: 'tablesorterCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_ionRangeSlider',
							'lazy_tablesorter',
                            'lazy_charts_chartist',
                            'lazy_charts_c3',
							'app/components/plugins/Report/singleemployeeReportController.js'
						],{serie:true});
					}],
					ts_data: function($http){
						return $http({ method: 'GET', url: 'app/components/employeemanagement/employee_list.json' })
							.then(function (data) {
								return data.data;
							});
					}
				},
				data: {
					pageTitle: 'Tablesorter'
				}
			})
			
            // Hostel Module Started on 28-03-17 by Vijayarj
            .state("restricted.hostel", {
                template: '<div ui-view autoscroll="false"/>',
                url :"/hostel",
                abstract: true
            })
            .state("restricted.hostel.settings", {
                url: "/settings",
                templateUrl: 'app/components/hostel/hostelSettings_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/hostelsettingsCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Hostel View'
                }
            })
            .state("restricted.hostel.allocation", {
                url: "/allocation",
                templateUrl: 'app/components/hostel/allocation_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/allocationviewCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Allocation View'
                }
            })
            .state("restricted.hostel.addAllocation", {
                url: "/addallocation",
                templateUrl: 'app/components/hostel/addAllocation.html',
                controller: 'addAllocationCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/addAllocationCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Allocation Add'
                }
            })
            .state("restricted.hostel.transfer", {
                url: "/transfer",
                templateUrl: 'app/components/hostel/transfer.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/transferCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Tranfer Details'
                }
            })
            .state("restricted.hostel.addTransfer", {
                url: "/addTransfer",
                templateUrl: 'app/components/hostel/add_transfer.html',
                controller: 'addTransferCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/addTransferCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Add Tranfer'
                }
            })
            .state("restricted.hostel.edit_transfer", {
                url: "/edit_transfer/{id}",
                templateUrl: 'app/components/hostel/editTransfer.html',
                controller: 'editTransferCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_parsleyjs',
                            'app/components/hostel/editTransferCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Edit Transfer'
                }
            })
            .state("restricted.hostel.vacate", {
                url: "/vacate",
                templateUrl: 'app/components/hostel/vacate.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
							'lazy_parsleyjs',
                            'app/components/hostel/vacateCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Vacte Details'
                }
            })
            .state("restricted.hostel.addAacate", {
                url: "/addVacate",
                templateUrl: 'app/components/hostel/addVacate.html',
                controller: 'addVacateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_parsleyjs',
                            'app/components/hostel/addVacateCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Add Vacte'
                }
            })
             .state("restricted.hostel.edit_vacate", {
                url: "/edit_vacate/{id}",
                templateUrl: 'app/components/hostel/editVacate.html',
                controller: 'editVacateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_parsleyjs',
                            'app/components/hostel/editVacate.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Edit Vacte'
                }
            })
            .state("restricted.hostel.visitors", {
                url: "/visitors",
                templateUrl: 'app/components/hostel/visitors.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_masked_inputs',
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_parsleyjs',
                            'app/components/hostel/visitorCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Visitors'
                }
            })
            .state("restricted.hostel.addVisitors", {
                url: "/addVisitors",
                templateUrl: 'app/components/hostel/addVisitors.html',
                controller: 'addVisitorCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_masked_inputs',
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_parsleyjs',
                            'app/components/hostel/addVisitorCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Add Visitors'
                }
            })
            .state("restricted.hostel.edit_visitor", {
                    url: "/edit_visitor/{id}",
                    templateUrl: 'app/components/hostel/editVisitor.html',
                    controller: 'editVisitorCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_masked_inputs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'lazy_tinymce',
                                'lazy_parsleyjs',
                                'app/components/hostel/editVisitor.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Visitor Edit'
                    },
                    params:{id:null}
                })
            .state("restricted.hostel.feereport", {
                url: "/feereport",
                templateUrl: 'app/components/hostel/report.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/hostel/reportCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Reports'
                }
            })

            // Library
            .state("restricted.library", {
                template: '<div ui-view autoscroll="false"/>',
                url :"/library",
                abstract: true
            })
            .state("restricted.library.category", {
                url: "/category",
                templateUrl: 'app/components/Library/category_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/categoryviewCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Category View'
                }
            })
            .state("restricted.library.bookviewdetails", {
                url: "/bookviewdetails",
                templateUrl: 'app/components/Library/bookdetails_tableview.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/booktableviewCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book View Details'
                }
            })
            .state("restricted.library.addbooks", {
                url: "/addbooks",
                templateUrl: 'app/components/Library/addbook_details.html',
                controller: 'addBookCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_dropify',
                            'lazy_parsleyjs',
                            'app/components/Library/addBookCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Add Books'
                }
            })
            .state("restricted.library.editbooks", {
                url: "/editbooks/{id}",
                templateUrl: 'app/components/Library/editbook_details.html',
                controller: 'editbookDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_dropify',
                            'lazy_parsleyjs',
                            'app/components/Library/editbookDetailCtrl.js'
                        ], {serie:true});
                    }],
                },
                data: {
                    pageTitle: 'Add Books'
                },
                params:{id:null}
            })
            .state("restricted.library.bookissue_view", {
                url: "/bookissue_view",
                templateUrl: 'app/components/Library/bookissue_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/bookissueCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book Issue'
                }
            })
            .state("restricted.library.addbookissue", {
                url: "/addbookissue",
                templateUrl: 'app/components/Library/addbook_issue.html',
                controller: 'addbookissueCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/addbookissueCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book Issue'
                }
            })

            .state("restricted.library.editBookIssue", {
                url: "/editBookIssue/{id}",
                templateUrl: 'app/components/Library/editbook_issue.html',
                controller: 'editbookissueCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'app/components/Library/editbookissueCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book Issue'
                }
            })

            // Book Return Added by Senthil 31/05/2017

            .state("restricted.library.bookreturn_view", {
                url: "/bookreturn_view",
                templateUrl: 'app/components/Library/bookreturn_view.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/bookreturnCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book Return'
                }
            })

            .state("restricted.library.addbookreturn", {
                url: "/addbookreturn",
                templateUrl: 'app/components/Library/addbook_return.html',
                controller: 'addbookreturnCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'app/components/Library/addbookreturnCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Book Issue'
                }
            })

            .state("restricted.library.BookReturnDetail", {
                url: "/BookReturnDetail/{id}",
                templateUrl: 'app/components/Library/Book_ReturnDetailsView.html',
                controller: 'BookReturnDetailController',
                parmas:{
                'id': {value: null},
                'indexId':{value:null}
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('app/components/Library/BookReturnDetailController.js');
                    }]
                }
            })

            .state("restricted.library.reportView", {
                url: "/reportView",
                templateUrl: 'app/components/Library/reportView.html',
                controller: 'reportViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/Library/reportViewCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Report View'
                }
            })
			
			// Transport module created by karthik @ 27.03.2017 9.13 pm
			.state("restricted.transport", {
				url: "/transport",
				template: '<div ui-view autoscroll="false"/>',
				abstract: true
			})
				
			.state("restricted.transport.vehicleDetail", {
				url: "/vehicleDetail",
				templateUrl: 'app/components/transport/vehicleDetail.html',
				controller: 'vehicleDetailCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'app/components/transport/vehicleDetail.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Vehicle Details'
				}
			})
			.state("restricted.transport.vehicleDetailAdd", {
				url: "/vehicleDetailAdd",
				templateUrl: 'app/components/transport/vehicleDetailAdd.html',
				controller: 'vehicleDetailAddCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
                            'lazy_parsleyjs',
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'lazy_dropify',
							'app/components/transport/vehicleDetailAdd.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Add Vehicle Details'
				}
			})
            .state("restricted.transport.vehicleDetailEdit", {
                url: "/vehicleDetailEdit/{id}",
                templateUrl: 'app/components/transport/vehicleDetailsEdit.html',
                controller: 'vehicleDetailsEditCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'lazy_dropify',
                            'app/components/transport/vehicleDetailsEditCtrl.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Edit Vehicle Details'
                }
            })
			
			.state("restricted.transport.routeDetail", {
				url: "/routeDetail",
				templateUrl: 'app/components/transport/routeDetail.html',
				controller: 'routeDetailCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
                            'lazy_parsleyjs',
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'app/components/transport/routeDetail.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Route Details'
				}
			})
			
			.state("restricted.transport.routeTiming", {
				url: "/routeTiming",
				templateUrl: 'app/components/transport/routeTiming.html',
				controller: 'routeTimingCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
                            'lazy_masked_inputs',
                            'lazy_parsleyjs',
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'app/components/transport/routeTiming.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Route Timing'
				}
			})
			
			.state("restricted.transport.routeStops", {
				url: "/routeStops",
				templateUrl: 'app/components/transport/routeStops.html',
				controller: 'routeStopsCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'app/components/transport/routeStops.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Route Stops'
				}
			})
            .state("restricted.transport.addRouteStops", {
                url: "/addRouteStops",
                templateUrl: 'app/components/transport/addRouteStops.html',
                controller: 'addRouteStopsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_masked_inputs',
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/transport/addRouteStops.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Add Route Stops'
                }
            })
            .state("restricted.transport.editRouteStops", {
                url: "/editRouteStops/{id}",
                templateUrl: 'app/components/transport/editRouteStops.html',
                controller: 'addRouteStopsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_masked_inputs',
                            'lazy_parsleyjs',
                            'bower_components/angular-resource/angular-resource.min.js',
                            'lazy_datatables',
                            'app/components/transport/editRouteStops.js'
                        ], {serie:true});
                    }]
                },
                data: {
                    pageTitle: 'Edit Route Stops'
                }
            })
			
			.state("restricted.transport.routeAllocation", {
				url: "/routeAllocation",
				templateUrl: 'app/components/transport/allocation.html',
				controller: 'routeAllocationCtrl',
				resolve: {
					deps: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load([
                            'lazy_parsleyjs',
							'bower_components/angular-resource/angular-resource.min.js',
							'lazy_datatables',
							'app/components/transport/allocation.js'
						], {serie:true});
					}]
				},
				data: {
					pageTitle: 'Route Allocation'
				}
			})
			
			
			// Email Template 
				.state("restricted.emailTemplate", {
                    url: "/emailTemplate",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }"/>',
                    abstract: true,
                    ncyBreadcrumb: {
                        label: 'Email Template'
                    }
                })
				
				.state("restricted.emailTemplate.template", {
                    url: "/template",
                    templateUrl: 'app/components/emailTemplate/templateview.html',
                    controller: 'templateCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/emailTemplate/templateCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Email Template'
                    }
                })
				.state("restricted.emailTemplate.create", {
                    url: "/create",
                    templateUrl: 'app/components/emailTemplate/create.html',
                    controller: 'createCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_datatables',
                                'lazy_tinymce',
                                'lazy_dropify',
                                'app/components/emailTemplate/create.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create Template'
                    }
                })
				
                // modified by vijayaraj 18-04-17
                .state("restricted.hr.LeaveEntitle_edit", {
                    url: "/LeaveEntitle_edit/{empid}",
                    templateUrl: 'app/components/Hr/Payroll_Payslip/LeaveEntitleEdit.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_parsleyjs',
                                'app/components/Hr/Payroll_Payslip/LeaveEntitleEditCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Leave Entitlement Edit'
                    },
                    params:{empid:null}
                })

                // created by vijayaraj on 17-06-17 finance transaction
                // .state("restricted.finance.fee.transaction", {
                //     url: "/transaction",
                //     template: '<div ui-view autoscroll="false"/>',
                //     abstract: true
                // })
                .state("restricted.finance.fee.category", {
                    url: "/category",
                    templateUrl: 'app/components/finance/financeCategory.html',
                    // controller: 'financeCategoryCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/financeCategoryCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Category'
                    }
                })
                .state("restricted.finance.fee.income", {
                    url: "/income",
                    templateUrl: 'app/components/finance/income.html',
                    // controller: 'incomeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/incomeCtrl.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'income'
                    }
                })
                .state("restricted.finance.fee.expense", {
                    url: "/expense",
                    templateUrl: 'app/components/finance/expense.html',
                    // controller: 'expense',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/expense.js'
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'Expense'
                    }
                })
                
                .state("restricted.finance.fee.transactionreport",{
                    url: "/transactionreport",
                    templateUrl: 'app/components/finance/TransactionReport.html',
                    controller : 'TransactionReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/finance/TransactionReportCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Report'
                    }                  
                })

                // Written by Vijayaraj ON 21-06-17

                .state("restricted.academics.timetable", {
                    url: "/timetable",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                .state("restricted.academics.timetable.managetimetable", {
                    url: "/managetimetable",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                .state("restricted.academics.timetable.managetimetable.setting",{
                    url: "/setting",
                    templateUrl: 'app/components/academics/timetable/timetablesetting.html',
                    controller : 'timetablesetting',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_masked_inputs',
                                'lazy_parsleyjs',
                                'app/components/academics/timetable/timetablesettingCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Timetable Setting'
                    }                  
                })

                .state("restricted.academics.timetable.managetimetable.createcalendar", {
                    url: "/createcalendar",
                    templateUrl: 'app/components/academics/timetable/calendarView.html',
                    controller: 'calendarCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_masked_inputs',
                                'lazy_parsleyjs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/academics/timetable/calendarController.js'
                            ]);
                        }],
                        setting_data: function($http,$localStorage){
                            return $http({method: 'GET', url: $localStorage.service+'TimetableAPI/timetableSetting'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                    },
                    data: {
                        pageTitle: 'Create Calendar'
                    }
                })
                .state("restricted.academics.timetable.viewtimetable", {
                    url: "/viewtimetable/{courseID}/{batchID}",
                    templateUrl: 'app/components/academics/timetable/timetableview.html',
                    controller: 'timetableviewCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_masked_inputs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/academics/timetable/timetableviewCtrl.js'
                            ]);
                        }],
                        setting_data: function($http,$localStorage){
                            return $http({method: 'GET', url: $localStorage.service+'TimetableAPI/timetableSetting'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                    },
                    data: {
                        pageTitle: 'Create Calendar'
                    },
                    params:{courseID:null,batchID:null}
                })

                .state("restricted.academics.timetable.timetableView", {
                    url: "/timetableView",
                    templateUrl: 'app/components/academics/timetable/timetableviewDetails.html',            
                    // controller: 'timetableviewdetailCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/academics/timetable/timetableviewdetailCtrl.js',
                            ], {serie:true});
                        }]
                    },
                    data: {
                        pageTitle: 'view table'
                    }
                })

                .state("restricted.academics.timetable.timetable_edit", {
                    url: "/timetable_edit/{courseID}/{batchID}",
                    templateUrl: 'app/components/academics/timetable/editTimetable.html',
                    controller: 'editTimetableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_fullcalendar',
                                'lazy_masked_inputs',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/academics/timetable/editTimetableCtrl.js'
                            ]);
                        }],
                        setting_data: function($http,$localStorage){
                            return $http({method: 'GET', url: $localStorage.service+'TimetableAPI/timetableSetting'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                    },
                    data: {
                        pageTitle: 'Timetable Edit'
                    },
                    params:{courseID:null,batchID:null}
                })

                .state("restricted.emailsending", {
                    template: '<div ui-view autoscroll="false"/>',
                    url :"/hr",
                    abstract: true
                })

                .state("restricted.emailsending.sendmail", {
                    url: "/sendmail",
                    templateUrl: 'app/components/emailsending/emailsending.html',
                    controller: 'emailsendingCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/emailsending/emailsendingCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Email Sending'
                    }
                })
                .state("restricted.student.paymentforparents",{
                    url: "/paymentforparents",
                    templateUrl: 'app/components/student/paymentviewforParents.html',
                    controller : 'paymentParentsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/student/paymentParentsCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Fee Payment'
                    }
                })
                .state("restricted.student.paymentdetailsview",{
                    url: "/paymentdetailsview",
                    templateUrl: 'app/components/student/viewpaymentdetails.html',
                    controller : 'viewpaymentDetails',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/student/viewpaymentDetails.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Payment View'
                    }
                })

                .state("restricted.student.paymenthistoryview",{
                    url: "/paymenthistoryview/{FEE_PAYMENT_ID}",
                    templateUrl: 'app/components/student/paymentHistory.html',
                    controller : 'paymentHistory',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/student/paymentHistory.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Payment View'
                    },
                    params:{FEE_PAYMENT_ID:null}
                })

                .state("restricted.student.paymentPay", {
                    url: "/paymentPay",
                    templateUrl: 'app/components/student/paymentPage.html',
                    controller : 'paymentCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/student/paymentCtrl.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'payment'
                    }
                })
        }
    ]);
