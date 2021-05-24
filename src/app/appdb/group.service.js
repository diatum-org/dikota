"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var GroupService = /** @class */ (function () {
    function GroupService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    GroupService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/group/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.getLabelViews = function (url, token) {
        return this.httpClient.get(url + "/group/labels/view?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.getLabels = function (url, token) {
        return this.httpClient.get(url + "/group/labels?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.addLabel = function (url, token, l) {
        var name = encodeURIComponent(l);
        return this.httpClient.post(url + "/group/labels/?token=" + token + "&name=" + name, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.getLabel = function (url, token, id) {
        return this.httpClient.get(url + "/group/labels/" + id + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.updateLabel = function (url, token, id, l) {
        var name = encodeURIComponent(l);
        return this.httpClient.put(url + "/group/labels/" + id + "/name?token=" + token + "&name=" + name, { headers: this.headers, observe: 'body' }).toPromise();
    };
    GroupService.prototype.removeLabel = function (url, token, id) {
        return this.httpClient.delete(url + "/group/labels/" + id + "?token=" + token, { headers: this.headers }).toPromise();
    };
    GroupService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], GroupService);
    return GroupService;
}());
exports.GroupService = GroupService;
