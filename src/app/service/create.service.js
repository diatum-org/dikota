"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CreateService = /** @class */ (function () {
    function CreateService() {
        this.emailAddress = null;
        this.phoneNumber = null;
        this.password = null;
        this.pnf = require('google-libphonenumber').PhoneNumberFormat;
        this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    }
    CreateService.prototype.getEmailAddress = function () {
        return this.emailAddress;
    };
    CreateService.prototype.setEmailAddress = function (value) {
        this.emailAddress = value;
    };
    CreateService.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    CreateService.prototype.setPhoneNumber = function (value) {
        this.phoneNumber = value;
    };
    CreateService.prototype.getPassword = function () {
        return this.password;
    };
    CreateService.prototype.setPassword = function (value) {
        this.password = value;
    };
    CreateService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], CreateService);
    return CreateService;
}());
exports.CreateService = CreateService;
