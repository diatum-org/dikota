import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import { timeout } from 'rxjs/operators';

import { Attribute } from './attribute';
import { EmigoMessage } from './emigoMessage';
import { AuthMessage } from './authMessage';

@Injectable()
export class ContactService {

  private auth: Map<string, string>;
  private authMessage: AuthMessage = null;
  private authToken: string = null;

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.auth = new Map<string, string>();
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  private getAgentMessage(url: string, token: string): Promise<AuthMessage> {
    return this.httpClient.put<AuthMessage>(url + "/agent/service?token=" + token,
      { headers: this.headers, observe: 'body' }).toPromise();
  }

  private setAgentMessage(url: string, token: string, msg: AuthMessage): Promise<string> {
    return this.httpClient.post(url + "/contact/agents?token=" + token,
      msg, { headers: this.headers, observe: 'body', responseType: 'text' }).pipe(timeout(5000)).toPromise();
  }

  private viewAttributes(url: string, token: string, agent: string, filter: string[]): Promise<Attribute[]> {
    return this.httpClient.post<Attribute[]>(url + "/contact/attributes/filters?token=" + token + "&agent=" + agent,
        filter, { headers: this.headers, observe: 'body'  }).toPromise();
  }

  private authAttributes(url: string, token: string, filter: string[]): Promise<Attribute[]> {

    return new Promise<Attribute[]>((resolve, reject) => {
      // send auth message if not set
      if(!this.auth.has(url)) {
        this.setAgentMessage(url, token, this.authMessage).then(t => {
          this.auth.set(url, t);
          this.viewAttributes(url, token, this.auth.get(url), filter).then(a => {
            resolve(a);
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
      else {
        this.viewAttributes(url, token, this.auth.get(url), filter).then(a => {
          resolve(a);
        }).catch(err => {
          // TODO only retry on 402
          this.setAgentMessage(url, token, this.authMessage).then(t => {
            this.auth.set(url, t);
            this.viewAttributes(url, token, this.auth.get(url), filter).then(a => {
              resolve(a);
            }).catch(err => {
              reject(JSON.stringify(err));
            });
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        });
      }
    });
  }

  public getAttributes(serviceUrl: string, serviceToken: string, nodeUrl: string, nodeToken: string, filter: string[]): Promise<Attribute[]> {

    return new Promise<Attribute[]>((resolve, reject) => {
      // retrieve auth message if not set
      if(this.authMessage == null) {
        this.getAgentMessage(serviceUrl, serviceToken).then(m => {
          this.authMessage = m;
          this.authAttributes(nodeUrl, nodeToken, filter).then(a => {
            resolve(a);
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
      else {
        this.authAttributes(nodeUrl, nodeToken, filter).then(a => {
          resolve(a);
        }).catch(err => {
          // TODO only retry on 402
          this.getAgentMessage(serviceUrl, serviceToken).then(m => {
            this.authMessage = m;
            this.authAttributes(nodeUrl, nodeToken, filter).then(a => {
              resolve(a);
            }).catch(err => {
              reject(JSON.stringify(err));
            });
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        });
      }
    });
  }

  private viewRevision(url: string, token: string, agent: string): Promise<number> {
    return this.httpClient.get<number>(url + "/contact/revision?token=" + token + "&agent=" + agent,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  private authRevision(url: string, token: string): Promise<number> {

    return new Promise<number>((resolve, reject) => {
      // send auth message if not set
      if(!this.auth.has(url)) {
        this.setAgentMessage(url, token, this.authMessage).then(t => {
          this.auth.set(url, t);
          this.viewRevision(url, token, this.auth.get(url)).then(a => {
            resolve(a);
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
      else {
        this.viewRevision(url, token, this.auth.get(url)).then(a => {
          resolve(a);
        }).catch(err => {
          // TODO only retry on 402
          this.setAgentMessage(url, token, this.authMessage).then(t => {
            this.auth.set(url, t);
            this.viewRevision(url, token, this.auth.get(url)).then(a => {
              resolve(a);
            }).catch(err => {
              reject(JSON.stringify(err));
            });
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        });
      }
    });
  }

  public getRevision(serviceUrl: string, serviceToken: string, nodeUrl: string, nodeToken: string): Promise<number> {

    return new Promise<number>((resolve, reject) => {
      // retrieve auth message if not set
      if(this.authMessage == null) {
        this.getAgentMessage(serviceUrl, serviceToken).then(m => {
          this.authMessage = m;
          this.authRevision(nodeUrl, nodeToken).then(a => {
            resolve(a);
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        }).catch(err => {
          reject(JSON.stringify(err));
        });
      }
      else {
        this.authRevision(nodeUrl, nodeToken).then(a => {
          resolve(a);
        }).catch(err => {
          // TODO only retry on 402
          this.getAgentMessage(serviceUrl, serviceToken).then(m => {
            this.authMessage = m;
            this.authRevision(nodeUrl, nodeToken).then(a => {
              resolve(a);
            }).catch(err => {
              reject(JSON.stringify(err));
            });
          }).catch(err => {
            reject(JSON.stringify(err));
          });
        });
      }
    });
  }

  public clearAuth(): void {
    this.authMessage = null;
    this.authToken = null;
    this.auth = new Map<string, string>();
  }

}

