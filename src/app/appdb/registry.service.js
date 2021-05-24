"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var RegistryService = /** @class */ (function () {
    function RegistryService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    RegistryService.prototype.getRevision = function (url, amigoId) {
        return this.httpClient.get(url + "/amigo/messages/revision?amigoId=" + amigoId, { headers: this.headers, observe: 'body' }).toPromise();
    };
    RegistryService.prototype.setMessage = function (url, msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // deliver amigo message
            _this.httpClient.post(url + "/amigo/messages", msg, { headers: _this.headers, observe: 'body' }).toPromise().then(function () {
                resolve();
            }).catch(function (err) {
                console.log("RegistryService.setMessage failed");
                reject();
            });
        });
    };
    RegistryService.prototype.getAmigoId = function (url, handle) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.httpClient.get(url + "/amigo/id?handle=" + handle, { headers: _this.headers, observe: 'body', responseType: 'text' }).toPromise().then(function (r) {
                resolve(r);
            }).catch(function (err) {
                console.log("RegistryService.getAmigoId failed");
                reject();
            });
        });
    };
    RegistryService.prototype.checkHandle = function (url, handle, amigoId) {
        var _this = this;
        if (amigoId === void 0) { amigoId = null; }
        return new Promise(function (resolve, reject) {
            if (amigoId != null) {
                _this.httpClient.get(url + "/amigo/status?handle=" + encodeURI(handle) + "&amigoId=" + amigoId, { headers: _this.headers, observe: 'body', responseType: 'json' }).toPromise().then(function (r) {
                    resolve(r.boolValue);
                }).catch(function (err) {
                    console.log("RegistryService.checkHandle failed");
                    reject();
                });
            }
            else {
                _this.httpClient.get(url + "/amigo/status?handle=" + encodeURI(handle), { headers: _this.headers, observe: 'body', responseType: 'json' }).toPromise().then(function (r) {
                    resolve(r.boolValue);
                }).catch(function (err) {
                    console.log("RegistryService.checkHandle failed");
                    reject();
                });
            }
        });
    };
    RegistryService.prototype.getPassCode = function (url, amigoId, password) {
        return this.httpClient.put(url + "/account/passcode?amigoId=" + amigoId + "&password=" + encodeURI(password), { headers: this.headers, observe: 'body' }).toPromise();
    };
    RegistryService.prototype.getLogoUrl = function (url, amigoId, revision) {
        return url + "/amigo/messages/logo?amigoId=" + amigoId + "&revision=" + revision;
    };
    RegistryService.prototype.getMessage = function (url, amigoId) {
        return this.httpClient.get(url + "/amigo/messages/?amigoId=" + amigoId, { headers: this.headers, observe: 'body' }).toPromise();
    };
    RegistryService.prototype.getIdentity = function (url, handle) {
        return this.httpClient.get(url + "/amigo/messages/?handle=" + handle, { headers: this.headers, observe: 'body' }).toPromise();
    };
    RegistryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], RegistryService);
    return RegistryService;
}());
exports.RegistryService = RegistryService;
