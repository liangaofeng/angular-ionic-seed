/**
 * 框架的总入口
 */
var myConfig = ""; //用于保存项目的配置信息
var myRoute = ""; //获取路由文件
requirejs.config({
    baseUrl: './'
});
require(['js/config', 'js/route'], function (data, route) {
    myConfig = angular.fromJson(data); //获取配置文件
    myRoute = angular.fromJson(route); //获取路由文件
    require(['app', 'js/routeDefs'], function (app) {
        angular.element(document).ready(function () {
            angular.bootstrap(document, [app['name'], function () {
                angular.element(document).find('html').addClass('ng-app');
            }]);
        });
    });
});