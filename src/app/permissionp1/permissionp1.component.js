"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var PermissionP1Component = /** @class */ (function () {
    function PermissionP1Component(router) {
        this.router = router;
    }
    PermissionP1Component.prototype.ngOnInit = function () {
    };
    PermissionP1Component.prototype.goBack = function () {
        this.router.back();
    };
    PermissionP1Component.prototype.onNext = function () {
        this.router.navigate(["/permissionp2"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    PermissionP1Component = __decorate([
        core_1.Component({
            selector: "permissionp1",
            moduleId: module.id,
            templateUrl: "./permissionp1.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], PermissionP1Component);
    return PermissionP1Component;
}());
exports.PermissionP1Component = PermissionP1Component;
