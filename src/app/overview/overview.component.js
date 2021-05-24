"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@nativescript/angular");
var platform_1 = require("tns-core-modules/platform");
var OverviewComponent = /** @class */ (function () {
    function OverviewComponent(router) {
        this.router = router;
        this.iOS = platform_1.isIOS;
    }
    OverviewComponent.prototype.ngOnInit = function () {
    };
    OverviewComponent.prototype.ngOnDestroy = function () {
    };
    OverviewComponent.prototype.onBack = function () {
        this.router.back();
    };
    OverviewComponent = __decorate([
        core_1.Component({
            selector: "overview",
            moduleId: module.id,
            templateUrl: "./overview.component.xml"
        }),
        __metadata("design:paramtypes", [angular_1.RouterExtensions])
    ], OverviewComponent);
    return OverviewComponent;
}());
exports.OverviewComponent = OverviewComponent;
