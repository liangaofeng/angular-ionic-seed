define(['app'],
    function (app) {
        app.registerController(
            'vipCtrl', ["$scope", "$state",
                function ($scope, $state) {
                    $scope.goState = function (state) {
                        $state.go(state);
                    }
                }])
    });