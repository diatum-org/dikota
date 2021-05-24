"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var image_source_1 = require("tns-core-modules/image-source");
var bitmap_service_1 = require("./bitmap.service");
var amigo_service_1 = require("../appdb/amigo.service");
var attributeUtil_1 = require("../attributeUtil");
var amigo_util_1 = require("../appdb/amigo.util");
var IdentityData = /** @class */ (function () {
    function IdentityData() {
    }
    return IdentityData;
}());
exports.IdentityData = IdentityData;
var ProfileData = /** @class */ (function () {
    function ProfileData() {
    }
    return ProfileData;
}());
exports.ProfileData = ProfileData;
var ShareData = /** @class */ (function () {
    function ShareData() {
    }
    return ShareData;
}());
exports.ShareData = ShareData;
var PendingData = /** @class */ (function () {
    function PendingData() {
    }
    return PendingData;
}());
exports.PendingData = PendingData;
var EntryService = /** @class */ (function () {
    function EntryService(bitmapService, amigoService) {
        var _this = this;
        this.bitmapService = bitmapService;
        this.amigoService = amigoService;
        this.all = [];
        this.connected = [];
        this.requested = [];
        this.received = [];
        this.saved = [];
        this.pending = [];
        this.revision = null;
        this.notified = null;
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/savatar.png");
        this.icons = new Map();
        this.connectedAmigos = new rxjs_1.BehaviorSubject([]);
        this.requestedAmigos = new rxjs_1.BehaviorSubject([]);
        this.receivedAmigos = new rxjs_1.BehaviorSubject([]);
        this.savedAmigos = new rxjs_1.BehaviorSubject([]);
        this.pendingAmigos = new rxjs_1.BehaviorSubject([]);
        this.notifyRevision = new rxjs_1.BehaviorSubject(false);
        // observe all saved contacts
        this.amigoService.allContacts.subscribe(function (e) { return __awaiter(_this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.all = e;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < e.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.setIdentityData(e[i])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setAttributeData(e[i])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.connectedAmigos.next(this.connected);
                        this.requestedAmigos.next(this.requested);
                        this.receivedAmigos.next(this.received);
                        this.savedAmigos.next(this.saved);
                        return [2 /*return*/];
                }
            });
        }); });
        this.amigoService.connectedContacts.subscribe(function (c) {
            _this.connected = c;
            _this.connectedAmigos.next(_this.connected);
            _this.setNotifyRevision();
        });
        this.amigoService.requestedContacts.subscribe(function (c) {
            _this.requested = c;
            _this.requestedAmigos.next(_this.requested);
        });
        this.amigoService.receivedContacts.subscribe(function (c) {
            _this.received = c;
            _this.receivedAmigos.next(_this.received);
            _this.setNotifyRevision();
        });
        this.amigoService.savedContacts.subscribe(function (c) {
            _this.saved = c;
            _this.savedAmigos.next(_this.saved);
        });
        this.amigoService.pendingContacts.subscribe(function (c) { return __awaiter(_this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pending = c;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < c.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setPendingData(c[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.pendingAmigos.next(this.pending);
                        this.setNotifyRevision();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    EntryService.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // retrieve notified revision
                        _a = this;
                        return [4 /*yield*/, this.amigoService.getAppProperty("notified_revision")];
                    case 1:
                        // retrieve notified revision
                        _a.notified = _b.sent();
                        this.setNotified();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntryService.prototype.clear = function () {
        this.notified = null;
        this.revision = null;
        this.pending = [];
        this.saved = [];
        this.received = [];
        this.requested = [];
        this.connected = [];
        this.all = [];
        this.icons.clear();
        this.connectedAmigos.next([]);
        this.requestedAmigos.next([]);
        this.receivedAmigos.next([]);
        this.savedAmigos.next([]);
        this.pendingAmigos.next([]);
        this.notifyRevision.next(false);
    };
    Object.defineProperty(EntryService.prototype, "notifyUpdate", {
        get: function () {
            return this.notifyRevision.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryService.prototype, "connectedContacts", {
        get: function () {
            return this.connectedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryService.prototype, "requestedContacts", {
        get: function () {
            return this.requestedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryService.prototype, "receivedContacts", {
        get: function () {
            return this.receivedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryService.prototype, "savedContacts", {
        get: function () {
            return this.savedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryService.prototype, "pendingContacts", {
        get: function () {
            return this.pendingAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    EntryService.prototype.setNotified = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.notified = this.revision;
                        return [4 /*yield*/, this.amigoService.setAppProperty("notified_revision", this.notified)];
                    case 1:
                        _a.sent();
                        this.notify();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntryService.prototype.notify = function () {
        this.notifyRevision.next(this.getNotify());
    };
    EntryService.prototype.getNotify = function () {
        if (this.notified != null && this.revision != null && this.notified < this.revision) {
            return true;
        }
        return false;
    };
    EntryService.prototype.setNotifyRevision = function () {
        var r = null;
        for (var i = 0; i < this.received.length; i++) {
            var c = this.received[i];
            if (c.shareData == null || c.shareData.notified != c.shareRevision) {
                if (r == null || c.shareRevision > r) {
                    r = c.shareRevision;
                }
            }
        }
        for (var i = 0; i < this.connected.length; i++) {
            var c = this.connected[i];
            if (c.shareData == null || c.shareData.notified != c.shareRevision) {
                if (r == null || c.shareRevision > r) {
                    r = c.shareRevision;
                }
            }
        }
        for (var i = 0; i < this.pending.length; i++) {
            var c = this.pending[i];
            if (c.pendingData == null || c.pendingData.notified != c.revision) {
                if (r == null || c.revision > r) {
                    r = c.revision;
                }
            }
        }
        this.revision = r;
        this.notify();
    };
    EntryService.prototype.setIcon = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // make sure icon has entry
                if (!this.icons.has(id)) {
                    this.icons.set(id, {});
                }
                // check if icon should be unset
                if (data == null && this.icons.get(id).icon != null) {
                    this.icons.set(id, {});
                }
                // check if icon should be set
                if (data != null && this.icons.get(id).revision != data.revision) {
                    this.icons.set(id, {
                        revision: data.revision,
                        icon: image_source_1.ImageSource.fromBase64Sync(data.icon),
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    EntryService.prototype.setIdentityData = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var amigo, icon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(e.identityRevision == null && e.identityData != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.amigoService.setContactIdentityData(e.amigoId, null)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(e.identityRevision != null && (e.identityData == null || e.identityData.revision != e.identityRevision))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.amigoService.getContactIdentity(e.amigoId)];
                    case 3:
                        amigo = _a.sent();
                        if (!(amigo != null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.bitmapService.convert(amigo.logo)];
                    case 4:
                        icon = _a.sent();
                        e.identityData = { revision: e.identityRevision, icon: icon };
                        return [4 /*yield*/, this.amigoService.setContactIdentityData(e.amigoId, e.identityData)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: 
                    // load icon if not set yet
                    return [4 /*yield*/, this.setIcon(e.amigoId, e.identityData)];
                    case 7:
                        // load icon if not set yet
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntryService.prototype.setAttributeData = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var phone, text, email, attr, i, p, e_1, c, category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(e.attributeRevision == null && e.attributeData != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.amigoService.setContactProfileData(e.amigoId, null)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(e.attributeRevision != null && (e.attributeData == null || e.attributeData.revision != e.attributeRevision))) return [3 /*break*/, 5];
                        phone = [];
                        text = [];
                        email = [];
                        return [4 /*yield*/, this.amigoService.getContactProfile(e.amigoId)];
                    case 3:
                        attr = _a.sent();
                        for (i = 0; i < attr.length; i++) {
                            if (attr[i].schema == attributeUtil_1.AttributeUtil.PHONE) {
                                p = JSON.parse(attr[i].data);
                                phone.push({ value: p.phone, type: p.category });
                                if (p.phoneSms == true) {
                                    text.push({ value: p.phone, type: p.category });
                                }
                            }
                            if (attr[i].schema == attributeUtil_1.AttributeUtil.EMAIL) {
                                e_1 = JSON.parse(attr[i].data);
                                email.push({ value: e_1.email, type: e_1.category });
                            }
                            if (attr[i].schema == attributeUtil_1.AttributeUtil.CARD) {
                                c = JSON.parse(attr[i].data);
                                category = "card";
                                if (c.companyName != null) {
                                    category = c.companyName;
                                }
                                if (c.mainPhone != null) {
                                    if (c.mainPhoneSms) {
                                        text.push({ value: c.mainPhone, type: category + " (main)" });
                                    }
                                    phone.push({ value: c.mainPhone, type: category + " (main)" });
                                }
                                if (c.directPhone != null) {
                                    if (c.directPhoneSms) {
                                        text.push({ value: c.directPhone, type: category + " (direct)" });
                                    }
                                    phone.push({ value: c.directPhone, type: category + " (direct)" });
                                }
                                if (c.mobilePhone != null) {
                                    if (c.mobilePhoneSms) {
                                        text.push({ value: c.mobilePhone, type: category + " (mobile)" });
                                    }
                                    phone.push({ value: c.mobilePhone, type: category + " (mobile)" });
                                }
                                if (c.email != null) {
                                    email.push({ value: c.email, type: category });
                                }
                            }
                        }
                        e.attributeData = { revision: e.attributeRevision, phone: phone, text: text, email: email };
                        return [4 /*yield*/, this.amigoService.setContactProfileData(e.amigoId, e.attributeData)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EntryService.prototype.setPendingData = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var pending, amigo, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(e.revision == null && e.pendingData != null)) return [3 /*break*/, 2];
                        e.pendingData = null;
                        return [4 /*yield*/, this.amigoService.setPendingAmigoData(e.shareId, null)];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!(e.revision != null && (e.pendingData == null || e.pendingData.revision != e.revision))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.amigoService.getPending(e.shareId)];
                    case 3:
                        pending = _c.sent();
                        amigo = amigo_util_1.getAmigoObject(pending.message);
                        _a = e;
                        _b = {
                            amigoId: amigo.amigoId,
                            revision: e.revision,
                            name: amigo.name,
                            handle: amigo.handle,
                            registry: amigo.registry
                        };
                        return [4 /*yield*/, this.bitmapService.convert(amigo.logo)];
                    case 4:
                        _a.pendingData = (_b.icon = _c.sent(),
                            _b);
                        return [4 /*yield*/, this.amigoService.setPendingAmigoData(e.shareId, e.pendingData)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: 
                    // load icon if not set yet
                    return [4 /*yield*/, this.setIcon(e.shareId, e.pendingData)];
                    case 7:
                        // load icon if not set yet
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntryService.prototype.notifyContact = function (amigoId) {
        for (var i = 0; i < this.all.length; i++) {
            if (this.all[i].amigoId == amigoId) {
                var e = this.all[i];
                e.shareData = { notified: e.shareRevision };
                this.amigoService.setContactShareData(e.shareId, e.shareData);
                this.connectedAmigos.next(this.connected);
                this.requestedAmigos.next(this.requested);
                this.receivedAmigos.next(this.received);
                this.savedAmigos.next(this.saved);
            }
        }
    };
    EntryService.prototype.notifyPending = function (shareId) {
        for (var i = 0; i < this.pending.length; i++) {
            if (this.pending[i].shareId == shareId) {
                var e = this.pending[i];
                e.pendingData.notified = e.revision;
                this.amigoService.setPendingAmigoData(e.shareId, e.pendingData);
                this.pendingAmigos.next(this.pending);
            }
        }
    };
    EntryService.prototype.getIcon = function (id) {
        var entry = this.icons.get(id);
        if (entry == null || entry.icon == null) {
            return this.avatarSrc;
        }
        return entry.icon;
    };
    EntryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [bitmap_service_1.BitmapService,
            amigo_service_1.AmigoService])
    ], EntryService);
    return EntryService;
}());
exports.EntryService = EntryService;
