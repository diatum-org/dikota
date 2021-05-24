"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@nativescript/angular");
var platform_1 = require("tns-core-modules/platform");
var core_2 = require("@angular/core");
var bitmap_service_1 = require("../service/bitmap.service");
var entry_service_1 = require("../service/entry.service");
var amigo_service_1 = require("../appdb/amigo.service");
var contactEntry_1 = require("../contactEntry");
var SavedComponent = /** @class */ (function () {
    function SavedComponent(router, bitmapService, entryService, amigoService, zone) {
        this.router = router;
        this.bitmapService = bitmapService;
        this.entryService = entryService;
        this.amigoService = amigoService;
        this.zone = zone;
        this.sub = [];
        this.grids = new Map();
        this.iOS = (platform_1.device.os == "iOS");
    }
    SavedComponent.prototype.ngOnInit = function () {
    };
    SavedComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // observe list of saved amigos
        this.sub.push(this.entryService.savedContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            var stack, i, e;
            var _this = this;
            return __generator(this, function (_a) {
                if (c.length == 0) {
                    setTimeout(function () {
                        _this.empty = true;
                    }, 1);
                }
                stack = this.saved.nativeElement;
                stack.removeChildren();
                for (i = 0; i < c.length; i++) {
                    e = this.grids.get(c[i].amigoId);
                    if (e == null) {
                        e = new contactEntry_1.ContactEntry(this.amigoService, this.entryService, this.router, this.zone);
                        this.grids.set(c[i].amigoId, e);
                    }
                    e.setContact(c[i], contactEntry_1.ContactLayoutType.Basic);
                    stack.addChild(e.getLayout());
                }
                return [2 /*return*/];
            });
        }); }));
    };
    SavedComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    SavedComponent.prototype.onBack = function () {
        this.router.back();
    };
    SavedComponent.prototype.timeout = function (s) {
        return new Promise(function (resolve) { return setTimeout(resolve, s); });
    };
    __decorate([
        core_1.ViewChild("res", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], SavedComponent.prototype, "saved", void 0);
    SavedComponent = __decorate([
        core_1.Component({
            selector: "saved",
            moduleId: module.id,
            templateUrl: "./saved.component.xml"
        }),
        __metadata("design:paramtypes", [angular_1.RouterExtensions,
            bitmap_service_1.BitmapService,
            entry_service_1.EntryService,
            amigo_service_1.AmigoService,
            core_2.NgZone])
    ], SavedComponent);
    return SavedComponent;
}());
exports.SavedComponent = SavedComponent;
