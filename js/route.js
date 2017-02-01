define([], function () {
    var config = {
        "vip": {
            "url": "/vip",
            "templateUrl": "platform/vip/vip.html",
            "controller": "vipCtrl",
            "controllerUrl": "platform/vip/vipCtrl",
            "abstract": true
        },
        "vip.index": {
            "url": "/index",
            "views": {
                "vip-home": {
                    "templateUrl": "platform/vip/home/index/index.html",
                    "controller": "vipHomeIndexCtrl"
                }
            },
            "controllerUrl": "platform/vip/home/index/indexCtrl",
            "showTabs": true
        },
        "vip.business": {
            "url": "/business/:word",
            "views": {
                "vip-near": {
                    "templateUrl": "platform/vip/near/business/business.html",
                    "controller": "vipNearBusinessCtrl"
                }
            },
            "controllerUrl": "platform/vip/near/business/businessCtrl",
            "showTabs": true
        },
        "vip.personal": {
            "url": "/personal",
            "views": {
                "vip-my": {
                    "templateUrl": "platform/vip/my/personal/personal.html",
                    "controller": "vipMyPersonalCtrl"
                }
            },
            "controllerUrl": "platform/vip/my/personal/personalCtrl",
            "showTabs": true,
            "auto": true
        },
        "vip.orders": {
            "url": "/orders/:docstatus",
            "views": {
                "vip-orders": {
                    "templateUrl": "platform/vip/orders/orders/orders.html",
                    "controller": "vipOrdersCtrl"
                }
            },
            "controllerUrl": "platform/vip/orders/orders/ordersCtrl",
            "showTabs": true
        },
        "login": {
            "url": "/login",
            "templateUrl": "platform/system/login/login.html",
            "controller": "loginCtrl",
            "controllerUrl": "platform/system/login/loginCtrl"
        }
    }
    return config;
});