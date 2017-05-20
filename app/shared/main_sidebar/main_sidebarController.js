angular
    .module('rubycampusApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
		'$http',
		'$localStorage',
        '$filter',
        function ($timeout,$scope,$rootScope,$http,$localStorage,$filter) {
    
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
						$('#sidebar_main').find('.act_item').parents('li:first').find('a:first').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);
    
                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });
    
            // language switcher
            $scope.langSwitcherModel = 'gb';
            var langData = $scope.langSwitcherOptions = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'French', value: 'fr'},
                {id: 3, title: 'Chinese', value: 'cn'},
                {id: 4, title: 'Dutch', value: 'nl'},
                {id: 5, title: 'Italian', value: 'it'},
                {id: 6, title: 'Spanish', value: 'es'},
                {id: 7, title: 'German', value: 'de'},
                {id: 8, title: 'Polish', value: 'pl'}
            ];
            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class=item><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function(selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                }
            };
			
			
			$http.get('http://192.168.1.139/rubyServices/api/UserMenuAPI/menuLink',{headers:{'access_token':$localStorage.access_token}})
			.success(function(data){
				//console.log(data.message,"data");
				$scope.sections=data.message;
				$scope.sections = $scope.convertTo($scope.sections, 'id', true);
				
			}).error(function(err){
			});
			
			var userLov = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.dashboard'
                },
                {
                    id: 1,
                    title: 'Institution',
                    icon: '&#xE84F;',
                    submenu: [
                        {
                            title: 'Institution Details',
                            link: 'restricted.setting.institutionDetails'
                            // link:'restricted.setting.institution_view'
                        },
                        {
                            title: 'Building',
                            link: 'restricted.setting.building'
                        },
                        {
                            title: 'Building Block',
                            link: 'restricted.setting.buildingblock'
                        },
                        {
                            title: 'Room',
                            link: 'restricted.setting.room'
                        }
                    ]
                }];
			
            // menu entries
            var adminLov = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.dashboard'
                },
                {
                    id: 1,
                    title: 'Institution',
                    icon: '&#xE84F;',
                    submenu: [
                        {
                            title: 'Institution Details',
                            link: 'restricted.setting.institutionDetails'
                            // link:'restricted.setting.institution_view'
                        },
                        {
                            title: 'Building',
                            link: 'restricted.setting.building'
                        },
                        {
                            title: 'Building Block',
                            link: 'restricted.setting.buildingblock'
                        },
                        {
                            title: 'Room',
                            link: 'restricted.setting.room'
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Academics',
                    icon: 'school',
                    submenu: [
                         {
                            title: 'Course & Batch',
                            submenu: [
                                {
                                    title: 'Department',
                                    link: 'restricted.academics.department'
                                },
                                {
                                    title: 'Course',
                                    link: 'restricted.academics.course'
                                },
                                {
                                    title: 'Batch',
                                    link: 'restricted.academics.courseBatches'
                                }
                            ]
                        },
                        {
                            title: 'Subjects & Syllabus',
                            submenu: [
                                {
                                    title: 'Subjects',
                                    link: 'restricted.academics.subjects'
                                },
                                {
                                    title: 'Syllabus',
                                    link: 'restricted.academics.syllabus_view'
                                }
                            ]
                        },
                        {
                            title: 'Attendance',
                            submenu: [
                                {
                                    title: 'Student Attendance Register',
                                },
                                {
                                    title: 'Student Attendance Report',
									link: 'restricted.plugins.studentreport'
                                },
                                {
                                    title: 'Student Attendance Marking',
                                    link: 'restricted.academics.markattendance'
                                },
                            ]
                        },
                        {
                            title: 'Timetable'
                        },
                       
                        {
                            title: 'Discipline',
                            submenu: [
                                {
                                    title: 'Add Compliant',
                                }
                            ]
                        },
                        {
                            title: 'Examination',
                            submenu: [
								{
                                    title: 'Grade Level',
                                    link: 'restricted.academics.examination.setgrading'
                                },
                                {
                                    title: 'Set Exam',
                                    link: 'restricted.academics.examination.setexam'
                                },
                                {
                                    title: 'Set Assessment',
									link: 'restricted.academics.examination.setassessment'
                                },
                                {
                                    title: 'Assign Exam',
									link: 'restricted.academics.examination.assign'
                                },
								{
                                    title: 'Mark List',
									link: 'restricted.academics.examination.markDetails'
                                },
                                {
                                    title: 'Enter Mark',
                                    link: 'restricted.academics.examination.EnterMarkView'
                                },
                                {
                                    title:'Online Exam',
                                    submenu: [
                                        {
                                            title: 'Add Online Exam',
                                        },
                                        {
                                            title: 'View Exam Result',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Assignments',
                            link: 'restricted.academics.assignment'
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Student',
                    icon: '&#xE7FD;',
                    submenu:[
                        {
                            title:'Student Admission',
                            link: 'restricted.student.admission'
                        },
                        {
                            title:'Students',
                            link: 'restricted.student.student_list'
                        },
                        {
                            title: 'Assign Teacher',
                            link: 'restricted.student.assignTeacher'
                        },
                        {
                            title: 'Leaves',
                            submenu: [
                                {
                                    title: 'Apply Leaves',
                                    link: 'restricted.student.stuApplyLeave'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'HR',
                    icon: '&#xE7EF;',
                    submenu: [
                        {
                            title: 'Employee Management',
                            submenu: [
                                {
                                    title: 'Employee Category',
                                    link: 'restricted.hr.config.category'
                                },
                                {
                                    title: 'Employee Position',
                                    link: 'restricted.hr.config.position'
                                },
                                {
                                    title: 'Employee Admission',
                                    link: 'restricted.employeemanagement.admission'
                                },
                                {
                                    title: 'Employees',
                                    link: 'restricted.employeemanagement.employee_view'
                                }
                            ]
                        },
                        {
                            title: 'Leave Management',
                            submenu: [
                                {
                                    title: 'Leave Type',
                                    // link:'restricted.hr.leave_category'
                                    link:'restricted.hr.leavetype'
                                },
                                {
                                    title: 'Leave Entitlement',
                                    link : 'restricted.hr.leave_entitlement_View'
                                },
                                {
                                    title: 'Apply Leave',
                                    link:'restricted.hr.applyLeave'
                                },
                                {
                                    title: 'Leave Applications',
                                    link : 'restricted.hr.leave_application'
                                },

                                {
                                    title: 'Attendance Register',
									link : 'restricted.academics.empattendancemark'
                                },
                                {
                                    title: 'Attendance Report',
									link: 'restricted.plugins.employeereport'
                                },
                            ]
                        },
                        {
                            title: 'Payroll & Payslip',
                            submenu: [
                                {
                                    title: 'Pay Item',
                                    link : 'restricted.hr.payitem_details'
                                },
                                {
                                    title: 'Pay Structure',
                                    link : 'restricted.hr.StructureGroup'
                                },
                                {
                                    title: 'Payslip',
                                    link : 'restricted.hr.payslipGenaration_view'
                                },
                                {
                                    title: 'Payslip Report',
                                    link : 'restricted.hr.payslipReport'
                                },
                                {
                                    title:'Rejected Payslips',
                                    link : 'restricted.hr.rejectpayslip'  
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    title: 'Finance',
                    icon: '&#xE263;',
                    submenu: [
                        {
                            title:'Fees',
                            submenu:[
                                    
                                {
                                    title:'Fee Item',
                                    link: 'restricted.finance.fee.feeitemDetails'
                                },
                                {
                                    title:'Fine',
                                    link: 'restricted.finance.fee.fineDetails'
                                },
                                {
                                    title:'Fee Structure',
                                    link: 'restricted.finance.fee.feeStructureDetails'
                                },
                                {
                                    title:'Fee Collection',
                                    link: 'restricted.finance.fee.feeCollectionDetails'
                                },
                                {
                                    title:'Fee Report',
                                    link: 'restricted.finance.fee.feeReport'
                                },
                                {
                                    title:'Parent Receipt View',
                                    link: 'restricted.parentReceiptView'
                                }
                            ]
                        },
                        {
                            title:'Payslip Management',
                            submenu:[
                                {
                                    title:'Payslip',
                                    link: 'restricted.finance.payslipGenaration_view'
                                },
                                {
                                    title:'Approve Payslips',
                                    link: 'restricted.finance.approvepayslip'
                                },
                                {
                                    title:'Payslip Report',
                                    link: 'restricted.finance.payslipReport'
                                }
                            ]
                        }
                    ]
                },

                {
                    id: 6,
                    title: 'Repository',
                    icon: '&#xE2CC;',
                    submenu:[
                        {
                            title:'Category',
                            link: 'restricted.repository.categoryView'
                        },
                        {
                            title:'Post',
                            link: 'restricted.repository.postView'
                        }
                        // ,{
                        //     title:'Repository View',
                        //     link: 'restricted.repository.repositoryView'
                        // }
                    ]
                },
                {
                    id: 7,
                    title: 'Email Template',
                    icon: '&#xE158;',
					link : 'restricted.emailTemplate.template'
                },
                {
                    id: 8,
                    title: 'Library',
                    icon: '&#xE02F;',
                    // link: 'restricted.Library'
                    submenu: [
                        {
                            title: 'Category',
                            link: 'restricted.library.category'
                        },
                        {
                            title: 'Books',
                            link: 'restricted.library.bookviewdetails'
                        },
                        {
                            title: 'Issue Books',
                            link: 'restricted.library.bookissue_view'
                        },
                        {
                            title: 'Return Books',
                            // link: ''
                        },
                        {
                            title: 'Report',
                            // link: ''
                        },
                        // {
                        //     title:"Library View",
                        //     link: 'restricted.Library'
                        // }
                    ]
                },
                {
                    id: 9,
                    title: 'Transport',
                    icon: '&#xE530;',
                    submenu: [
						{
							title: 'Vehicle',
							link : 'restricted.transport.vehicleDetail'
						},
						{
							title: 'Route',
							link : 'restricted.transport.routeDetail'
						},
						{
							title: 'Route Timing',
							link : 'restricted.transport.routeTiming'
						},
						{
							title: 'Route Stops',
							link : 'restricted.transport.routeStops'
						},
						{
							title: 'Route Allocation',
							link : 'restricted.transport.routeAllocation'
						}
					]
                },
                {
                    id: 10,
                    title: 'Hostel',
                    icon: '&#xE88A;',
                    submenu: [
                        {
                            title: 'Settings',
                            link: 'restricted.hostel.settings'
                        },
                        {
                            title: 'Allocation',
                            link: 'restricted.hostel.allocation'
                        },
                        {
                            title: 'Transfer',
                            link: 'restricted.hostel.transfer'
                        },
                        {
                            title: 'Vacate',
                            link: 'restricted.hostel.vacate'
                        },
                        {
                            title: 'Visitors',
                            link: 'restricted.hostel.visitors'
                        }
                        // {
                        //     title: 'Reports',
                        //     link: 'restricted.hostel.feereport'
                        // }
                    ]
                },
                {
                    id: 11,
                    title: 'Inventory',
                    icon: '&#xE8D1;',
                    submenu: [
                        {
                            title:'Settings',
                            submenu:[
                                {
                                    title: 'Store Category',
                                    link: 'restricted.inventory.storeCategory'
                                },
                                {
                                    title: 'Item Category',
                                    link: 'restricted.inventory.itemCategory'
                                },
                                {
                                    title: 'Supplier Type',
                                    link: 'restricted.inventory.supplierType'
                                }
                            ]
                        },
                        {
                            title: 'Store',
                            link: 'restricted.inventory.store'
                        },
                        {
                            title: 'Item',
                            link: 'restricted.inventory.item'
                        },
                        {
                            title: 'Store Item',
                            link: 'restricted.inventory.storeItem'
                        },
                        {
                            title: 'Supplier',
                            link: 'restricted.inventory.supplier'
                        },
                        {
                            title: 'Material Request',
                            link: 'restricted.inventory.materialRequestView'
                        },
                        {
                            title: 'Purchase Order',
                            link: 'restricted.inventory.purchaseOrderView'
                        },
                        {
                            title: 'Billing',
                            link: 'restricted.inventory.billingView'
                        },
                        {
                            title: 'GRN',
                            link: 'restricted.inventory.grnView'
                        },
                        {
                            title: 'Reports',
                            link: 'restricted.inventory.reportView'
                        }
                    ]
                    // link: 'restricted.Library'
                },
                // {
                //     id: 12,
                //     title: 'Calendar',
                //     icon: '&#xE8DF;',
                //     link: 'restricted.calendar'
                // },
                {
                    id: 12,
                    title: 'Calendar',
                    icon: '&#xE8DF;',
                    submenu: [
                        {
                            title: 'Calendar',
                            link: 'restricted.plugins.calendar'
                        },
                        {
                            title: 'Exam Calendar',
                            link: 'restricted.plugins.examination'
                        },
                        {
                            title: 'Events Calendar',
                            link: 'restricted.plugins.events'
                        }
                    ]
                },
                {
                    id: 13,
                    title: 'Student Dashboard',
                    icon: '&#xE158;',
                    link : 'restricted.studentDashboard'
                },
                {
                    id: 13,
                    title: 'Employee Dashboard',
                    icon: '&#xE158;',
                    link : 'restricted.employeeDashboard'
                },
				{
                    id: 14,
                    title: 'User Privileges',
                    icon: '&#xE8E8;',
                    link : 'restricted.user_privileges.userView'
                }
            ];
			// if($localStorage.role_id==1){
			// 	$scope.sections = adminLov;
			// }else if($localStorage.role_id==2){
			// 	//$scope.sections = userLov;
			// 	$scope.sections = adminLov;
			// }
            $scope.sections=[
                    {
                      "id": "1",
                      "title": "Dashboard",
                      "icon": "&#xE871;",
                      "link": "restricted.dashboard",
                      "submenu_id": null,
                      "menu_id": null,
                      "submenuTitle": null,
                      "submenuLink": null,
                      "submenuIcon": null,
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "2",
                      "title": "Institution",
                      "icon": "&#xE84F;",
                      "link": "",
                      "submenu_id": "1",
                      "menu_id": "2",
                      "submenuTitle": "Institution Details",
                      "submenuLink": "restricted.setting.institutionDetails",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "2",
                      "title": "Institution",
                      "icon": "&#xE84F;",
                      "link": "",
                      "submenu_id": "2",
                      "menu_id": "2",
                      "submenuTitle": "Building",
                      "submenuLink": "restricted.setting.building",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "2",
                      "title": "Institution",
                      "icon": "&#xE84F;",
                      "link": "",
                      "submenu_id": "3",
                      "menu_id": "2",
                      "submenuTitle": "Building Block",
                      "submenuLink": "restricted.setting.buildingblock",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "2",
                      "title": "Institution",
                      "icon": "&#xE84F;",
                      "link": "",
                      "submenu_id": "4",
                      "menu_id": "2",
                      "submenuTitle": "Room",
                      "submenuLink": "restricted.setting.room",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "5",
                      "menu_id": "3",
                      "submenuTitle": "Course & Batch",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "1",
                      "Itemsubmenu_id": "5",
                      "itemTitle": "Department",
                      "itemLink": "restricted.academics.department"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "5",
                      "menu_id": "3",
                      "submenuTitle": "Course & Batch",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "2",
                      "Itemsubmenu_id": "5",
                      "itemTitle": "Course",
                      "itemLink": "restricted.academics.course"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "5",
                      "menu_id": "3",
                      "submenuTitle": "Course & Batch",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "3",
                      "Itemsubmenu_id": "5",
                      "itemTitle": "Batch",
                      "itemLink": "restricted.academics.courseBatches"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "6",
                      "menu_id": "3",
                      "submenuTitle": "Subjects & Syllabus",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "4",
                      "Itemsubmenu_id": "6",
                      "itemTitle": "Subjects",
                      "itemLink": "restricted.academics.subjects"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "6",
                      "menu_id": "3",
                      "submenuTitle": "Subjects & Syllabus",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "5",
                      "Itemsubmenu_id": "6",
                      "itemTitle": "Syllabus",
                      "itemLink": "restricted.academics.syllabus_view"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "7",
                      "menu_id": "3",
                      "submenuTitle": "Attendance",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "6",
                      "Itemsubmenu_id": "7",
                      "itemTitle": "Student Attendance Register",
                      "itemLink": ""
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "7",
                      "menu_id": "3",
                      "submenuTitle": "Attendance",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "7",
                      "Itemsubmenu_id": "7",
                      "itemTitle": "Student Attendance Report",
                      "itemLink": "restricted.plugins.studentreport"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "7",
                      "menu_id": "3",
                      "submenuTitle": "Attendance",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "8",
                      "Itemsubmenu_id": "7",
                      "itemTitle": "Student Attendance Marking",
                      "itemLink": "restricted.academics.markattendance"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "8",
                      "menu_id": "3",
                      "submenuTitle": "Timetable",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "9",
                      "menu_id": "3",
                      "submenuTitle": "Discipline",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "9",
                      "Itemsubmenu_id": "9",
                      "itemTitle": "Add Compliant",
                      "itemLink": ""
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "10",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Grade Level",
                      "itemLink": "restricted.academics.examination.setgrading"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "11",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Set Exam",
                      "itemLink": "restricted.academics.examination.setexam"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "12",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Set Assessment",
                      "itemLink": "restricted.academics.examination.setassessment"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "13",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Assign Exam",
                      "itemLink": "restricted.academics.examination.assign"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "14",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Mark List",
                      "itemLink": "restricted.academics.examination.markDetails"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "10",
                      "menu_id": "3",
                      "submenuTitle": "Examination",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "15",
                      "Itemsubmenu_id": "10",
                      "itemTitle": "Enter Mark",
                      "itemLink": "restricted.academics.examination.EnterMarkView"
                    },
                    {
                      "id": "3",
                      "title": "Academics",
                      "icon": "school",
                      "link": "",
                      "submenu_id": "11",
                      "menu_id": "3",
                      "submenuTitle": "Assignments",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "4",
                      "title": "Student",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "12",
                      "menu_id": "4",
                      "submenuTitle": "Student Admission",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "4",
                      "title": "Student",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "13",
                      "menu_id": "4",
                      "submenuTitle": "Students",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "4",
                      "title": "Student",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "14",
                      "menu_id": "4",
                      "submenuTitle": "Assign Teacher",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "4",
                      "title": "Student",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "15",
                      "menu_id": "4",
                      "submenuTitle": "Leaves",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "16",
                      "Itemsubmenu_id": "15",
                      "itemTitle": "Apply Leaves",
                      "itemLink": "restricted.student.stuApplyLeave"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "32",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Fee Item",
                      "itemLink": "restricted.finance.fee.feeitemDetails"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "33",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Fine",
                      "itemLink": "restricted.finance.fee.fineDetails"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "34",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Fee Structure",
                      "itemLink": "restricted.finance.fee.feeStructureDetails"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "35",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Fee Collection",
                      "itemLink": "restricted.finance.fee.feeCollectionDetails"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "36",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Fee Report",
                      "itemLink": "restricted.finance.fee.feeReport"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "19",
                      "menu_id": "5",
                      "submenuTitle": "Fees",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "37",
                      "Itemsubmenu_id": "19",
                      "itemTitle": "Parent Receipt View",
                      "itemLink": "restricted.parentReceiptView"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "20",
                      "menu_id": "5",
                      "submenuTitle": "Payslip Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "38",
                      "Itemsubmenu_id": "20",
                      "itemTitle": "Payslip",
                      "itemLink": "restricted.finance.payslipGenaration_view"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "20",
                      "menu_id": "5",
                      "submenuTitle": "Payslip Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "39",
                      "Itemsubmenu_id": "20",
                      "itemTitle": "Approve Payslips",
                      "itemLink": "restricted.finance.approvepayslip"
                    },
                    {
                      "id": "5",
                      "title": "Finance",
                      "icon": "&#xE263;",
                      "link": "",
                      "submenu_id": "20",
                      "menu_id": "5",
                      "submenuTitle": "Payslip Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "40",
                      "Itemsubmenu_id": "20",
                      "itemTitle": "Payslip Report",
                      "itemLink": "restricted.finance.payslipReport"
                    },
                    {
                      "id": "6",
                      "title": "Repository",
                      "icon": "&#xE2CC;",
                      "link": "",
                      "submenu_id": "21",
                      "menu_id": "6",
                      "submenuTitle": "Category",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "6",
                      "title": "Repository",
                      "icon": "&#xE2CC;",
                      "link": "",
                      "submenu_id": "22",
                      "menu_id": "6",
                      "submenuTitle": "Post",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "7",
                      "title": "Email Template",
                      "icon": "&#xE158;",
                      "link": "restricted.emailTemplate.template",
                      "submenu_id": null,
                      "menu_id": null,
                      "submenuTitle": null,
                      "submenuLink": null,
                      "submenuIcon": null,
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "8",
                      "title": "Library",
                      "icon": "&#xE02F;",
                      "link": "",
                      "submenu_id": "23",
                      "menu_id": "8",
                      "submenuTitle": "Category",
                      "submenuLink": "restricted.library.category",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "8",
                      "title": "Library",
                      "icon": "&#xE02F;",
                      "link": "",
                      "submenu_id": "24",
                      "menu_id": "8",
                      "submenuTitle": "Books",
                      "submenuLink": "restricted.library.bookviewdetails",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "8",
                      "title": "Library",
                      "icon": "&#xE02F;",
                      "link": "",
                      "submenu_id": "25",
                      "menu_id": "8",
                      "submenuTitle": "Issue Books",
                      "submenuLink": "restricted.library.bookissue_view",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "8",
                      "title": "Library",
                      "icon": "&#xE02F;",
                      "link": "",
                      "submenu_id": "26",
                      "menu_id": "8",
                      "submenuTitle": "Return Books",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "8",
                      "title": "Library",
                      "icon": "&#xE02F;",
                      "link": "",
                      "submenu_id": "27",
                      "menu_id": "8",
                      "submenuTitle": "Report",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "9",
                      "title": "Transport",
                      "icon": "&#xE530;",
                      "link": "",
                      "submenu_id": "28",
                      "menu_id": "9",
                      "submenuTitle": "Vehicle",
                      "submenuLink": "restricted.transport.vehicleDetail",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "9",
                      "title": "Transport",
                      "icon": "&#xE530;",
                      "link": "",
                      "submenu_id": "29",
                      "menu_id": "9",
                      "submenuTitle": "Route",
                      "submenuLink": "restricted.transport.routeDetail",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "9",
                      "title": "Transport",
                      "icon": "&#xE530;",
                      "link": "",
                      "submenu_id": "30",
                      "menu_id": "9",
                      "submenuTitle": "Route Timing",
                      "submenuLink": "restricted.transport.routeTiming",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "9",
                      "title": "Transport",
                      "icon": "&#xE530;",
                      "link": "",
                      "submenu_id": "31",
                      "menu_id": "9",
                      "submenuTitle": "Route Stops",
                      "submenuLink": "restricted.transport.routeStops",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "9",
                      "title": "Transport",
                      "icon": "&#xE530;",
                      "link": "",
                      "submenu_id": "32",
                      "menu_id": "9",
                      "submenuTitle": "Route Allocation",
                      "submenuLink": "restricted.transport.routeAllocation",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "10",
                      "title": "Hostel",
                      "icon": "&#xE88A;",
                      "link": "",
                      "submenu_id": "33",
                      "menu_id": "10",
                      "submenuTitle": "Allocation",
                      "submenuLink": "restricted.hostel.allocation",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "10",
                      "title": "Hostel",
                      "icon": "&#xE88A;",
                      "link": "",
                      "submenu_id": "34",
                      "menu_id": "10",
                      "submenuTitle": "Transfer",
                      "submenuLink": "restricted.hostel.transfer",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "10",
                      "title": "Hostel",
                      "icon": "&#xE88A;",
                      "link": "",
                      "submenu_id": "35",
                      "menu_id": "10",
                      "submenuTitle": "Vacate",
                      "submenuLink": "restricted.hostel.vacate",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "10",
                      "title": "Hostel",
                      "icon": "&#xE88A;",
                      "link": "",
                      "submenu_id": "36",
                      "menu_id": "10",
                      "submenuTitle": "Visitors",
                      "submenuLink": "restricted.hostel.visitors",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "37",
                      "menu_id": "11",
                      "submenuTitle": "Settings",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "41",
                      "Itemsubmenu_id": "37",
                      "itemTitle": "Store Category",
                      "itemLink": "restricted.inventory.storeCategory"
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "37",
                      "menu_id": "11",
                      "submenuTitle": "Settings",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "42",
                      "Itemsubmenu_id": "37",
                      "itemTitle": "Item Category",
                      "itemLink": "restricted.inventory.itemCategory"
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "37",
                      "menu_id": "11",
                      "submenuTitle": "Settings",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "43",
                      "Itemsubmenu_id": "37",
                      "itemTitle": "Supplier Type",
                      "itemLink": "restricted.inventory.supplierType"
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "38",
                      "menu_id": "11",
                      "submenuTitle": "Store",
                      "submenuLink": "restricted.inventory.store",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "39",
                      "menu_id": "11",
                      "submenuTitle": "Item",
                      "submenuLink": "restricted.inventory.item",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "40",
                      "menu_id": "11",
                      "submenuTitle": "Store Item",
                      "submenuLink": "restricted.inventory.storeItem",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "41",
                      "menu_id": "11",
                      "submenuTitle": "Supplier",
                      "submenuLink": "restricted.inventory.supplier",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "42",
                      "menu_id": "11",
                      "submenuTitle": "Material Request",
                      "submenuLink": "restricted.inventory.materialRequestView",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "43",
                      "menu_id": "11",
                      "submenuTitle": "Purchase Order",
                      "submenuLink": "restricted.inventory.purchaseOrderView",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "44",
                      "menu_id": "11",
                      "submenuTitle": "Billing",
                      "submenuLink": "restricted.inventory.billingView",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "45",
                      "menu_id": "11",
                      "submenuTitle": "GRN",
                      "submenuLink": "restricted.inventory.grnView",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "11",
                      "title": "Inventory",
                      "icon": "&#xE8D1;",
                      "link": "",
                      "submenu_id": "46",
                      "menu_id": "11",
                      "submenuTitle": "Reports",
                      "submenuLink": "restricted.inventory.reportView",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "12",
                      "title": "Calendar",
                      "icon": "&#xE8DF;",
                      "link": "restricted.employeeDashboard",
                      "submenu_id": "47",
                      "menu_id": "12",
                      "submenuTitle": "Calendar",
                      "submenuLink": "restricted.plugins.calendar",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "12",
                      "title": "Calendar",
                      "icon": "&#xE8DF;",
                      "link": "restricted.employeeDashboard",
                      "submenu_id": "48",
                      "menu_id": "12",
                      "submenuTitle": "Exam Calendar",
                      "submenuLink": "restricted.plugins.examination",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "12",
                      "title": "Calendar",
                      "icon": "&#xE8DF;",
                      "link": "restricted.employeeDashboard",
                      "submenu_id": "49",
                      "menu_id": "12",
                      "submenuTitle": "Events Calendar",
                      "submenuLink": "restricted.plugins.events",
                      "submenuIcon": "",
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "13",
                      "title": "User Privileges",
                      "icon": "&#xE8E8;",
                      "link": "restricted.user_privileges.userView",
                      "submenu_id": null,
                      "menu_id": null,
                      "submenuTitle": null,
                      "submenuLink": null,
                      "submenuIcon": null,
                      "item_id": null,
                      "Itemsubmenu_id": null,
                      "itemTitle": null,
                      "itemLink": null
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "16",
                      "menu_id": "14",
                      "submenuTitle": "Employee Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "17",
                      "Itemsubmenu_id": "16",
                      "itemTitle": "Employee Category",
                      "itemLink": "restricted.hr.config.category"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "16",
                      "menu_id": "14",
                      "submenuTitle": "Employee Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "18",
                      "Itemsubmenu_id": "16",
                      "itemTitle": "Employee Position",
                      "itemLink": "restricted.hr.config.position"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "16",
                      "menu_id": "14",
                      "submenuTitle": "Employee Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "19",
                      "Itemsubmenu_id": "16",
                      "itemTitle": "Employee Admission",
                      "itemLink": "restricted.employeemanagement.admission"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "16",
                      "menu_id": "14",
                      "submenuTitle": "Employee Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "20",
                      "Itemsubmenu_id": "16",
                      "itemTitle": "Employees",
                      "itemLink": "restricted.employeemanagement.employee_view"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "21",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Leave Type",
                      "itemLink": "restricted.hr.leavetype"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "22",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Leave Entitlement",
                      "itemLink": "restricted.hr.leave_entitlement_View"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "23",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Apply Leave",
                      "itemLink": "restricted.hr.applyLeave"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "24",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Leave Applications",
                      "itemLink": "restricted.hr.leave_application"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "25",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Attendance Register",
                      "itemLink": "restricted.academics.empattendancemark"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "17",
                      "menu_id": "14",
                      "submenuTitle": "Leave Management",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "26",
                      "Itemsubmenu_id": "17",
                      "itemTitle": "Attendance Report",
                      "itemLink": "restricted.plugins.employeereport"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "18",
                      "menu_id": "14",
                      "submenuTitle": "Payroll & Payslip",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "27",
                      "Itemsubmenu_id": "18",
                      "itemTitle": "Pay Item",
                      "itemLink": "restricted.hr.payitem_details"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "18",
                      "menu_id": "14",
                      "submenuTitle": "Payroll & Payslip",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "28",
                      "Itemsubmenu_id": "18",
                      "itemTitle": "Pay Structure",
                      "itemLink": "restricted.hr.StructureGroup"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "18",
                      "menu_id": "14",
                      "submenuTitle": "Payroll & Payslip",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "29",
                      "Itemsubmenu_id": "18",
                      "itemTitle": "Payslip",
                      "itemLink": "restricted.hr.payslipGenaration_view"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "18",
                      "menu_id": "14",
                      "submenuTitle": "Payroll & Payslip",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "30",
                      "Itemsubmenu_id": "18",
                      "itemTitle": "Payslip Report",
                      "itemLink": "restricted.hr.payslipReport"
                    },
                    {
                      "id": "14",
                      "title": "HR",
                      "icon": "&#xE7EF;",
                      "link": "",
                      "submenu_id": "18",
                      "menu_id": "14",
                      "submenuTitle": "Payroll & Payslip",
                      "submenuLink": "",
                      "submenuIcon": "",
                      "item_id": "31",
                      "Itemsubmenu_id": "18",
                      "itemTitle": "Rejected Payslips",
                      "itemLink": "restricted.hr.rejectpayslip"
                    }
                  ];
            $scope.convertTo = function (arr, key, dayWise) {
                var groups = {};
                for (var i=0;l= arr.length, i<l;i++) {
                    arr[i][key] = arr[i][key];
                  // console.log(groups,"groups");
                  groups[arr[i][key]] = groups[arr[i][key]] || [];
                  groups[arr[i][key]].title = arr[i].title;
                  groups[arr[i][key]].icon = arr[i].icon;
                  groups[arr[i][key]].link = arr[i].link;
                  
                  if (arr[i].submenuTitle) {
                    groups[arr[i][key]].submenu=groups[arr[i][key]].submenu || [];
                    var data={title:arr[i].submenuTitle, id:arr[i].submenu_id, link:arr[i].submenuLink};
                    var filteredData=$filter('filter')(groups[arr[i][key]].submenu, data, true);
                    if (filteredData.length == 0) {
                        groups[arr[i][key]].submenu.push(data);
                    };
                    if (arr[i].item_id!=null) {
                        groups[arr[i][key]].submenu[parseInt(groups[arr[i][key]].submenu.length)-1].submenu=groups[arr[i][key]].submenu[parseInt(groups[arr[i][key]].submenu.length)-1].submenu || [];
                        groups[arr[i][key]].submenu[parseInt(groups[arr[i][key]].submenu.length)-1].submenu.push({title:arr[i].itemTitle, id:arr[i].item_id, link:arr[i].itemLink})
                    };
                  }
                }
                return groups;
            };
            // $scope.sections = $scope.convertTo($scope.sections, 'id', true);
            // console.log($scope.sections);
        }
    ])
;