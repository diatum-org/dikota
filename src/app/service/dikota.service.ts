import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Subscription } from 'rxjs'; 

import { Emigo } from '../appdb/emigo';
import { Result } from '../appdb/result';

import { EmigoService } from '../appdb/emigo.service';

import { AppSettings } from '../app.settings';
import { GpsLocation } from '../model/gpsLocation';
import { SearchArea } from '../model/searchArea';
import { Contact } from '../model/contact';
import { Profile } from '../model/profile';
import { EmigoLogin } from '../model/emigoLogin';

@Injectable()
export class DikotaService {

  private token: string;
  private headers: HttpHeaders;
  private syncInterval: any = null;
  private syncRevision: number = null;
  private identity: Emigo = null;
  private sub: Subscription = null;
  private phoneUtil: any;
  private pnf: any;
  private readonly SEMI_SECRET: string = "92a41a31a209ce961e279e54592199be"

  constructor(private httpClient: HttpClient,
      private emigoService: EmigoService) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Accept', 'application/json');
  
    this.pnf = require('google-libphonenumber').PhoneNumberFormat;
    this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

  }

  public getE164(phone: string): string {
    try {
      const num = this.phoneUtil.parse(phone, 'US');
      return this.phoneUtil.format(num, this.pnf.E164);
    }
    catch(err) {
      console.log(err);
      return null;
    }
  }

  public getRFC5322(email: string): string {
    var at = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if(at.test(email)) {
      return email;
    }
    else {
      return null;
    }
  }

  public getAvailable(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.httpClient.get<Result>(AppSettings.EMIGO + "/accounts/status",
          { headers: this.headers, observe: 'body' }).toPromise().then(r => {
        if(r != null) {
          resolve(r.numValue);
        }
        else {
          resolve(0);
        }            
      }).catch(err => {
        console.log("DikotaService.getAvailable failed");
        reject();
      });
    });
  }

  public emigoIdLogin(emigoId: string, password: string): Promise<EmigoLogin> {
    return this.httpClient.get<EmigoLogin>(AppSettings.EMIGO + "/accounts/token?emigoId=" + emigoId +
        "&password=" + password, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public emailLogin(email: string, password: string): Promise<EmigoLogin> {
    return this.httpClient.get<EmigoLogin>(AppSettings.EMIGO + "/accounts/token?email=" + email +
        "&password=" + password, { headers: this.headers, observe: 'body' }).toPromise();
  }
 
  public phoneLogin(phone: string, password: string): Promise<EmigoLogin> {
    return this.httpClient.get<EmigoLogin>(AppSettings.EMIGO + "/accounts/token?phone=" + 
        phone.replace(/\+/g, "%2B") + "&password=" + password, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public attachAccount(password: string, emigoId: string, node: string, code: string): Promise<EmigoLogin> {

    // construct auth
    let d: Date = new Date();
    let t: number = Math.floor(d.getTime() / 1000);
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let auth = SHA256(this.SEMI_SECRET + ":" + t);

    return this.httpClient.post<EmigoLogin>(AppSettings.EMIGO + "/accounts/attached?password=" + 
        password + "&emigoId=" + emigoId + "&node=" + node + "&code=" + code + "&timestamp=" + t + "&auth=" + auth, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public createAccount(phone: string, email: string, password: string): Promise<EmigoLogin> {
    let e: string = "";
    if(email != null) {
      e = "&emailAddress=" + email;
    }
    let p: string = "";
    if(phone != null) {
      p = "&phoneNumber=" + phone.replace(/\+/g, "%2B");
    }

    // construct auth
    let d: Date = new Date();
    let t: number = Math.floor(d.getTime() / 1000);
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let auth = SHA256(this.SEMI_SECRET + ":" + t);

    return this.httpClient.post<EmigoLogin>(AppSettings.EMIGO + "/accounts/created?password=" + password + e + p + "&timestamp=" + t + "&auth=" + auth, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setToken(token: string): void {
    this.clearToken();
    this.token = token;
    this.syncRevision = null;
    this.syncInterval = setInterval(() => {
      this.syncChanges();
    }, 1000);
    this.sub = this.emigoService.identity.subscribe(i => {
      this.identity = i;
    });
  }

  public clearToken(): void {
    this.token = null;
    if(this.syncInterval != null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if(this.sub != null) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }

  public updatePassword(password: string, update: string): Promise<void> {
    return this.httpClient.put<void>(AppSettings.EMIGO + "/profile/password?token=" + this.token + "&password=" + password + "&update=" + update,
      { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getIdentityRevision(): Promise<number> {
    return this.httpClient.get<number>(AppSettings.EMIGO + "/accounts/revision?token=" + this.token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getProfileRevision(): Promise<number> {
    return this.httpClient.get<number>(AppSettings.EMIGO + "/profile/revision?token=" + this.token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getProfile(): Promise<Profile> {
    return this.httpClient.get<Profile>(AppSettings.EMIGO + "/profile/all?token=" + this.token, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setRegistry(registry: string, revision: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // trigger emigo update
      this.httpClient.put<Emigo>(AppSettings.EMIGO + "/accounts/registry?token=" + this.token + "&registry=" + registry + "&revision=" + revision,
          { headers: this.headers, observe: 'body' }).toPromise().then(e => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public setAvailable(flag: boolean): Promise<Profile> {
    return this.httpClient.put<Profile>(AppSettings.EMIGO + "/profile/available?token=" + this.token + "&flag=" + flag,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setSearchable(flag: boolean): Promise<Profile> {
    return this.httpClient.put<Profile>(AppSettings.EMIGO + "/profile/searchable?token=" + this.token + "&flag=" + flag,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public confirm(): Promise<void> {
    return this.httpClient.put<void>(AppSettings.EMIGO + "/profile/confirm?token=" + this.token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setPhoneNumber(phone: string): Promise<Profile> {
    return this.httpClient.put<Profile>(AppSettings.EMIGO + "/profile/phone?token=" + this.token + "&phoneNumber=" + 
        phone.replace(/\+/g, "%2B"), { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setEmailAddress(email: string): Promise<Profile> {
    return this.httpClient.put<Profile>(AppSettings.EMIGO + "/profile/email?token=" + this.token + "&emailAddress=" + 
        email, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setLocation(gps: GpsLocation): Promise<Profile> {
    return this.httpClient.put<Profile>(AppSettings.EMIGO + "/profile/location?token=" + this.token,
        gps, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public reset(email: string, phone: string): Promise<void> {
    if(email != null) {
      return this.httpClient.put<void>(AppSettings.EMIGO + "/profile/reset?emailAddress=" + email,
          { headers: this.headers, observe: 'body' }).toPromise();
    }
    else {
      return this.httpClient.put<void>(AppSettings.EMIGO + "/profile/reset?phoneNumber=" + phone.replace(/\+/g, "%2B"),
          { headers: this.headers, observe: 'body' }).toPromise();
    }
  }

  public search(match: string): Promise<Contact[]> {
    return this.httpClient.get<Contact[]>(AppSettings.EMIGO + "/search/accounts?token=" + this.token + "&limit=32&match=" + match, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public scan(area: SearchArea): Promise<Contact[]> {
    return this.httpClient.post<Contact[]>(AppSettings.EMIGO + "/search/accounts?token=" + this.token + "&limit=32",
        area, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public contact(email: string, phone: string): Promise<boolean> {
    let params: string = "";
    if(email != null) {
      if(params == "") {
        params += "?"
      }
      else {
        params += "&"
      }
      params += "emailAddress=" + email;
    }
    if(phone != null) {
      if(params == "") {
        params += "?"
      }
      else {
        params += "&"
      }
      params += "phoneNumber=" + phone.replace(/\+/g, "%2B");
    } 
    if(this.token != null) {
      if(params == "") {
        params += "?"
      }
      else {
        params += "&"
      }
      params += "token=" + this.token;
    }
    return this.httpClient.post<boolean>(AppSettings.EMIGO + "/accounts/contact" + params,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  private syncChanges(): void {
    if(this.identity != null && this.syncRevision != this.identity.revision) {

      this.getIdentityRevision().then(r => {
        if(r != this.identity.revision) {
          this.setRegistry(this.identity.registry, this.identity.revision).then(() => {
            this.syncRevision = this.identity.revision;
          }).catch(err => {
            console.log("DikotaService.setRegistry failed");
          });
        }
        else {
          this.syncRevision = r;
        }
      }).catch(err => {
        console.log("DikotaService.getIdentityRevision failed");
      });
    }
  }

}

