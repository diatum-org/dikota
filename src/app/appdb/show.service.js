"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ShowService = /** @class */ (function () {
    function ShowService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    ShowService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/show/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.getSubject = function (url, token, subjectId) {
        return this.httpClient.get(url + "/show/subjects/" + subjectId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.getSubjects = function (url, token, filter) {
        return this.httpClient.post(url + "/show/subjects/filter?token=" + token, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.getSubjectViews = function (url, token, filter) {
        return this.httpClient.post(url + "/show/subjects/view?token=" + token, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.addSubject = function (url, token, schema) {
        return this.httpClient.post(url + "/show/subjects?token=" + token + "&schema=" + schema, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.updateSubjectData = function (url, token, subjectId, schema, data) {
        return this.httpClient.put(url + "/show/subjects/" + subjectId + "/data?token=" + token + "&schema=" + schema, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.updateSubjectShare = function (url, token, subjectId, share) {
        return this.httpClient.put(url + "/show/subjects/" + subjectId + "/access?token=" + token + "&done=" + share, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.updateSubjectExpire = function (url, token, subjectId, expire) {
        var e = "";
        if (expire != null) {
            e = "&expire=" + expire;
        }
        return this.httpClient.put(url + "/show/subjects/" + subjectId + "/expire?token=" + token + e, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.setSubjectLabels = function (url, token, subjectId, labelIds) {
        return this.httpClient.put(url + "/show/subjects/" + subjectId + "/labels" + "?token=" + token, labelIds, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.setSubjectLabel = function (url, token, subjectId, labelId) {
        return this.httpClient.post(url + "/show/subjects/" + subjectId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.clearSubjectLabel = function (url, token, subjectId, labelId) {
        return this.httpClient.delete(url + "/show/subjects/" + subjectId + "/labels/" + labelId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.removeSubject = function (url, token, subjectId) {
        return this.httpClient.delete(url + "/show/subjects/" + subjectId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.removeSubjectAsset = function (url, token, subjectId, assetId) {
        return this.httpClient.delete(url + "/show/subjects/" + subjectId + "/assets/" + assetId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.getSubjectTags = function (url, token, subjectId, schema) {
        return this.httpClient.get(url + "/show/subjects/" + subjectId + "/tags?schema=" + schema + "&descending=false&token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.addSubjectTag = function (url, token, subjectId, schema, data) {
        return this.httpClient.post(url + "/show/subjects/" + subjectId + "/tags?schema=" + schema + "&descending=false&token=" + token, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.removeSubjectTag = function (url, token, subjectId, tagId, schema) {
        return this.httpClient.delete(url + "/show/subjects/" + subjectId + "/tags/" + tagId + "?schema=" + schema + "&descending=false&token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShowService.prototype.getUploadUrl = function (url, token, subjectId, transforms) {
        var t = encodeURIComponent(transforms.join());
        return url + "/show/subjects/" + subjectId + "/assets?token=" + token + "&transforms=" + t;
    };
    ShowService.prototype.getAssetUrl = function (url, token, subjectId, assetId) {
        return url + "/show/subjects/" + subjectId + "/assets/" + assetId + "?token=" + token;
    };
    ShowService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ShowService);
    return ShowService;
}());
exports.ShowService = ShowService;
