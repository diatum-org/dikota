"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var platform_1 = require("tns-core-modules/platform");
var core_2 = require("@angular/core");
var amigo_service_1 = require("../appdb/amigo.service");
var scale_service_1 = require("../service/scale.service");
var entry_service_1 = require("../service/entry.service");
var contactEntry_1 = require("../contactEntry");
var pendingEntry_1 = require("../pendingEntry");
var PendingComponent = /** @class */ (function () {
    function PendingComponent(router, amigoService, entryService, scaleService, zone) {
        this.router = router;
        this.amigoService = amigoService;
        this.entryService = entryService;
        this.scaleService = scaleService;
        this.zone = zone;
        this.avatarSrc = null;
        this.maskSrc = null;
        this.sub = [];
        this.notifyBorderColor = "#F0F8FF";
        this.requestedBorderColor = "#F0F8FF";
        this.receivedBorderColor = "#F0F8FF";
        this.ready = false;
        this.requested = [];
        this.received = [];
        this.connected = [];
        this.pending = [];
        this.iOS = (platform_1.device.os == "iOS");
    }
    PendingComponent.prototype.ngOnInit = function () {
        // set default tab
        this.tab = "notify";
        this.notifyBorderColor = "#909097";
        this.requestedBorderColor = "#F0F8FF";
        this.receivedBorderColor = "#F0F0FF";
        this.contactEntries = new Map();
        this.pendingEntries = new Map();
        this.entryService.setNotified();
    };
    PendingComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.sub.push(this.entryService.requestedContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.requested = c;
                        if (!(this.tab == "requested")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applySaved(this.requestedStack.nativeElement, this.requested)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }));
        this.sub.push(this.entryService.receivedContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.received = c;
                        if (!(this.tab == "received")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applySaved(this.receivedStack.nativeElement, this.received)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.tab == "notify")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.notifySaved(this.receivedStack.nativeElement, this.received)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        this.sub.push(this.entryService.connectedContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.connected = c;
                        if (!(this.tab == "notify")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.notifySaved(this.connectedStack.nativeElement, this.connected)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }));
        this.sub.push(this.entryService.pendingContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pending = c;
                        if (!(this.tab == "received")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applyUnsaved(this.pendingStack.nativeElement, this.pending)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.tab == "notify")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.notifyUnsaved(this.pendingStack.nativeElement, this.pending)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }));
        setTimeout(function () {
            _this.ready = true;
        }, 1);
    };
    PendingComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    PendingComponent.prototype.resetStack = function () {
        this.connectedStack.nativeElement.removeChildren();
        this.receivedStack.nativeElement.removeChildren();
        this.requestedStack.nativeElement.removeChildren();
        this.pendingStack.nativeElement.removeChildren();
    };
    PendingComponent.prototype.isEmpty = function () {
        if (!this.ready) {
            return false;
        }
        if (this.connectedStack.nativeElement.getChildrenCount() != 0) {
            return false;
        }
        if (this.receivedStack.nativeElement.getChildrenCount() != 0) {
            return false;
        }
        if (this.requestedStack.nativeElement.getChildrenCount() != 0) {
            return false;
        }
        if (this.pendingStack.nativeElement.getChildrenCount() != 0) {
            return false;
        }
        return true;
    };
    PendingComponent.prototype.setNotify = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.tab != "notify")) return [3 /*break*/, 4];
                        this.resetStack();
                        this.tab = "notify";
                        this.notifyBorderColor = "#909097";
                        this.requestedBorderColor = "#F0F8FF";
                        this.receivedBorderColor = "#F0F8FF";
                        return [4 /*yield*/, this.notifySaved(this.connectedStack.nativeElement, this.connected)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.notifySaved(this.receivedStack.nativeElement, this.received)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.notifyUnsaved(this.pendingStack.nativeElement, this.pending)];
                    case 3:
                        _a.sent();
                        this.entryService.setNotified();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PendingComponent.prototype.setRequested = function () {
        if (this.tab != "requested") {
            this.resetStack();
            this.tab = "requested";
            this.notifyBorderColor = "#F0F8FF";
            this.requestedBorderColor = "#909097";
            this.receivedBorderColor = "#F0F8FF";
            this.applySaved(this.requestedStack.nativeElement, this.requested);
        }
    };
    PendingComponent.prototype.setReceived = function () {
        if (this.tab != "received") {
            this.resetStack();
            this.tab = "received";
            this.notifyBorderColor = "#F0F8FF";
            this.requestedBorderColor = "#F0F8FF";
            this.receivedBorderColor = "#909097";
            this.applySaved(this.receivedStack.nativeElement, this.received);
            this.applyUnsaved(this.pendingStack.nativeElement, this.pending);
        }
    };
    PendingComponent.prototype.applySaved = function (stack, c) {
        return __awaiter(this, void 0, void 0, function () {
            var i, e;
            return __generator(this, function (_a) {
                // load saved contacts
                stack.removeChildren();
                for (i = 0; i < c.length; i++) {
                    e = this.contactEntries.get(c[i].amigoId);
                    if (e == null) {
                        e = new contactEntry_1.ContactEntry(this.amigoService, this.entryService, this.router, this.zone);
                        this.contactEntries.set(c[i].amigoId, e);
                    }
                    e.setContact(c[i], contactEntry_1.ContactLayoutType.Basic);
                    stack.addChild(e.getLayout());
                }
                return [2 /*return*/];
            });
        });
    };
    PendingComponent.prototype.notifySaved = function (stack, c) {
        return __awaiter(this, void 0, void 0, function () {
            var i, d, e;
            return __generator(this, function (_a) {
                // load saved contacts
                stack.removeChildren();
                for (i = 0; i < c.length; i++) {
                    d = new Date();
                    if (c[i].updated != null && (d.getTime() / 1000) < (c[i].updated + 2419200)) {
                        if (c[i].shareData == null || c[i].shareData.notified != c[i].shareRevision) {
                            e = this.contactEntries.get(c[i].amigoId);
                            if (e == null) {
                                e = new contactEntry_1.ContactEntry(this.amigoService, this.entryService, this.router, this.zone);
                                this.contactEntries.set(c[i].amigoId, e);
                            }
                            e.setContact(c[i], contactEntry_1.ContactLayoutType.Updates);
                            stack.addChild(e.getLayout());
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    PendingComponent.prototype.applyUnsaved = function (stack, c) {
        return __awaiter(this, void 0, void 0, function () {
            var i, e;
            return __generator(this, function (_a) {
                // load unsaved contacts
                stack.removeChildren();
                for (i = 0; i < c.length; i++) {
                    e = this.pendingEntries.get(c[i].shareId);
                    if (e == null) {
                        e = new pendingEntry_1.PendingEntry(this.amigoService, this.entryService, this.router, this.zone);
                        this.pendingEntries.set(c[i].shareId, e);
                    }
                    e.setPending(c[i], pendingEntry_1.PendingLayoutType.Basic);
                    stack.addChild(e.getLayout());
                }
                return [2 /*return*/];
            });
        });
    };
    PendingComponent.prototype.notifyUnsaved = function (stack, c) {
        return __awaiter(this, void 0, void 0, function () {
            var i, d, e;
            return __generator(this, function (_a) {
                // load unsaved contacts
                stack.removeChildren();
                for (i = 0; i < c.length; i++) {
                    d = new Date();
                    if (c[i].updated != null && (d.getTime() / 1000) < (c[i].updated + 2419200)) {
                        if (c[i].pendingData == null || c[i].pendingData.notified != c[i].revision) {
                            e = this.pendingEntries.get(c[i].shareId);
                            if (e == null) {
                                e = new pendingEntry_1.PendingEntry(this.amigoService, this.entryService, this.router, this.zone);
                                this.pendingEntries.set(c[i].shareId, e);
                            }
                            e.setPending(c[i], pendingEntry_1.PendingLayoutType.Updates);
                            stack.addChild(e.getLayout());
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    PendingComponent.prototype.getOffset = function (t) {
        var d = new Date();
        var offset = Math.floor(d.getTime() / 1000) - t;
        if (offset < 1800) {
            return (Math.floor(offset / 60) + 1) + "m";
        }
        else if (offset < 43200) {
            return (Math.floor(offset / 3600) + 1) + "h";
        }
        else if (offset < 604800) {
            return (Math.floor(offset / 86400) + 1) + "d";
        }
        else {
            return (Math.floor(offset / 604800) + 1) + "w";
        }
    };
    PendingComponent.prototype.onBack = function () {
        this.router.back();
    };
    __decorate([
        core_1.ViewChild("con", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], PendingComponent.prototype, "connectedStack", void 0);
    __decorate([
        core_1.ViewChild("req", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], PendingComponent.prototype, "requestedStack", void 0);
    __decorate([
        core_1.ViewChild("rec", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], PendingComponent.prototype, "receivedStack", void 0);
    __decorate([
        core_1.ViewChild("pen", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], PendingComponent.prototype, "pendingStack", void 0);
    PendingComponent = __decorate([
        core_1.Component({
            selector: "pending",
            moduleId: module.id,
            templateUrl: "./pending.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService,
            entry_service_1.EntryService,
            scale_service_1.ScaleService,
            core_2.NgZone])
    ], PendingComponent);
    return PendingComponent;
}());
exports.PendingComponent = PendingComponent;
