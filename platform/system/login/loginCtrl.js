define(['app'],
    function (app) {
        app.registerController(
            'loginCtrl', ["$scope","$log",
                function ($scope,$log) {
                    $log.debug(sessionStorage.toStateName);
                    $log.debug( angular.fromJson(sessionStorage.toStateParams||'{}'));
                }
            ]);
    });