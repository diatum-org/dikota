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
var ContactLayoutType;
(function (ContactLayoutType) {
    ContactLayoutType[ContactLayoutType["Basic"] = 0] = "Basic";
    ContactLayoutType[ContactLayoutType["Controls"] = 1] = "Controls";
    ContactLayoutType[ContactLayoutType["Updates"] = 2] = "Updates";
})(ContactLayoutType = exports.ContactLayoutType || (exports.ContactLayoutType = {}));
var ContactEntry = /** @class */ (function () {
    function ContactEntry(amigoService, entryService, router, zone) {
        this.maskSrc = null;
        this.grid = null;
        this.amigoSet = false;
        this.identityRevision = null;
        this.attributeRevision = null;
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
    ContactEntry.prototype.getLayout = function () {
        return this.grid;
    };
    ContactEntry.prototype.setContact = function (e, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var name_1, mask, icon, handle, s, status_1, s, ctrl, date, ctrl, btns, fill, text_1, phone_1, email_1;
            var _this = this;
            return __generator(this, function (_a) {
                // reset on contact change
                if (!this.amigoSet || this.mode != mode ||
                    (this.identityRevision == null && e.identityData != null) ||
                    (this.identityRevision != null && e.identityData == null) ||
                    (this.identityRevision != null && e.identityData != null &&
                        this.identityRevision != e.identityData.revision) ||
                    (this.attributeRevision == null && e.attributeData != null) ||
                    (this.attributeRevision != null && e.attributeData == null) ||
                    (this.attributeRevision != null && e.attributeData != null &&
                        this.attributeRevision != e.attributeData.revision)) {
                    // reset layout  
                    this.grid.removeChildren();
                    // 
                    if (e.identityData == null) {
                        e.identityData = { revision: null, icon: null };
                    }
                    if (e.attributeData == null) {
                        e.attributeData = { revision: null, text: [], phone: [], email: [] };
                    }
                    name_1 = new label_1.Label();
                    name_1.text = e.name;
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
                    icon.src = this.entryService.getIcon(e.amigoId);
                    // place icon
                    this.grid.addChildAtCell(icon, 0, 0);
                    this.grid.addChildAtCell(mask, 0, 0);
                    if (mode == ContactLayoutType.Basic) {
                        handle = new label_1.Label();
                        handle.text = e.handle;
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
                    else if (mode == ContactLayoutType.Updates) {
                        status_1 = new label_1.Label();
                        status_1.fontSize = 14;
                        status_1.className = "text";
                        if (e.status == "connected") {
                            status_1.text = "Is now connected";
                        }
                        else if (e.status == "received") {
                            status_1.text = "Sent you a request";
                        }
                        else {
                            status_1.text = e.status;
                        }
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
                            _this.entryService.notifyContact(e.amigoId);
                        });
                    }
                    else {
                        // position text
                        name_1.paddingLeft = 12;
                        name_1.paddingTop = 4;
                        name_1.verticalAlignment = enums_1.VerticalAlignment.top;
                        name_1.on(button_1.Button.tapEvent, function () {
                            _this.selectContact(e);
                        });
                        ctrl = new grid_layout_1.GridLayout();
                        ctrl.addColumn(new grid_layout_1.ItemSpec(1, "star"));
                        ctrl.addColumn(new grid_layout_1.ItemSpec(1, "auto"));
                        this.grid.addChildAtCell(ctrl, 0, 1);
                        btns = new stack_layout_1.StackLayout();
                        btns.orientation = enums_1.Orientation.horizontal;
                        btns.horizontalAlignment = enums_1.HorizontalAlignment.right;
                        fill = new label_1.Label();
                        fill.on(button_1.Button.tapEvent, function () {
                            _this.selectContact(e);
                        });
                        ctrl.addChildAtCell(fill, 0, 0);
                        ctrl.addChildAtCell(name_1, 0, 0, 1, 2);
                        if (e.attributeData != null && e.attributeData.text.length > 0) {
                            text_1 = new image_1.Image();
                            text_1.on(button_1.Button.tapEvent, function () {
                                _this.onControl("sms", e.attributeData.text, text_1);
                            });
                            text_1.marginLeft = 16;
                            text_1.width = 32;
                            text_1.height = 32;
                            text_1.translateY = 12;
                            text_1.src = image_source_1.ImageSource.fromFileSync("~/assets/messaging.png");
                            btns.addChild(text_1);
                        }
                        if (e.attributeData != null && e.attributeData.phone.length > 0) {
                            phone_1 = new image_1.Image();
                            phone_1.on(button_1.Button.tapEvent, function () {
                                _this.onControl("tel", e.attributeData.phone, phone_1);
                            });
                            phone_1.marginLeft = 16;
                            phone_1.width = 32;
                            phone_1.height = 32;
                            phone_1.translateY = 12;
                            phone_1.src = image_source_1.ImageSource.fromFileSync("~/assets/telephone.png");
                            btns.addChild(phone_1);
                        }
                        if (e.attributeData != null && e.attributeData.email.length > 0) {
                            email_1 = new image_1.Image();
                            email_1.on(button_1.Button.tapEvent, function () {
                                _this.onControl("mailto", e.attributeData.email, email_1, false);
                            });
                            email_1.marginLeft = 16;
                            email_1.width = 32;
                            email_1.height = 32;
                            email_1.translateY = 12;
                            email_1.src = image_source_1.ImageSource.fromFileSync("~/assets/email.png");
                            btns.addChild(email_1);
                        }
                        // add buttons to view
                        ctrl.addChildAtCell(btns, 0, 1);
                        this.grid.on(gestures_1.GestureTypes.swipe, function () { });
                    }
                    // store params
                    this.mode = mode;
                    this.amigoSet = true;
                    this.identityRevision = e.identityData.revision;
                    this.attributeRevision = e.attributeData.revision;
                    this.amigoId = e.amigoId;
                    this.registry = e.registry;
                }
                return [2 /*return*/];
            });
        });
    };
    ContactEntry.prototype.selectContact = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.zone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.amigoSet) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.amigoService.setContact(e.amigoId)];
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
    ContactEntry.prototype.onControl = function (prefix, e, view, trim) {
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
    ContactEntry.prototype.getOffset = function (t) {
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
    return ContactEntry;
}());
exports.ContactEntry = ContactEntry;
