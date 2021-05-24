"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var AppSettings = /** @class */ (function () {
    function AppSettings() {
    }
    AppSettings.VER = "0.2.94";
    AppSettings.REGISTRY = environment_1.Environment.REGISTRY;
    AppSettings.AMIGO = environment_1.Environment.AMIGO;
    AppSettings.DB = environment_1.Environment.DB;
    AppSettings.ENV = environment_1.Environment.ENV;
    AppSettings.PORTAL = environment_1.Environment.PORTAL;
    return AppSettings;
}());
exports.AppSettings = AppSettings;
