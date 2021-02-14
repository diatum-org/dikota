import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import { AttributeUtil, AttributeDataEntry } from '../attributeUtil';
import { EmigoService, AttributeEntity, EmigoContact, EmigoView } from '../appdb/emigo.service';
import { PendingEmigoView } from '../appdb/pendingEmigoView';
import { EmigoAppData } from '../model/emigoAppData';
import { EmigoAppState } from '../model/emigoAppState';

export class EmigoStatus {
  active: EmigoView;
  pending: PendingEmigoView;
  status: string;
}

@Injectable()
export class MonitorService {

  private sub: Subscription[] = [];
  private connected: EmigoView[] = [];
  private received: EmigoView[] = [];
  private pending: PendingEmigoView[] = [];
  private notifyRevision: number = 0;
  private appRevision: number = 0;
  private dismiss: Map<string, number>;
  private emigos: BehaviorSubject<EmigoStatus[]>;
  private notify: BehaviorSubject<boolean>;
  private setRevision: boolean = false;

  constructor(private emigoService: EmigoService) {
    this.emigos = new BehaviorSubject<EmigoStatus[]>([]);
    this.notify = new BehaviorSubject<boolean>(false);
    this.dismiss = new Map<string, number>();
  }

  get notifyEmigos() {
    return this.emigos.asObservable();
  }

  get notifyFlag() {
    return this.notify.asObservable();
  }

  public start() {  

    this.stop(); // clear previous instance
    this.notifyRevision = 0;
    this.appRevision = 0;
    this.connected = [];
    this.received = [];
    this.pending = [];

    this.sub.push(this.emigoService.updatedEmigo.subscribe(e => {
      if(e != null) {
        if(e.attributeRevision == null && e.appData != null) {
          this.emigoService.setEmigoData(e.emigo.emigoId, null, null).then(() => {}).catch(err => {
            console.log("EmigoService.setEmigoData failed");
          });
        }
        if(e.attributeRevision != null && (e.appData == null || e.appData.revision != e.attributeRevision)) {
          let phone: AttributeDataEntry[] = AttributeUtil.getPhoneData(e.attributes);
          let text: AttributeDataEntry[] = AttributeUtil.getTextData(e.attributes);
          let email: AttributeDataEntry[] = AttributeUtil.getEmailData(e.attributes);

          this.emigoService.setEmigoData(e.emigo.emigoId, e.attributeRevision, { revision: e.attributeRevision,
              hasPhone: phone.length!=0, hasText: text.length!=0, hasEmail: email.length!=0 }).then(() => {}).catch(err => {
            console.log("EmigoService.setEmigoData failed");
          });
        }
      }
    }));

    this.emigoService.getAppProperty("dismiss_notification").then(m => {
      if(m != null) {
        this.dismiss = new Map<string, number>(m);
      }

      this.sub.push(this.emigoService.connectedContacts.subscribe(e => {
        this.connected = e;
        this.setEmigos();
      }));

      this.sub.push(this.emigoService.pendingContacts.subscribe(e => {
        this.pending = e;
        this.setEmigos();
      }));

      this.sub.push(this.emigoService.receivedContacts.subscribe(e => {
        this.received = e;
        this.setEmigos();
      }));
    }).catch(err => {
      console.log("failed to retrieve dismiss map");
      this.emigoService.setAppProperty("dismiss_notification", null);
    });

    this.emigoService.getAppProperty("dismiss_revision").then(r => {

      if(r == null) {
        this.appRevision = 0;
      }
      else {
        this.setRevision = true;
        this.appRevision = r.revision;
      }
      this.setEmigos();
    }).catch(err => {
      console.log("EmigoService.getAppProperty failed");
    });
  }

  public stop() {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
    this.dismiss.clear();
    this.emigos.next([]);
    this.notify.next(false);
    this.notifyRevision = 0;
  }

  private setEmigos() {
    let month: number = 345600;
    let d: Date = new Date();
    let epoch: number = Math.floor(d.getTime() / 1000); 

    let e: EmigoStatus[] = [];
    for(let i = 0; i < this.connected.length; i++) {
      if(this.connected[i].shareTimestamp != null && month > (epoch - this.connected[i].shareTimestamp)) {
        if(!this.dismiss.has(this.connected[i].id) || 
            this.dismiss.get(this.connected[i].id) < this.connected[i].shareRevision) {
          e.push({ active: this.connected[i], pending: null, status: "connected" });
          if(this.connected[i].shareRevision > this.notifyRevision) {
            if(this.setRevision || epoch <= this.connected[i].shareTimestamp) { 
              this.notifyRevision = this.connected[i].shareRevision;
            }
          }
        }
      }
    }
    for(let i = 0; i < this.received.length; i++) {
      if(this.received[i].shareTimestamp != null && month > (epoch - this.received[i].shareTimestamp)) {
        if(!this.dismiss.has(this.received[i].id) ||
            this.dismiss.get(this.received[i].id) < this.received[i].shareRevision) {
          e.push({ active: this.received[i], pending: null, status: "received" });
          if(this.received[i].shareRevision > this.notifyRevision) {
            if(this.setRevision || epoch <= this.received[i].shareTimestamp) {
              this.notifyRevision = this.received[i].shareRevision;
            }
          }
        }
      }
    }
    for(let i = 0; i < this.pending.length; i++) {
      if(this.pending[i].updated != null && month > (epoch - this.pending[i].updated)) {
        if(!this.dismiss.has(this.pending[i].emigoId) ||
            this.dismiss.get(this.pending[i].emigoId) < this.pending[i].revision) {
          e.push({ active: null, pending: this.pending[i], status: "pending" });
          if(this.pending[i].revision > this.notifyRevision) {
            if(this.setRevision || epoch <= this.pending[i].updated) {
              this.notifyRevision = this.pending[i].revision;
            }
          }
        }
      }
    }
    e.sort((a, b) => {
      let ats: number = 0;
      if(a.active != null) {
        ats = a.active.shareTimestamp;
      }
      if(a.pending != null) {
        ats = a.pending.updated;
      }
      let bts: number = 0;
      if(b.active != null) {
        bts = b.active.shareTimestamp;
      }
      if(b.pending != null) {
        bts = b.pending.updated;
      }
      return bts - ats;
    });
    this.emigos.next(e);
    this.notify.next(this.notifyRevision > this.appRevision);
  }

  public unnotify(emigoId: string, revision: number) {
    this.dismiss.set(emigoId, revision);
    this.emigoService.setAppProperty("dismiss_notification", Array.from(this.dismiss.entries())).then(() => {
      this.setEmigos();
    }).catch(err => {
      console.log("EmigoService.setAppProperty failed");
    });
  }

  public clearNotify() {
    this.setRevision = true;
    this.appRevision = this.notifyRevision;
    this.notify.next(false);
    this.emigoService.setAppProperty("dismiss_revision", { revision: this.notifyRevision }).then(() => {}).catch(err => {
      console.log("EmigoService.setAppProperty failed");
    });
  }
}

