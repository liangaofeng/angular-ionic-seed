define(
    ['app'],
    function () {
        var app = angular.module('app', ['scs.couch-potato', 'ionic', 'Routing']); //, 'flow', 'ngFileUpload'   上传文件模块
        couchPotato.configureApp(app);
        app.config(function ($ionicConfigProvider, $logProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.tabs.style('standard');
            $ionicConfigProvider.views.maxCache(50);
            $ionicConfigProvider.views.transition('ios'); //platform,ios,android,none
            $ionicConfigProvider.views.forwardCache(true); //true:启用,false:禁用
            $ionicConfigProvider.backButton.text('&emsp;&emsp;').icon('ion-chevron-left').previousTitleText(false);
            $ionicConfigProvider.navBar.alignTitle('center');

            $logProvider.debugEnabled(myConfig.isDebug);

        });
        app.run(function ($rootScope, $log, $state) {
            document.title = myConfig.name;
            $rootScope.myConfig = myConfig;

            $rootScope.goBack = function () {
                history.go(-1);
            }

            $rootScope.imgPath = function (name, lazy, replace) {
                if (replace) return replace;
                if (name && name.indexOf('http') >= 0)  return name;
                return name ? (myConfig.host + name) : myConfig.lazyImage;
            }


            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.auto) {//判断是否登陆 &&!localStorage.uid
                        $state.go('login');
                        sessionStorage.setItem('toStateName', toState.name);
                        sessionStorage.setItem('toStateParams', angular.toJson(toParams));
                        event.preventDefault();
                    } else {
                        $rootScope.hideTabs = !toState.showTabs;
                    }
                });


            //todo 定位功能
            /*
             if (!sessionStorage.gpsCity) {
             sessionStorage.setItem("city", myConfig.city);
             locationService.getGeolocation().then(function (d) {
             sessionStorage.setItem("pos", angular.toJson(d));
             sessionStorage.setItem("gpsCity", d.address.city);//定位出来的城市不改变
             sessionStorage.setItem("latitude", d.latitude);
             sessionStorage.setItem("longitude", d.longitude);
             $rootScope.$broadcast("pos");
             if (!d.address.city) {
             console.log('定位失败');
             return;
             } else {
             if (myConfig.city != d.address.city&&$state.current.name =='vip.index'){
             $ionicPopup.confirm({
             title: '温馨提示',
             template: '当前定位城市' + d.address.city + "是否切换？",
             cancelText: '取消',
             okText: '切换',
             okType: 'button-' + myConfig.color
             }).then(function (res) {
             if (res) {
             sessionStorage.setItem("city", d.address.city);
             $rootScope.$broadcast("city");
             }
             });
             }
             locationService.setLocation(d);
             console.log('定位成功--城市：' + d.address.city + "--lat" + d.latitude + "--lon" + d.longitude);
             }
             }, function (d) {
             console.log(d);
             });

             } else {
             console.log(angular.fromJson(sessionStorage.pos));
             }*/


        });

        app.constant('$ionicLoadingConfig', {
            template: "<ion-spinner icon=\"bubbles\" class=\"my-spinner spinner-" + myConfig.color + "\"></ion-spinner>",
            noBackdrop: true,
            duration: 10000
        });

        return app;
    }
);
