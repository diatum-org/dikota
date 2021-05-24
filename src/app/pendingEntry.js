"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var label_1 = require("tns-core-modules/ui/label");
var image_1 = require("tns-core-modules/ui/image");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var grid_layout_1 = require("tns-core-modules/ui/layouts/grid-layout");
var image_source_1 = require("tns-core-modules/image-source");
var enums_1 = require("tns-core-modules/ui/enums");
var button_1 = require("tns-core-modules/ui/button");
var gestures_1 = require("tns-core-modules/ui/gestures");
var utils = require("tns-core-modules/utils/utils");
var nativescript_menu_1 = require("nativescript-menu");
var PendingLayoutType;
(function (PendingLayoutType) {
    PendingLayoutType[PendingLayoutType["Basic"] = 0] = "Basic";
    PendingLayoutType[PendingLayoutType["Updates"] = 1] = "Updates";
})(PendingLayoutType = exports.PendingLayoutType || (exports.PendingLayoutType = {}));
var PendingEntry = /** @class */ (function () {
    function PendingEntry(amigoService, entryService, router, zone) {
        this.maskSrc = null;
        this.grid = null;
        this.amigoSet = false;
        this.revision = null;
        this.amigoId = null;
        this.registry = null;
        this.mode = null;
        this.maskSrc = image_source_1.ImageSource.fromFileSync("~/assets/mask.png");
        this.amigoService = amigoService;
        this.entryService = entryService;
        this.router = router;
        this.zone = zone;
        // allocate new grid 
        this.grid = new grid_layout_1.GridLayout();
        this.grid.height = 64;
        this.grid.marginLeft = 16;
        this.grid.paddingTop = 8;
        this.grid.paddingBottom = 8;
        this.grid.addColumn(new grid_layout_1.ItemSpec(1, "auto"));
        this.grid.addColumn(new grid_layout_1.ItemSpec(1, "star"));
    }
    PendingEntry.prototype.getLayout = function () {
        return this.grid;
    };
    PendingEntry.prototype.setPending = function (e, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, mask, icon, handle, s, status_1, s, ctrl, date;
            var _this = this;
            return __generator(this, function (_a) {
                // reset on contact change
                if (!this.amigoSet || mode != this.mode ||
                    (this.revision == null && e.revision != null) ||
                    (this.revision != null && e.revision == null) ||
                    (this.revision != null && e.revision != null &&
                        this.revision != e.pendingData.revision)) {
                    // reset layout  
                    this.grid.removeChildren();
                    // set default identity data
                    if (e.pendingData == null) {
                        e.pendingData = { revision: null, name: "", handle: "", icon: null };
                    }
                    name_1 = new label_1.Label();
                    name_1.text = e.pendingData.name;
                    name_1.fontSize = 18;
                    name_1.className = "text";
                    mask = new image_1.Image();
                    mask.width = 48;
                    mask.height = 48;
                    mask.src = this.maskSrc;
                    mask.on(button_1.Button.tapEvent, function () {
                        _this.selectContact(e);
                    });
                    icon = new image_1.Image();
                    icon.width = 48;
                    icon.height = 48;
                    icon.src = this.entryService.getIcon(e.shareId);
                    // place icon
                    this.grid.addChildAtCell(icon, 0, 0);
                    this.grid.addChildAtCell(mask, 0, 0);
                    if (mode == PendingLayoutType.Basic) {
                        handle = new label_1.Label();
                        handle.text = e.pendingData.handle;
                        handle.fontSize = 16;
                        handle.className = "text";
                        s = new stack_layout_1.StackLayout();
                        s.paddingLeft = 16;
                        s.verticalAlignment = enums_1.VerticalAlignment.middle;
                        s.addChild(name_1);
                        s.addChild(handle);
                        s.on(button_1.Button.tapEvent, function () {
                            _this.selectContact(e);
                        });
                        // place entry
                        this.grid.addChildAtCell(s, 0, 1);
                        this.grid.on(gestures_1.GestureTypes.swipe, function () { });
                    }
                    else if (mode == PendingLayoutType.Updates) {
                        status_1 = new label_1.Label();
                        status_1.fontSize = 14;
                        status_1.className = "text";
                        status_1.text = "Sent you a request";
                        s = new stack_layout_1.StackLayout();
                        s.paddingLeft = 16;
                        s.verticalAlignment = enums_1.VerticalAlignment.middle;
                        s.addChild(name_1);
                        s.addChild(status_1);
                        s.on(button_1.Button.tapEvent, function () {
                            _this.selectContact(e);
                        });
                        ctrl = new grid_layout_1.GridLayout();
                        ctrl.addColumn(new grid_layout_1.ItemSpec(1, "star"));
                        ctrl.addColumn(new grid_layout_1.ItemSpec(1, "auto"));
                        date = new label_1.Label();
                        date.text = this.getOffset(e.updated);
                        date.fontSize = 14;
                        date.className = "text";
                        date.verticalAlignment = enums_1.VerticalAlignment.middle;
                        date.paddingRight = 16;
                        ctrl.addChildAtCell(s, 0, 0);
                        ctrl.addChildAtCell(date, 0, 1);
                        this.grid.addChildAtCell(ctrl, 0, 1);
                        this.grid.on(gestures_1.GestureTypes.swipe, function () {
                            _this.entryService.notifyPending(e.shareId);
                        });
                    }
                    // store fields
                    this.mode = mode;
                    this.amigoSet = true;
                    this.revision = e.pendingData.revision;
                    this.amigoId = e.pendingData.amigoId;
                    this.registry = e.pendingData.registry;
                }
                return [2 /*return*/];
            });
        });
    };
    PendingEntry.prototype.selectContact = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.zone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this.amigoSet && e.pendingData != null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.amigoService.setContact(e.pendingData.amigoId)];
                            case 1:
                                _a.sent();
                                this.router.navigate(["/contactprofile", this.amigoId, this.registry, true, false], { clearHistory: false, animated: true, transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    PendingEntry.prototype.onControl = function (prefix, e, view, trim) {
        if (trim === void 0) { trim = true; }
        if (e == null || e.length == 0) {
            console.log("no entry option");
        }
        else if (e.length == 1) {
            if (trim) {
                utils.openUrl(prefix + ":" + e[0].value.replace(/\D/g, ''));
            }
            else {
                utils.openUrl(prefix + ":" + e[0].value);
            }
        }
        else {
            var actions = [];
            for (var i = 0; i < e.length; i++) {
                var type = e[i].type == null ? "" : e[i].type;
                var value = e[i].value == null ? "" : e[i].value;
                actions.push({ id: i, title: type + ": " + value });
            }
            nativescript_menu_1.Menu.popup({ view: view, actions: actions, cancelButtonText: "Dismiss" }).then(function (a) {
                if (a.id > 0) {
                    if (trim) {
                        utils.openUrl(prefix + ":" + e[a.id].value.replace(/\D/g, ''));
                    }
                    else {
                        utils.openUrl(prefix + ":" + e[a.id].value);
                    }
                }
            });
        }
    };
    PendingEntry.prototype.getOffset = function (t) {
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
    return PendingEntry;
}());
exports.PendingEntry = PendingEntry;
