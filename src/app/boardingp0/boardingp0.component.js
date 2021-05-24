"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var gestures_1 = require("tns-core-modules/ui/gestures");
var utils = require("tns-core-modules/utils/utils");
var BoardingP0Component = /** @class */ (function () {
    function BoardingP0Component(router, page) {
        this.router = router;
        this.page = page;
        this.more = false;
        this.page.actionBarHidden = true;
    }
    BoardingP0Component.prototype.ngOnInit = function () {
    };
    BoardingP0Component.prototype.onMore = function () {
        this.more = true;
    };
    BoardingP0Component.prototype.onView = function () {
        utils.openUrl("https://diatum.org");
    };
    BoardingP0Component.prototype.onSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.left) {
            this.router.navigate(["/boardingp1"], { clearHistory: false, animated: true,
                transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
            });
        }
    };
    BoardingP0Component.prototype.onNext = function (idx) {
        this.router.navigate(["/boardingp" + idx], { clearHistory: false, animated: false });
    };
    BoardingP0Component = __decorate([
        core_1.Component({
            selector: "boardingp0",
            moduleId: module.id,
            templateUrl: "./boardingp0.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            page_1.Page])
    ], BoardingP0Component);
    return BoardingP0Component;
}());
exports.BoardingP0Component = BoardingP0Component;
