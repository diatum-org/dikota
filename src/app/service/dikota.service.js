"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var amigo_service_1 = require("../appdb/amigo.service");
var app_settings_1 = require("../app.settings");
var DikotaService = /** @class */ (function () {
    function DikotaService(httpClient, amigoService) {
        this.httpClient = httpClient;
        this.amigoService = amigoService;
        this.syncInterval = null;
        this.syncRevision = null;
        this.identity = null;
        this.sub = null;
        this.SEMI_SECRET = "92a41a31a209ce961e279e54592199be";
        this.headers = new http_1.HttpHeaders();
        this.headers = this.headers.set('Accept', 'application/json');
        this.pnf = require('google-libphonenumber').PhoneNumberFormat;
        this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    }
    DikotaService.prototype.getE164 = function (phone) {
        try {
            var num = this.phoneUtil.parse(phone, 'US');
            return this.phoneUtil.format(num, this.pnf.E164);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    };
    DikotaService.prototype.getRFC5322 = function (email) {
        var at = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (at.test(email)) {
            return email;
        }
        else {
            return null;
        }
    };
    DikotaService.prototype.report = function (amigoId) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/accounts/amigos/" + amigoId + "/flag?token=" + this.token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.attach = function (amigoId, node, code) {
        return this.httpClient.post(app_settings_1.AppSettings.AMIGO + "/accounts/attached?amigoId=" + amigoId
            + "&node=" + node + "&code=" + code, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.createAccount = function (phone, email, password) {
        var e = "";
        if (email != null) {
            e = "&emailAddress=" + email;
        }
        var p = "";
        if (phone != null) {
            p = "&phoneNumber=" + phone.replace(/\+/g, "%2B");
        }
        // construct auth
        var d = new Date();
        var t = Math.floor(d.getTime() / 1000);
        var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
        var auth = SHA256(this.SEMI_SECRET + ":" + t);
        return this.httpClient.post(app_settings_1.AppSettings.AMIGO + "/accounts/created?password=" + password + e + p + "&timestamp=" + t + "&auth=" + auth, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setToken = function (token) {
        var _this = this;
        this.clearToken();
        this.token = token;
        this.syncRevision = null;
        this.syncInterval = setInterval(function () {
            _this.syncChanges();
        }, 1000);
        this.sub = this.amigoService.identity.subscribe(function (i) {
            _this.identity = i;
        });
    };
    DikotaService.prototype.clearToken = function () {
        this.token = null;
        if (this.syncInterval != null) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        if (this.sub != null) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    };
    DikotaService.prototype.updatePassword = function (password, update) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/password?token=" + this.token + "&password=" + password + "&update=" + update, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.getIdentityRevision = function () {
        return this.httpClient.get(app_settings_1.AppSettings.AMIGO + "/accounts/revision?token=" + this.token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.getProfileRevision = function () {
        return this.httpClient.get(app_settings_1.AppSettings.AMIGO + "/profile/revision?token=" + this.token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.getProfile = function () {
        return this.httpClient.get(app_settings_1.AppSettings.AMIGO + "/profile/all?token=" + this.token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setRegistry = function (registry, revision) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // trigger amigo update
            _this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/accounts/registry?token=" + _this.token + "&registry=" + registry + "&revision=" + revision, { headers: _this.headers, observe: 'body' }).toPromise().then(function (e) {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    DikotaService.prototype.setAvailable = function (flag) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/available?token=" + this.token + "&flag=" + flag, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setSearchable = function (flag) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/searchable?token=" + this.token + "&flag=" + flag, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.confirm = function () {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/confirm?token=" + this.token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setPhoneNumber = function (phone) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/phone?token=" + this.token + "&phoneNumber=" +
            phone.replace(/\+/g, "%2B"), { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setEmailAddress = function (email) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/email?token=" + this.token + "&emailAddress=" +
            email, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.setLocation = function (gps) {
        return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/location?token=" + this.token, gps, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.reset = function (email, phone) {
        if (email != null) {
            return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/reset?emailAddress=" + email, { headers: this.headers, observe: 'body' }).toPromise();
        }
        else {
            return this.httpClient.put(app_settings_1.AppSettings.AMIGO + "/profile/reset?phoneNumber=" + phone.replace(/\+/g, "%2B"), { headers: this.headers, observe: 'body' }).toPromise();
        }
    };
    DikotaService.prototype.search = function (match) {
        return this.httpClient.get(app_settings_1.AppSettings.AMIGO + "/search/accounts?token=" + this.token + "&limit=32&match=" + match, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.scan = function (area) {
        return this.httpClient.post(app_settings_1.AppSettings.AMIGO + "/search/accounts?token=" + this.token + "&limit=32", area, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.contact = function (email, phone) {
        var params = "";
        if (email != null) {
            if (params == "") {
                params += "?";
            }
            else {
                params += "&";
            }
            params += "emailAddress=" + email;
        }
        if (phone != null) {
            if (params == "") {
                params += "?";
            }
            else {
                params += "&";
            }
            params += "phoneNumber=" + phone.replace(/\+/g, "%2B");
        }
        if (this.token != null) {
            if (params == "") {
                params += "?";
            }
            else {
                params += "&";
            }
            params += "token=" + this.token;
        }
        return this.httpClient.post(app_settings_1.AppSettings.AMIGO + "/accounts/contact" + params, { headers: this.headers, observe: 'body' }).toPromise();
    };
    DikotaService.prototype.syncChanges = function () {
        var _this = this;
        if (this.identity != null && this.syncRevision != this.identity.revision) {
            this.getIdentityRevision().then(function (r) {
                if (r != _this.identity.revision) {
                    _this.setRegistry(_this.identity.registry, _this.identity.revision).then(function () {
                        _this.syncRevision = _this.identity.revision;
                    }).catch(function (err) {
                        console.log("DikotaService.setRegistry failed");
                    });
                }
                else {
                    _this.syncRevision = r;
                }
            }).catch(function (err) {
                console.log("DikotaService.getIdentityRevision failed");
            });
        }
    };
    DikotaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            amigo_service_1.AmigoService])
    ], DikotaService);
    return DikotaService;
}());
exports.DikotaService = DikotaService;
