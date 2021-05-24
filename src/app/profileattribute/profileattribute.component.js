"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var attributeUtil_1 = require("../attributeUtil");
var ProfileAttributeComponent = /** @class */ (function () {
    function ProfileAttributeComponent(router) {
        this.router = router;
        this.iOS = platform_1.isIOS;
    }
    ProfileAttributeComponent.prototype.ngOnInit = function () {
    };
    ProfileAttributeComponent.prototype.ngOnDestroy = function () {
    };
    ProfileAttributeComponent.prototype.onBack = function () {
        this.router.back();
    };
    ProfileAttributeComponent.prototype.onAddEmail = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.EMAIL], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onAddPhone = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.PHONE], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onAddHome = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.HOME], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onAddBusinessCard = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.CARD], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onAddWebsite = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.WEBSITE], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onAddSocialLink = function () {
        this.router.navigate(["/attributeadd", attributeUtil_1.AttributeUtil.SOCIAL], { clearHistory: false });
    };
    ProfileAttributeComponent.prototype.onRequest = function () {
        utils.openUrl("mailto:requests@diatum.org");
    };
    ProfileAttributeComponent = __decorate([
        core_1.Component({
            selector: "profileattribute",
            moduleId: module.id,
            templateUrl: "./profileattribute.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], ProfileAttributeComponent);
    return ProfileAttributeComponent;
}());
exports.ProfileAttributeComponent = ProfileAttributeComponent;
