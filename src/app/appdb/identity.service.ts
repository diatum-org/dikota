import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import * as  base64 from "base-64";
import * as utf8 from "utf8";

import { IdentityValue } from './identityValue';
import { EmigoMessage } from './emigoMessage';
import { Emigo } from './emigo';
import { Result } from './result';

@Injectable()
export class IdentityService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  public getRevision(url: string, token: string): Promise<number> {
    return this.httpClient.get<number>(url + "/identity/revision?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getMessage(url: string, token: string): Promise<EmigoMessage> {
    return this.httpClient.get<EmigoMessage>(url + "/identity/message?token=" + token,
          { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setRegistry(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/registry?token=" + token,
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setImage(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/image?token=" + token, 
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setName(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/name?token=" + token, 
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setHandle(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/handle?token=" + token, 
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setLocation(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/location?token=" + token, 
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setDescription(url: string, token: string, data: string): Promise<EmigoMessage> {
    let value: IdentityValue = { data: data };
    return this.httpClient.put<EmigoMessage>(url + "/identity/description?token=" + token, 
        value, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getDirty(url: string, token: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient.get<Result>(url + "/identity/dirty?token=" + token,
          { headers: this.headers, observe: 'body' }).toPromise().then(r => {
        resolve(r.boolValue);
      }).catch(err => {
        console.log("IndentityService.getDirty failed");
        reject();
      });
    });
  }

  public clearDirty(url: string, token: string, revision: number): Promise<void> {
    return this.httpClient.put<void>(url + "/identity/dirty?token=" + token + "&flag=false&revision=" + revision,
        { headers: this.headers, observe: 'body' }).toPromise();
  }
}
