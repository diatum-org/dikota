"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var TokenService = /** @class */ (function () {
    function TokenService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    TokenService.prototype.getAccess = function (url, token) {
        return this.httpClient.get(url + "/token/access?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    TokenService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], TokenService);
    return TokenService;
}());
exports.TokenService = TokenService;
