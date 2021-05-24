"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ShareService = /** @class */ (function () {
    function ShareService(httpClient) {
        this.httpClient = httpClient;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    ShareService.prototype.getConnectionViews = function (url, token) {
        return this.httpClient.get(url + "/share/connections/view?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getConnections = function (url, token) {
        return this.httpClient.get(url + "/share/connections?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getContact = function (url, token, amigoId) {
        return this.httpClient.get(url + "/share/amigos/" + amigoId + "/connections?token=" + token + "&contacts=true&offset=0&limit=1", { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getRevision = function (url, token) {
        return this.httpClient.get(url + "/share/revision?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getRequested = function (url, token) {
        return this.httpClient.get(url + "/share/connections?token=" + token +
            "&contacts=true&status=requested", { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getReceived = function (url, token) {
        return this.httpClient.get(url + "/share/connections?token=" + token +
            "&contacts=true&status=received", { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getEntry = function (url, token, shareId) {
        return this.httpClient.get(url + "/share/connections/" + shareId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.addConnection = function (url, token, amigoId) {
        return this.httpClient.post(url + "/share/connections?token=" + token + "&amigoId=" + amigoId, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getConnection = function (url, token, shareId) {
        return this.httpClient.get(url + "/share/connections/" + shareId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.removeConnection = function (url, token, shareId) {
        return this.httpClient.delete(url + "/share/connections/" + shareId + "?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.getMessage = function (url, token, shareId) {
        return this.httpClient.get(url + "/share/" + shareId + "/message?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.setMessage = function (url, amigoId, msg) {
        return this.httpClient.post(url + "/share/messages?amigoId=" + amigoId, msg, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService.prototype.updateStatus = function (url, token, shareId, status, shareToken) {
        var t = "";
        if (shareToken != null) {
            t = "&shareToken=" + shareToken;
        }
        var s = "";
        if (status != null) {
            s = "&status=" + status;
        }
        return this.httpClient.put(url + "/share/connections/" + shareId + "/status?token=" + token + s + t, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ShareService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ShareService);
    return ShareService;
}());
exports.ShareService = ShareService;
