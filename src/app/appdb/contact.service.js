"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var ContactService = /** @class */ (function () {
    function ContactService(httpClient) {
        this.httpClient = httpClient;
        this.authMessage = null;
        this.authToken = null;
        this.auth = new Map();
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    ContactService.prototype.getAgentMessage = function (url, token) {
        return this.httpClient.put(url + "/agent/service?token=" + token, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ContactService.prototype.setAgentMessage = function (url, token, msg) {
        return this.httpClient.post(url + "/contact/agents?token=" + token, msg, { headers: this.headers, observe: 'body', responseType: 'text' }).pipe(operators_1.timeout(5000)).toPromise();
    };
    ContactService.prototype.viewAttributeViews = function (url, token, agent, filter) {
        return this.httpClient.post(url + "/contact/attributes/view?token=" + token + "&agent=" + agent, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ContactService.prototype.authAttributeViews = function (url, token, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewAttributeViews(url, token, _this.auth.get(url), filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewAttributeViews(url, token, _this.auth.get(url), filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewAttributeViews(url, token, _this.auth.get(url), filter).then(function (a) {
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
    ContactService.prototype.getAttributeViews = function (serviceUrl, serviceToken, nodeUrl, nodeToken, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authAttributeViews(nodeUrl, nodeToken, filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authAttributeViews(nodeUrl, nodeToken, filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authAttributeViews(nodeUrl, nodeToken, filter).then(function (a) {
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
    ContactService.prototype.viewAttributes = function (url, token, agent, filter) {
        return this.httpClient.post(url + "/contact/attributes/filter?token=" + token + "&agent=" + agent, filter, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ContactService.prototype.authAttributes = function (url, token, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewAttributes(url, token, _this.auth.get(url), filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewAttributes(url, token, _this.auth.get(url), filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewAttributes(url, token, _this.auth.get(url), filter).then(function (a) {
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
    ContactService.prototype.getAttributes = function (serviceUrl, serviceToken, nodeUrl, nodeToken, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authAttributes(nodeUrl, nodeToken, filter).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authAttributes(nodeUrl, nodeToken, filter).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authAttributes(nodeUrl, nodeToken, filter).then(function (a) {
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
    ContactService.prototype.viewAttribute = function (url, token, agent, attributeId) {
        return this.httpClient.get(url + "/contact/attributes/" + attributeId + "?token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ContactService.prototype.authAttribute = function (url, token, attributeId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // send auth message if not set
            if (!_this.auth.has(url)) {
                _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                    _this.auth.set(url, t);
                    _this.viewAttribute(url, token, _this.auth.get(url), attributeId).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.viewAttribute(url, token, _this.auth.get(url), attributeId).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.setAgentMessage(url, token, _this.authMessage).then(function (t) {
                        _this.auth.set(url, t);
                        _this.viewAttribute(url, token, _this.auth.get(url), attributeId).then(function (a) {
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
    ContactService.prototype.getAttribute = function (serviceUrl, serviceToken, nodeUrl, nodeToken, attributeId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // retrieve auth message if not set
            if (_this.authMessage == null) {
                _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                    _this.authMessage = m;
                    _this.authAttribute(nodeUrl, nodeToken, attributeId).then(function (a) {
                        resolve(a);
                    }).catch(function (err) {
                        reject(JSON.stringify(err));
                    });
                }).catch(function (err) {
                    reject(JSON.stringify(err));
                });
            }
            else {
                _this.authAttribute(nodeUrl, nodeToken, attributeId).then(function (a) {
                    resolve(a);
                }).catch(function (err) {
                    // TODO only retry on 402
                    _this.getAgentMessage(serviceUrl, serviceToken).then(function (m) {
                        _this.authMessage = m;
                        _this.authAttribute(nodeUrl, nodeToken, attributeId).then(function (a) {
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
    ContactService.prototype.viewRevision = function (url, token, agent) {
        return this.httpClient.get(url + "/contact/revision?token=" + token + "&agent=" + agent, { headers: this.headers, observe: 'body' }).toPromise();
    };
    ContactService.prototype.authRevision = function (url, token) {
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
    ContactService.prototype.getRevision = function (serviceUrl, serviceToken, nodeUrl, nodeToken) {
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
    ContactService.prototype.clearAuth = function () {
        this.authMessage = null;
        this.authToken = null;
        this.auth = new Map();
    };
    ContactService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ContactService);
    return ContactService;
}());
exports.ContactService = ContactService;
