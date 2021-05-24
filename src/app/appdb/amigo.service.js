"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var amigo_util_1 = require("./amigo.util");
var shareStatus_1 = require("./shareStatus");
var store_service_1 = require("./store.service");
var registry_service_1 = require("./registry.service");
var access_service_1 = require("./access.service");
var identity_service_1 = require("./identity.service");
var group_service_1 = require("./group.service");
var profile_service_1 = require("./profile.service");
var index_service_1 = require("./index.service");
var share_service_1 = require("./share.service");
var contact_service_1 = require("./contact.service");
var token_service_1 = require("./token.service");
var show_service_1 = require("./show.service");
var view_service_1 = require("./view.service");
var Prop = /** @class */ (function () {
    function Prop() {
    }
    Prop.IDENTITY = "identity";
    Prop.REVISION = "revision";
    return Prop;
}());
var Revision = /** @class */ (function () {
    function Revision() {
    }
    return Revision;
}());
var AmigoSubjectId = /** @class */ (function () {
    function AmigoSubjectId() {
    }
    return AmigoSubjectId;
}());
exports.AmigoSubjectId = AmigoSubjectId;
var MapEntry = /** @class */ (function () {
    function MapEntry() {
    }
    return MapEntry;
}());
var AmigoService = /** @class */ (function () {
    function AmigoService(registryService, accessService, identityService, groupService, profileService, indexService, shareService, contactService, tokenService, showService, viewService, storeService) {
        this.registryService = registryService;
        this.accessService = accessService;
        this.identityService = identityService;
        this.groupService = groupService;
        this.profileService = profileService;
        this.indexService = indexService;
        this.shareService = shareService;
        this.contactService = contactService;
        this.tokenService = tokenService;
        this.showService = showService;
        this.viewService = viewService;
        this.storeService = storeService;
        this.selectedAmigo = new rxjs_1.BehaviorSubject(null);
        this.attributeEntries = new rxjs_1.BehaviorSubject([]);
        this.labelEntries = new rxjs_1.BehaviorSubject([]);
        this.filteredAmigos = new rxjs_1.BehaviorSubject([]);
        this.connectedAmigos = new rxjs_1.BehaviorSubject([]);
        this.requestedAmigos = new rxjs_1.BehaviorSubject([]);
        this.receivedAmigos = new rxjs_1.BehaviorSubject([]);
        this.savedAmigos = new rxjs_1.BehaviorSubject([]);
        this.allAmigos = new rxjs_1.BehaviorSubject([]);
        this.hiddenAmigos = new rxjs_1.BehaviorSubject([]);
        this.pendingAmigos = new rxjs_1.BehaviorSubject([]);
        this.showSubjects = new rxjs_1.BehaviorSubject([]);
        this.viewSubjects = new rxjs_1.BehaviorSubject([]);
        this.identityAmigo = new rxjs_1.BehaviorSubject(null);
        this.syncInterval = null;
    }
    Object.defineProperty(AmigoService.prototype, "identity", {
        get: function () {
            return this.identityAmigo.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "labels", {
        get: function () {
            return this.labelEntries.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "attributes", {
        get: function () {
            return this.attributeEntries.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "selectedContact", {
        get: function () {
            return this.selectedAmigo.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "filteredContacts", {
        get: function () {
            return this.filteredAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "connectedContacts", {
        get: function () {
            return this.connectedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "requestedContacts", {
        get: function () {
            return this.requestedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "receivedContacts", {
        get: function () {
            return this.receivedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "savedContacts", {
        get: function () {
            return this.savedAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "allContacts", {
        get: function () {
            return this.allAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "hiddenContacts", {
        get: function () {
            return this.hiddenAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "pendingContacts", {
        get: function () {
            return this.pendingAmigos.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "showFeed", {
        get: function () {
            return this.showSubjects.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AmigoService.prototype, "viewFeed", {
        get: function () {
            return this.viewSubjects.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    AmigoService.prototype.init = function (db) {
        return this.storeService.init(db);
    };
    AmigoService.prototype.setAppContext = function (obj) {
        return this.storeService.setAppContext(obj);
    };
    AmigoService.prototype.clearAppContext = function () {
        return this.storeService.clearAppContext();
    };
    AmigoService.prototype.setAppProperty = function (key, obj) {
        return this.storeService.setAppProperty(this.amigoId, "app_" + key, obj);
    };
    AmigoService.prototype.getAppProperty = function (key) {
        return this.storeService.getAppProperty(this.amigoId, "app_" + key);
    };
    AmigoService.prototype.clearAppProperty = function (key, obj) {
        return this.storeService.clearAppProperty(this.amigoId, "app_" + key);
    };
    // set account, validate token, return permissions, and periodically synchronize
    AmigoService.prototype.setAmigo = function (amigoId, registry, token, serviceNode, serviceToken, attributeFilter, subjectFilter, tagFilter, searchableAmigo, searchableSubject, stale, refresh) {
        if (stale === void 0) { stale = 86400; }
        if (refresh === void 0) { refresh = 60; }
        return __awaiter(this, void 0, void 0, function () {
            var access, amigo, msg, _a, a, l, r;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // clear any perviously set account
                        this.clearAmigo();
                        // set new account
                        this.amigoId = amigoId;
                        this.token = token;
                        this.registry = registry;
                        this.serviceNode = serviceNode;
                        this.serviceToken = serviceToken;
                        this.attributeFilter = attributeFilter;
                        this.subjectFilter = subjectFilter;
                        this.tagFilter = tagFilter;
                        this.searchableAmigo = searchableAmigo;
                        this.searchableSubject = searchableSubject;
                        this.stale = stale;
                        // init sync revision for each module
                        this.revision = { identity: 0, group: 0, index: 0, profile: 0, show: 0, share: 0 };
                        return [4 /*yield*/, this.storeService.setAccount(amigoId)];
                    case 1:
                        access = _b.sent();
                        return [4 /*yield*/, this.storeService.getAppProperty(this.amigoId, Prop.IDENTITY)];
                    case 2:
                        amigo = _b.sent();
                        if (!(access == null || amigo == null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.registryService.getMessage(registry, this.amigoId)];
                    case 3:
                        msg = _b.sent();
                        amigo = amigo_util_1.getAmigoObject(msg);
                        this.identityAmigo.next(amigo);
                        this.node = amigo.node;
                        this.registry = amigo.registry;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.IDENTITY, amigo)];
                    case 4:
                        _b.sent();
                        this.revision.identity = amigo.revision;
                        this.identityAmigo.next(amigo);
                        // retrieve access
                        _a = this;
                        return [4 /*yield*/, this.tokenService.getAccess(this.node, this.token)];
                    case 5:
                        // retrieve access
                        _a.access = _b.sent();
                        // import account but dont wait
                        try {
                            this.importAccount(registry);
                        }
                        catch (e) {
                            console.error(e);
                        }
                        return [3 /*break*/, 10];
                    case 6:
                        // set module access
                        this.access = access;
                        // retrieve identity
                        this.identityAmigo.next(amigo);
                        this.registry = amigo.registry;
                        this.node = amigo.node;
                        this.identityAmigo.next(amigo);
                        return [4 /*yield*/, this.storeService.getAttributes(this.amigoId)];
                    case 7:
                        a = _b.sent();
                        this.attributeEntries.next(a);
                        return [4 /*yield*/, this.storeService.getLabels(this.amigoId)];
                    case 8:
                        l = _b.sent();
                        this.labelEntries.next(l);
                        // refresh contacts
                        this.refreshAmigos();
                        this.refreshContacts();
                        this.refreshPending();
                        this.refreshShowFeed();
                        this.refreshViewFeed();
                        return [4 /*yield*/, this.storeService.getAppProperty(this.amigoId, Prop.REVISION)];
                    case 9:
                        r = _b.sent();
                        if (r != null) {
                            this.revision = r;
                        }
                        _b.label = 10;
                    case 10:
                        // periodically sync appdb
                        this.syncChanges();
                        this.syncInterval = setInterval(function () { _this.syncChanges(); }, refresh * 1000);
                        return [2 /*return*/, this.access];
                }
            });
        });
    };
    // clear account
    AmigoService.prototype.clearAmigo = function () {
        if (this.syncInterval != null) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        this.viewService.clearAuth();
        this.contactService.clearAuth();
        this.amigoLabel = null;
        this.amigoSearch = null;
        this.showLabel = null;
        this.showSearch = null;
        this.viewLabel = null;
        this.viewSearch = null;
        this.amigoId = null;
        this.selectedAmigo.next(null);
        this.labelEntries.next([]);
        this.attributeEntries.next([]);
        this.filteredAmigos.next([]);
        this.connectedAmigos.next([]);
        this.receivedAmigos.next([]);
        this.requestedAmigos.next([]);
        this.savedAmigos.next([]);
        this.allAmigos.next([]);
        this.pendingAmigos.next([]);
        this.showSubjects.next([]);
        this.viewSubjects.next([]);
        this.identityAmigo.next(null);
    };
    AmigoService.prototype.importAccount = function (registry) {
        return __awaiter(this, void 0, void 0, function () {
            var d, cur, updates, i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 17, , 18]);
                        // sync each module
                        return [4 /*yield*/, this.syncIdentity()];
                    case 1:
                        // sync each module
                        _a.sent();
                        return [4 /*yield*/, this.syncGroup()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.syncShow()];
                    case 6:
                        _a.sent();
                        d = new Date();
                        cur = Math.floor(d.getDate() / 1000);
                        return [4 /*yield*/, this.storeService.getAmigoUpdates(this.amigoId)];
                    case 7:
                        updates = _a.sent();
                        i = 0;
                        _a.label = 8;
                    case 8:
                        if (!(i < updates.length)) return [3 /*break*/, 14];
                        // update identity
                        return [4 /*yield*/, this.syncAmigoIdentity(updates[i])];
                    case 9:
                        // update identity
                        _a.sent();
                        // update attributes
                        return [4 /*yield*/, this.syncAmigoAttributes(updates[i])];
                    case 10:
                        // update attributes
                        _a.sent();
                        // update subjects
                        return [4 /*yield*/, this.syncAmigoSubjects(updates[i])];
                    case 11:
                        // update subjects
                        _a.sent();
                        // set updated timestamp
                        return [4 /*yield*/, this.storeService.setAmigoUpdateTimestamp(this.amigoId, updates[i].amigoId, cur)];
                    case 12:
                        // set updated timestamp
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 8];
                    case 14: 
                    // store revision
                    return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 15:
                        // store revision
                        _a.sent();
                        // store access
                        return [4 /*yield*/, this.storeService.setAppAccount(this.amigoId, this.access)];
                    case 16:
                        // store access
                        _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        e_1 = _a.sent();
                        console.log("import failed");
                        console.log(e_1);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncAmigoIdentity = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var refresh, indexRevision, amigo, registryRevision, msg, amigo, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableIndex == true)) return [3 /*break*/, 15];
                        refresh = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 15]);
                        return [4 /*yield*/, this.indexService.getAmigoRevision(this.node, this.token, update.amigoId)];
                    case 2:
                        indexRevision = _a.sent();
                        if (!(indexRevision != update.identityRevision)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.indexService.getAmigoIdentity(this.node, this.token, update.amigoId)];
                    case 3:
                        amigo = _a.sent();
                        update.node = amigo.node;
                        update.registry = amigo.registry;
                        update.identityRevision = amigo.revision;
                        return [4 /*yield*/, this.storeService.setAmigoIdentity(this.amigoId, update.amigoId, amigo, this.searchableAmigo)];
                    case 4:
                        _a.sent();
                        update.identityRevision = indexRevision;
                        refresh = true;
                        _a.label = 5;
                    case 5:
                        if (!(update.registry != null)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.registryService.getRevision(update.registry, update.amigoId)];
                    case 6:
                        registryRevision = _a.sent();
                        if (!(registryRevision != update.identityRevision)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.registryService.getMessage(update.registry, update.amigoId)];
                    case 7:
                        msg = _a.sent();
                        return [4 /*yield*/, this.indexService.setAmigo(this.node, this.token, msg)];
                    case 8:
                        amigo = _a.sent();
                        update.node = amigo.node;
                        update.registry = amigo.registry;
                        update.identityRevision = amigo.revision;
                        return [4 /*yield*/, this.storeService.setAmigoIdentity(this.amigoId, update.amigoId, amigo, this.searchableAmigo)];
                    case 9:
                        _a.sent();
                        update.identityRevision = registryRevision;
                        refresh = true;
                        _a.label = 10;
                    case 10:
                        if (!refresh) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.refreshAmigos()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.refreshContacts()];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        e_2 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_2);
                        }
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncAmigoAttributes = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var refresh, revision, remote, remoteMap_1, i, local, localMap_1, i, local, i, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refresh = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 20, , 21]);
                        if (!(update.shareStatus == "connected")) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.contactService.getRevision(this.serviceNode, this.serviceToken, update.node, update.token)];
                    case 2:
                        revision = _a.sent();
                        if (!(revision != update.attributeRevision)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.contactService.getAttributeViews(this.serviceNode, this.serviceToken, update.node, update.token, this.attributeFilter)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_1 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_1.set(remote[i].attributeId, remote[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getAmigoAttributeViews(this.amigoId, update.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_1 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_1.set(local[i].attributeId, local[i].revision);
                        }
                        // add remote entry not in local
                        return [4 /*yield*/, this.asyncForEach(remoteMap_1, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var a, a;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_1.has(key)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.contactService.getAttribute(this.serviceNode, this.serviceToken, update.node, update.token, key)];
                                        case 1:
                                            a = _a.sent();
                                            return [4 /*yield*/, this.storeService.addAmigoAttribute(this.amigoId, update.amigoId, a)];
                                        case 2:
                                            _a.sent();
                                            refresh = true;
                                            return [3 /*break*/, 6];
                                        case 3:
                                            if (!(localMap_1.get(key) != value)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.contactService.getAttribute(this.serviceNode, this.serviceToken, update.node, update.token, key)];
                                        case 4:
                                            a = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAmigoAttribute(this.amigoId, update.amigoId, a)];
                                        case 5:
                                            _a.sent();
                                            refresh = true;
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        // add remote entry not in local
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_1, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_1.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeAmigoAttribute(this.amigoId, update.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        // set updated revision
                        return [4 /*yield*/, this.storeService.setAmigoAttributeRevision(this.amigoId, update.amigoId, revision)];
                    case 7:
                        // set updated revision
                        _a.sent();
                        update.attributeRevision = revision;
                        _a.label = 8;
                    case 8: return [3 /*break*/, 16];
                    case 9: return [4 /*yield*/, this.storeService.getAmigoAttributeViews(this.amigoId, update.amigoId)];
                    case 10:
                        local = _a.sent();
                        i = 0;
                        _a.label = 11;
                    case 11:
                        if (!(i < local.length)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.storeService.removeAmigoAttribute(this.amigoId, update.amigoId, local[i].attributeId)];
                    case 12:
                        _a.sent();
                        refresh = true;
                        _a.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 11];
                    case 14:
                        if (!(update.attributeRevision != null)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.storeService.setAmigoAttributeRevision(this.amigoId, update.amigoId, null)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        if (!refresh) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.refreshAmigos()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.refreshContacts()];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        e_3 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_3);
                        }
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncAmigoSubjects = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var refresh, revision, remote, remoteMap_2, i, local, localMap_2, i, local, i, e_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refresh = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 17, , 18]);
                        if (!(update.shareStatus == "connected")) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.viewService.getRevision(this.serviceNode, this.serviceToken, update.node, update.token)];
                    case 2:
                        revision = _a.sent();
                        if (!(revision != update.subjectRevision)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.viewService.getSubjectViews(this.serviceNode, this.serviceToken, update.node, update.token, this.subjectFilter)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_2 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_2.set(remote[i].subjectId, { subjet: remote[i].revision, tag: remote[i].tagRevision });
                        }
                        return [4 /*yield*/, this.storeService.getAmigoSubjectViews(this.amigoId, update.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_2 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_2.set(local[i].subjectId, { subject: local[i].revision, tag: local[i].tagRevision });
                        }
                        // add remote entry not in local
                        return [4 /*yield*/, this.asyncForEach(remoteMap_2, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var subject, tag, subject, tag;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_2.has(key)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.viewService.getSubject(this.serviceNode, this.serviceToken, update.node, update.token, key)];
                                        case 1:
                                            subject = _a.sent();
                                            return [4 /*yield*/, this.storeService.addAmigoSubject(this.amigoId, update.amigoId, subject, this.searchableSubject)];
                                        case 2:
                                            _a.sent();
                                            if (!(value.tag != null)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, this.viewService.getSubjectTags(this.serviceNode, this.serviceToken, update.node, update.token, key, this.tagFilter)];
                                        case 3:
                                            tag = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAmigoSubjectTags(this.amigoId, update.amigoId, key, tag.revision, tag.tags)];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            refresh = true;
                                            return [3 /*break*/, 12];
                                        case 6:
                                            if (!(localMap_2.get(key).subject != value.subject)) return [3 /*break*/, 9];
                                            return [4 /*yield*/, this.viewService.getSubject(this.serviceNode, this.serviceToken, update.node, update.token, key)];
                                        case 7:
                                            subject = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAmigoSubject(this.amigoId, update.amigoId, subject, this.searchableSubject)];
                                        case 8:
                                            _a.sent();
                                            refresh = true;
                                            _a.label = 9;
                                        case 9:
                                            if (!(localMap_2.get(key).tag != value.tag)) return [3 /*break*/, 12];
                                            return [4 /*yield*/, this.viewService.getSubjectTags(this.serviceNode, this.serviceToken, update.node, update.token, key, this.tagFilter)];
                                        case 10:
                                            tag = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAmigoSubjectTags(this.amigoId, update.amigoId, key, tag.revision, tag.tags)];
                                        case 11:
                                            _a.sent();
                                            refresh = true;
                                            _a.label = 12;
                                        case 12: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        // add remote entry not in local
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_2, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_2.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeAmigoSubject(this.amigoId, update.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        // set updated revision
                        return [4 /*yield*/, this.storeService.setAmigoSubjectRevision(this.amigoId, update.amigoId, revision)];
                    case 7:
                        // set updated revision
                        _a.sent();
                        update.subjectRevision = revision;
                        _a.label = 8;
                    case 8: return [3 /*break*/, 16];
                    case 9: return [4 /*yield*/, this.storeService.getAmigoSubjectViews(this.amigoId, update.amigoId)];
                    case 10:
                        local = _a.sent();
                        i = 0;
                        _a.label = 11;
                    case 11:
                        if (!(i < local.length)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.storeService.removeAmigoSubject(this.amigoId, update.amigoId, local[i].subjectId)];
                    case 12:
                        _a.sent();
                        refresh = true;
                        _a.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 11];
                    case 14:
                        if (!(update.subjectRevision != null)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.storeService.setAmigoSubjectRevision(this.amigoId, update.amigoId, null)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        // refresh contacts
                        if (refresh) {
                            this.refreshViewFeed();
                        }
                        return [3 /*break*/, 18];
                    case 17:
                        e_4 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_4);
                        }
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncShow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, refresh_1, remote, remoteMap_3, i, local, localMap_3, i, e_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableShow == true)) return [3 /*break*/, 12];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        return [4 /*yield*/, this.showService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.show != r)) return [3 /*break*/, 10];
                        refresh_1 = false;
                        return [4 /*yield*/, this.showService.getSubjectViews(this.node, this.token, this.subjectFilter)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_3 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_3.set(remote[i].subjectId, { subject: remote[i].revision, tag: remote[i].tagRevision });
                        }
                        return [4 /*yield*/, this.storeService.getSubjectViews(this.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_3 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_3.set(local[i].subjectId, { subject: local[i].revision, tag: local[i].tagRevision });
                        }
                        // add remote entry not in local
                        return [4 /*yield*/, this.asyncForEach(remoteMap_3, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var entry, i, tag, entry, i, tag;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_3.has(key)) return [3 /*break*/, 11];
                                            return [4 /*yield*/, this.showService.getSubject(this.node, this.token, key)];
                                        case 1:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.addSubject(this.amigoId, entry, this.searchableSubject)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearSubjectLabels(this.amigoId, key)];
                                        case 3:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 4;
                                        case 4:
                                            if (!(i < entry.labels.length)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.storeService.setSubjectLabel(this.amigoId, key, entry.labels[i])];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            i++;
                                            return [3 /*break*/, 4];
                                        case 7:
                                            if (!(value.tag != 0)) return [3 /*break*/, 10];
                                            return [4 /*yield*/, this.showService.getSubjectTags(this.node, this.token, key, this.tagFilter)];
                                        case 8:
                                            tag = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateSubjectTags(this.amigoId, key, tag.revision, tag.tags)];
                                        case 9:
                                            _a.sent();
                                            _a.label = 10;
                                        case 10:
                                            refresh_1 = true;
                                            return [3 /*break*/, 22];
                                        case 11:
                                            if (!(localMap_3.get(key).subject != value.subject)) return [3 /*break*/, 19];
                                            return [4 /*yield*/, this.showService.getSubject(this.node, this.token, key)];
                                        case 12:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                                        case 13:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearSubjectLabels(this.amigoId, key)];
                                        case 14:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 15;
                                        case 15:
                                            if (!(i < entry.labels.length)) return [3 /*break*/, 18];
                                            return [4 /*yield*/, this.storeService.setSubjectLabel(this.amigoId, key, entry.labels[i])];
                                        case 16:
                                            _a.sent();
                                            _a.label = 17;
                                        case 17:
                                            i++;
                                            return [3 /*break*/, 15];
                                        case 18:
                                            refresh_1 = true;
                                            _a.label = 19;
                                        case 19:
                                            if (!(localMap_3.get(key).tag != value.tag)) return [3 /*break*/, 22];
                                            return [4 /*yield*/, this.showService.getSubjectTags(this.node, this.token, key, this.tagFilter)];
                                        case 20:
                                            tag = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateSubjectTags(this.amigoId, key, tag.revision, tag.tags)];
                                        case 21:
                                            _a.sent();
                                            refresh_1 = true;
                                            _a.label = 22;
                                        case 22: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        // add remote entry not in local
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_3, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_3.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeSubject(this.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh_1 = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        if (!refresh_1) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        // upldate group revision
                        this.revision.show = r;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        e_5 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_5);
                        }
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, refresh_2, remote, remoteMap_4, i, local, localMap_4, i, entries, e_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableProfile == true)) return [3 /*break*/, 11];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.profileService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.profile != r)) return [3 /*break*/, 9];
                        refresh_2 = false;
                        return [4 /*yield*/, this.profileService.getAttributeViews(this.node, this.token, this.attributeFilter)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_4 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_4.set(remote[i].attributeId, remote[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getAttributeViews(this.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_4 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_4.set(local[i].attributeId, local[i].revision);
                        }
                        return [4 /*yield*/, this.asyncForEach(remoteMap_4, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var entry, i, entry, i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_4.has(key)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, this.profileService.getAttribute(this.node, this.token, key)];
                                        case 1:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.addAttribute(this.amigoId, entry.attribute)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearAttributeLabels(this.amigoId, entry.attribute.attributeId)];
                                        case 3:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 4;
                                        case 4:
                                            if (!(i < entry.labels.length)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.storeService.setAttributeLabel(this.amigoId, key, entry.labels[i])];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            i++;
                                            return [3 /*break*/, 4];
                                        case 7:
                                            refresh_2 = true;
                                            return [3 /*break*/, 16];
                                        case 8:
                                            if (!(localMap_4.get(key) != value)) return [3 /*break*/, 16];
                                            return [4 /*yield*/, this.profileService.getAttribute(this.node, this.token, key)];
                                        case 9:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAttribute(this.amigoId, entry.attribute)];
                                        case 10:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearAmigoLabels(this.amigoId, entry.attribute.attributeId)];
                                        case 11:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 12;
                                        case 12:
                                            if (!(i < entry.labels.length)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, this.storeService.setAttributeLabel(this.amigoId, entry.attribute.attributeId, entry.labels[i])];
                                        case 13:
                                            _a.sent();
                                            _a.label = 14;
                                        case 14:
                                            i++;
                                            return [3 /*break*/, 12];
                                        case 15:
                                            refresh_2 = true;
                                            _a.label = 16;
                                        case 16: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_4, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_4.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeAttribute(this.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh_2 = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        // upldate group revision
                        this.revision.profile = r;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 7:
                        _a.sent();
                        if (!refresh_2) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.storeService.getAttributes(this.amigoId)];
                    case 8:
                        entries = _a.sent();
                        this.attributeEntries.next(entries);
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_6 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_6);
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, refresh_3, remote, remoteMap_5, i, local, localMap_5, i, remoteReq, remoteReqMap_1, i, localReq, localReqMap_1, i, pending_1, e_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableIndex == true)) return [3 /*break*/, 18];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 17, , 18]);
                        return [4 /*yield*/, this.indexService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.index != r)) return [3 /*break*/, 16];
                        refresh_3 = false;
                        return [4 /*yield*/, this.indexService.getAmigoViews(this.node, this.token)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_5 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_5.set(remote[i].amigoId, remote[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getAmigoViews(this.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_5 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_5.set(local[i].amigoId, local[i].revision);
                        }
                        return [4 /*yield*/, this.asyncForEach(remoteMap_5, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var amigo, i, amigo, i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_5.has(key)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, this.indexService.getAmigo(this.node, this.token, key)];
                                        case 1:
                                            amigo = _a.sent();
                                            return [4 /*yield*/, this.storeService.addAmigo(this.amigoId, amigo.amigoId, amigo.notes, amigo.revision)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearAmigoLabels(this.amigoId, amigo.amigoId)];
                                        case 3:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 4;
                                        case 4:
                                            if (!(i < amigo.labels.length)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, this.storeService.setAmigoLabel(this.amigoId, key, amigo.labels[i])];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            i++;
                                            return [3 /*break*/, 4];
                                        case 7:
                                            refresh_3 = true;
                                            return [3 /*break*/, 16];
                                        case 8:
                                            if (!(localMap_5.get(key) != value)) return [3 /*break*/, 16];
                                            return [4 /*yield*/, this.indexService.getAmigo(this.node, this.token, key)];
                                        case 9:
                                            amigo = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateAmigo(this.amigoId, amigo.amigoId, amigo.notes, amigo.revision)];
                                        case 10:
                                            _a.sent();
                                            return [4 /*yield*/, this.storeService.clearAmigoLabels(this.amigoId, amigo.amigoId)];
                                        case 11:
                                            _a.sent();
                                            i = 0;
                                            _a.label = 12;
                                        case 12:
                                            if (!(i < amigo.labels.length)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, this.storeService.setAmigoLabel(this.amigoId, amigo.amigoId, amigo.labels[i])];
                                        case 13:
                                            _a.sent();
                                            _a.label = 14;
                                        case 14:
                                            i++;
                                            return [3 /*break*/, 12];
                                        case 15:
                                            refresh_3 = true;
                                            _a.label = 16;
                                        case 16: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_5, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_5.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeAmigo(this.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh_3 = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        return [4 /*yield*/, this.indexService.getPendingRequests(this.node, this.token)];
                    case 7:
                        remoteReq = _a.sent();
                        remoteReqMap_1 = new Map();
                        for (i = 0; i < remoteReq.length; i++) {
                            remoteReqMap_1.set(remoteReq[i].shareId, remoteReq[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getPendingViews(this.amigoId)];
                    case 8:
                        localReq = _a.sent();
                        localReqMap_1 = new Map();
                        for (i = 0; i < localReq.length; i++) {
                            localReqMap_1.set(localReq[i].shareId, localReq[i].revision);
                        }
                        pending_1 = false;
                        // add any new pending requests
                        return [4 /*yield*/, this.asyncForEach(remoteReqMap_1, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var amigo, amigo;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localReqMap_1.has(key)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.indexService.getPendingRequest(this.node, this.token, key)];
                                        case 1:
                                            amigo = _a.sent();
                                            return [4 /*yield*/, this.storeService.addPending(this.amigoId, amigo)];
                                        case 2:
                                            _a.sent();
                                            pending_1 = true;
                                            return [3 /*break*/, 6];
                                        case 3:
                                            if (!(localReqMap_1.get(key) != value)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.indexService.getPendingRequest(this.node, this.token, key)];
                                        case 4:
                                            amigo = _a.sent();
                                            return [4 /*yield*/, this.storeService.updatePending(this.amigoId, key, amigo)];
                                        case 5:
                                            _a.sent();
                                            pending_1 = true;
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 9:
                        // add any new pending requests
                        _a.sent();
                        // remove old pending requests
                        this.asyncForEach(localReqMap_1, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!remoteReqMap_1.has(key)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.storeService.removePending(this.amigoId, key)];
                                    case 1:
                                        _a.sent();
                                        pending_1 = true;
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        if (!refresh_3) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.refreshAmigos()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.refreshContacts()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (!pending_1) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.refreshPending()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        // upldate group revision
                        this.revision.index = r;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        e_7 = _a.sent();
                        if (this.amigoId != null) {
                            console.log(e_7);
                        }
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncShare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, refresh_4, remote, remoteMap_6, i, local, localMap_6, i, e_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableShare == true)) return [3 /*break*/, 10];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.shareService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.share != r)) return [3 /*break*/, 8];
                        refresh_4 = false;
                        return [4 /*yield*/, this.shareService.getConnectionViews(this.node, this.token)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_6 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_6.set(remote[i].shareId, remote[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getConnectionViews(this.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_6 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_6.set(local[i].shareId, local[i].revision);
                        }
                        // add remote entry not in local
                        return [4 /*yield*/, this.asyncForEach(remoteMap_6, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var entry, entry;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_6.has(key)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.shareService.getConnection(this.node, this.token, key)];
                                        case 1:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.addConnection(this.amigoId, entry)];
                                        case 2:
                                            _a.sent();
                                            refresh_4 = true;
                                            return [3 /*break*/, 6];
                                        case 3:
                                            if (!(localMap_6.get(key) != value)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.shareService.getConnection(this.node, this.token, key)];
                                        case 4:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateConnection(this.amigoId, entry)];
                                        case 5:
                                            _a.sent();
                                            refresh_4 = true;
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        // add remote entry not in local
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_6, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_6.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeConnection(this.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh_4 = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        // upldate group revision
                        this.revision.share = r;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 7:
                        _a.sent();
                        // if contacts should refresh
                        if (refresh_4) {
                            this.refreshAmigos();
                            this.refreshContacts();
                        }
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_8 = _a.sent();
                        if (this.amigoId != null) {
                            console.log(e_8);
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncGroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, refresh_5, remote, remoteMap_7, i, local, localMap_7, i, labels, e_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableGroup == true)) return [3 /*break*/, 11];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, this.groupService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.group != r)) return [3 /*break*/, 9];
                        refresh_5 = false;
                        return [4 /*yield*/, this.groupService.getLabelViews(this.node, this.token)];
                    case 3:
                        remote = _a.sent();
                        remoteMap_7 = new Map();
                        for (i = 0; i < remote.length; i++) {
                            remoteMap_7.set(remote[i].labelId, remote[i].revision);
                        }
                        return [4 /*yield*/, this.storeService.getLabelViews(this.amigoId)];
                    case 4:
                        local = _a.sent();
                        localMap_7 = new Map();
                        for (i = 0; i < local.length; i++) {
                            localMap_7.set(local[i].labelId, local[i].revision);
                        }
                        // add remote entry not in local
                        return [4 /*yield*/, this.asyncForEach(remoteMap_7, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var entry, entry;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!localMap_7.has(key)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.groupService.getLabel(this.node, this.token, key)];
                                        case 1:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.addLabel(this.amigoId, entry)];
                                        case 2:
                                            _a.sent();
                                            refresh_5 = true;
                                            return [3 /*break*/, 6];
                                        case 3:
                                            if (!(localMap_7.get(key) != value)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.groupService.getLabel(this.node, this.token, key)];
                                        case 4:
                                            entry = _a.sent();
                                            return [4 /*yield*/, this.storeService.updateLabel(this.amigoId, entry)];
                                        case 5:
                                            _a.sent();
                                            refresh_5 = true;
                                            _a.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 5:
                        // add remote entry not in local
                        _a.sent();
                        // remove any local entry not in remote
                        return [4 /*yield*/, this.asyncForEach(localMap_7, function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!remoteMap_7.has(key)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.storeService.removeLabel(this.amigoId, key)];
                                        case 1:
                                            _a.sent();
                                            refresh_5 = true;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 6:
                        // remove any local entry not in remote
                        _a.sent();
                        // upldate group revision
                        this.revision.group = r;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 7:
                        _a.sent();
                        if (!refresh_5) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.storeService.getLabels(this.amigoId)];
                    case 8:
                        labels = _a.sent();
                        this.labelEntries.next(labels);
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_9 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_9);
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.syncIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, amigo, e_10, r, msg, amigo, msg, amigo, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.access.enableIdentity == true)) return [3 /*break*/, 19];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.identityService.getRevision(this.node, this.token)];
                    case 2:
                        r = _a.sent();
                        if (!(this.revision.identity != r)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.identityService.getAmigo(this.node, this.token)];
                    case 3:
                        amigo = _a.sent();
                        this.identityAmigo.next(amigo);
                        this.node = amigo.node;
                        this.registry = amigo.registry;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.IDENTITY, amigo)];
                    case 4:
                        _a.sent();
                        this.revision.identity = amigo.revision;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_10 = _a.sent();
                        console.error(e_10);
                        return [3 /*break*/, 8];
                    case 8:
                        _a.trys.push([8, 18, , 19]);
                        if (!(this.registry != null)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.registryService.getRevision(this.registry, this.amigoId)];
                    case 9:
                        r = _a.sent();
                        if (!(this.revision.identity < r)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.registryService.getMessage(this.node, this.token)];
                    case 10:
                        msg = _a.sent();
                        amigo = amigo_util_1.getAmigoObject(msg);
                        this.identityAmigo.next(amigo);
                        this.node = amigo.node;
                        this.registry = amigo.registry;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.IDENTITY, amigo)];
                    case 11:
                        _a.sent();
                        this.revision.identity = amigo.revision;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        if (!(this.revision.identity > r)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.identityService.getMessage(this.node, this.token)];
                    case 14:
                        msg = _a.sent();
                        amigo = amigo_util_1.getAmigoObject(msg);
                        return [4 /*yield*/, this.registryService.setMessage(amigo.registry, msg)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this.identityService.clearDirty(this.node, this.token, amigo.revision)];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        e_11 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_11);
                        }
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setIdentity = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var amigo, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amigo = amigo_util_1.getAmigoObject(msg);
                        this.identityAmigo.next(amigo);
                        this.node = amigo.node;
                        this.registry = amigo.registry;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.IDENTITY, amigo)];
                    case 1:
                        _a.sent();
                        this.revision.identity = amigo.revision;
                        return [4 /*yield*/, this.storeService.setAppProperty(this.amigoId, Prop.REVISION, this.revision)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, , 8]);
                        if (!(amigo.registry != null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.registryService.setMessage(this.registry, msg)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.identityService.clearDirty(this.node, this.token, amigo.revision)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_12 = _a.sent();
                        console.log(e_12);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setContact = function (amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var contact;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.amigo = amigoId;
                        return [4 /*yield*/, this.storeService.getContact(this.amigoId, amigoId)];
                    case 1:
                        contact = _a.sent();
                        this.selectedAmigo.next(contact);
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setAmigoLabelFilter = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.amigoLabel = l;
                        return [4 /*yield*/, this.refreshAmigos()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setAmigoSearchFilter = function (s) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.amigoSearch = s;
                        return [4 /*yield*/, this.refreshAmigos()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.refreshAmigos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filtered, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.storeService.getContacts(this.amigoId, this.amigoLabel, this.amigoSearch, "connected", null)];
                    case 1:
                        filtered = _a.sent();
                        this.filteredAmigos.next(filtered);
                        return [3 /*break*/, 3];
                    case 2:
                        e_13 = _a.sent();
                        console.error(e_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setShowLabelFilter = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showLabel = l;
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setShowSearchFilter = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    AmigoService.prototype.refreshShowFeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getShowFeed(this.showLabel, this.showSearch, null)];
                    case 1:
                        subjects = _a.sent();
                        this.showSubjects.next(subjects);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setViewLabelFilter = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.viewLabel = l;
                        return [4 /*yield*/, this.refreshViewFeed()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setViewSearchFilter = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    AmigoService.prototype.refreshViewFeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.storeService.getAmigoFeed(this.amigoId, null, this.viewLabel, this.viewSearch, null)];
                    case 1:
                        subjects = _a.sent();
                        this.viewSubjects.next(subjects);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.refreshContacts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contacts, contact, connected, saved, received, requested, all, hidden, i, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.storeService.getContacts(this.amigoId, null, null, null, null)];
                    case 1:
                        contacts = _a.sent();
                        contact = null;
                        connected = [];
                        saved = [];
                        received = [];
                        requested = [];
                        all = [];
                        hidden = [];
                        for (i = 0; i < contacts.length; i++) {
                            // updated selected contact
                            if (this.amigo == contacts[i].amigoId) {
                                contact = contacts[i];
                            }
                            // recevied - received
                            if (contacts[i].status == "received") {
                                received.push(contacts[i]);
                            }
                            // requested - requested
                            if (contacts[i].status == "requested") {
                                requested.push(contacts[i]);
                            }
                            // connected - connected
                            if (contacts[i].status == "connected") {
                                connected.push(contacts[i]);
                            }
                            // saved - null, requesting, requested, receiving, received, closing, closed
                            if (contacts[i].status != "connected") {
                                saved.push(contacts[i]);
                            }
                            // any hidden contact
                            if (contacts[i].hidden) {
                                hidden.push(contacts[i]);
                            }
                            // add to all list
                            all.push(contacts[i]);
                        }
                        this.selectedAmigo.next(contact);
                        this.connectedAmigos.next(connected);
                        this.savedAmigos.next(saved);
                        this.receivedAmigos.next(received);
                        this.requestedAmigos.next(requested);
                        this.allAmigos.next(all);
                        this.hiddenAmigos.next(hidden);
                        return [3 /*break*/, 3];
                    case 2:
                        e_14 = _a.sent();
                        console.error(e_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.refreshPending = function () {
        return __awaiter(this, void 0, void 0, function () {
            var amigos, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.storeService.getPendingContacts(this.amigoId)];
                    case 1:
                        amigos = _a.sent();
                        this.pendingAmigos.next(amigos);
                        return [3 /*break*/, 3];
                    case 2:
                        e_15 = _a.sent();
                        console.error(e_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setName = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identityService.setName(this.node, this.token, value)];
                    case 1:
                        msg = _a.sent();
                        return [4 /*yield*/, this.setIdentity(msg)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setDescription = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identityService.setDescription(this.node, this.token, value)];
                    case 1:
                        msg = _a.sent();
                        return [4 /*yield*/, this.setIdentity(msg)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setLocation = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identityService.setLocation(this.node, this.token, value)];
                    case 1:
                        msg = _a.sent();
                        return [4 /*yield*/, this.setIdentity(msg)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setImage = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.identityService.setImage(this.node, this.token, value)];
                    case 1:
                        msg = _a.sent();
                        return [4 /*yield*/, this.setIdentity(msg)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.checkHandle = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.registry != null) {
                    return [2 /*return*/, this.registryService.checkHandle(this.registry, value, this.amigoId)];
                }
                return [2 /*return*/, true];
            });
        });
    };
    AmigoService.prototype.setHandle = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var check, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkHandle(value)];
                    case 1:
                        check = _a.sent();
                        if (!check) {
                            throw new Error("handle not available");
                        }
                        return [4 /*yield*/, this.identityService.setHandle(this.node, this.token, value)];
                    case 2:
                        msg = _a.sent();
                        return [4 /*yield*/, this.setIdentity(msg)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getLabels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getLabels(this.amigoId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getLabel = function (labelId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getLabel(this.amigoId, labelId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.addLabel = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupService.addLabel(this.node, this.token, name)];
                    case 1:
                        label = _a.sent();
                        return [4 /*yield*/, this.syncGroup()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, label];
                }
            });
        });
    };
    AmigoService.prototype.updateLabel = function (labelId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupService.updateLabel(this.node, this.token, labelId, name)];
                    case 1:
                        label = _a.sent();
                        return [4 /*yield*/, this.syncGroup()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, label];
                }
            });
        });
    };
    AmigoService.prototype.removeLabel = function (labelId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupService.removeLabel(this.node, this.token, labelId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncGroup()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getAttributes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAttributes(this.amigoId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getAttribute = function (attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAttribute(this.amigoId, attributeId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.addAttribute = function (schema, data) {
        return __awaiter(this, void 0, void 0, function () {
            var attribute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.addAttribute(this.node, this.token, schema, data)];
                    case 1:
                        attribute = _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, attribute];
                }
            });
        });
    };
    AmigoService.prototype.updateAttribute = function (attributeId, schema, data) {
        return __awaiter(this, void 0, void 0, function () {
            var attribute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.updateAttribute(this.node, this.token, attributeId, schema, data)];
                    case 1:
                        attribute = _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, attribute];
                }
            });
        });
    };
    AmigoService.prototype.removeAttribute = function (attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.removeAttribute(this.node, this.token, attributeId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setAttributeLabels = function (attributeId, labelIds) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.setAttributeLabels(this.node, this.token, attributeId, labelIds)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.setAttributeLabel = function (attributeId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.setAttributeLabel(this.node, this.token, attributeId, labelId)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.clearAttributeLabel = function (attributeId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.profileService.clearAttributeLabel(this.node, this.token, attributeId, labelId)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.addSubject = function (schema) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.addSubject(this.node, this.token, schema)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.addSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.getSubject = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getSubject(this.amigoId, subjectId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.updateSubject = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, stored;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.getSubject(this.node, this.token, subjectId)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.getSubject(this.amigoId, subjectId)];
                    case 2:
                        stored = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 3:
                        _a.sent();
                        if (!(entry.subject.revision != stored.subject.revision)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.storeService.getFeedSubjectEntry(this.amigoId, subjectId)];
                    case 6: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.updateSubjectData = function (subjectId, schema, data) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.updateSubjectData(this.node, this.token, subjectId, schema, data)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.updateSubjectShare = function (subjectId, share) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.updateSubjectShare(this.node, this.token, subjectId, share)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.updateSubjectExpire = function (subjectId, expire) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.updateSubjectExpire(this.node, this.token, subjectId, expire)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.removeSubject = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.removeSubject(this.node, this.token, subjectId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.storeService.removeSubject(this.amigoId, subjectId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.removeSubjectAsset = function (subjectId, assetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.removeSubjectAsset(this.node, this.token, subjectId, assetId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setSubjectLabels = function (subjectId, labelIds) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.setSubjectLabels(this.node, this.token, subjectId, labelIds)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.setSubjectLabel = function (subjectId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.setSubjectLabel(this.node, this.token, subjectId, labelId)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.clearSubjectLabel = function (subjectId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.clearSubjectLabel(this.node, this.token, subjectId, labelId)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubject(this.amigoId, entry, this.searchableSubject)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.getSubjectTags = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getSubjectTags(this.amigoId, subjectId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getAmigoSubjectTags = function (amigoId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoSubjectTags(this.amigoId, amigoId, subjectId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.addSubjectTag = function (subjectId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.addSubjectTag(this.node, this.token, subjectId, this.tagFilter, data)];
                    case 1:
                        t = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubjectTags(this.amigoId, subjectId, t.revision, t.tags)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, t.tags];
                }
            });
        });
    };
    AmigoService.prototype.addAmigoSubjectTag = function (amigoId, subjectId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var update, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoUpdate(this.amigoId, amigoId)];
                    case 1:
                        update = _a.sent();
                        return [4 /*yield*/, this.viewService.addSubjectTags(this.serviceNode, this.serviceToken, update.node, update.token, subjectId, this.tagFilter, data)];
                    case 2:
                        t = _a.sent();
                        return [4 /*yield*/, this.storeService.updateAmigoSubjectTags(this.amigoId, amigoId, subjectId, t.revision, t.tags)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.refreshViewFeed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, t.tags];
                }
            });
        });
    };
    AmigoService.prototype.removeSubjectTag = function (subjectId, tagId) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.showService.removeSubjectTag(this.node, this.token, subjectId, tagId, this.tagFilter)];
                    case 1:
                        t = _a.sent();
                        return [4 /*yield*/, this.storeService.updateSubjectTags(this.amigoId, subjectId, t.revision, t.tags)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refreshShowFeed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, t.tags];
                }
            });
        });
    };
    AmigoService.prototype.removeAmigoSubjectTag = function (amigoId, subjectId, tagId) {
        return __awaiter(this, void 0, void 0, function () {
            var update, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoUpdate(this.amigoId, amigoId)];
                    case 1:
                        update = _a.sent();
                        return [4 /*yield*/, this.viewService.removeSubjectTags(this.serviceNode, this.serviceToken, update.node, update.token, subjectId, tagId, this.tagFilter)];
                    case 2:
                        t = _a.sent();
                        return [4 /*yield*/, this.storeService.updateAmigoSubjectTags(this.amigoId, amigoId, subjectId, t.revision, t.tags)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.refreshViewFeed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, t.tags];
                }
            });
        });
    };
    AmigoService.prototype.getUploadUrl = function (subjectId, transforms) {
        return this.showService.getUploadUrl(this.node, this.token, subjectId, transforms);
    };
    AmigoService.prototype.getLogoUrl = function (revision) {
        return this.identityService.getImageUrl(this.node, this.token, revision);
    };
    AmigoService.prototype.getAmigoLogoUrl = function (amigoId, revision) {
        return this.indexService.getAmigoLogoUrl(this.node, this.token, amigoId, revision);
    };
    AmigoService.prototype.getShowAssetUrl = function (subjectId, assetId) {
        return this.showService.getAssetUrl(this.node, this.token, subjectId, assetId);
    };
    AmigoService.prototype.getViewAssetUrl = function (amigoId, subjectId, assetId) {
        return __awaiter(this, void 0, void 0, function () {
            var update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoUpdate(this.amigoId, amigoId)];
                    case 1:
                        update = _a.sent();
                        return [4 /*yield*/, this.viewService.getAssetUrl(this.serviceNode, this.serviceToken, update.node, update.token, subjectId, assetId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.addConnection = function (amigo) {
        return __awaiter(this, void 0, void 0, function () {
            var share;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shareService.addConnection(this.node, this.token, amigo)];
                    case 1:
                        share = _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, share];
                }
            });
        });
    };
    AmigoService.prototype.openConnection = function (amigo, share, node) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, msg, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "requesting", null)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.shareService.getMessage(this.node, this.token, share)];
                    case 3:
                        msg = _a.sent();
                        return [4 /*yield*/, this.shareService.setMessage(node, amigo, msg)];
                    case 4:
                        status = _a.sent();
                        if (!(status.shareStatus == shareStatus_1.ShareStatus.ShareStatusEnum.Connected)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "connected", status.connected)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, "connected"];
                    case 7:
                        if (!(status.shareStatus == shareStatus_1.ShareStatus.ShareStatusEnum.Closed)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "closed", null)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, "closed"];
                    case 10:
                        if (!(status.shareStatus == shareStatus_1.ShareStatus.ShareStatusEnum.Received)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "requested", null)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, "requested"];
                    case 13: throw new Error("unexpected connection state");
                }
            });
        });
    };
    AmigoService.prototype.closeConnection = function (amigo, share, node) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, msg, status_1, e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "closing", null)];
                    case 1:
                        entry = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 11]);
                        return [4 /*yield*/, this.shareService.getMessage(this.node, this.token, share)];
                    case 3:
                        msg = _a.sent();
                        return [4 /*yield*/, this.shareService.setMessage(node, amigo, msg)];
                    case 4:
                        status_1 = _a.sent();
                        if (!(status_1.shareStatus == shareStatus_1.ShareStatus.ShareStatusEnum.Closed)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.shareService.updateStatus(this.node, this.token, share, "closed", null)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, "closed"];
                    case 7:
                        console.error("unexpected connection state");
                        return [4 /*yield*/, this.syncShare()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, "closing"];
                    case 9:
                        e_16 = _a.sent();
                        console.error(e_16);
                        return [4 /*yield*/, this.syncShare()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, "closing"];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.removeConnection = function (amigo, share) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shareService.removeConnection(this.node, this.token, share)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getAmigo = function (amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigo(this.amigoId, amigoId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.addAmigo = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.addAmigo(this.node, this.token, msg)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.storeService.getAmigoUpdate(this.amigoId, entry.amigoId)];
                    case 4:
                        update = _a.sent();
                        return [4 /*yield*/, this.syncAmigoIdentity(update)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.updateAmigoNotes = function (amigoId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.setAmigoNotes(this.node, this.token, amigoId, notes)];
                    case 1:
                        entry = _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, entry];
                }
            });
        });
    };
    AmigoService.prototype.removeAmigo = function (amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.removeAmigo(this.node, this.token, amigoId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setAmigoLabels = function (amigoId, labelIds) {
        return __awaiter(this, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.setAmigoLabels(this.node, this.token, amigoId, labelIds)];
                    case 1:
                        view = _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, view];
                }
            });
        });
    };
    AmigoService.prototype.setAmigoLabel = function (amigoId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.setAmigoLabel(this.node, this.token, amigoId, labelId)];
                    case 1:
                        view = _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, view];
                }
            });
        });
    };
    AmigoService.prototype.clearAmigoLabel = function (amigoId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.clearAmigoLabel(this.node, this.token, amigoId, labelId)];
                    case 1:
                        view = _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, view];
                }
            });
        });
    };
    AmigoService.prototype.getPending = function (shareId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getPending(this.amigoId, shareId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.clearAmigoRequest = function (shareId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.indexService.clearRequest(this.node, this.token, shareId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setContactShareData = function (share, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setShareData(this.amigoId, share, obj)];
                    case 1:
                        _a.sent();
                        this.refreshAmigos();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setPendingAmigoData = function (share, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setPendingData(this.amigoId, share, obj)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setAmigoFeed = function (amigo, hidden) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setAmigoFeed(this.amigoId, amigo, hidden)];
                    case 1:
                        _a.sent();
                        this.refreshContacts();
                        this.refreshViewFeed();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.setContactIdentityData = function (amigo, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setAmigoIdentityData(this.amigoId, amigo, obj)];
                    case 1:
                        _a.sent();
                        this.refreshAmigos();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getContactIdentity = function (amigo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoIdentity(this.amigoId, amigo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getContactShare = function (amigo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoShare(this.amigoId, amigo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.setContactProfileData = function (amigo, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setAmigoAttributeData(this.amigoId, amigo, obj)];
                    case 1:
                        _a.sent();
                        this.refreshAmigos();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getContactProfile = function (amigo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoAttributes(this.amigoId, amigo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.setViewSubjectFeed = function (amigo, subject, hidden) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.setViewSubjectFeed(this.amigoId, amigo, subject, hidden)];
                    case 1:
                        _a.sent();
                        this.refreshViewFeed();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.getShowFeedSubject = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getFeedSubjectEntry(this.amigoId, subjectId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getContact = function (amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getContact(this.amigoId, amigoId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getContacts = function (label, search, status, hidden) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getContacts(this.amigoId, label, search, status, hidden)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getShowFeed = function (label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getSubjectFeed(this.amigoId, label, search, limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getViewFeed = function (amigo, label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getAmigoFeed(this.amigoId, amigo, label, search, limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.getHiddenFeed = function (label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storeService.getHiddenFeed(this.amigoId, label, search, limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AmigoService.prototype.syncChanges = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d, cur, updates, i, e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("sync changes");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 16, , 17]);
                        // sync all modules
                        return [4 /*yield*/, this.syncIdentity()];
                    case 2:
                        // sync all modules
                        _a.sent();
                        return [4 /*yield*/, this.syncGroup()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.syncShare()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.syncIndex()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.syncProfile()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.syncShow()];
                    case 7:
                        _a.sent();
                        d = new Date();
                        cur = Math.floor(d.getTime() / 1000);
                        return [4 /*yield*/, this.storeService.getStaleAmigos(this.amigoId, cur - this.stale)];
                    case 8:
                        updates = _a.sent();
                        i = 0;
                        _a.label = 9;
                    case 9:
                        if (!(i < updates.length)) return [3 /*break*/, 15];
                        // set updated timestamp
                        return [4 /*yield*/, this.storeService.setAmigoUpdateTimestamp(this.amigoId, updates[i].amigoId, cur)];
                    case 10:
                        // set updated timestamp
                        _a.sent();
                        // update identity
                        return [4 /*yield*/, this.syncAmigoIdentity(updates[i])];
                    case 11:
                        // update identity
                        _a.sent();
                        // update attributes
                        return [4 /*yield*/, this.syncAmigoAttributes(updates[i])];
                    case 12:
                        // update attributes
                        _a.sent();
                        // update subjects
                        return [4 /*yield*/, this.syncAmigoSubjects(updates[i])];
                    case 13:
                        // update subjects
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        i++;
                        return [3 /*break*/, 9];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        e_17 = _a.sent();
                        if (this.amigoId != null) {
                            console.error(e_17);
                        }
                        return [3 /*break*/, 17];
                    case 17:
                        console.log("sync changes: done");
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.refreshContact = function (amigo) {
        return __awaiter(this, void 0, void 0, function () {
            var d, cur, update, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = new Date();
                        cur = Math.floor(d.getTime() / 1000);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.storeService.getAmigoUpdate(this.amigoId, amigo)];
                    case 2:
                        update = _a.sent();
                        return [4 /*yield*/, this.storeService.setAmigoUpdateTimestamp(this.amigoId, update.amigoId, cur)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.syncAmigoIdentity(update)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.syncAmigoAttributes(update)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.syncAmigoSubjects(update)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.refreshAllContacts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d, cur, updates, i, e_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = new Date();
                        cur = Math.floor(d.getTime() / 1000);
                        return [4 /*yield*/, this.storeService.getStaleAmigos(this.amigoId, cur)];
                    case 1:
                        updates = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < updates.length)) return [3 /*break*/, 10];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        // set updated timestamp
                        return [4 /*yield*/, this.storeService.setAmigoUpdateTimestamp(this.amigoId, updates[i].amigoId, cur)];
                    case 4:
                        // set updated timestamp
                        _a.sent();
                        // update identity
                        return [4 /*yield*/, this.syncAmigoIdentity(updates[i])];
                    case 5:
                        // update identity
                        _a.sent();
                        // update attributes
                        return [4 /*yield*/, this.syncAmigoAttributes(updates[i])];
                    case 6:
                        // update attributes
                        _a.sent();
                        // update subjects
                        return [4 /*yield*/, this.syncAmigoSubjects(updates[i])];
                    case 7:
                        // update subjects
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_18 = _a.sent();
                        console.log(e_18);
                        return [3 /*break*/, 9];
                    case 9:
                        i++;
                        return [3 /*break*/, 2];
                    case 10: 
                    // lag a little for visual
                    return [4 /*yield*/, this.delay(2000)];
                    case 11:
                        // lag a little for visual
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.asyncForEach = function (map, handler) {
        return __awaiter(this, void 0, void 0, function () {
            var arr, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = [];
                        map.forEach(function (value, key) {
                            arr.push({ id: key, obj: value });
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < arr.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, handler(arr[i].obj, arr[i].id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AmigoService.prototype.delay = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    AmigoService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [registry_service_1.RegistryService,
            access_service_1.AccessService,
            identity_service_1.IdentityService,
            group_service_1.GroupService,
            profile_service_1.ProfileService,
            index_service_1.IndexService,
            share_service_1.ShareService,
            contact_service_1.ContactService,
            token_service_1.TokenService,
            show_service_1.ShowService,
            view_service_1.ViewService,
            store_service_1.StoreService])
    ], AmigoService);
    return AmigoService;
}());
exports.AmigoService = AmigoService;
