define(['app'], function (app) {
    app.registerFactory('DataService', ['$q', '$ionicLoading', "$log", "$ionicScrollDelegate", "$http",
        function ($q, $ionicLoading, $log, $ionicScrollDelegate, $http) {
            var dataServiceUrl = myConfig.isDebug ? myConfig.testDataServiceUrl : myConfig.dataServiceUrl;

            var post = function (action, d, showLoading) {
                d = ( d ? d : {});
                if (localStorage.userguid) {
                    d.userguid = localStorage.userguid;
                }
                var deferred = $q.defer();
                if (!showLoading) {
                    $ionicLoading.show();
                }
                $log.debug('-----------------请求信息开始-----------------');
                $http({
                    method: 'POST',
                    url: dataServiceUrl + '/' + action,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded',Authorization :  'BasicAuth ' +  localStorage.ticket||''},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: d
                }).then(function (json) {
                    deferred.resolve(json.data);
                    if (json.data && json.data.Code === -1000) {
                        self.location = "index.html#/userType";
                    }
                    $log.debug(action);
                    $log.debug(d);
                    $log.debug(json.data);
                    $log.debug('-----------------请求信息结束-----------------');
                    if (!showLoading) {
                        $ionicLoading.hide();
                    }
                }, function (json) {
                    deferred.reject(json);
                    $ionicLoading.show("网络错误");
                    $log.error(json);
                    if (!showLoading) {
                        $ionicLoading.hide();
                    }
                    $log.debug('-----------------请求错误-----------------');
                });
                return deferred.promise;
            };
            return {
                post: post
            }
        }
    ]);
    app.registerFactory('UserInfoFactory', ["$ionicHistory",
        function ($ionicHistory) {
            /**
             * 获取用户信息
             * @returns {UserInfo}
             */
            function getUserInfo() {
                if (hasLoginUserInfo()) {
                    return angular.fromJson(localStorage.getItem("user"));
                } else {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                    return null;
                }
            }

            function deleteUserInfo() {
                localStorage.removeItem("userguid");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("usertype");
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            }


            /*
             *
             * 设置用户信息 保存cookie
             * @user 用户信息
             * */
            function setLogin(user) {
                localStorage.setItem("userguid", user.userguid);
                localStorage.setItem("token", user.token);
                localStorage.setItem("usertype", user.usertype);
                localStorage.setItem("user", angular.toJson(user));
            }


            /**
             * 检查是否已登录
             */
            function hasLoginUserInfo() {
                if (localStorage.user && localStorage.userguid && localStorage.token) {
                    return true;
                } else {
                    return false;
                }
            }

            return {
                getUserInfo: getUserInfo,
                setLogin: setLogin,
                hasLoginUserInfo: hasLoginUserInfo
            }
        }
    ]);
    app.registerFactory('UploadService', ['$ionicLoading', '$q', 'Upload',
        function ($ionicLoading, $q, Upload) {
            /*
             * params 参数说明
             * @upAction 接收图片的Action
             * @ifUpload 是否上传文件 ，如不上传返回的是 ：image_base64  ，否则返回的是：服务器路径
             * */
            var uploadImage = function uploadImage(file, callback) {
                var uploadUrl = myConfig.dataServiceUrl + "/Common/Upload";
                Upload.upload({
                    url: uploadUrl,
                    data: {file: file}
                }).then(function (response) {
                    console.log(response);
                    callback(response.data);
                    $ionicLoading.hide();
                }, function (response) {
                    callback(response);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $ionicLoading.show({
                        template: '正在上传 ' + progressPercentage + " %"
                    });
                    // console.log('progress: ' + base.progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
            return {
                uploadImage: uploadImage
            }
        }
    ]);
    app.registerFactory('ToolService', ['$ionicPopup', '$ionicLoading',
        function ($ionicPopup, $ionicLoading) {
            var alert = function (template, title, okText) {
                return $ionicPopup.alert({
                    title: title || "温馨提示",
                    template: template || "请检查内容",
                    okText: okText || '确定',
                    okType: 'button-' + myConfig.color
                });
            };
            var confirm = function (template, title, func, okText) {
                return $ionicPopup.confirm({
                    title: title || "温馨提示",
                    template: template || "请检查内容",
                    okText: okText || '确定',
                    okType: 'button-' + myConfig.color,
                    cancelText: '取消'
                });
            };

            var show = function (template) {
                return $ionicLoading.show({
                    template: template,
                    duration: 800,
                    noBackdrop: true
                });
            };


            var isFloatNumber = function isFloatNumber(value) {
                var regexp = /^[0-9]+.?[0-9]*$/;
                return regexp.test(value);
            }


            var getQueryString = function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }

            var isTel = function isTel(v) {
                var PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{8}$/;//移动手机号
                var PATTERN_CHINAUNICOM = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/;//联通手机号
                var PATTERN_CHINATELECOM = /^1(3[3])|(8[019])\d{8}$/;//电信手机号
                if (PATTERN_CHINAMOBILE.test(v))
                    return true;
                else if (PATTERN_CHINAUNICOM.test(v))
                    return true;
                else if (PATTERN_CHINATELECOM.test(v))
                    return true;
                else
                    return false;
            }

            var getCarriers = function getCarriers(v) {
                var PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{8}$/;//移动手机号
                var PATTERN_CHINAUNICOM = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/;//联通手机号
                var PATTERN_CHINATELECOM = /^1(3[3])|(8[019])\d{8}$/;//电信手机号
                if (PATTERN_CHINAMOBILE.test(v))
                    return '中国移动';
                else if (PATTERN_CHINAUNICOM.test(v))
                    return '中国联通';
                else if (PATTERN_CHINATELECOM.test(v))
                    return '中国电信';
                else
                    return '未知';
            }
            var changeDateFormat = function changeDateFormat(val, format) {
                if (val != null) {
                    var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
                    //月份为0-11，所以+1，月份小于10时补个0
                    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    if (format)  return date.Format(format);
                    return date.Format("yyyy-MM-dd hh:mm:ss");
                }
                return "";
            }


            /*判断图片是否加载完成 */
            var t_img; // 定时器
            var isLoad = true; // 控制变量
            var isImgLoad = function isImgLoad(callback, times) {
                $('.load').each(function () {
                    if (!this.complete) {
                        isLoad = false;
                        return false;
                    }
                });
                if (isLoad) {
                    clearTimeout(t_img);
                    callback();
                } else {
                    isLoad = true;
                    t_img = setTimeout(function () {
                        isImgLoad(callback); // 递归扫描
                    }, times || 500);
                }
            }

            return {
                alert: alert,
                confirm: confirm,
                show: show,
                isImgLoad: isImgLoad,
                isFloatNumber: isFloatNumber,
                isImgLoad: isImgLoad,
                changeDateFormat: changeDateFormat,
                getCarriers: getCarriers,
                isTel: isTel,
                getQueryString: getQueryString
            }
        }
    ]);
    app.registerFactory('LocationService', ['DataService', '$q',
        function (DataService, $q) {

            var getGeolocation = function () {
                var deferred = $q.defer();
                if (!BMap) {
                    deferred.reject(null);
                } else {
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (pos) {
                        deferred.resolve(pos);
                    }, {enableHighAccuracy: true});
                }

                return deferred.promise;
            };


            var getPos = function () {

                var deferred = $q.defer();
                if (!BMap) {
                    deferred.reject(null);
                } else {
                    var pos = '';
                    var geolocation = new BMap.Geolocation();
                    var deferred = $q.defer();
                    if (pos) {
                        if (pos) {

                        }
                        else {
                            pos = angular.fromJson(c_pos);
                        }
                        deferred.resolve(pos);
                    } else {
                        geolocation.getCurrentPosition(function (pos) {
                            deferred.resolve(pos);
                        }, {enableHighAccuracy: true});
                    }
                }
                return deferred.promise;
            };


            var setLocation = function (gps) {
                if (!localStorage.userguid)return;
                if (!gps) {
                    getGeolocation().then(function (d) {
                        set(d);
                    })
                } else {
                    set(gps);
                }

                function set(_gps) {
                    dataService.post('User/SetLocation', {
                        lon: _gps.longitude,
                        lat: _gps.latitude
                    }).then(function (json) {
                        console.log(json.Message);
                    });
                }
            }
            return {
                getGeolocation: getGeolocation,
                getPos: getPos,

                setLocation: setLocation
            };
        }
    ]);
});
