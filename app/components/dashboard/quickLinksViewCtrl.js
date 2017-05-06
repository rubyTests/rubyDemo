angular
    .module('rubycampusApp')
    .controller('quickLinksViewCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        function ($rootScope,$scope,$timeout) {

            $timeout(function() {

                // multiple selection
                $("#tB").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tB1").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tB2").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tB3").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tB4").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });


                $("#tBS").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tBS1").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tBS2").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tBS3").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
                $("#tBS4").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });
            });

            $scope.backBtn = function(){
                window.history.back();
            }
            
        }
    ]);