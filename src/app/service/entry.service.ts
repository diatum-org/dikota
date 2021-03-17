import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageSource } from "tns-core-modules/image-source";

import { BitmapService } from './bitmap.service';
import { AmigoService } from '../appdb/amigo.service';
import { AmigoContact } from '../appdb/amigoContact';
import { PendingContact } from '../appdb/pendingContact';
import { Amigo } from '../appdb/amigo';
import { Attribute } from '../appdb/attribute';
import { AttributeUtil } from '../attributeUtil';
import { PendingAmigo } from '../appdb/pendingAmigo';

import { getAmigoObject } from '../appdb/amigo.util';

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
  amigoId: string;
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
  private all: AmigoContact[] = [];
  private connected: AmigoContact[] = [];
  private requested: AmigoContact[] = [];
  private received: AmigoContact[] = [];
  private saved: AmigoContact[] = [];
  private pending: PendingContact[] = [];
  private revision: number = null;
  private notified: number = null;

  private connectedAmigos: BehaviorSubject<AmigoContact[]>;
  private requestedAmigos: BehaviorSubject<AmigoContact[]>;
  private receivedAmigos: BehaviorSubject<AmigoContact[]>;
  private savedAmigos: BehaviorSubject<AmigoContact[]>;
  private pendingAmigos: BehaviorSubject<PendingContact[]>;

  private notifyRevision: BehaviorSubject<boolean>;

  constructor(private bitmapService: BitmapService,
      private amigoService: AmigoService) {

    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");
    this.icons = new Map<string, any>();

    this.connectedAmigos = new BehaviorSubject<AmigoContact[]>([]);
    this.requestedAmigos = new BehaviorSubject<AmigoContact[]>([]);
    this.receivedAmigos = new BehaviorSubject<AmigoContact[]>([]);
    this.savedAmigos = new BehaviorSubject<AmigoContact[]>([]);
    this.pendingAmigos = new BehaviorSubject<PendingContact[]>([]);
    this.notifyRevision = new BehaviorSubject<boolean>(false);

    // observe all saved contacts
    this.amigoService.allContacts.subscribe(async e => {
      this.all = e;
      for(let i = 0; i < e.length; i++) {
        await this.setIdentityData(e[i]);
        await this.setAttributeData(e[i]);
      }
      this.connectedAmigos.next(this.connected);
      this.requestedAmigos.next(this.requested);
      this.receivedAmigos.next(this.received);
      this.savedAmigos.next(this.saved);
    });

    this.amigoService.connectedContacts.subscribe(c => {
      this.connected = c;
      this.connectedAmigos.next(this.connected);
      this.setNotifyRevision();
    });
    this.amigoService.requestedContacts.subscribe(c => {
      this.requested = c;
      this.requestedAmigos.next(this.requested);
    });
    this.amigoService.receivedContacts.subscribe(c => {
      this.received = c;
      this.receivedAmigos.next(this.received);
      this.setNotifyRevision();
    });
    this.amigoService.savedContacts.subscribe(c => {
      this.saved = c;
      this.savedAmigos.next(this.saved);
    });

    this.amigoService.pendingContacts.subscribe(async c => {
      this.pending = c;
      for(let i = 0; i < c.length; i++) {
        await this.setPendingData(c[i]);
      }      
      this.pendingAmigos.next(this.pending);
      this.setNotifyRevision();
    });
  }

  public async init() {
    // retrieve notified revision
    this.notified = await this.amigoService.getAppProperty("notified_revision");
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

    this.connectedAmigos.next([]);
    this.requestedAmigos.next([]);
    this.receivedAmigos.next([]);
    this.savedAmigos.next([]);
    this.pendingAmigos.next([]);
    this.notifyRevision.next(false);
  }

  get notifyUpdate() {
    return this.notifyRevision.asObservable();
  }

  get connectedContacts() {
    return this.connectedAmigos.asObservable();
  }

  get requestedContacts() {
    return this.requestedAmigos.asObservable();
  }

  get receivedContacts() {
    return this.receivedAmigos.asObservable();
  }

  get savedContacts() {
    return this.savedAmigos.asObservable();
  }

  get pendingContacts() {
    return this.pendingAmigos.asObservable();
  }

  public async setNotified() {
  
    this.notified = this.revision;
    await this.amigoService.setAppProperty("notified_revision", this.notified);
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
      let c: AmigoContact = this.received[i];
      if(c.shareData == null || c.shareData.notified != c.shareRevision) {
        if(r == null || c.shareRevision > r) {
          r = c.shareRevision;
        }
      }
    }
    for(let i = 0; i < this.connected.length; i++) {
      let c: AmigoContact = this.connected[i];
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

  private async setIdentityData(e: AmigoContact) {

    // check if identity data should be cleared
    if(e.identityRevision == null && e.identityData != null) {
      await this.amigoService.setContactIdentityData(e.amigoId, null);
    }

    // check if identity data should be set
    if(e.identityRevision != null && (e.identityData == null || e.identityData.revision != e.identityRevision)) {
      let amigo: Amigo = await this.amigoService.getContactIdentity(e.amigoId);
      if(amigo != null) {
        let icon: string = await this.bitmapService.convert(amigo.logo);
        e.identityData = { revision: e.identityRevision, icon: icon };
        await this.amigoService.setContactIdentityData(e.amigoId, e.identityData); 
      }
    }

    // load icon if not set yet
    await this.setIcon(e.amigoId, e.identityData);
  }

  private async setAttributeData(e: AmigoContact) {

    // check if attribute data should be cleared
    if(e.attributeRevision == null && e.attributeData != null) {
      await this.amigoService.setContactProfileData(e.amigoId, null);
    }

    // check if attribute data should be set
    if(e.attributeRevision != null && (e.attributeData == null || e.attributeData.revision != e.attributeRevision)) {
      let phone: any[] = [];
      let text: any[] = [];
      let email: any[] = [];
      let attr: Attribute[] = await this.amigoService.getContactProfile(e.amigoId);
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
      await this.amigoService.setContactProfileData(e.amigoId, e.attributeData);
    }
  }

  private async setPendingData(e: PendingContact) {

    // check if pending data should be cleared
    if(e.revision == null && e.pendingData != null) {
      e.pendingData = null;
      await this.amigoService.setPendingAmigoData(e.shareId, null);
    }

    // store updated pending data
    if(e.revision != null && (e.pendingData == null || e.pendingData.revision != e.revision)) {
      let pending: PendingAmigo = await this.amigoService.getPending(e.shareId);
      let amigo: Amigo = getAmigoObject(pending.message);
      e.pendingData = {
        amigoId: amigo.amigoId,
        revision: e.revision,
        name: amigo.name,
        handle: amigo.handle,
        registry: amigo.registry,
        icon: await this.bitmapService.convert(amigo.logo),
      };
      await this.amigoService.setPendingAmigoData(e.shareId, e.pendingData);
    }

    // load icon if not set yet
    await this.setIcon(e.shareId, e.pendingData);
  }

  public notifyContact(amigoId: string) {
    for(let i = 0; i < this.all.length; i++) {
      if(this.all[i].amigoId == amigoId) {
        let e: AmigoContact = this.all[i];
        e.shareData = { notified: e.shareRevision };
        this.amigoService.setContactShareData(e.shareId, e.shareData);
        this.connectedAmigos.next(this.connected);
        this.requestedAmigos.next(this.requested);
        this.receivedAmigos.next(this.received);
        this.savedAmigos.next(this.saved);
      }
    }
  }

  public notifyPending(shareId: string) {
    for(let i = 0; i < this.pending.length; i++) {
      if(this.pending[i].shareId == shareId) {
        let e: PendingContact = this.pending[i];
        e.pendingData.notified = e.revision; 
        this.amigoService.setPendingAmigoData(e.shareId, e.pendingData);
        this.pendingAmigos.next(this.pending);
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

