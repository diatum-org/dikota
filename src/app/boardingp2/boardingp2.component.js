"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var gestures_1 = require("tns-core-modules/ui/gestures");
var BoardingP2Component = /** @class */ (function () {
    function BoardingP2Component(router, page) {
        this.router = router;
        this.page = page;
        this.more = false;
        this.page.actionBarHidden = true;
    }
    BoardingP2Component.prototype.ngOnInit = function () {
    };
    BoardingP2Component.prototype.onMore = function (flag) {
        this.more = flag;
    };
    BoardingP2Component.prototype.onSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.left) {
            this.router.navigate(["/boardingp3"], { clearHistory: true, animated: true,
                transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
            });
        }
        else {
            this.router.navigate(["/boardingp1"], { clearHistory: true, animated: true,
                transition: { name: "slideRight", duration: 300, curve: "easeIn" }
            });
        }
    };
    BoardingP2Component.prototype.onNext = function (idx) {
        this.router.navigate(["/boardingp" + idx], { clearHistory: true, animated: false });
    };
    BoardingP2Component = __decorate([
        core_1.Component({
            selector: "boardingp2",
            moduleId: module.id,
            templateUrl: "./boardingp2.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            page_1.Page])
    ], BoardingP2Component);
    return BoardingP2Component;
}());
exports.BoardingP2Component = BoardingP2Component;
