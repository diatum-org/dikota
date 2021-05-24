"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var gestures_1 = require("tns-core-modules/ui/gestures");
var BoardingP1Component = /** @class */ (function () {
    function BoardingP1Component(router, page) {
        this.router = router;
        this.page = page;
        this.page.actionBarHidden = true;
    }
    BoardingP1Component.prototype.ngOnInit = function () {
    };
    BoardingP1Component.prototype.onSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.left) {
            this.router.navigate(["/boardingp2"], { clearHistory: true, animated: true,
                transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
            });
        }
        else {
            this.router.navigate(["/boardingp0"], { clearHistory: true, animated: true,
                transition: { name: "slideRight", duration: 300, curve: "easeIn" }
            });
        }
    };
    BoardingP1Component.prototype.onNext = function (idx) {
        this.router.navigate(["/boardingp" + idx], { clearHistory: true, animated: false });
    };
    BoardingP1Component = __decorate([
        core_1.Component({
            selector: "boardingp1",
            moduleId: module.id,
            templateUrl: "./boardingp1.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            page_1.Page])
    ], BoardingP1Component);
    return BoardingP1Component;
}());
exports.BoardingP1Component = BoardingP1Component;
