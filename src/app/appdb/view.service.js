"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var ViewService = /** @class */ (function () {
    function ViewService(httpClient) {
        this.httpClient = httpClient;
        this.authMessage = null;
        this.authToken = null;
        this.auth = new Map();
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    ViewService.prototype.getAgentMessage = function (url, token) {
        return this.httpClient.put(url + "/agent/service?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.setAgentMessage = function (url, token, msg) {
        return this.httpClient.post(url + "/view/agents?token=" + token, msg, { headers: this.headers, observe: 'body', responseType: 'text' }).pipe(operators_1.timeout(5000)).toPromise();
    };
    ViewService.prototype.viewSubjectViews = function (url, token, agent, filter) {
        return this.httpClient.post(url + "/view/subjects/view?token=" + token + "&agent=" + agent, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authSubjectViews = function (url, token, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewSubjectViews(url, token, _this.auth.get(url), filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewSubjectViews(url, token, _this.auth.get(url), filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewSubjectViews(url, token, _this.auth.get(url), filter).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getSubjectViews = function (serviceUrl, serviceToken, nodeUrl, nodeToken, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authSubjectViews(nodeUrl, nodeToken, filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authSubjectViews(nodeUrl, nodeToken, filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authSubjectViews(nodeUrl, nodeToken, filter).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewSubject = function (url, token, agent, subjectId) {
        return this.httpClient.get(url + "/view/subjects/" + subjectId + "?token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authSubject = function (url, token, subjectId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewSubject(url, token, _this.auth.get(url), subjectId).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewSubject(url, token, _this.auth.get(url), subjectId).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewSubject(url, token, _this.auth.get(url), subjectId).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getSubject = function (serviceUrl, serviceToken, nodeUrl, nodeToken, subjectId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authSubject(nodeUrl, nodeToken, subjectId).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authSubject(nodeUrl, nodeToken, subjectId).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authSubject(nodeUrl, nodeToken, subjectId).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewSubjects = function (url, token, agent, filter) {
        return this.httpClient.post(url + "/view/subjects/filter?token=" + token + "&agent=" + agent, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authSubjects = function (url, token, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewSubjects(url, token, _this.auth.get(url), filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewSubjects(url, token, _this.auth.get(url), filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewSubjects(url, token, _this.auth.get(url), filter).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getSubjects = function (serviceUrl, serviceToken, nodeUrl, nodeToken, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authSubjects(nodeUrl, nodeToken, filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authSubjects(nodeUrl, nodeToken, filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authSubjects(nodeUrl, nodeToken, filter).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewGetSubjectTags = function (url, token, subjectId, schema, agent) {
        return this.httpClient.get(url + "/view/subjects/" + subjectId + "/tags?schema=" + schema + "&descending=false&token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authGetSubjectTags = function (url, token, subjectId, schema) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewGetSubjectTags(url, token, subjectId, schema, _this.auth.get(url)).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewGetSubjectTags(url, token, subjectId, schema, _this.auth.get(url)).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewGetSubjectTags(url, token, subjectId, schema, _this.auth.get(url)).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getSubjectTags = function (serviceUrl, serviceToken, nodeUrl, nodeToken, subjectId, schema) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authGetSubjectTags(nodeUrl, nodeToken, subjectId, schema).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authGetSubjectTags(nodeUrl, nodeToken, subjectId, schema).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authGetSubjectTags(nodeUrl, nodeToken, subjectId, schema).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewAddSubjectTags = function (url, token, subjectId, schema, data, agent) {
        return this.httpClient.post(url + "/view/subjects/" + subjectId + "/tags?schema=" + schema + "&descending=false&token=" + token + "&agent=" + agent, data, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authAddSubjectTags = function (url, token, subjectId, schema, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewAddSubjectTags(url, token, subjectId, schema, data, _this.auth.get(url)).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewAddSubjectTags(url, token, subjectId, schema, data, _this.auth.get(url)).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewAddSubjectTags(url, token, subjectId, schema, data, _this.auth.get(url)).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.addSubjectTags = function (serviceUrl, serviceToken, nodeUrl, nodeToken, subjectId, schema, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authAddSubjectTags(nodeUrl, nodeToken, subjectId, schema, data).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authAddSubjectTags(nodeUrl, nodeToken, subjectId, schema, data).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authAddSubjectTags(nodeUrl, nodeToken, subjectId, schema, data).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewRemoveSubjectTags = function (url, token, subjectId, tagId, schema, agent) {
        return this.httpClient.delete(url + "/view/subjects/" + subjectId + "/tags/" + tagId + "?schema=" + schema + "&descending=false&token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authRemoveSubjectTags = function (url, token, subjectId, tagId, schema) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewRemoveSubjectTags(url, token, subjectId, tagId, schema, _this.auth.get(url)).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewRemoveSubjectTags(url, token, subjectId, tagId, schema, _this.auth.get(url)).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewRemoveSubjectTags(url, token, subjectId, tagId, schema, _this.auth.get(url)).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.removeSubjectTags = function (serviceUrl, serviceToken, nodeUrl, nodeToken, subjectId, tagId, schema) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authRemoveSubjectTags(nodeUrl, nodeToken, subjectId, tagId, schema).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authRemoveSubjectTags(nodeUrl, nodeToken, subjectId, tagId, schema).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authRemoveSubjectTags(nodeUrl, nodeToken, subjectId, tagId, schema).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.viewRevision = function (url, token, agent) {
        return this.httpClient.get(url + "/view/revision?token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ViewService.prototype.authRevision = function (url, token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewRevision(url, token, _this.auth.get(url)).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewRevision(url, token, _this.auth.get(url)).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewRevision(url, token, _this.auth.get(url)).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getRevision = function (serviceUrl, serviceToken, nodeUrl, nodeToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authRevision(nodeUrl, nodeToken).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authRevision(nodeUrl, nodeToken).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authRevision(nodeUrl, nodeToken).then(function (a) {
                            resolve(a);
                        }).catch(function (err) {
                            reject(JSON.stringify(err));
                        });
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                });
            }
        });
    };
    ViewService.prototype.getAssetUrl = function (serviceUrl, serviceToken, nodeUrl, nodeToken, subjectId, assetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO optimize with just a validating enpoint instead of revision check
                    return [4 /*yield*/, this.getRevision(serviceUrl, serviceToken, nodeUrl, nodeToken)];
                    case 1:
                        // TODO optimize with just a validating enpoint instead of revision check
                        _a.sent();
                        return [2 /*return*/, nodeUrl + "/view/subjects/" + subjectId + "/assets/" + assetId + "?token=" + nodeToken +
                                "&agent=" + this.auth.get(nodeUrl)];
                }
            });
        });
    };
    ViewService.prototype.clearAuth = function () {
        this.authMessage = null;
        this.authToken = null;
        this.auth = new Map();
    };
    ViewService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ViewService);
    return ViewService;
}());
exports.ViewService = ViewService;
