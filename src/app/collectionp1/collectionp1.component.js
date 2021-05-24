"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var CollectionP1Component = /** @class */ (function () {
    function CollectionP1Component(router) {
        this.router = router;
    }
    CollectionP1Component.prototype.ngOnInit = function () {
    };
    CollectionP1Component.prototype.goBack = function () {
        this.router.back();
    };
    CollectionP1Component.prototype.onNext = function () {
        this.router.navigate(["/collectionp2"], { clearHistory: false,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    CollectionP1Component = __decorate([
        core_1.Component({
            selector: "collectionp1",
            moduleId: module.id,
            templateUrl: "./collectionp1.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], CollectionP1Component);
    return CollectionP1Component;
}());
exports.CollectionP1Component = CollectionP1Component;
