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
import { ContextService } from '../service/context.service';
import { EmigoService, EmigoView } from '../appdb/emigo.service';
import { PendingEmigoView } from '../appdb/pendingEmigoView';
import { MonitorService, EmigoStatus } from '../service/monitor.service';
import { ScaleService } from '../service/scale.service';

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
  @ViewChild("res", {static: false}) emigos: ElementRef;
  private iOS: boolean;
  private pendingEmigos: PendingEmigoView[] = [];
  private requestedEmigos: EmigoView[] = [];
  private receivedEmigos: EmigoView[] = [];
  private notifyEmigos: EmigoStatus[] = [];
  private grids: Map<string, GridLayout>;
  private scaleMap: Map<string, Image>;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private contextService: ContextService,
      private monitorService: MonitorService,
      private scaleService: ScaleService,
      private zone: NgZone) {
    this.scaleMap = new Map<string, Image>();
    this.grids = new Map<string, GridLayout>();
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    
    // load mask
    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");

    // load default icon
    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");

    // set default tab
    this.tab = "notify"
    this.notifyBorderColor = "#909097"
    this.requestedBorderColor = "#F0F8FF";
    this.receivedBorderColor = "#F0F0FF";

    // clear notify icon
    this.monitorService.clearNotify();

    // set scaled image 
    this.sub.push(this.scaleService.image.subscribe(s => {
      if(s != null && this.scaleMap.has(s.id)) {
        this.scaleMap.get(s.id).src = s.imgSource;
      }
    }));
  }

  ngAfterViewInit(): void {
    
    this.sub.push(this.emigoService.pendingContacts.subscribe(c => {
      this.pendingEmigos = c;
      if(this.tab == "requested") {
        this.applyRequested();
      }
    }));

    this.sub.push(this.emigoService.requestedContacts.subscribe(c => {
      this.requestedEmigos = c;
      if(this.tab == "requested") {
        this.applyRequested();
      }
    }));

    this.sub.push(this.emigoService.receivedContacts.subscribe(c => {
      this.receivedEmigos = c;
      if(this.tab == "received") {
        this.applyReceived();
      }
    }));

    this.sub.push(this.monitorService.notifyEmigos.subscribe(e => {
      this.notifyEmigos = e;
      if(this.tab == "notify") {
        this.applyNotify();
      }
      this.monitorService.clearNotify();
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public setNotify() {
    this.tab = "notify";
    this.notifyBorderColor = "#909097"
    this.requestedBorderColor = "#F0F8FF"
    this.receivedBorderColor = "#F0F8FF"
    this.applyNotify();
  }

  public setRequested() {
    this.tab = "requested";
    this.notifyBorderColor = "#F0F8FF";
    this.requestedBorderColor = "#909097";
    this.receivedBorderColor = "#F0F8FF";
    this.applyRequested();
  }

  public setReceived() {
    this.tab = "received";
    this.notifyBorderColor = "#F0F8FF";
    this.requestedBorderColor = "#F0F8FF";
    this.receivedBorderColor = "#909097";
    this.applyReceived();
  }

  private applyNotify() {
    
    // populate list of requested emigos
    let stack = <StackLayout>this.emigos.nativeElement;
    let views: Map<string, GridLayout> = new Map<string, GridLayout>();

    for(let i = 0; i < this.notifyEmigos.length; i++) {
      let emigo: EmigoStatus = this.notifyEmigos[i];
      let id: string;
      if(emigo.active != null) {
        id = emigo.active.id + "-" + emigo.status + "-" + emigo.active.shareRevision;
      }
      if(emigo.pending != null) {
        id = emigo.pending.emigoId + "-" + emigo.status + "-" + emigo.pending.revision;
      }
      if(this.grids.has(id)) {
        let g: GridLayout = this.grids.get(id);
        if(stack.getChildAt(i) != g) {
          stack.removeChild(g);
          stack.insertChild(g, i);
          views.set(id, g);
        }
      }
      else {
        let g: GridLayout;
        if(emigo.active != null) {
          g = this.getSavedNotify(emigo.active, emigo.status);
        }
        if(emigo.pending != null) {
          g = this.getPendingNotify(emigo.pending);
        }
        stack.insertChild(g, i);
        views.set(id, g);
      }
    }
    while(stack.getChildrenCount() > this.notifyEmigos.length) {
      stack.removeChild(stack.getChildAt(this.notifyEmigos.length));
    }
    this.grids = views;
  }

  private applyRequested() {
  
    // populate list of requested emigos
    let stack = <StackLayout>this.emigos.nativeElement;
    let views: Map<string, GridLayout> = new Map<string, GridLayout>();
    for(let i = 0; i < this.requestedEmigos.length; i++) {
      let emigo: EmigoView = this.requestedEmigos[i];
      let id: string = emigo.id + "-" + emigo.identityRevision + "-" + emigo.attributeRevision;
      if(this.grids.has(id)) {
        let g: GridLayout = this.grids.get(id);
        if(stack.getChildAt(i) != g) {
          stack.removeChild(g);
          stack.insertChild(g, i);
          views.set(id, g);
        }
      }
      else {
        let g: GridLayout = this.getSavedView(emigo);
        stack.insertChild(g, i);
        views.set(id, g);
      }
    }
    while(stack.getChildrenCount() > this.requestedEmigos.length) {
      stack.removeChild(stack.getChildAt(this.requestedEmigos.length));
    }
    this.grids = views;
  }

  private applyReceived() {
  
    let stack = <StackLayout>this.emigos.nativeElement;
    let views: Map<string, GridLayout> = new Map<string, GridLayout>();
    
    // populate list of received emigos
    for(let i = 0; i < this.receivedEmigos.length; i++) {
      let emigo: EmigoView = this.receivedEmigos[i];
      let id: string = emigo.id + "-" + emigo.identityRevision + "-" + emigo.attributeRevision;
      if(this.grids.has(id)) {
        let g: GridLayout = this.grids.get(id);
        if(stack.getChildAt(i) != g) {
          stack.removeChild(g);
          stack.insertChild(g, i);
          views.set(id, g);
        }
      }
      else {
        let g: GridLayout = this.getSavedView(emigo);
        stack.insertChild(g, i);
        views.set(id, g);
      }
    }

    // populate list of pending emigos
    for(let i = 0; i < this.pendingEmigos.length; i++) {
      let idx: number = i + this.receivedEmigos.length;
      let emigo: PendingEmigoView = this.pendingEmigos[i]
      let id: string = emigo.shareId + "-" + emigo.emigoId;
      if(this.grids.has(id)) {
        let g: GridLayout = this.grids.get(id);
        if(stack.getChildAt(idx) != g) {
          stack.removeChild(g);
          stack.insertChild(g, idx);
          views.set(id, g);
        }
      }
      else {
        let g: GridLayout = this.getPendingView(emigo);
        stack.insertChild(g, idx);
        views.set(id, g);
      }
    } 

    let count: number = this.receivedEmigos.length + this.pendingEmigos.length;
    while(stack.getChildrenCount() > count) {
      stack.removeChild(stack.getChildAt(count));
    }
    this.grids = views;
  }

  private getPendingView(e: PendingEmigoView): GridLayout {

    let icon: Image = new Image();
    icon = new Image();
    icon.width = 48;
    icon.height = 48;

    let mask: Image = new Image();
    mask.width = 48;
    mask.height = 48;
    mask.src = this.maskSrc;

    let g: GridLayout = new GridLayout();
    g.height = 64;
    g.marginLeft = 16;
    g.paddingTop = 8;
    g.paddingBottom = 8;
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);

    this.emigoService.getEmigoRequestMessage(e.shareId).then(msg => {
      let emigo: Emigo = getEmigoObject(msg);

      g.on(Button.tapEvent, () => {
   
        // retrieve contact for rendering
        this.emigoService.selectEmigoContact(emigo.emigoId);

        // set whether contact can be stored
        this.contextService.setEmigo({ id: emigo.emigoId, handle: emigo.handle, registry: emigo.registry,
          pending: true, shareId: e.shareId, available: true });

        this.zone.run(() => { 
          this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
        });
      });

      // scale image
      this.scaleMap.set(emigo.emigoId, icon);
      icon.src = this.scaleService.setImage(emigo.emigoId, emigo.logo);

      let name: Label = new Label();
      name.text = emigo.name;
      name.fontSize = 18;
      name.className = "text";

      let handle: Label = new Label();
      handle.text = emigo.handle;
      handle.fontSize = 16;
      handle.className = "text";

      let s: StackLayout = new StackLayout();
      s.paddingLeft = 16;
      s.verticalAlignment = VerticalAlignment.middle;
      s.addChild(name);
      s.addChild(handle);

      g.addColumn(new ItemSpec(1, "star"));
      g.addChildAtCell(s, 0, 1);
    });
  
    return g;
  }

  private getSavedView(e: EmigoView): GridLayout {
    let name: Label = new Label();
    name.text = e.name;
    name.fontSize = 18;
    name.className = "text";

    let handle: Label = new Label();
    handle.text = e.handle;
    handle.fontSize = 16;
    handle.className = "text";

    let mask: Image = new Image();
    mask.width = 48;
    mask.height = 48;
    mask.src = this.maskSrc;

    let icon: Image = new Image();
    icon = new Image();
    icon.width = 48;
    icon.height = 48;
    if(e.thumb != null) {
      icon.src = ImageSource.fromBase64Sync(e.thumb);
    }
    else {
      icon.src = this.avatarSrc;
    }

    let s: StackLayout = new StackLayout();
    s.paddingLeft = 16;
    s.verticalAlignment = VerticalAlignment.middle;
    s.addChild(name);
    s.addChild(handle);

    let g: GridLayout = new GridLayout();
    g.on(Button.tapEvent, () => {
 
      // retrieve contact for rendering
      this.emigoService.selectEmigoContact(e.id);

      // set whether contact can be stored
      this.contextService.setEmigo({ id: e.id, handle: e.handle, registry: null,
        pending: false, available: true });

      this.zone.run(() => { 
        this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
          transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
      });
    });
    g.height = 64;
    g.marginLeft = 16;
    g.paddingTop = 8;
    g.paddingBottom = 8;
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);
    g.addChildAtCell(s, 0, 1);
    return g;
  }

  private getPendingNotify(e: PendingEmigoView): GridLayout {

    let icon: Image = new Image();
    icon = new Image();
    icon.width = 48;
    icon.height = 48;

    let mask: Image = new Image();
    mask.width = 48;
    mask.height = 48;
    mask.src = this.maskSrc;

    let date: Label = new Label();
    date.text = this.getOffset(e.updated);;
    date.fontSize = 14;
    date.className = "text";
    date.verticalAlignment = VerticalAlignment.middle;

    let g: GridLayout = new GridLayout();
    g.height = 64;
    g.marginLeft = 16;
    g.marginRight = 16;
    g.paddingTop = 8;
    g.paddingBottom = 8;
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addColumn(new ItemSpec(1, "auto"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);
    g.addChildAtCell(date, 0, 2);

    this.emigoService.getEmigoRequestMessage(e.shareId).then(msg => {
      let emigo: Emigo = getEmigoObject(msg);

      g.on(GestureTypes.swipe, () => {
        this.monitorService.unnotify(e.emigoId, e.revision);
      });

      g.on(Button.tapEvent, () => {
   
        // retrieve contact for rendering
        this.emigoService.selectEmigoContact(emigo.emigoId);

        // set whether contact can be stored
        this.contextService.setEmigo({ id: emigo.emigoId, handle: emigo.handle, registry: emigo.registry,
          pending: true, shareId: e.shareId, available: true });

        this.zone.run(() => { 
          this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
        });
      });

      // scale image
      this.scaleMap.set(emigo.emigoId, icon);
      icon.src = this.scaleService.setImage(emigo.emigoId, emigo.logo);

      let name: Label = new Label();
      name.text = emigo.name;
      name.fontSize = 18;
      name.className = "text";

      let message: Label = new Label();
      message.text = "Sent you a request";
      message.fontSize = 14;
      message.className = "text";

      let s: StackLayout = new StackLayout();
      s.paddingLeft = 16;
      s.verticalAlignment = VerticalAlignment.middle;
      s.addChild(name);
      s.addChild(message);

      g.addChildAtCell(s, 0, 1);
    });
  
    return g;
  }
 
  private getSavedNotify(e: EmigoView, status: string): GridLayout {
    let name: Label = new Label();
    name.text = e.name;
    name.fontSize = 18;
    name.className = "text";

    let message: Label = new Label();
    if(status == "connected") {
      message.text = "Is now connected";
    }
    else {
      message.text = "Sent you a request";
    }
    message.fontSize = 14;
    message.className = "text";

    let date: Label = new Label();
    date.text = this.getOffset(e.shareTimestamp);;
    date.fontSize = 14;
    date.className = "text";
    date.verticalAlignment = VerticalAlignment.middle;

    let mask: Image = new Image();
    mask.width = 48;
    mask.height = 48;
    mask.src = this.maskSrc;

    let icon: Image = new Image();
    icon = new Image();
    icon.width = 48;
    icon.height = 48;
    if(e.thumb != null) {
      icon.src = ImageSource.fromBase64Sync(e.thumb);
    }
    else {
      icon.src = this.avatarSrc;
    }

    let s: StackLayout = new StackLayout();
    s.paddingLeft = 16;
    s.verticalAlignment = VerticalAlignment.middle;
    s.addChild(name);
    s.addChild(message);

    let g: GridLayout = new GridLayout();

    g.on(GestureTypes.swipe, () => {
      this.monitorService.unnotify(e.id, e.shareRevision);
    });

    g.on(Button.tapEvent, () => {
 
      // retrieve contact for rendering
      this.emigoService.selectEmigoContact(e.id);

      // set whether contact can be stored
      this.contextService.setEmigo({ id: e.id, handle: e.handle, registry: null,
        pending: false, available: true });

      this.zone.run(() => { 
        this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
          transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
      });
    });
    g.height = 64;
    g.marginLeft = 16;
    g.marginRight = 16;
    g.paddingTop = 8;
    g.paddingBottom = 8;
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addColumn(new ItemSpec(1, "auto"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);
    g.addChildAtCell(s, 0, 1);
    g.addChildAtCell(date, 0, 2);
    return g;
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
