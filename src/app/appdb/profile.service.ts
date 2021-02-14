import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import { Attribute } from './attribute';
import { AttributeData } from './attributeData';
import { AttributeEntry } from './attributeEntry';
import { AttributeEntryView } from './attributeEntryView';
import { AttributeEntryData } from './attributeEntryData';
import { LabelEntry } from './labelEntry';
import { Label } from './label';

@Injectable()
export class ProfileService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  public getRevision(url: string, token: string): Promise<number> {
    return this.httpClient.get<number>(url + "/profile/revision?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getAttributes(url: string, token: string, filter: string[]): Promise<AttributeEntryView[]> {
    return this.httpClient.post<AttributeEntryView[]>(url + "/profile/attributes/ids?token=" + token,
        filter, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public addAttribute(url: string, token: string, a: AttributeData): Promise<AttributeEntry> {
    return this.httpClient.post<AttributeEntry>(url + "/profile/attributes?token=" + token,
        a, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public updateAttribute(url: string, token: string, id: string, a: Attribute): Promise<void> {
    return this.httpClient.put<void>(url + "/profile/attributes/" + id + "?token=" + token,
        a, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public removeAttribute(url: string, token: string, id: string): Promise<void> {
    return this.httpClient.delete<void>(url + "/profile/attributes/" + id + "?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setAttributeLabel(url: string, token: string, attributeId: string, labelId: string): Promise<void> {
    return this.httpClient.post<void>(url + "/profile/labels/" + labelId + "/attributes/" + attributeId + "?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public clearAttributeLabel(url: string, token: string, attributeId: string, labelId: string): Promise<void> {
    return this.httpClient.delete<void>(url + "/profile/labels/" + labelId + "/attributes/" + attributeId + "?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

}

