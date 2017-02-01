define(['app'], function (app) {
  /*  app.directive('myArea', ['$http', '$q', '$ionicPopover', 'dataService',
        function ($http, $q, $ionicPopover, dataService) {
            return {
                restrict: 'AE',
                scope: {
                    province: '=',
                    city: '=',
                    district: '=',
                    areaSourceAction: '@areaSourceAction',
                    popover: '@popover',
                },
                templateUrl: 'templates/sys/area.html',
                link: function (scope) {

                    scope.base = {};
                    scope.base.province = [];
                    scope.base.city = [];
                    scope.base.district = [];

                    scope.current = {};
                    scope.current.province = "";
                    scope.current.city = "";
                    scope.current.district = "";

                    scope.types = ['province', 'city', 'district'];
                    scope.typesAlert = ['省份', '城市', '区域'];
                    scope.typesIndex = 0;

                    scope.selectArea = function (id, typesIndex) {
                        if (typesIndex === 1) {
                            scope.current.province = id;
                            scope.current.city = "";
                            scope.current.district = "";
                            scope.base.city = [];
                            scope.base.district = [];
                        }
                        if (typesIndex === 2) {
                            scope.current.city = id;
                            scope.current.district = "";
                            scope.base.district = [];
                        }
                        if (typesIndex === 3) {
                            scope.current.district = id;
                        }
                        if (typesIndex) {
                            scope.typesIndex = typesIndex;
                            scope.getArea(id, scope.types[typesIndex]).then(function () {
                                if (typesIndex === 1)  scope.selectArea(scope.current.city, 2);
                            });
                            scope.popover.hide();
                        }

                    }

                    scope.getAreaName = function (typesIndex) {
                        var areas = scope.base[scope.types[typesIndex]];
                        if (areas && areas.length > 0) {
                            for (var i = 0; i < areas.length; i++) {
                                if (areas[i].ID == scope.current[scope.types[typesIndex]]) {
                                    scope[scope.types[typesIndex]] = areas[i].Name;//双向绑定赋值
                                    return areas[i].Name;
                                }
                            }
                        }
                        return "";
                    }

                    $ionicPopover.fromTemplateUrl('my-popover.html', {
                        scope: scope
                    }).then(function (popover) {
                        scope.popover = popover;
                    });

                    scope.openPopover = function ($event, typesIndex) {
                        scope.typesIndex = typesIndex;
                        scope.popover.show($event);
                    };

                    scope.$on('$destroy', function () {
                        scope.popover.remove();
                    });

                    scope.initializing = function (id) {
                        if (scope[scope.types[scope.typesIndex]]) {
                            scope.getArea(id, scope.types[scope.typesIndex]).then(function (areas) {
                                angular.forEach(areas, function (area) {
                                    if (area.Name == scope[scope.types[scope.typesIndex]]) {
                                        scope.current[scope.types[scope.typesIndex]] = area.ID;
                                        scope.initializing(area.ID, ++scope.typesIndex);
                                        return;
                                    }
                                });
                            });
                        } else {
                            if (id === 0) scope.getArea(id, scope.types[scope.typesIndex]);
                        }
                    }

                    scope.getArea = function (parentId, type) {
                        var deferred = $q.defer();
                        dataService.post('Common/GetArea', {parentId: parentId}, false).then(function (json) {
                            scope.base[type] = json;
                            if (!scope.current[type] && scope.base[type][0]) {
                                scope.current[type] = scope.base[type][0].ID;
                            }
                            deferred.resolve(scope.base[type]);
                        }, function (json) {
                            deferred.reject(json);
                        });
                        return deferred.promise;
                    }
                    scope.initializing(0);
                }
            };
        }
    ]);*/
   /* app.directive('top', ["$ionicScrollDelegate",
        function ($ionicScrollDelegate) {
            return {
                restrict: 'AEC',
                scope: {
                    height: '@height'
                },
                templateUrl: 'templates/sys/top.html',
                link: function ($scope) {
                    $scope.$on('scrollEvent', function () {
                        if ($ionicScrollDelegate.getScrollPosition().top > ($scope.height || 800)) {
                            $scope.show = true;
                        } else {
                            $scope.show = false;
                        }
                    });
                    $scope.scrollTop = function () {
                        $scope.show = false;
                        $ionicScrollDelegate.scrollTop(true);
                    };
                }
            };
        }
    ]);*/
    //监听 $onScroll
    app.directive('lazyScroll', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element) {
                    var origEvent = $scope.$onScroll;
                    $scope.$onScroll = function () {
                        $timeout(function () {
                            $rootScope.$broadcast('scrollEvent');
                            $rootScope.$broadcast('lazyScrollEvent');
                            if (typeof origEvent === 'function') {
                                origEvent();
                            }
                        }, 500);
                    };
                }
            };
        }
    ]);
    /*
     <ion-content class="has-header" lazy-scroll>
     <img class="imgwidth" image-lazy-src="{{item.imageurl}}" style="height: 180px;background-color: #dedede">
     * */
    // 赖加载指令
    app.directive('imageLazySrc', ['$document', '$timeout',
        function ($document, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    imageLazyBackgroundImage: "@imageLazyBackgroundImage",
                    imageLazySrc: "@"
                },
                link: function ($scope, $element, $attributes) {
                    $scope.$watch('imageLazySrc', function (oldV, newV) {
                        var deregistration = $scope.$on('lazyScrollEvent', function () {
                            if (isInView()) {
                                loadImage();
                                deregistration();
                            }
                        });
                        $timeout(function () {
                            if (isInView()) {
                                loadImage();
                                deregistration();
                            }
                        }, 600);
                    });
                    var deregistration = $scope.$on('lazyScrollEvent', function () {
                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    });

                    function loadImage() {
                        if ($scope.imageLazyBackgroundImage == "true") {
                            var bgImg = new Image();
                            bgImg.src = $attributes.imageLazySrc;
                            bgImg.onload = function () {
                                $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')';
                            };
                        } else {
                            var bgImg = new Image();
                            bgImg.src = $attributes.imageLazySrc;
                            bgImg.onload = function () {
                                $element[0].src = $attributes.imageLazySrc;
                            };
                        }
                    }

                    function isInView() {
                        var clientHeight = $document[0].documentElement.clientHeight;
                        var imageRect = $element[0].getBoundingClientRect();
                        return (imageRect.top >= -50 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad || 0));
                    }

                    $element.on('$destroy', function () {
                        deregistration();
                    });

                    $timeout(function () {
                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    }, 500);
                }
            };
        }
    ]);

    app.directive('repeatFinished', function () {
        return {
            link: function (scope, element, attrs) {
                if (scope.$last) {                   // 这个判断意味着最后一个 OK
                    scope.$eval(attrs.repeatFinished);   // 执行绑定的表达式
                }
            }
        }
    });

})