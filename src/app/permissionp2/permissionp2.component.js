"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@nativescript/angular");
var PermissionP2Component = /** @class */ (function () {
    function PermissionP2Component(router) {
        this.router = router;
        this.block = [false, false, false];
    }
    PermissionP2Component.prototype.ngOnInit = function () {
    };
    PermissionP2Component.prototype.ngOnDestroy = function () {
    };
    PermissionP2Component.prototype.goBack = function () {
        this.router.back();
    };
    PermissionP2Component.prototype.onNext = function () {
        this.router.navigate(["/permissionp3"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    PermissionP2Component = __decorate([
        core_1.Component({
            selector: "permissionp2",
            moduleId: module.id,
            templateUrl: "./permissionp2.component.xml"
        }),
        __metadata("design:paramtypes", [angular_1.RouterExtensions])
    ], PermissionP2Component);
    return PermissionP2Component;
}());
exports.PermissionP2Component = PermissionP2Component;
