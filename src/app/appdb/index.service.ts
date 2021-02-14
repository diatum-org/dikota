import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';

import { Emigo } from './emigo';
import { EmigoEntry } from './emigoEntry';
import { EmigoEntryView } from './emigoEntryView';
import { EmigoEntryData } from './emigoEntryData';
import { EmigoMessage } from './emigoMessage';
import { PendingEmigo } from './pendingEmigo';
import { PendingEmigoView } from './pendingEmigoView';

@Injectable()
export class IndexService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  public getRevision(url: string, token: string): Promise<number> {
    return this.httpClient.get<number>(url + "/index/revision?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getEmigo(url: string, token: string, emigoId: string): Promise<EmigoEntry> {
    return this.httpClient.get<EmigoEntry>(url + "/index/emigos/" + emigoId + "?token=" + token, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getEmigoRevision(url: string, token: string, emigoId: string): Promise<number> {
    return this.httpClient.get<number>(url + "/index/emigos/" + emigoId + "/revision?token=" + token,
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getEmigos(url: string, token: string, offset: number, limit: number): Promise<EmigoEntry[]> {
    return this.httpClient.get<EmigoEntry[]>(url + "/index/emigos?token=" + token + "&offset=" + offset + 
        "&limit=" + limit, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setEmigo(url: string, token: string, e: EmigoMessage): Promise<Emigo> {
    return this.httpClient.put<Emigo>(url + "/index/emigos?token=" + token,
        e, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public addEmigo(url: string, token: string, e: EmigoMessage): Promise<EmigoEntry> {
    return this.httpClient.post<EmigoEntry>(url + "/index/emigos?token=" + token,
        e, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public deleteEmigo(url: string, token: string, emigoId: string): Promise<void> {
    return this.httpClient.delete<void>(url + "/index/emigos/" + emigoId + "?token=" + token).toPromise();
  }

  public setEmigoNotes(url: string, token: string, emigoId: string, notes: string): Promise<void> {
    if(notes == null) {
      return this.httpClient.delete<void>(url + "/index/emigos/" + emigoId + "/notes?token=" + token, 
          { headers: this.headers, observe: 'body' }).toPromise();
    }
    else {
      return this.httpClient.put<void>(url + "/index/emigos/" + emigoId + "/notes?token=" + token, notes, 
          { headers: this.headers, observe: 'body' }).toPromise();
    }
  }

  public updateEmigo(url: string, token: string, emigoId: string, d: EmigoEntryData): Promise<EmigoEntry> {
    return this.httpClient.put<EmigoEntry>(url + "/index/emigos/" + emigoId + "?token=" + token, d, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public getEmigoIds(url: string, token: string): Promise<EmigoEntryView[]> {
    return this.httpClient.get<EmigoEntryView[]>(url + "/index/emigos/ids" + "?token=" + token, 
        { headers: this.headers, observe: 'body' }).toPromise();
  }

  public setEmigoLabel(url: string, token: string, emigoId: string, labelId: string): Promise<EmigoEntry> {
    return this.httpClient.post<EmigoEntry>(url + "/index/labels/" + labelId + "/emigos/" + emigoId + "?token=" + 
        token, { headers: this.headers, observe: 'body' }).toPromise();
  }

  public clearEmigoLabel(url: string, token: string, emigoId: string, labelId: string): Promise<void> {
    return this.httpClient.delete<void>(url + "/index/labels/" + labelId + "/emigos/" + emigoId + "?token=" + 
        token).toPromise();
  }

  public getRequests(url: string, token: string): Promise<PendingEmigo[]> {
    return this.httpClient.get<PendingEmigo[]>(url + "/index/requests?token=" + token).toPromise();
  }

  public getRequestIds(url: string, token: string): Promise<PendingEmigoView[]> {
    return this.httpClient.get<PendingEmigoView[]>(url + "/index/requests/ids?token=" + token).toPromise();
  }

  public getRequestMessage(url: string, token: string, shareId: string): Promise<EmigoMessage> {
    return this.httpClient.get<EmigoMessage>(url + "/index/requests/" + shareId + "/message?token=" + token).toPromise();
  }

  public clearRequest(url: string, token: string, shareId: string): Promise<void> {
    return this.httpClient.delete<void>(url + "/index/requests/" + shareId + "?token=" + token).toPromise();
  }
}

