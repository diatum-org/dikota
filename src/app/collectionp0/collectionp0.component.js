"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var CollectionP0Component = /** @class */ (function () {
    function CollectionP0Component(router) {
        this.router = router;
    }
    CollectionP0Component.prototype.ngOnInit = function () {
    };
    CollectionP0Component.prototype.goBack = function () {
        this.router.back();
    };
    CollectionP0Component.prototype.onNext = function () {
        this.router.navigate(["/collectionp1"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    CollectionP0Component = __decorate([
        core_1.Component({
            selector: "collectionp0",
            moduleId: module.id,
            templateUrl: "./collectionp0.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], CollectionP0Component);
    return CollectionP0Component;
}());
exports.CollectionP0Component = CollectionP0Component;
