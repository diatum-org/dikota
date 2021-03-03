import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageSource } from "tns-core-modules/image-source";

import { BitmapService } from './bitmap.service';
import { EmigoService } from '../appdb/emigo.service';
import { EmigoContact } from '../appdb/emigoContact';
import { PendingContact } from '../appdb/pendingContact';
import { Emigo } from '../appdb/emigo';
import { Attribute } from '../appdb/attribute';
import { AttributeUtil } from '../attributeUtil';
import { PendingEmigo } from '../appdb/pendingEmigo';

import { getEmigoObject } from '../appdb/emigo.util';

export class IdentityData {
  revision: number;
  icon: string;
}

export class ProfileData {
  revision: number;
  phone: boolean;
  email: boolean;
  text: boolean;
}

export class ShareData {
  notified: number;
}

export class PendingData {
  emigoId: string;
  revision: number;
  name: string;
  handle: string;
  icon: string;
  notified: number;
}

@Injectable()
export class EntryService {

  private icons: Map<string, any>; 
  private avatarSrc: ImageSource;
  private all: EmigoContact[] = [];
  private connected: EmigoContact[] = [];
  private requested: EmigoContact[] = [];
  private received: EmigoContact[] = [];
  private saved: EmigoContact[] = [];
  private pending: PendingContact[] = [];
  private revision: number = null;
  private notified: number = null;

  private connectedEmigos: BehaviorSubject<EmigoContact[]>;
  private requestedEmigos: BehaviorSubject<EmigoContact[]>;
  private receivedEmigos: BehaviorSubject<EmigoContact[]>;
  private savedEmigos: BehaviorSubject<EmigoContact[]>;
  private pendingEmigos: BehaviorSubject<PendingContact[]>;

  private notifyRevision: BehaviorSubject<boolean>;

  constructor(private bitmapService: BitmapService,
      private emigoService: EmigoService) {

    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");
    this.icons = new Map<string, any>();

    this.connectedEmigos = new BehaviorSubject<EmigoContact[]>([]);
    this.requestedEmigos = new BehaviorSubject<EmigoContact[]>([]);
    this.receivedEmigos = new BehaviorSubject<EmigoContact[]>([]);
    this.savedEmigos = new BehaviorSubject<EmigoContact[]>([]);
    this.pendingEmigos = new BehaviorSubject<PendingContact[]>([]);
    this.notifyRevision = new BehaviorSubject<boolean>(false);

    // observe all saved contacts
    this.emigoService.allContacts.subscribe(async e => {
      this.all = e;
      for(let i = 0; i < e.length; i++) {
        await this.setIdentityData(e[i]);
        await this.setAttributeData(e[i]);
      }
      this.connectedEmigos.next(this.connected);
      this.requestedEmigos.next(this.requested);
      this.receivedEmigos.next(this.received);
      this.savedEmigos.next(this.saved);
    });

    this.emigoService.connectedContacts.subscribe(c => {
      this.connected = c;
      this.connectedEmigos.next(this.connected);
      this.setNotifyRevision();
    });
    this.emigoService.requestedContacts.subscribe(c => {
      this.requested = c;
      this.requestedEmigos.next(this.requested);
    });
    this.emigoService.receivedContacts.subscribe(c => {
      this.received = c;
      this.receivedEmigos.next(this.received);
      this.setNotifyRevision();
    });
    this.emigoService.savedContacts.subscribe(c => {
      this.saved = c;
      this.savedEmigos.next(this.saved);
    });

    this.emigoService.pendingContacts.subscribe(async c => {
      this.pending = c;
      for(let i = 0; i < c.length; i++) {
        await this.setPendingData(c[i]);
      }      
      this.pendingEmigos.next(this.pending);
      this.setNotifyRevision();
    });
  }

  public async init() {
    // retrieve notified revision
    this.notified = await this.emigoService.getAppProperty("notified_revision");
    this.setNotified();
  }

  public clear() {
    this.notified = null;
    this.revision = null;
    this.pending = [];
    this.saved = [];
    this.received = [];
    this.requested = [];
    this.connected = [];
    this.all = [];
    this.icons.clear();

    this.connectedEmigos.next([]);
    this.requestedEmigos.next([]);
    this.receivedEmigos.next([]);
    this.savedEmigos.next([]);
    this.pendingEmigos.next([]);
    this.notifyRevision.next(false);
  }

  get notifyUpdate() {
    return this.notifyRevision.asObservable();
  }

  get connectedContacts() {
    return this.connectedEmigos.asObservable();
  }

  get requestedContacts() {
    return this.requestedEmigos.asObservable();
  }

  get receivedContacts() {
    return this.receivedEmigos.asObservable();
  }

  get savedContacts() {
    return this.savedEmigos.asObservable();
  }

  get pendingContacts() {
    return this.pendingEmigos.asObservable();
  }

  public async setNotified() {
  
    this.notified = this.revision;
    await this.emigoService.setAppProperty("notified_revision", this.notified);
    this.notify();
  }

  private notify() {
    this.notifyRevision.next(this.getNotify());
  }

  public getNotify(): boolean {
    
    if(this.notified == null && this.revision != null) {
      return true;
    }
    else if(this.notified != null && this.revision != null && this.notified < this.revision) {
      return true;
    }
    else {
      return false;
    }
  }

  private setNotifyRevision() {
    let r: number = null;
    for(let i = 0; i < this.received.length; i++) {
      let c: EmigoContact = this.received[i];
      if(c.shareData == null || c.shareData.notified != c.shareRevision) {
        if(r == null || c.shareRevision > r) {
          r = c.shareRevision;
        }
      }
    }
    for(let i = 0; i < this.connected.length; i++) {
      let c: EmigoContact = this.connected[i];
      if(c.shareData == null || c.shareData.notified != c.shareRevision) {
        if(r == null || c.shareRevision > r) {
          r = c.shareRevision;
        }
      }
    }
    for(let i = 0; i < this.pending.length; i++) {
      let c: PendingContact = this.pending[i];
      if(c.pendingData == null || c.pendingData.notified != c.revision) {
        if(r == null || c.revision > r) {
          r = c.revision;
        }
      }
    }
    this.revision = r;
    this.notify();
  }

  private async setIcon(id: string, data: any) {
    
    // make sure icon has entry
    if(!this.icons.has(id)) {
      this.icons.set(id, {});
    }

    // check if icon should be unset
    if(data == null && this.icons.get(id).icon != null) {
      this.icons.set(id, {});
    }
    
    // check if icon should be set
    if(data != null && this.icons.get(id).revision != data.revision) {
      this.icons.set(id, {
        revision: data.revision,
        icon: ImageSource.fromBase64Sync(data.icon),
      });
    }
  }

  private async setIdentityData(e: EmigoContact) {

    // check if identity data should be cleared
    if(e.identityRevision == null && e.identityData != null) {
      await this.emigoService.setContactIdentityData(e.emigoId, null);
    }

    // check if identity data should be set
    if(e.identityRevision != null && (e.identityData == null || e.identityData.revision != e.identityRevision)) {
      let emigo: Emigo = await this.emigoService.getContactIdentity(e.emigoId);
      if(emigo != null) {
        let icon: string = await this.bitmapService.convert(emigo.logo);
        e.identityData = { revision: e.identityRevision, icon: icon };
        await this.emigoService.setContactIdentityData(e.emigoId, e.identityData); 
      }
    }

    // load icon if not set yet
    await this.setIcon(e.emigoId, e.identityData);
  }

  private async setAttributeData(e: EmigoContact) {

    // check if attribute data should be cleared
    if(e.attributeRevision == null && e.attributeData != null) {
      await this.emigoService.setContactProfileData(e.emigoId, null);
    }

    // check if attribute data should be set
    if(e.attributeRevision != null && (e.attributeData == null || e.attributeData.revision != e.attributeRevision)) {
      let phone: any[] = [];
      let text: any[] = [];
      let email: any[] = [];
      let attr: Attribute[] = await this.emigoService.getContactProfile(e.emigoId);
      for(let i = 0; i < attr.length; i++) {
        if(attr[i].schema == AttributeUtil.PHONE) {
          let p = JSON.parse(attr[i].data);
          phone.push({ value: p.phone, type: p.category });
          if(p.phoneSms == true) {
            text.push({ value: p.phone, type: p.category });
          }
        }
        if(attr[i].schema == AttributeUtil.EMAIL) {
          let e = JSON.parse(attr[i].data);
          email.push({ value: e.email, type: e.category });
        }
        if(attr[i].schema == AttributeUtil.CARD) {
          let c = JSON.parse(attr[i].data);
          let category: string = "card";
          if(c.companyName != null) {
            category = c.companyName;
          }
          if(c.mainPhone != null) {
            if(c.mainPhoneSms) {
              text.push({ value: c.mainPhone, type: category + " (main)"});
            }
            phone.push({ value: c.mainPhone, type: category + " (main)"});
          }
          if(c.directPhone != null) {
            if(c.directPhoneSms) {
              text.push({ value: c.directPhone, type: category + " (direct)"});
            }
            phone.push({ value: c.directPhone, type: category + " (direct)"});
          }
          if(c.mobilePhone != null) {
            if(c.mobilePhoneSms) {
              text.push({ value: c.mobilePhone, type: category + " (mobile)"});
            }
            phone.push({ value: c.mobilePhone, type: category + " (mobile)"});
          }
          if(c.email != null) {
            email.push({ value: c.email, type: category });
          }
        }
      }
      e.attributeData = { revision: e.attributeRevision, phone: phone, text: text, email: email };
      await this.emigoService.setContactProfileData(e.emigoId, e.attributeData);
    }
  }

  private async setPendingData(e: PendingContact) {

    // check if pending data should be cleared
    if(e.revision == null && e.pendingData != null) {
      e.pendingData = null;
      await this.emigoService.setPendingEmigoData(e.shareId, null);
    }

    // store updated pending data
    if(e.revision != null && (e.pendingData == null || e.pendingData.revision != e.revision)) {
      let pending: PendingEmigo = await this.emigoService.getPending(e.shareId);
      let emigo: Emigo = getEmigoObject(pending.message);
      e.pendingData = {
        emigoId: emigo.emigoId,
        revision: e.revision,
        name: emigo.name,
        handle: emigo.handle,
        registry: emigo.registry,
        icon: await this.bitmapService.convert(emigo.logo),
      };
      await this.emigoService.setPendingEmigoData(e.shareId, e.pendingData);
    }

    // load icon if not set yet
    await this.setIcon(e.shareId, e.pendingData);
  }

  public notifyContact(emigoId: string) {
    for(let i = 0; i < this.all.length; i++) {
      if(this.all[i].emigoId == emigoId) {
        let e: EmigoContact = this.all[i];
        e.shareData = { notified: e.shareRevision };
        this.emigoService.setContactShareData(e.shareId, e.shareData);
        this.connectedEmigos.next(this.connected);
        this.requestedEmigos.next(this.requested);
        this.receivedEmigos.next(this.received);
        this.savedEmigos.next(this.saved);
      }
    }
  }

  public notifyPending(shareId: string) {
    for(let i = 0; i < this.pending.length; i++) {
      if(this.pending[i].shareId == shareId) {
        let e: PendingContact = this.pending[i];
        e.pendingData.notified = e.revision; 
        this.emigoService.setPendingEmigoData(e.shareId, e.pendingData);
        this.pendingEmigos.next(this.pending);
      }
    }
  }

  public getIcon(id: string): ImageSource {
    let entry: any = this.icons.get(id);
    if(entry == null || entry.icon == null) {
      return this.avatarSrc;
    }
    return entry.icon;
  }
}

