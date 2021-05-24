"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var gestures_1 = require("tns-core-modules/ui/gestures");
var utils = require("tns-core-modules/utils/utils");
var BoardingP4Component = /** @class */ (function () {
    function BoardingP4Component(router, page) {
        this.router = router;
        this.page = page;
        this.page.actionBarHidden = true;
    }
    BoardingP4Component.prototype.ngOnInit = function () {
    };
    BoardingP4Component.prototype.onSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.left) {
            this.onFinish();
        }
        else {
            this.router.navigate(["/boardingp3"], { clearHistory: true, animated: true,
                transition: { name: "slideRight", duration: 300, curve: "easeIn" }
            });
        }
    };
    BoardingP4Component.prototype.onFinish = function () {
        this.router.navigate(["/home"], { clearHistory: true, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    BoardingP4Component.prototype.onPortal = function () {
        utils.openUrl("https://portal.diatum.net/app/#/account");
    };
    BoardingP4Component = __decorate([
        core_1.Component({
            selector: "boardingp4",
            moduleId: module.id,
            templateUrl: "./boardingp4.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            page_1.Page])
    ], BoardingP4Component);
    return BoardingP4Component;
}());
exports.BoardingP4Component = BoardingP4Component;
