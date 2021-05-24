"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@nativescript/angular");
var PermissionP4Component = /** @class */ (function () {
    function PermissionP4Component(router) {
        this.router = router;
        this.block = [false, false, false];
    }
    PermissionP4Component.prototype.ngOnInit = function () {
    };
    PermissionP4Component.prototype.ngOnDestroy = function () {
    };
    PermissionP4Component.prototype.goBack = function () {
        this.router.back();
    };
    PermissionP4Component.prototype.onNext = function () {
        this.router.navigate(["/home"], { clearHistory: true,
            transition: { name: "slideRight", duration: 300, curve: "easeIn" } });
    };
    PermissionP4Component = __decorate([
        core_1.Component({
            selector: "permissionp4",
            moduleId: module.id,
            templateUrl: "./permissionp4.component.xml"
        }),
        __metadata("design:paramtypes", [angular_1.RouterExtensions])
    ], PermissionP4Component);
    return PermissionP4Component;
}());
exports.PermissionP4Component = PermissionP4Component;
