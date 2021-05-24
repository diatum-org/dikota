"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var app_settings_1 = require("../app.settings");
var OpenSourceNoticeComponent = /** @class */ (function () {
    function OpenSourceNoticeComponent(router) {
        this.router = router;
        this.iOS = (platform_1.device.os == "iOS");
    }
    OpenSourceNoticeComponent.prototype.ngOnInit = function () {
    };
    OpenSourceNoticeComponent.prototype.ngOnDestroy = function () {
    };
    OpenSourceNoticeComponent.prototype.onBack = function () {
        this.router.back();
    };
    OpenSourceNoticeComponent.prototype.openURL = function (url) {
        console.log(app_settings_1.AppSettings.AMIGO + "/assets/" + url);
        utils.openUrl(app_settings_1.AppSettings.AMIGO + "/assets/" + url);
    };
    OpenSourceNoticeComponent = __decorate([
        core_1.Component({
            selector: "ossnotice",
            moduleId: module.id,
            templateUrl: "./opensourcenotice.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], OpenSourceNoticeComponent);
    return OpenSourceNoticeComponent;
}());
exports.OpenSourceNoticeComponent = OpenSourceNoticeComponent;
