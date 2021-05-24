"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ProfileService = /** @class */ (function () {
    function ProfileService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    ProfileService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/profile/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.getAttribute = function (url, token, attributeId) {
        return this.httpClient.get(url + "/profile/attributes/" + attributeId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.getAttributes = function (url, token, filter) {
        return this.httpClient.post(url + "/profile/attributes/filter?token=" + token, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.getAttributeViews = function (url, token, filter) {
        return this.httpClient.post(url + "/profile/attributes/view?token=" + token, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.addAttribute = function (url, token, schema, data) {
        return this.httpClient.post(url + "/profile/attributes?token=" + token + "&schema=" + schema, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.updateAttribute = function (url, token, attributeId, schema, data) {
        return this.httpClient.put(url + "/profile/attributes/" + attributeId + "?token=" + token + "&schema=" + schema, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.removeAttribute = function (url, token, attributeId) {
        return this.httpClient.delete(url + "/profile/attributes/" + attributeId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.setAttributeLabels = function (url, token, attributeId, labelIds) {
        return this.httpClient.put(url + "/profile/attributes/" + attributeId + "/labels" + "?token=" + token, labelIds, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.setAttributeLabel = function (url, token, attributeId, labelId) {
        return this.httpClient.post(url + "/profile/attributes/" + attributeId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService.prototype.clearAttributeLabel = function (url, token, attributeId, labelId) {
        return this.httpClient.delete(url + "/profile/attributes/" + attributeId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ProfileService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
