"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var IdentityService = /** @class */ (function () {
    function IdentityService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    IdentityService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/identity/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.getAmigo = function (url, token) {
        return this.httpClient.get(url + "/identity?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.getMessage = function (url, token) {
        return this.httpClient.get(url + "/identity/message?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.setRegistry = function (url, token, data) {
        return this.httpClient.put(url + "/identity/registry?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.setImage = function (url, token, data) {
        return this.httpClient.put(url + "/identity/image?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.getImageUrl = function (url, token, revision) {
        return url + "/identity/image?token=" + token + "&revision=" + revision;
    };
    IdentityService.prototype.setName = function (url, token, data) {
        return this.httpClient.put(url + "/identity/name?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.setHandle = function (url, token, data) {
        return this.httpClient.put(url + "/identity/handle?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.setLocation = function (url, token, data) {
        return this.httpClient.put(url + "/identity/location?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.setDescription = function (url, token, data) {
        return this.httpClient.put(url + "/identity/description?token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.getDirty = function (url, token) {
        return this.httpClient.get(url + "/identity/dirty?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService.prototype.clearDirty = function (url, token, revision) {
        return this.httpClient.put(url + "/identity/dirty?token=" + token + "&flag=false&revision=" + revision, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IdentityService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], IdentityService);
    return IdentityService;
}());
exports.IdentityService = IdentityService;
