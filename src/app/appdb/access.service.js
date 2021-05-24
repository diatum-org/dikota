"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var AccessService = /** @class */ (function () {
    function AccessService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    AccessService.prototype.createAccount = function (url, token) {
        return this.httpClient.post(url + "/access/amigos?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    AccessService.prototype.getAccess = function (url, token) {
        return this.httpClient.get(url + "/access/accounts/authorized?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    AccessService.prototype.authorizeAccount = function (url, token, access) {
        return this.httpClient.post(url + "/access/services/created?token=" + token, access, { headers: this.headers, observe: 'body' }).toPromise();
    };
    AccessService.prototype.createUser = function (url, token, msg) {
        return this.httpClient.post(url + "/access/accounts/created?token=" + token, msg, { headers: this.headers, observe: 'body' }).toPromise();
    };
    AccessService.prototype.assignUser = function (url, token, amigo) {
        return this.httpClient.post(url + "/access/services/tokens?token=" + token, amigo, { headers: this.headers, observe: 'body' }).toPromise();
    };
    AccessService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], AccessService);
    return AccessService;
}());
exports.AccessService = AccessService;
