//加载公共服务
var sourcelist = [];
sourcelist.splice(0, 0, "app");
sourcelist.push('js/services');
sourcelist.push('js/directive');
sourcelist.push('js/filter');
//sourcelist.push('lib/angular/angular-toastr/dist/angular-toastr.tpls');
//sourcelist.push('lib/ionic/timepicker/dist/ionic-timepicker.bundle.min');
//sourcelist.push('lib/ionic/datepicker/dist/ionic-datepicker.bundle.min');

//sourcelist.push('lib/angular/ng-flow/dist/ng-flow-standalone.min');
//sourcelist.push('lib/angular/ng-file-upload/ng-file-upload.min');

define(sourcelist);
