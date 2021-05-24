"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var IndexService = /** @class */ (function () {
    function IndexService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    IndexService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/index/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigoRevision = function (url, token, amigoId) {
        return this.httpClient.get(url + "/index/amigos/" + amigoId + "/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigoIdentity = function (url, token, amigoId) {
        return this.httpClient.get(url + "/index/amigos/" + amigoId + "/identity?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigo = function (url, token, amigoId) {
        return this.httpClient.get(url + "/index/amigos/" + amigoId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigos = function (url, token) {
        return this.httpClient.get(url + "/index/amigos?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigoViews = function (url, token) {
        return this.httpClient.get(url + "/index/amigos/view?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.setAmigo = function (url, token, e) {
        return this.httpClient.put(url + "/index/amigos?token=" + token, e, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getPendingRequests = function (url, token) {
        return this.httpClient.get(url + "/index/requests?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getPendingRequest = function (url, token, shareId) {
        return this.httpClient.get(url + "/index/requests/" + shareId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.addAmigo = function (url, token, e) {
        return this.httpClient.post(url + "/index/amigos?token=" + token, e, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.removeAmigo = function (url, token, amigoId) {
        return this.httpClient.delete(url + "/index/amigos/" + amigoId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.getAmigoLogoUrl = function (url, token, amigoId, revision) {
        return url + "/index/amigos/" + amigoId + "/logo?token=" + token + "&revision=" + revision;
    };
    IndexService.prototype.setAmigoNotes = function (url, token, amigoId, notes) {
        if (notes == null) {
            return this.httpClient.delete(url + "/index/amigos/" + amigoId + "/notes?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
        }
        else {
            return this.httpClient.put(url + "/index/amigos/" + amigoId + "/notes?token=" + token, notes, { headers: this.headers, observe: 'body' }).toPromise();
        }
    };
    IndexService.prototype.setAmigoLabels = function (url, token, amigoId, labelIds) {
        return this.httpClient.put(url + "/index/amigos/" + amigoId + "/labels" + "?token=" + token, labelIds, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.setAmigoLabel = function (url, token, amigoId, labelId) {
        return this.httpClient.post(url + "/index/amigos/" + amigoId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.clearAmigoLabel = function (url, token, amigoId, labelId) {
        return this.httpClient.delete(url + "/index/amigos/" + amigoId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService.prototype.clearRequest = function (url, token, shareId) {
        return this.httpClient.delete(url + "/index/requests/" + shareId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    IndexService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], IndexService);
    return IndexService;
}());
exports.IndexService = IndexService;
