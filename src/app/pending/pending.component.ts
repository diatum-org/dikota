import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GestureTypes, SwipeGestureEventData } from "tns-core-modules/ui/gestures";
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";
import { VerticalAlignment } from "tns-core-modules/ui/enums";
import { Button } from "tns-core-modules/ui/button";
import { GestureEventData } from "tns-core-modules/ui/gestures";
import * as utils from "tns-core-modules/utils/utils";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { NgZone } from "@angular/core";

import { getEmigoObject } from '../appdb/emigo.util';
import { Emigo } from '../appdb/emigo';
import { EmigoContact } from '../appdb/emigoContact';
import { PendingContact } from '../appdb/pendingContact';
import { EmigoService } from '../appdb/emigo.service';
import { ScaleService } from '../service/scale.service';
import { EntryService } from '../service/entry.service';
import { ContactEntry, ContactLayoutType } from '../contactEntry';
import { PendingEntry, PendingLayoutType } from '../pendingEntry';

@Component({
    selector: "pending",
    moduleId: module.id,
    templateUrl: "./pending.component.xml"
})
export class PendingComponent implements OnInit, OnDestroy {

  private tab: string;
  private avatarSrc: ImageSource = null;
  private maskSrc: ImageSource = null;
  private sub: Subscription[] = [];
  private notifyBorderColor: string = "#F0F8FF";
  private requestedBorderColor: string = "#F0F8FF";
  private receivedBorderColor: string = "#F0F8FF";
  @ViewChild("con", {static: false}) connectedStack: ElementRef;
  @ViewChild("req", {static: false}) requestedStack: ElementRef;
  @ViewChild("rec", {static: false}) receivedStack: ElementRef;
  @ViewChild("pen", {static: false}) pendingStack: ElementRef;
  private iOS: boolean;

  private requested: EmigoContact[] = [];
  private received: EmigoContact[] = [];
  private connected: EmigoContact[] = [];
  private pending: PendingContact[] = [];

  private contactEntries: Map<string, ContactEntry>;
  private pendingEntries: Map<string, PendingEntry>;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private entryService: EntryService,
      private scaleService: ScaleService,
      private zone: NgZone) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    
    // set default tab
    this.tab = "notify"
    this.notifyBorderColor = "#909097"
    this.requestedBorderColor = "#F0F8FF";
    this.receivedBorderColor = "#F0F0FF";
    this.contactEntries = new Map<string, ContactEntry>();
    this.pendingEntries = new Map<string, PendingEntry>();
    this.entryService.setNotified();
  }

  ngAfterViewInit(): void {
    
    this.sub.push(this.entryService.requestedContacts.subscribe(async c => {
      this.requested = c;
      if(this.tab == "requested") {
        await this.applySaved(<StackLayout>this.requestedStack.nativeElement, this.requested);
      }
    }));

    this.sub.push(this.entryService.receivedContacts.subscribe(async c => {
      this.received = c;
      if(this.tab == "received") {
        await this.applySaved(<StackLayout>this.receivedStack.nativeElement, this.received);
      }
      if(this.tab == "notify") {
        await this.notifySaved(<StackLayout>this.receivedStack.nativeElement, this.received);
      }
    }));

    this.sub.push(this.entryService.connectedContacts.subscribe(async c => {
      this.connected = c;
      if(this.tab == "notify") {
        await this.notifySaved(<StackLayout>this.connectedStack.nativeElement, this.connected);
      }
    }));

    this.sub.push(this.entryService.pendingContacts.subscribe(async c => {
      this.pending = c;
      if(this.tab == "received") {
        await this.applyUnsaved(<StackLayout>this.pendingStack.nativeElement, this.pending);
      }
      if(this.tab == "notify") {
        await this.notifyUnsaved(<StackLayout>this.pendingStack.nativeElement, this.pending);
      }
    }));

  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private resetStack() {
    (<StackLayout>this.connectedStack.nativeElement).removeChildren();
    (<StackLayout>this.receivedStack.nativeElement).removeChildren();
    (<StackLayout>this.requestedStack.nativeElement).removeChildren();
    (<StackLayout>this.pendingStack.nativeElement).removeChildren();
  }

  public async setNotify() {
    if(this.tab != "notify") {
      this.resetStack();
      this.tab = "notify";
      this.notifyBorderColor = "#909097"
      this.requestedBorderColor = "#F0F8FF"
      this.receivedBorderColor = "#F0F8FF"
      await this.notifySaved(<StackLayout>this.connectedStack.nativeElement, this.connected);
      await this.notifySaved(<StackLayout>this.receivedStack.nativeElement, this.received);
      await this.notifyUnsaved(<StackLayout>this.pendingStack.nativeElement, this.pending);
      this.entryService.setNotified();
    }
  }

  public setRequested() {
    if(this.tab != "requested") {
      this.resetStack();
      this.tab = "requested";
      this.notifyBorderColor = "#F0F8FF";
      this.requestedBorderColor = "#909097";
      this.receivedBorderColor = "#F0F8FF";
      this.applySaved(<StackLayout>this.requestedStack.nativeElement, this.requested);
    }
  }

  public setReceived() {
    if(this.tab != "received") {
      this.resetStack();
      this.tab = "received";
      this.notifyBorderColor = "#F0F8FF";
      this.requestedBorderColor = "#F0F8FF";
      this.receivedBorderColor = "#909097";
      this.applySaved(<StackLayout>this.receivedStack.nativeElement, this.received);
      this.applyUnsaved(<StackLayout>this.pendingStack.nativeElement, this.pending);
    }
  }

  private async applySaved(stack: StackLayout, c: EmigoContact[]) { 

    // load saved contacts
    stack.removeChildren();
    for(let i = 0; i < c.length; i++) {
      let e: ContactEntry = this.contactEntries.get(c[i].emigoId);
      if(e == null) {
        e = new ContactEntry(this.emigoService, this.entryService, this.router, this.zone);
        this.contactEntries.set(c[i].emigoId, e);
      }
      e.setContact(c[i], ContactLayoutType.Basic);
      stack.addChild(e.getLayout());
    }
  }

  private async notifySaved(stack: StackLayout, c: EmigoContact[]) {

    // load saved contacts
    stack.removeChildren();
    for(let i = 0; i < c.length; i++) {
      let d: Date = new Date();
      if(c[i].updated != null && (d.getTime()/1000) < (c[i].updated + 2419200)) {
        if(c[i].shareData == null || c[i].shareData.notified != c[i].shareRevision) {
          let e: ContactEntry = this.contactEntries.get(c[i].emigoId);
          if(e == null) {
            e = new ContactEntry(this.emigoService, this.entryService, this.router, this.zone);
            this.contactEntries.set(c[i].emigoId, e);
          }
          e.setContact(c[i], ContactLayoutType.Updates);
          stack.addChild(e.getLayout());
        }
      }
    }
  }

  private async applyUnsaved(stack: StackLayout, c: PendingContact[]) {

    // load unsaved contacts
    stack.removeChildren();
    for(let i = 0; i < c.length; i++) {
      let e: PendingEntry = this.pendingEntries.get(c[i].shareId);
      if(e == null) {
        e = new PendingEntry(this.emigoService, this.entryService, this.router, this.zone);
        this.pendingEntries.set(c[i].shareId, e);
      }
      e.setPending(c[i], PendingLayoutType.Basic);
      stack.addChild(e.getLayout());
    }
  }

  private async notifyUnsaved(stack: StackLayout, c: PendingContact[]) {

    // load unsaved contacts
    stack.removeChildren();
    for(let i = 0; i < c.length; i++) {
      let d: Date = new Date();
      if(c[i].updated != null && (d.getTime()/1000) < (c[i].updated + 2419200)) {
        if(c[i].pendingData == null || c[i].pendingData.notified != c[i].revision) {
          let e: PendingEntry = this.pendingEntries.get(c[i].shareId);
          if(e == null) {
            e = new PendingEntry(this.emigoService, this.entryService, this.router, this.zone);
            this.pendingEntries.set(c[i].shareId, e);
          }
          e.setPending(c[i], PendingLayoutType.Updates);
          stack.addChild(e.getLayout());
        }
      }
    }
  }

  public getOffset(t: number) {
    let d: Date = new Date();
    let offset = Math.floor(d.getTime()/1000) - t;

    if(offset < 1800) {
      return (Math.floor(offset / 60) + 1) + "m";
    }
    else if(offset < 43200) {
      return (Math.floor(offset / 3600) + 1) + "h";
    }
    else if(offset < 604800) {
      return (Math.floor(offset / 86400) + 1) + "d";
    }
    else {
      return (Math.floor(offset / 604800) + 1) + "w";
    }
  }

  public onBack() {
    this.router.back();
  }

}
