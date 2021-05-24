"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var PermissionP0Component = /** @class */ (function () {
    function PermissionP0Component(router) {
        this.router = router;
    }
    PermissionP0Component.prototype.ngOnInit = function () {
    };
    PermissionP0Component.prototype.goBack = function () {
        this.router.back();
    };
    PermissionP0Component.prototype.onNext = function () {
        this.router.navigate(["/permissionp1"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    PermissionP0Component = __decorate([
        core_1.Component({
            selector: "permissionp0",
            moduleId: module.id,
            templateUrl: "./permissionp0.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], PermissionP0Component);
    return PermissionP0Component;
}());
exports.PermissionP0Component = PermissionP0Component;
