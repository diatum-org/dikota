"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@nativescript/angular");
var PermissionP3Component = /** @class */ (function () {
    function PermissionP3Component(router) {
        this.router = router;
        this.block = [false, false, false];
    }
    PermissionP3Component.prototype.ngOnInit = function () {
    };
    PermissionP3Component.prototype.ngOnDestroy = function () {
    };
    PermissionP3Component.prototype.goBack = function () {
        this.router.back();
    };
    PermissionP3Component.prototype.onNext = function () {
        this.router.navigate(["/permissionp4"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    PermissionP3Component = __decorate([
        core_1.Component({
            selector: "permissionp3",
            moduleId: module.id,
            templateUrl: "./permissionp3.component.xml"
        }),
        __metadata("design:paramtypes", [angular_1.RouterExtensions])
    ], PermissionP3Component);
    return PermissionP3Component;
}());
exports.PermissionP3Component = PermissionP3Component;
