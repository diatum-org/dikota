"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var CollectionP2Component = /** @class */ (function () {
    function CollectionP2Component(router) {
        this.router = router;
    }
    CollectionP2Component.prototype.ngOnInit = function () {
    };
    CollectionP2Component.prototype.goBack = function () {
        this.router.back();
    };
    CollectionP2Component.prototype.onNext = function () {
        this.router.navigate(["/home"], { clearHistory: true,
            transition: { name: "slideRight", duration: 300, curve: "easeIn" } });
    };
    CollectionP2Component = __decorate([
        core_1.Component({
            selector: "collectionp2",
            moduleId: module.id,
            templateUrl: "./collectionp2.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], CollectionP2Component);
    return CollectionP2Component;
}());
exports.CollectionP2Component = CollectionP2Component;
