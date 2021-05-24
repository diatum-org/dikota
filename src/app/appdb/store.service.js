"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var base64 = require("base-64");
var utf8 = require("utf8");
var sqlite = require("nativescript-sqlite");
var IdRevision = /** @class */ (function () {
    function IdRevision() {
    }
    return IdRevision;
}());
exports.IdRevision = IdRevision;
var AmigoUpdate = /** @class */ (function () {
    function AmigoUpdate() {
    }
    return AmigoUpdate;
}());
exports.AmigoUpdate = AmigoUpdate;
var StoreService = /** @class */ (function () {
    function StoreService() {
        this.database = null;
    }
    StoreService.prototype.decodeText = function (s) {
        if (s == null) {
            return null;
        }
        return utf8.decode(base64.decode(s));
    };
    StoreService.prototype.encodeText = function (o) {
        if (o == null) {
            return "null";
        }
        return "'" + base64.encode(utf8.encode(o)) + "'";
    };
    StoreService.prototype.decodeObject = function (s) {
        if (s == null) {
            return null;
        }
        return JSON.parse(utf8.decode(base64.decode(s)));
    };
    StoreService.prototype.encodeObject = function (o) {
        if (o == null) {
            return "null";
        }
        return "'" + base64.encode(utf8.encode(JSON.stringify(o))) + "'";
    };
    StoreService.prototype.init = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // allocate database
                        _a = this;
                        return [4 /*yield*/, (new sqlite(name))];
                    case 1:
                        // allocate database
                        _a.database = _b.sent();
                        // create app table
                        return [4 /*yield*/, this.createAppTable()];
                    case 2:
                        // create app table
                        _b.sent();
                        return [4 /*yield*/, this.initAppContext()];
                    case 3: 
                    // retrieve app context
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    StoreService.prototype.setAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // create tables for account id
                    return [4 /*yield*/, this.createConfigTable(id)];
                    case 1:
                        // create tables for account id
                        _a.sent();
                        return [4 /*yield*/, this.createLabelTable(id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.createAmigoTable(id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.createAmigoLabelTable(id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.createPendingTable(id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.createProfileTable(id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.createProfileLabelTable(id)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.createContactTable(id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.createShowTable(id)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.createShowLabelTable(id)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.createViewTable(id)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.createShareTable(id)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.initAppAccount(id)];
                    case 13: 
                    // retrieve app account
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StoreService.prototype.createAppTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists app (key text, value text, unique(key))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.initAppContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into app (key, value) values ('context', null)";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getAppContext()];
                }
            });
        });
    };
    StoreService.prototype.createConfigTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists config_" + id + " (key text, value text null, unique(key))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createLabelTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists label_" + id + " (label_id text, revision integer, name text, unique(label_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createAmigoTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists amigo_" + id + " (amigo_id text unique, revision integer, node text, registry text, name text, handle text, amigo text, identity_revision, attribute_revision integer, subject_revision integer, update_timestamp integer, amigo_error integer, attribute_error integer, subject_error integer, hide integer, app_identity text, app_attribute text, app_subject text, notes text, searchable text, unique(amigo_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createPendingTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists pending_" + id + " (share_id text unique, revision integer, message text, updated integer, app_share text)";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createAmigoLabelTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists amigolabel_" + id + " (label_id text, amigo_id text, unique (label_id, amigo_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createProfileTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists profile_" + id + " (attribute_id text, revision integer, schema text, data text, unique(attribute_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createProfileLabelTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists profilelabel_" + id + " (label_id text, attribute_id text, unique (label_id, attribute_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createContactTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists contact_" + id + " (amigo_id text, attribute_id text, revision integer, schema text, data text, unique(amigo_id, attribute_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createShowTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists show_" + id + " (subject_id text, revision integer, tag_revision integer, created integer, modified integer, expires integer, schema text, data text, tags text, tag_count integer, share integer, ready integer, assets text, originals text, app_subject text, searchable text, unique(subject_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createShowLabelTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists showlabel_" + id + " (label_id text, subject_id text, subject text, unique (label_id, subject_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createViewTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists view_" + id + " (amigo_id text, subject_id text, revision integer, tag_revision integer, created integer, modified integer, expires integer, schema text, data text, tags text, tag_count integer, hide integer, app_subject text, searchable text, unique(amigo_id, subject_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.createShareTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "create table if not exists share_" + id + " (amigo_id text, share_id text, revision integer, status text, token text, updated integer, app_share text, unique(amigo_id), unique(share_id))";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.initAppAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into app (key, value) values ('account_" + id + "', null)";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAppAccount(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StoreService.prototype.getAppContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select value from app where key='context'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, this.decodeObject(rows[0][0])];
                }
            });
        });
    };
    StoreService.prototype.setAppContext = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var data, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.encodeObject(obj);
                        cmd = "update app set value=" + data + " where key='context'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearAppContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update app set value=null where key='context'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getAppAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select value from app where key='account_" + id + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        if (rows.length == 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.decodeObject(rows[0][0])];
                }
            });
        });
    };
    StoreService.prototype.setAppAccount = function (id, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var data, insert, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.encodeObject(obj);
                        insert = "insert or ignore into app (key, value) values ('account_" + id + "', " + data + ")";
                        update = "update app set value=" + data + " where key='account_" + id + "'";
                        return [4 /*yield*/, this.database.execSQL(insert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.database.execSQL(update)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearAppAccount = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update app set value=null where key='account_" + id + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getAppProperty = function (id, key) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select value from app where key='prop_" + key + "_" + id + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        if (rows.length == 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.decodeObject(rows[0][0])];
                }
            });
        });
    };
    StoreService.prototype.setAppProperty = function (id, key, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var data, insert, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.encodeObject(obj);
                        insert = "insert or ignore into app (key, value) values ('prop_" + key + "_" + id + "', " + data + ")";
                        update = "update app set value=" + data + " where key='prop_" + key + "_" + id + "'";
                        return [4 /*yield*/, this.database.execSQL(insert)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.database.execSQL(update)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearAppProperty = function (id, key) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update app set value=null where key='prop_" + key + "_" + id + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // group module synchronization
    StoreService.prototype.getLabel = function (id, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, label, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select label_id, revision, name from label_" + id + " where label_id='" + labelId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        label = null;
                        for (i = 0; i < rows.length; i++) {
                            label = {
                                labelId: rows[i][0],
                                revision: rows[i][1],
                                name: this.decodeText(rows[i][2]),
                            };
                        }
                        return [2 /*return*/, label];
                }
            });
        });
    };
    StoreService.prototype.getLabels = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, labels, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select label_id, revision, name from label_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        labels = [];
                        for (i = 0; i < rows.length; i++) {
                            labels.push({
                                labelId: rows[i][0],
                                revision: rows[i][1],
                                name: this.decodeText(rows[i][2]),
                            });
                        }
                        return [2 /*return*/, labels];
                }
            });
        });
    };
    StoreService.prototype.getLabelViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select label_id, revision from label_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                labelId: rows[i][0],
                                revision: rows[i][1]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addLabel = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into label_" + id + " (label_id, revision, name) values ('" + entry.labelId + "', " + entry.revision + ", " + this.encodeText(entry.name) + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateLabel = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update label_" + id + " set name=" + this.encodeText(entry.name) + ", revision=" + entry.revision + " where label_id='" + entry.labelId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeLabel = function (id, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from label_" + id + " where label_id='" + labelId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // share module synchronization  
    StoreService.prototype.getConnections = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, shares, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_id, share_id, revision, status, token, updated from share_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        shares = [];
                        for (i = 0; i < rows.length; i++) {
                            shares.push({
                                amigoId: rows[i][0],
                                shareId: rows[i][1],
                                revision: rows[i][2],
                                status: rows[i][3],
                                token: rows[i][4],
                                updated: rows[i][5]
                            });
                        }
                        return [2 /*return*/, shares];
                }
            });
        });
    };
    StoreService.prototype.getConnectionViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select share_id, revision from share_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                shareId: rows[i][0],
                                revision: rows[i][1]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addConnection = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into share_" + id + " (amigo_id, share_id, revision, status, token, updated) values ('" + entry.amigoId + "', '" + entry.shareId + "', " + entry.revision + ", '" + entry.status + "', '" + entry.token + "', " + entry.updated + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateConnection = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update share_" + id + " set amigo_id='" + entry.amigoId + "', revision=" + entry.revision + ", status='" + entry.status + "', token='" + entry.token + "', updated=" + entry.updated + " where share_id='" + entry.shareId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeConnection = function (id, shareId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from share_" + id + " where share_id='" + shareId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // index module synchronization
    StoreService.prototype.getAmigo = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var label, labelRows, labels, i, entry, rows, amigo, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = "select label_id from amigolabel_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(label)];
                    case 1:
                        labelRows = _a.sent();
                        labels = [];
                        for (i = 0; i < labelRows.length; i++) {
                            labels.push(labelRows[i][0]);
                        }
                        entry = "select amigo_id, revision, notes from amigo_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(entry)];
                    case 2:
                        rows = _a.sent();
                        amigo = null;
                        for (i = 0; i < rows.length; i++) {
                            amigo = {
                                amigoId: rows[i][0],
                                revision: rows[i][1],
                                notes: this.decodeText(rows[i][2]),
                                labels: labels,
                            };
                        }
                        return [2 /*return*/, amigo];
                }
            });
        });
    };
    StoreService.prototype.getAmigos = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var label, labelRows, views, i, entry, rows, amigos, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = "select amigo_id, label_id from amigolabel_" + id;
                        return [4 /*yield*/, this.database.all(label)];
                    case 1:
                        labelRows = _a.sent();
                        views = new Map();
                        for (i = 0; i < labelRows.length; i++) {
                            if (views.has(labelRows[i][0])) {
                                views.get(labelRows[i][0]).push(labelRows[i][1]);
                            }
                            else {
                                views.set(labelRows[i][0], [labelRows[i][1]]);
                            }
                        }
                        entry = "select amigo_id, revision, notes from amigo_" + id;
                        return [4 /*yield*/, this.database.all(entry)];
                    case 2:
                        rows = _a.sent();
                        amigos = [];
                        for (i = 0; i < rows.length; i++) {
                            amigos.push({
                                amigoId: rows[i][0],
                                revision: rows[i][1],
                                notes: this.decodeText(rows[i][2]),
                                labels: views.has(rows[i][0]) ? views.get(rows[i][0]) : [],
                            });
                        }
                        return [2 /*return*/, amigos];
                }
            });
        });
    };
    StoreService.prototype.getAmigoViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_id, revision from amigo_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                amigoId: rows[i][0],
                                revision: rows[i][1]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addAmigo = function (id, amigoId, notes, revision) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into amigo_" + id + " (amigo_id, revision, hide, notes) values ('" + amigoId + "', " + revision + ", 0, " + this.encodeText(notes) + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateAmigo = function (id, amigoId, notes, revision) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update amigo_" + id + " set revision=" + revision + ", notes=" + this.encodeText(notes) + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeAmigo = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, label, share, contact, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from amigo_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        label = "delete from amigolabel_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(label)];
                    case 2:
                        _a.sent();
                        share = "delete from share_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(share)];
                    case 3:
                        _a.sent();
                        contact = "delete from contact_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(contact)];
                    case 4:
                        _a.sent();
                        view = "delete from view_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(view)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoLabel = function (id, amigoId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into amigolabel_" + id + " (amigo_id, label_id) values ('" + amigoId + "', '" + labelId + "')";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearAmigoLabels = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from amigolabel_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getPendingContacts = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, amigos, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select share_id, revision, updated, app_share from pending_" + id + " order by updated";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        amigos = [];
                        for (i = 0; i < rows.length; i++) {
                            amigos.push({
                                shareId: rows[i][0],
                                revision: rows[i][1],
                                updated: rows[i][2],
                                pendingData: this.decodeObject(rows[i][3]),
                            });
                        }
                        return [2 /*return*/, amigos];
                }
            });
        });
    };
    StoreService.prototype.getPendingViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, shares, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select share_id, revision from pending_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        shares = [];
                        for (i = 0; i < rows.length; i++) {
                            shares.push({ shareId: rows[i][0], revision: rows[i][1] });
                        }
                        return [2 /*return*/, shares];
                }
            });
        });
    };
    StoreService.prototype.getPending = function (id, shareId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, amigo, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select share_id, revision, message, updated from pending_" + id + " where share_id='" + shareId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        amigo = null;
                        for (i = 0; i < rows.length; i++) {
                            amigo = {
                                shareId: rows[i][0],
                                revision: rows[i][1],
                                message: this.decodeObject(rows[i][2]),
                                updated: rows[i][3],
                            };
                        }
                        return [2 /*return*/, amigo];
                }
            });
        });
    };
    StoreService.prototype.addPending = function (id, amigo) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into pending_" + id + " (share_id, message, revision, updated) values ('" + amigo.shareId + "', " + this.encodeObject(amigo.message) + ", " + amigo.revision + ", " + amigo.updated + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updatePending = function (id, shareId, amigo) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (shareId != amigo.shareId) {
                            throw new Error("unexpected request share id");
                        }
                        cmd = "update pending_" + id + " message=" + this.encodeObject(amigo.message) + ", revision=" + amigo.revision + ", updated=" + amigo.updated + " where share_id='" + amigo.shareId + "')";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removePending = function (id, shareId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from pending_" + id + " where share_id='" + shareId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // profile module synchronization
    StoreService.prototype.getAttributes = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var label, lows, views, i, cmd, rows, attributes, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = "select attribute_id, label_id from profilelabel_" + id;
                        return [4 /*yield*/, this.database.all(label)];
                    case 1:
                        lows = _a.sent();
                        views = new Map();
                        for (i = 0; i < lows.length; i++) {
                            if (views.has(lows[i][0])) {
                                views.get(lows[i][0]).push(lows[i][1]);
                            }
                            else {
                                views.set(lows[i][0], [lows[i][1]]);
                            }
                        }
                        cmd = "select attribute_id, revision, schema, data from profile_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 2:
                        rows = _a.sent();
                        attributes = [];
                        for (i = 0; i < rows.length; i++) {
                            attributes.push({
                                attribute: {
                                    attributeId: rows[i][0],
                                    revision: rows[i][1],
                                    schema: rows[i][2],
                                    data: this.decodeText(rows[i][3]),
                                },
                                labels: views.has(rows[i][0]) ? views.get(rows[i][0]) : [],
                            });
                        }
                        return [2 /*return*/, attributes];
                }
            });
        });
    };
    StoreService.prototype.getAttribute = function (id, attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            var label, lows, labels, i, cmd, rows, attribute, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = "select label_id from profilelabel_" + id + " where attribute_id='" + attributeId + "'";
                        return [4 /*yield*/, this.database.all(label)];
                    case 1:
                        lows = _a.sent();
                        labels = [];
                        for (i = 0; i < lows.length; i++) {
                            labels.push(lows[i][0]);
                        }
                        cmd = "select attribute_id, revision, schema, data from profile_" + id + " where attribute_id='" + attributeId + "'";
                        ;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 2:
                        rows = _a.sent();
                        attribute = null;
                        for (i = 0; i < rows.length; i++) {
                            attribute = {
                                attribute: {
                                    attributeId: rows[i][0],
                                    revision: rows[i][1],
                                    schema: rows[i][2],
                                    data: this.decodeText(rows[i][3]),
                                },
                                labels: labels,
                            };
                        }
                        return [2 /*return*/, attribute];
                }
            });
        });
    };
    StoreService.prototype.getAttributeViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select attribute_id, revision from profile_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                attributeId: rows[i][0],
                                revision: rows[i][1],
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addAttribute = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into profile_" + id + " (attribute_id, revision, schema, data) values ('" + entry.attributeId + "', " + entry.revision + ", '" + entry.schema + "', " + this.encodeText(entry.data) + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateAttribute = function (id, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update profile_" + id + " set revision=" + entry.revision + ", schema='" + entry.schema + "', data=" + this.encodeText(entry.data) + " where attribute_id='" + entry.attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeAttribute = function (id, attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from profile_" + id + " where attribute_id='" + attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        view = "delete from profilelabel_" + id + " where attribute_id='" + attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(view)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAttributeLabel = function (id, attributeId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into profilelabel_" + id + " (attribute_id, label_id) values ('" + attributeId + "', '" + labelId + "')";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearAttributeLabels = function (id, attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from profilelabel_" + id + " where attribute_id='" + attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // show module synchronization
    StoreService.prototype.getSubject = function (id, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var vmd, vows, labels, i, cmd, rows, subject, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vmd = "select label_id from showlabel_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.all(vmd)];
                    case 1:
                        vows = _a.sent();
                        labels = [];
                        for (i = 0; i < vows.length; i++) {
                            labels.push(vows[i][0]);
                        }
                        cmd = "select subject_id, revision, created, modified, expires, schema, data, share, ready, assets, originals from show_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 2:
                        rows = _a.sent();
                        subject = null;
                        for (i = 0; i < rows.length; i++) {
                            subject = {
                                subject: {
                                    subjectId: rows[i][0],
                                    revision: rows[i][1],
                                    created: rows[i][2],
                                    modified: rows[i][3],
                                    expires: rows[i][4],
                                    schema: rows[i][5],
                                    data: this.decodeText(rows[i][6])
                                },
                                share: rows[i][7] == 0 ? false : true,
                                ready: rows[i][8] == 0 ? false : true,
                                assets: this.decodeObject(rows[i][9]),
                                originals: this.decodeObject(rows[i][10]),
                                labels: labels,
                            };
                        }
                        return [2 /*return*/, subject];
                }
            });
        });
    };
    StoreService.prototype.getSubjects = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var vmd, vows, views, i, cmd, rows, subjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vmd = "select subject_id, label_id from showlabel_" + id;
                        return [4 /*yield*/, this.database.all(vmd)];
                    case 1:
                        vows = _a.sent();
                        views = new Map();
                        for (i = 0; i < vows.length; i++) {
                            if (views.has(vows[i][0])) {
                                views.get(vows[i][0]).push(vows[i][1]);
                            }
                            else {
                                views.set(vows[i][0], [vows[i][1]]);
                            }
                        }
                        cmd = "select subject_id, revision, created, modified, expires, schema, data, share, ready, assets, originals from show_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 2:
                        rows = _a.sent();
                        subjects = [];
                        for (i = 0; i < rows.length; i++) {
                            subjects.push({
                                subject: {
                                    subjectId: rows[i][0],
                                    revision: rows[i][1],
                                    created: rows[i][2],
                                    modified: rows[i][3],
                                    expires: rows[i][4],
                                    schema: rows[i][5],
                                    data: this.decodeText(rows[i][6])
                                },
                                share: rows[i][7],
                                ready: rows[i][8],
                                assets: this.decodeObject(rows[i][9]),
                                originals: this.decodeObject(rows[i][10]),
                                labels: views.has(rows[i][0]) ? views.get(rows[i][0]) : [],
                            });
                        }
                        return [2 /*return*/, subjects];
                }
            });
        });
    };
    StoreService.prototype.getSubjectViews = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select subject_id, revision, tag_revision from show_" + id;
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                subjectId: rows[i][0],
                                revision: rows[i][1],
                                tagRevision: rows[i][2]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addSubject = function (id, entry, searchable) {
        return __awaiter(this, void 0, void 0, function () {
            var search, r, s, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = "";
                        if (entry != null && searchable != null) {
                            search = searchable(entry.subject);
                            search = search.replace(/'/g, ' ');
                            search = search.replace(/"/g, ' ');
                        }
                        r = entry.ready ? 1 : 0;
                        s = entry.share ? 1 : 0;
                        cmd = "insert or ignore into show_" + id + " (subject_id, revision, created, modified, expires, schema, searchable, data, share, ready, assets, originals, tag_revision, tag_count) values ('" + entry.subject.subjectId + "', " + entry.subject.revision + ", " + entry.subject.created + ", " + entry.subject.modified + ", " + entry.subject.expires + ", '" + entry.subject.schema + "', '" + search + "', " + this.encodeText(entry.subject.data) + ", " + s + ", " + r + ", " + this.encodeObject(entry.assets) + ", " + this.encodeObject(entry.originals) + ", 0, 0)";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateSubject = function (id, entry, searchable) {
        return __awaiter(this, void 0, void 0, function () {
            var search, r, s, cmd, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = "";
                        if (entry != null && searchable != null) {
                            search = searchable(entry.subject);
                            search = search.replace(/'/g, ' ');
                            search = search.replace(/"/g, ' ');
                        }
                        r = entry.ready ? 1 : 0;
                        s = entry.share ? 1 : 0;
                        cmd = "update show_" + id + " set revision=" + entry.subject.revision + ", created=" + entry.subject.created + ", modified=" + entry.subject.modified + ", expires=" + entry.subject.expires + ", ready=" + r + ", share=" + s + ", schema='" + entry.subject.schema + "', searchable='" + search + "', data=" + this.encodeText(entry.subject.data) + ", assets=" + this.encodeObject(entry.assets) + ", originals=" + this.encodeObject(entry.originals) + " where subject_id='" + entry.subject.subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clearSubjectLabels(id, entry.subject.subjectId)];
                    case 2:
                        _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < entry.labels.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.setSubjectLabel(id, entry.subject.subjectId, entry.labels[i])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateAmigoSubjectTags = function (id, amigoId, subjectId, revision, tags) {
        return __awaiter(this, void 0, void 0, function () {
            var count, t, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (tags == null) {
                            count = 0;
                        }
                        else {
                            count = tags.length;
                        }
                        t = this.encodeObject(tags);
                        cmd = "update view_" + id + " set tag_revision=" + revision + ", tag_count=" + count + ", tags=" + t + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateSubjectTags = function (id, subjectId, revision, tags) {
        return __awaiter(this, void 0, void 0, function () {
            var count, t, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        count = 0;
                        if (tags == null) {
                            count = 0;
                        }
                        else {
                            count = tags.length;
                        }
                        t = this.encodeObject(tags);
                        cmd = "update show_" + id + " set tag_revision=" + revision + ", tag_count=" + count + ", tags=" + t + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getAmigoSubjectTags = function (id, amigoId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, tags, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select tags from view_" + id + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        tags = [];
                        for (i = 0; i < rows.length; i++) {
                            tags = this.decodeObject(rows[i][0]);
                        }
                        return [2 /*return*/, tags];
                }
            });
        });
    };
    StoreService.prototype.getSubjectTags = function (id, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, tags, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select tags from show_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        tags = [];
                        for (i = 0; i < rows.length; i++) {
                            tags = this.decodeObject(rows[i][0]);
                        }
                        return [2 /*return*/, tags];
                }
            });
        });
    };
    StoreService.prototype.removeSubject = function (id, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from show_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        view = "delete from showlabel_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(view)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setSubjectLabel = function (id, subjectId, labelId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into showlabel_" + id + " (subject_id, label_id) values ('" + subjectId + "', '" + labelId + "')";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.clearSubjectLabels = function (id, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from showlabel_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // contact synchronization
    StoreService.prototype.getAmigoUpdate = function (id, amigo) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, update, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_" + id + ".amigo_id, node, registry, amigo_" + id + ".identity_revision, attribute_revision, subject_revision, status, token from amigo_" + id + " left outer join share_" + id + " on amigo_" + id + ".amigo_id = share_" + id + ".amigo_id where amigo_" + id + ".amigo_id='" + amigo + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        update = null;
                        for (i = 0; i < rows.length; i++) {
                            update = {
                                amigoId: rows[i][0],
                                node: rows[i][1],
                                registry: rows[i][2],
                                identityRevision: rows[i][3],
                                attributeRevision: rows[i][4],
                                subjectRevision: rows[i][5],
                                shareStatus: rows[i][6],
                                token: rows[i][7]
                            };
                        }
                        return [2 /*return*/, update];
                }
            });
        });
    };
    StoreService.prototype.getAmigoUpdates = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, updates, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_" + id + ".amigo_id, node, registry, amigo_" + id + ".identity_revision, attribute_revision, subject_revision, status, token from amigo_" + id + " left outer join share_" + id + " on amigo_" + id + ".amigo_id = share_" + id + ".amigo_id";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        updates = [];
                        for (i = 0; i < rows.length; i++) {
                            updates.push({
                                amigoId: rows[i][0],
                                node: rows[i][1],
                                registry: rows[i][2],
                                identityRevision: rows[i][3],
                                attributeRevision: rows[i][4],
                                subjectRevision: rows[i][5],
                                shareStatus: rows[i][6],
                                token: rows[i][7]
                            });
                        }
                        return [2 /*return*/, updates];
                }
            });
        });
    };
    StoreService.prototype.getStaleAmigos = function (id, stale) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, updates, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_" + id + ".amigo_id, node, registry, amigo_" + id + ".revision, attribute_revision, subject_revision, status, token from amigo_" + id + " left outer join share_" + id + " on amigo_" + id + ".amigo_id = share_" + id + ".amigo_id where update_timestamp is null or update_timestamp < " + stale + " order by update_timestamp asc";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        updates = [];
                        for (i = 0; i < rows.length; i++) {
                            updates.push({
                                amigoId: rows[i][0],
                                node: rows[i][1],
                                registry: rows[i][2],
                                identityRevision: rows[i][3],
                                attributeRevision: rows[i][4],
                                subjectRevision: rows[i][5],
                                shareStatus: rows[i][6],
                                token: rows[i][7]
                            });
                        }
                        return [2 /*return*/, updates];
                }
            });
        });
    };
    StoreService.prototype.getAmigoIdentity = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, amigo, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo from amigo_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        amigo = null;
                        for (i = 0; i < rows.length; i++) {
                            amigo = this.decodeObject(rows[i][0]);
                        }
                        return [2 /*return*/, amigo];
                }
            });
        });
    };
    StoreService.prototype.setAmigoIdentity = function (id, amigoId, amigo, searchableAmigo) {
        return __awaiter(this, void 0, void 0, function () {
            var search, u, h, v, n, r, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = "";
                        if (searchableAmigo != null) {
                            search = searchableAmigo(amigo);
                        }
                        // sanity check
                        if (amigo.amigoId == null || amigo.amigoId != amigoId) {
                            throw new Error("invalid amigo id");
                        }
                        u = "null";
                        if (amigo != null && amigo.name != null) {
                            u = "'" + amigo.name.replace(/["',]/g, " ") + "'";
                        }
                        h = "null";
                        if (amigo != null && amigo.handle != null) {
                            h = "'" + amigo.handle.replace(/["',]/g, " ") + "'";
                        }
                        v = "null";
                        if (amigo != null && amigo.revision != null) {
                            v = amigo.revision.toString();
                        }
                        n = "null";
                        if (amigo != null && amigo.node != null) {
                            n = "'" + amigo.node.replace(/["',]/g, " ") + "'";
                        }
                        r = "null";
                        if (amigo != null && amigo.registry != null) {
                            r = "'" + amigo.registry.replace(/["',]/g, " ") + "'";
                        }
                        cmd = "update amigo_" + id + " set identity_revision=" + v + ", node=" + n + ", registry=" + r + ", name=" + u + ", handle=" + h + ", searchable='" + search + "', amigo=" + this.encodeObject(amigo) + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getAmigoShare = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, share, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_id, share_id, revision, status, token, updated from share_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        share = null;
                        for (i = 0; i < rows.length; i++) {
                            share = {
                                amigoId: rows[i][0],
                                shareId: rows[i][1],
                                revision: rows[i][2],
                                status: rows[i][3],
                                token: rows[i][4],
                                updated: rows[i][5]
                            };
                        }
                        return [2 /*return*/, share];
                }
            });
        });
    };
    StoreService.prototype.getAmigoAttributes = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, attributes, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select attribute_id, revision, schema, data from contact_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        attributes = [];
                        for (i = 0; i < rows.length; i++) {
                            attributes.push({
                                attributeId: rows[i][0],
                                revision: rows[i][1],
                                schema: rows[i][2],
                                data: this.decodeText(rows[i][3])
                            });
                        }
                        return [2 /*return*/, attributes];
                }
            });
        });
    };
    StoreService.prototype.getAmigoAttributeViews = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select attribute_id, revision from contact_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                attributeId: rows[i][0],
                                revision: rows[i][1]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addAmigoAttribute = function (id, amigoId, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "insert or ignore into contact_" + id + " (amigo_id, attribute_id, revision, schema, data) values ('" + amigoId + "', '" + entry.attributeId + "', " + entry.revision + ", '" + entry.schema + "', " + this.encodeText(entry.data) + ")";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateAmigoAttribute = function (id, amigoId, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update contact_" + id + " set revision=" + entry.revision + ", schema='" + entry.schema + "', data=" + this.encodeText(entry.data) + " where amigo_id='" + amigoId + "' and attribute_id='" + entry.attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeAmigoAttribute = function (id, amigoId, attributeId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from contact_" + id + " where amigo_id='" + amigoId + "' and attribute_id='" + attributeId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoAttributeRevision = function (id, amigoId, revision) {
        return __awaiter(this, void 0, void 0, function () {
            var r, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (revision == null) {
                            r = "null";
                        }
                        else {
                            r = revision.toString();
                        }
                        cmd = "update amigo_" + id + " set attribute_revision=" + r + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.getAmigoSubject = function (id, amigoId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, subject, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select subject_id, revision, created, modified, expires, schema, data from contact_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subject = null;
                        for (i = 0; i < rows.length; i++) {
                            subject = {
                                subjectId: rows[i][0],
                                revision: rows[i][1],
                                created: rows[i][2],
                                modified: rows[i][3],
                                expires: rows[i][4],
                                schema: rows[i][5],
                                data: this.decodeText(rows[i][6])
                            };
                        }
                        return [2 /*return*/, subject];
                }
            });
        });
    };
    StoreService.prototype.getAmigoSubjects = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, subjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select subject_id, revision, created, modified, expires, schema, data from contact_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subjects = [];
                        for (i = 0; i < rows.length; i++) {
                            subjects.push({
                                subjectId: rows[i][0],
                                revision: rows[i][1],
                                created: rows[i][2],
                                modified: rows[i][3],
                                expires: rows[i][4],
                                schema: rows[i][5],
                                data: this.decodeText(rows[i][6])
                            });
                        }
                        return [2 /*return*/, subjects];
                }
            });
        });
    };
    StoreService.prototype.getAmigoSubjectViews = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, revisions, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select subject_id, revision, tag_revision from view_" + id + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        revisions = [];
                        for (i = 0; i < rows.length; i++) {
                            revisions.push({
                                subjectId: rows[i][0],
                                revision: rows[i][1],
                                tagRevision: rows[i][2]
                            });
                        }
                        return [2 /*return*/, revisions];
                }
            });
        });
    };
    StoreService.prototype.addAmigoSubject = function (id, amigoId, entry, searchable) {
        return __awaiter(this, void 0, void 0, function () {
            var search, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = "";
                        if (entry != null && searchable != null) {
                            search = searchable(entry).replace(/["',]/g, " ");
                        }
                        cmd = "insert or ignore into view_" + id + " (amigo_id, subject_id, revision, created, modified, expires, schema, searchable, data, hide, tag_revision, tag_count) values ('" + amigoId + "', '" + entry.subjectId + "', " + entry.revision + ", " + entry.created + ", " + entry.modified + ", " + entry.expires + ", '" + entry.schema + "', '" + search + "', " + this.encodeText(entry.data) + ", 0, 0, 0)";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.updateAmigoSubject = function (id, amigoId, entry, searchable) {
        return __awaiter(this, void 0, void 0, function () {
            var search, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = "";
                        if (entry != null && searchable != null) {
                            search = searchable(entry).replace(/["',]/g, " ");
                        }
                        cmd = "update view_" + id + " set revision=" + entry.revision + ", created=" + entry.created + ", modified=" + entry.modified + ", expires=" + entry.expires + ", schema='" + entry.schema + "', searchable='" + search + "', data=" + this.encodeText(entry.data) + " where amigo_id='" + amigoId + "' and subject_id='" + entry.subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.removeAmigoSubject = function (id, amigoId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "delete from view_" + id + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoSubjectRevision = function (id, amigoId, revision) {
        return __awaiter(this, void 0, void 0, function () {
            var r, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (revision == null) {
                            r = "null";
                        }
                        else {
                            r = revision.toString();
                        }
                        cmd = "update amigo_" + id + " set subject_revision=" + r + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoUpdateTimestamp = function (id, amigoId, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update amigo_" + id + " set update_timestamp=" + timestamp + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // app customizations
    StoreService.prototype.setAmigoFeed = function (id, amigoId, hide) {
        return __awaiter(this, void 0, void 0, function () {
            var h, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        h = hide ? 1 : 0;
                        cmd = "update amigo_" + id + " set hide=" + h + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoIdentitySearchable = function (id, amigoId, str) {
        return __awaiter(this, void 0, void 0, function () {
            var s, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (str == null) {
                            s = "null";
                        }
                        else {
                            s = "'" + str.replace(/["',]/g, " ") + "'";
                        }
                        cmd = "update amigo_" + id + " set searchable=" + s + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoIdentityData = function (id, amigoId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update amigo_" + id + " set app_identity=" + this.encodeObject(obj) + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setShareData = function (id, shareId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update share_" + id + " set app_share=" + this.encodeObject(obj) + " where share_id='" + shareId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setPendingData = function (id, shareId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update pending_" + id + " set app_share=" + this.encodeObject(obj) + " where share_id='" + shareId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoAttributeData = function (id, amigoId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update amigo_" + id + " set app_attribute=" + this.encodeObject(obj) + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setAmigoSubjectData = function (id, amigoId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update amigo_" + id + " set app_subject=" + this.encodeObject(obj) + " where amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setShowSubjectData = function (id, subjectId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update show_" + id + " set app_subject=" + this.encodeObject(obj) + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setShowSubjectSearchable = function (id, subjectId, str) {
        return __awaiter(this, void 0, void 0, function () {
            var s, cmd;
            return __generator(this, function (_a) {
                if (str == null) {
                    s = "null";
                }
                else {
                    s = "'" + str.replace(/["',]/g, " ") + "'";
                }
                cmd = "update view_" + id + " set searchable=" + s + " where subject_id='" + subjectId + "'";
                return [2 /*return*/];
            });
        });
    };
    StoreService.prototype.setViewSubjectFeed = function (id, amigoId, subjectId, hide) {
        return __awaiter(this, void 0, void 0, function () {
            var h, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        h = hide ? 1 : 0;
                        cmd = "update view_" + id + " set hide=" + h + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setViewSubjectData = function (id, amigoId, subjectId, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "update view_" + id + " set app_subject=" + this.encodeObject(obj) + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.execSQL(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StoreService.prototype.setViewSubjectSearchable = function (id, amigoId, subjectId, str) {
        return __awaiter(this, void 0, void 0, function () {
            var s, cmd;
            return __generator(this, function (_a) {
                if (str == null) {
                    s = "null";
                }
                else {
                    s = "'" + str.replace(/["',]/g, " ") + "'";
                }
                cmd = "update view_" + id + " set searchable=" + s + " where amigo_id='" + amigoId + "' and subject_id='" + subjectId + "'";
                return [2 /*return*/];
            });
        });
    };
    // aggregate entities
    StoreService.prototype.getContacts = function (id, label, search, status, hidden) {
        return __awaiter(this, void 0, void 0, function () {
            var s, c, h, cmd, rows, contacts, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (search == null) {
                            s = null;
                        }
                        else {
                            s = "'%" + search.replace(/["'%,]/g, "") + "%'";
                        }
                        if (status == null) {
                            c = null;
                        }
                        else {
                            c = "'" + status.replace(/["'%,]/g, "") + "'";
                        }
                        h = "";
                        if (hidden != null) {
                            if (hidden) {
                                h = " and hide = 1";
                            }
                            else {
                                h = " and hide = 0";
                            }
                        }
                        if (c == null && label == null && s == null && hidden == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c == null && label == null && s == null && hidden != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id" + " where hide = " + (hidden ? "1" : "0") + " order by name asc";
                        }
                        if (c == null && label != null && label != "" && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " inner join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and searchable like " + s + h + " group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c == null && label != null && label == "" && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id is null and searchable like " + s + h + " group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c == null && label == null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where searchable like " + s + h + " order by name asc";
                        }
                        if (c == null && label != null && label != "" && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " inner join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + h + "' group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c == null && label != null && label == "" && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id is null" + h + " group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c != null && label == null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where status=" + c + h + " order by name asc";
                        }
                        if (c != null && label != null && label != "" && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " inner join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and status=" + c + " and searchable like " + s + h + " group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c != null && label != null && label == "" && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id is null and and status=" + c + " and searchable like " + s + h + " group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c != null && label == null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where status=" + c + " and searchable like " + s + h + " order by name asc";
                        }
                        if (c != null && label != null && label != "" && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " inner join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where status=" + c + " and label_id='" + label + h + "' group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        if (c != null && label != null && label == "" && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where status=" + c + h + " and label_id is null group by amigo_" + id + ".amigo_id order by name asc";
                        }
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        contacts = [];
                        for (i = 0; i < rows.length; i++) {
                            contacts.push({
                                amigoId: rows[i][0],
                                name: rows[i][1],
                                handle: rows[i][2],
                                node: rows[i][3],
                                registry: rows[i][4],
                                identityRevision: rows[i][5],
                                attributeRevision: rows[i][6],
                                identityData: this.decodeObject(rows[i][7]),
                                attributeData: this.decodeObject(rows[i][8]),
                                status: rows[i][9],
                                hidden: rows[i][10] == 1 ? true : false,
                                shareId: rows[i][11],
                                shareRevision: rows[i][12],
                                shareData: this.decodeObject(rows[i][13]),
                                updated: rows[i][14],
                            });
                        }
                        return [2 /*return*/, contacts];
                }
            });
        });
    };
    StoreService.prototype.getContact = function (id, amigoId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, contact, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select amigo_" + id + ".amigo_id, name, handle, node, registry, amigo_" + id + ".identity_revision, attribute_revision, app_identity, app_attribute, status, hide, share_id, share_" + id + ".revision, app_share, share_" + id + ".updated from amigo_" + id + " left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where amigo_" + id + ".amigo_id='" + amigoId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        contact = null;
                        for (i = 0; i < rows.length; i++) {
                            contact = {
                                amigoId: rows[i][0],
                                name: rows[i][1],
                                handle: rows[i][2],
                                node: rows[i][3],
                                registry: rows[i][4],
                                identityRevision: rows[i][5],
                                attributeRevision: rows[i][6],
                                identityData: this.decodeObject(rows[i][7]),
                                attributeData: this.decodeObject(rows[i][8]),
                                status: rows[i][9],
                                hidden: rows[i][10] == 1 ? true : false,
                                shareId: rows[i][11],
                                shareRevision: rows[i][12],
                                shareData: this.decodeObject(rows[i][13]),
                                updated: rows[i][14],
                            };
                        }
                        return [2 /*return*/, contact];
                }
            });
        });
    };
    StoreService.prototype.getSubjectFeed = function (id, label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var s, l, cmd, rows, subjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (search == null) {
                            s = null;
                        }
                        else {
                            s = "'%" + search.replace(/["'%,]/g, "") + "%'";
                        }
                        l = "";
                        if (limit != null) {
                            l = " limit " + limit;
                        }
                        if (label == null && s == null) {
                            cmd = "select subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " order by modified desc" + l;
                        }
                        if (label == null && s != null) {
                            cmd = "select subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " where show_" + id + ".searchable like " + s + " order by modified desc" + l;
                        }
                        if (label != null && label == '' && s == null) {
                            cmd = "select show_" + id + ".subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " left outer join showlabel_" + id + " on show_" + id + ".subject_id = showlabel_" + id + ".subject_id where label_id is null order by modified desc" + l;
                        }
                        if (label != null && label != '' && s == null) {
                            cmd = "select show_" + id + ".subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " left outer join showlabel_" + id + " on show_" + id + ".subject_id = showlabel_" + id + ".subject_id where label_id='" + label + "' order by modified desc" + l;
                        }
                        if (label != null && label == '' && s != null) {
                            cmd = "select show_" + id + ".subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " left outer join showlabel_" + id + " on show_" + id + ".subject_id = showlabel_" + id + ".subject_id where label_id is null and show_" + id + ".searchable like " + s + " order by modified desc" + l;
                        }
                        if (label != null && label != '' && s != null) {
                            cmd = "select show_" + id + ".subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " left outer join showlabel_" + id + " on show_" + id + ".subject_id = showlabel_" + id + ".subject_id where label_id='" + label + "' and show_" + id + ".searchable like " + s + " order by modified desc" + l;
                        }
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subjects = [];
                        for (i = 0; i < rows.length; i++) {
                            subjects.push({
                                subjectId: rows[i][0],
                                created: rows[i][1],
                                modified: rows[i][2],
                                expires: rows[i][3],
                                schema: rows[i][4],
                                data: this.decodeText(rows[i][5]),
                                revision: rows[i][6],
                                appData: this.decodeObject(rows[i][7]),
                                assets: this.decodeObject(rows[i][8]),
                                originals: this.decodeObject(rows[i][9]),
                                ready: rows[i][10] >= 1 ? true : false,
                                share: rows[i][11] >= 1 ? true : false,
                                tagCount: rows[i][12]
                            });
                        }
                        return [2 /*return*/, subjects];
                }
            });
        });
    };
    StoreService.prototype.getFeedSubjectEntry = function (id, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, rows, subject, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "select subject_id, created, modified, expires, schema, data, revision, app_subject, assets, originals, ready, share, tag_count from show_" + id + " where subject_id='" + subjectId + "'";
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subject = null;
                        for (i = 0; i < rows.length; i++) {
                            subject = {
                                subjectId: rows[i][0],
                                created: rows[i][1],
                                modified: rows[i][2],
                                expires: rows[i][3],
                                schema: rows[i][4],
                                data: this.decodeText(rows[i][5]),
                                revision: rows[i][6],
                                appData: this.decodeObject(rows[i][7]),
                                assets: this.decodeObject(rows[i][8]),
                                originals: this.decodeObject(rows[i][9]),
                                ready: rows[i][10] >= 1 ? true : false,
                                share: rows[i][11] >= 1 ? true : false,
                                tagCount: rows[i][12]
                            };
                        }
                        return [2 /*return*/, subject];
                }
            });
        });
    };
    StoreService.prototype.getHiddenFeed = function (id, label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var s, l, cmd, rows, subjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (search == null) {
                            s = null;
                        }
                        else {
                            s = "'%" + search.replace(/["'%,]/g, "") + "%'";
                        }
                        if (limit == null) {
                            l = "";
                        }
                        else {
                            l = " limit " + limit;
                        }
                        if (label == null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where view_" + id + ".hide=1 order by modified" + l;
                        }
                        if (label == null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where view_" + id + ".searchable like " + s + " and view_" + id + ".hide=1 order by modified" + l;
                        }
                        if (label != null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and view_" + id + ".hide=1 order by modified" + l;
                        }
                        if (label != null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and view_" + id + ".searchable like " + s + " and view_" + id + ".hide=1 order by modified" + l;
                        }
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subjects = [];
                        for (i = 0; i < rows.length; i++) {
                            subjects.push({
                                amigoId: rows[i][0],
                                name: rows[i][1],
                                handle: rows[i][2],
                                registry: rows[i][3],
                                node: rows[i][4],
                                token: rows[i][5],
                                subjectId: rows[i][6],
                                subjectRevision: rows[i][7],
                                created: rows[i][8],
                                modified: rows[i][9],
                                expires: rows[i][10],
                                schema: rows[i][11],
                                data: this.decodeText(rows[i][12]),
                                identityRevision: rows[i][13],
                                identityData: this.decodeObject(rows[i][14]),
                                subjectData: this.decodeObject(rows[i][15]),
                                tagCount: rows[i][16]
                            });
                        }
                        return [2 /*return*/, subjects];
                }
            });
        });
    };
    StoreService.prototype.getAmigoFeed = function (id, amigo, label, search, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var s, l, cmd, rows, subjects, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (search == null) {
                            s = null;
                        }
                        else {
                            s = "'%" + search.replace(/["'%,]/g, "") + "%'";
                        }
                        l = "";
                        if (limit != null) {
                            l = " limit " + limit;
                        }
                        if (amigo == null && label == null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo == null && label == null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where view_" + id + ".searchable like " + s + " and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo == null && label != null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo == null && label != null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and view_" + id + ".searchable like " + s + " and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo != null && label == null && s == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where amigo_" + id + ".amigo_id='" + amigo + "' and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo != null && label == null && s != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where amigo_" + id + ".amigo_id='" + amigo + "' and view_" + id + ".searchable like " + s + " and view_" + id + ".hide=0 amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo != null && label != null && search == null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and amigo_" + id + ".amigo_id = '" + amigo + "' and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        if (amigo != null && label != null && search != null) {
                            cmd = "select amigo_" + id + ".amigo_id, name, handle, registry, node, share_" + id + ".token, view_" + id + ".subject_id, view_" + id + ".revision, created, modified, expires, schema, data, amigo_" + id + ".identity_revision, app_identity, view_" + id + ".app_subject, tag_count from view_" + id + " inner join amigo_" + id + " on view_" + id + ".amigo_id = amigo_" + id + ".amigo_id left outer join amigolabel_" + id + " on amigo_" + id + ".amigo_id = amigolabel_" + id + ".amigo_id left outer join share_" + id + " on share_" + id + ".amigo_id = amigo_" + id + ".amigo_id where label_id='" + label + "' and amigo_" + id + ".amigo_id = '" + amigo + "' and view_" + id + ".searchable like " + s + " and view_" + id + ".hide=0 and amigo_" + id + ".hide=0 order by modified desc" + l;
                        }
                        return [4 /*yield*/, this.database.all(cmd)];
                    case 1:
                        rows = _a.sent();
                        subjects = [];
                        for (i = 0; i < rows.length; i++) {
                            subjects.push({
                                amigoId: rows[i][0],
                                name: rows[i][1],
                                handle: rows[i][2],
                                registry: rows[i][3],
                                node: rows[i][4],
                                token: rows[i][5],
                                subjectId: rows[i][6],
                                subjectRevision: rows[i][7],
                                created: rows[i][8],
                                modified: rows[i][9],
                                expires: rows[i][10],
                                schema: rows[i][11],
                                data: this.decodeText(rows[i][12]),
                                identityRevision: rows[i][13],
                                identityData: this.decodeObject(rows[i][14]),
                                subjectData: this.decodeObject(rows[i][15]),
                                tagCount: rows[i][16]
                            });
                        }
                        return [2 /*return*/, subjects];
                }
            });
        });
    };
    StoreService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], StoreService);
    return StoreService;
}());
exports.StoreService = StoreService;
