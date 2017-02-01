var vpCtrlList = ['app'];
var ctrlList = getIOSCtrlList(myRoute);
vpCtrlList = vpCtrlList.concat(ctrlList);
vpCtrlList.splice(1, 0, 'js/app-init');

angular.module('Routing', ['ui.router'])
    .provider('router', function () {
        this.$get = function () {
            return {}
        }
        this.loadRoutes = function loadRoutes($stateProvider, collection) {
            for (var routeName in collection) {
                var isExist = false;
                for (var i = 0; i < vpCtrlList.length; i++) {
                    if (vpCtrlList[i] == collection[routeName].controllerUrl) {
                        isExist = true;
                    }
                }
                if (!isExist) {
                    vpCtrlList.push(collection[routeName].controllerUrl);
                }
                delete collection[routeName].controllerUrl;
                $stateProvider.state(routeName, collection[routeName]);
            }
        }
    })

define(vpCtrlList, function (app) {
    app.registerProvider(
        'routeDefs',
        [
            '$stateProvider',
            '$urlRouterProvider'
            , 'routerProvider',
            function ($stateProvider, $urlRouterProvider, routerProvider) {
                this.$get = function () {
                    return {};
                };
                routerProvider.loadRoutes($stateProvider, myRoute);
                $urlRouterProvider.otherwise(myConfig.otherwise);
            }
        ]
    );
});

function getIOSCtrlList(collection) {
    var ctrlList = [];
    for (var routeName in collection) {
        var controllerUrl = collection[routeName].controllerUrl;
        var isExist = false;
        if (angular.isString(controllerUrl)) {
            for (var i = 0; i < ctrlList.length; i++) {
                if (ctrlList[i] == controllerUrl) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                ctrlList.push(collection[routeName].controllerUrl+'.js?v='+myConfig.version);
            }
        }
    }
    return ctrlList;
}


