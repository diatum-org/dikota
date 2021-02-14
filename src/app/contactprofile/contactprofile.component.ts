import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from 'tns-core-modules/data/observable';
import { ImageSource } from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
import { Menu } from "nativescript-menu";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as utils from "tns-core-modules/utils/utils";
import * as clipboard from "nativescript-clipboard";
import { AttributeUtil } from '../attributeUtil';
import { ContextService } from '../service/context.service';
import { ContactView } from '../model/contactView';

import { Attribute } from '../appdb/attribute';
import { AttributeEntry } from '../appdb/attributeEntry';
import { LabelEntry } from '../appdb/labelEntry';
import { getEmigoObject } from '../appdb/emigo.util';
import { RegistryService } from '../appdb/registry.service';
import { EmigoService, EmigoContact, AttributeEntityData } from '../appdb/emigo.service';
import { EmigoMessage } from '../appdb/emigoMessage';
import { Emigo } from '../appdb/emigo';
import { AppSettings } from '../app.settings';

@Component({
    selector: "contactprofile",
    moduleId: module.id,
    templateUrl: "./contactprofile.component.xml"
})
export class ContactProfileComponent implements OnInit, OnDestroy {

  private hint: string = "";
  private notes: string = null;
  private name: string = "Contact";
  private busy: boolean = false;
  private labelBusy: boolean = false;
  private menuSet: boolean = false;
  private notesSet: boolean = false;
  private avatarSrc: ImageSource = null;
  private sub: Subscription[] = [];
  private application: any;
  private orientation: any;
  private iOS: boolean;
  private view: ContactView = { available: false };
  private labels: LabelEntry[] = [];
  private contact: EmigoContact = {};
  private emigoMessage: EmigoMessage = null;
  private added: boolean = true;
  private afterInit: boolean = false;
  @ViewChild("img", {static: false}) img: ElementRef;
  @ViewChild("rmu", {static: false}) menu: ElementRef;

  constructor(private router: RouterExtensions,
      private contextService: ContextService,
      private registryService: RegistryService,
      private emigoService: EmigoService) {

    this.application = require('application');
    this.orientation = (args) => { this.onOrientation(); };
    let emigo: Emigo = { emigoId: null, node: null, revision: null, version: null };
    this.contact = { emigo: emigo, labels: new Set<string>(), attributes: [], error: false };
    this.iOS = (device.os == "iOS");
     
    // retrieve view
    this.view = this.contextService.getEmigo();

    // load default logo
    this.avatarSrc = ImageSource.fromFileSync("~/assets/avatar.png");
  }

  ngOnInit(): void {

    // handle orientation change
    this.application.on(this.application.orientationChangedEvent, this.orientation);

    // retrieve labels
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    }));
 
    // observe selected emigo
    this.sub.push(this.emigoService.selectedEmigo.subscribe(c => {
      if(c != null) {
        if(Object.getOwnPropertyNames(c).length === 0) {
          this.added = false;
          if(this.view.registry != null && this.view.id != null) {
            this.busy = true;
            this.registryService.getMessage(this.view.registry, this.view.id).then(m => {
              this.busy = false;
              this.emigoMessage = m;
              let emigo: Emigo = getEmigoObject(m);
              this.contact = { emigo: emigo, labels: new Set<string>(), attributes: [], error: false };
              this.setContact();
            }).catch(err => {
              this.busy = false;
              console.log("RegistryService.getMessage failed");
              dialogs.alert({ message: "failed to load contact profile", okButtonText: "ok" });
            });
          }
        }
        else {
          this.added = true;
          this.contact = c;
          this.setContact();
        }
      }
    }));

  }

  ngAfterViewInit(): void {
    this.afterInit = true;
    this.setContact();
  }

  ngOnDestroy(): void {
    this.application.off(this.application.orientationChangedEvent, this.orientation);
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public getHandle(): string {
    if(this.contact == null || this.contact.emigo == null || this.contact.emigo.registry == null) {
      return "";
    }
    let e: Emigo = this.contact.emigo;
    if(e.registry == AppSettings.REGISTRY) {
      return e.handle;
    }
    var reg = /^(https:\/\/registry\.).*(\/app)$/
    if(reg.test(e.registry)) {
      return e.handle + " [" + e.registry.replace(/^(https:\/\/registry\.)/,"").replace(/(\/app)$/,"") + "]";
    }
    return "invalid registry";
  }

  public onSaveProfile(): void {
    if(this.busy) {
      console.log("can't save while processing");
      return;
    }
    this.busy = true;
    this.emigoService.addEmigo(this.emigoMessage).then(i => {
      this.busy = false;
    }).catch(err => {
      this.busy = false;
      console.log("EmigoService.addEmigo failed");
      dialogs.alert({ message: "failed to save contact", okButtonText: "ok" });
    });
  }

  public canRequest(): boolean {
    if(!this.added && this.view.pending) {
      return false;
    }
    if(this.contact.status != 'requested' && this.contact.status != 'received' &&
        this.contact.status != 'connected') {
      return true;
    }
    return false;
  }

  public onRequest(): void {
    if(this.busy) {
      console.log("can't save while processing");
      return;
    }
    this.busy = true;
    if(!this.added) {
      this.emigoService.addEmigo(this.emigoMessage).then(i => {
        this.emigoService.requestContact(i).then(() => {
          this.busy = false;
        }).catch(err => {
          this.busy = false;
          console.log("EmigoService.requestContact failed");
          dialogs.alert({ message: "failed to request connection", okButtonText: "ok" });
        });
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.addEmigo failed");
        dialogs.alert({ message: "failed to save contact", okButtonText: "ok" });
      });
    }
    else {
      this.emigoService.requestContact(this.contact.emigo.emigoId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.requestContact failed");
        dialogs.alert({ message: "failed to request connection", okButtonText: "ok" });
      });
    }
  }

  public canAccept(): boolean {
    if(this.added && this.contact.status == 'received') {
      return true;
    }
    if(!this.added && this.view.pending) {
      return true;
    }
    return false;
  }

  public onAccept(): void {
    this.busy = true;
    if(!this.added && this.view.pending) {
      this.emigoService.addEmigo(this.emigoMessage).then(i => {
        this.emigoService.acceptContact(this.contact.emigo.emigoId).then(() => {
          this.busy = false;
        }).catch(err => {
          this.busy = false;
          console.log("EmigoService.acceptContact failed");
          dialogs.alert({ message: "failed to accept pending connection", okButtonText: "ok" });
        });
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.addEmigo failed");
        dialogs.alert({ message: "failed to accept pending connection", okButtonText: "ok" });
      });
    }
    else {
      this.emigoService.acceptContact(this.contact.emigo.emigoId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.acceptContact failed");
        dialogs.alert({ message: "failed to accept connection", okButtonText: "ok" });
      });
    }
  }

  public canDeny(): boolean {
    if(this.added && this.contact.status == 'received') {
      return true;
    }
    if(!this.added && this.view.pending) {
      return true;
    }
    return false;
  }

  public onDeny() {
    this.busy = true;
    if(!this.added && this.view.pending) {
      this.emigoService.clearEmigoRequest(this.view.shareId).then(() => {
        this.busy = false;
        this.router.back();
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.clearEmigoRequest failed");
        dialogs.alert({ message: "failed to deny pending request", okButtonText: "ok" });
      });
    }
    else {
      this.emigoService.closeContact(this.contact.emigo.emigoId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.closeContact failed");
        dialogs.alert({ message: "failed to deny request", okButtonText: "ok" });
      });
    }
  }

  public canCancel(): boolean {
    if(this.added && this.contact.status == 'requested') {
      return true;
    }
    return false;
  }

  public onCancel(): void {
    this.busy = true;
    this.emigoService.closeContact(this.contact.emigo.emigoId).then(() => {
      this.busy = false;
    }).catch(err => {
      this.busy = false;
      console.log("EmigoService.closeContact failed");
      dialogs.alert({ message: "failed to cancel request", okButtonText: "ok" });
    });
  }

  private setContact(): void {
    if(this.afterInit) {
      if(this.contact.emigo.logo == null) {
        let obj: Image = <Image>this.img.nativeElement;
        obj.imageSource = this.avatarSrc;
      }
      else {
        let obj: Image = <Image>this.img.nativeElement;
        obj.imageSource = ImageSource.fromBase64Sync(this.contact.emigo.logo);
      }
    }

    if(this.contact.emigo.name == null) {
      this.name = "Contact";
    }
    else {
      this.name = this.contact.emigo.name;
    }
    this.notes = this.contact.notes;
  }

  private onOrientation() {
    setTimeout(() => {
      this.hideLabelMenu();
    }, 500);
  }

  public onBack() {
    this.router.back();
  }

  public getScreenGrid(): string {
    if(this.notesSet && this.iOS) {
      return "*,*";
    }
    else {
      return "*";
    }
  }

  public onOptions(ev): void {
    let actions = [];
    if(this.added) {
      if(this.contact.status == "connected") {
        actions.push({ id: 1, title: "Disconnect" });
      }
      actions.push({ id: 0, title: "Delete Contact" });
      actions.push({ id: 2, title: "Refresh Contact" });
    }
    Menu.popup({ view: ev.view, actions: actions, cancelButtonText: "Dismiss" }).then(action => {
      if(action.id == 0) {
        dialogs.confirm({ message: "Are you sure you want to delete this contact?",
            okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(flag => {
          if(flag) {
            this.busy = true;
            this.emigoService.deleteEmigo(this.contact.emigo.emigoId).then(() => {
              this.busy = false;
              this.router.back();
            }).catch(err => {
              console.log("EmigoService.deleteEmigo failed");
              dialogs.alert({ message: "failed to delete contact", okButtonText: "ok" });
            });
          }
        });
      }
      if(action.id == 1) {
        dialogs.confirm({ message: "Are you sure you want to disconnect from this contat?",
            okButtonText: "Yes, Disconnect", cancelButtonText: "No, Cancel" }).then(flag => {
          if(flag) {
            this.busy = true;
            this.emigoService.closeContact(this.contact.emigo.emigoId).then(() => {
              this.busy = false;
            }).catch(err => {
              this.busy = false;
              console.log("EmigoService.closeContact failed");
              dialogs.alert({ message: "failed to cancel request", okButtonText: "ok" });
            });
          }
        }); 
      }
      if(action.id == 2) {
        this.emigoService.refreshEmigoContact(this.contact.emigo.emigoId);
      }
    });
  }

  public getLabels(): string {
    if(this.contact == null || this.contact.labels == null || this.contact.labels.size == 0) {
      return "Add a label";
    }

    // construct label list
    let l: string = null;
    this.contact.labels.forEach(v => {
      for(let i = 0; i < this.labels.length; i++) {
        if(this.labels[i].labelId == v) {
          if(l == null) {
            l = this.labels[i].label.name;
          }
          else {
            l += ", " + this.labels[i].label.name;
          }
        }
      }
    });

    // check if labels matched
    if(l == null) {
      return "Add a label";
    }
    return l;
  }

  public onMenuSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.right) {
      this.hideLabelMenu();
    }
  }

  public onLabelCreate() {
    this.router.navigate(["/labelcreate"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
  }

  public onLabel(l: LabelEntry): void {
    this.labelBusy = true;
    if(this.isLabeled(l)) {
      this.emigoService.clearEmigoLabel(this.contact.emigo.emigoId, l.labelId).then(() => {
        this.labelBusy = false;
      }).catch(err => {
        this.labelBusy = false;
        console.log("EmigoService.clearEmigoLabel failed");
        dialogs.alert({ message: "failed to remove contact label", okButtonText: "ok" });
      });
    }
    else {
      this.emigoService.setEmigoLabel(this.contact.emigo.emigoId, l.labelId).then(() => {
        this.labelBusy = false;
      }).catch(err => {
        this.labelBusy = false; 
        console.log("EmigoService.clearEmigoLabel failed");
        dialogs.alert({ message: "failed to add contact label", okButtonText: "ok" });
      });
    }
  }

  public isLabeled(l: LabelEntry): boolean {
    if(this.contact.labels != null) {
      return this.contact.labels.has(l.labelId);
    }
    return false;
  }

  public clearNotes() {
    if(this.notesSet) {
      this.notesSet = false;
      this.notes = this.contact.notes;
    }
    else {
      this.busy = true;
      this.emigoService.updateEmigo(this.contact.emigo.emigoId, null).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.updateEmigo failed");
        dialogs.alert({ message: "failed to clear contact notes", okButtonText: "ok" });
      });
    }
  }

  public getHint(): string {
    if(this.notesSet) {
      return "";
    }
    else {
      return this.hint;
    }
  }

  public getNotes(): string {
    if(this.notes == null) {
      return "Add personal notes about the contact";
    }
    return this.notes;
  }

  public onNotes() {
    this.notesSet = true;
  }

  public setNotes() {
    this.busy = true;
    this.emigoService.updateEmigo(this.contact.emigo.emigoId, this.notes).then(() => {
      this.busy = false;
      this.notesSet = false;
    }).catch(err => {
      this.busy = false;
      console.log("EmigoService.updateEmigo failed");
      dialogs.alert({ message: "failed to set contact notes", okButtonText: "ok" });
    });
  }

  public updateNotes(n: string) {
    this.notes = n;
  }

  public showLabelMenu(): void {
    this.menuSet = true;
    let right: GridLayout = <GridLayout>this.menu.nativeElement;
    right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: AnimationCurve.easeOut })
  }

  public hideLabelMenu(): void {
    this.menuSet = false;
    let right: GridLayout = <GridLayout>this.menu.nativeElement;
    let width: number = (right.getMeasuredWidth() / screen.mainScreen.scale) + 16;
    right.animate({ translate: { x: width, y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
  }

  public setEmail(e: string) {
    utils.openUrl("mailto:" + e);
  }

  public setPhone(t: string) {
    utils.openUrl("tel:" + t.replace(/\D/g,''));
  }

  public setSms(s: string) {
    utils.openUrl("sms:" + s.replace(/\D/g,''));
  }

  public setWebsite(s: string) {
    if(s.startsWith('http')) {
      utils.openUrl(s);
    }
    else {
      utils.openUrl('https://' + s);
    }
  }

  public setSocial(a: any) {
    clipboard.setText(a.value.link);

    // show copied message
    a.flag = true;
    setTimeout(() => {
      a.flag = false;
    }, 1000);
  }

  public setLocation(l: any) {
    let location: string = "";
    if(l.streetPo != null) {
      location += l.streetPo + " ";
    }
    if(l.cityTown != null) {
      location += l.cityTown + " ";
    }
    if(l.provinceState != null) {
      location += l.provinceState + " ";
    }
    if(l.postalCode != null) {
      location += l.postalCode + " ";
    }
    if(l.country != null) {
      location += l.country + " ";
    }
    location = location.replace(/ /g, "+");
    utils.openUrl("https://www.google.com/maps/search/?api=1&query=" + location);
  }

  public setBusinessCardPhone(view: Image, b: any) {
    let options: any[] = [];
    if(b.mainPhone) {
      options.push({ id: options.length, title: "main: " + b.mainPhone, value: b.mainPhone });
    }
    if(b.directPhone) {
      options.push({ id: options.length, title: "direct: " + b.directPhone, value: b.directPhone });
    }
    if(b.mobilePhone) {
      options.push({ id: options.length, title: "mobile: " + b.mobilePhone, value: b.mobilePhone });
    }
    if(options.length == 1) {
      utils.openUrl("tel:" + options[0].value.replace(/\D/g,''));
    }
    if(options.length > 1) {
      Menu.popup({ view: view, actions: options, cancelButtonText: "Dismiss" }).then(a => {
        if(a != false) {
          utils.openUrl("tel:" + options[a.id].value.replace(/\D/g,''));
        }
      });
    }
  }

  public setBusinessCardSms(view: Image, b: any) {
    let options: any[] = [];
    if(b.mainPhoneSms) {
      options.push({ id: options.length, title: "main: " + b.mainPhone, value: b.mainPhone });
    }
    if(b.directPhoneSms) {
      options.push({ id: options.length, title: "direct: " + b.directPhone, value: b.directPhone });
    }
    if(b.mobilePhoneSms) {
      options.push({ id: options.length, title: "mobile: " + b.mobilePhone, value: b.mobilePhone });
    }
    if(options.length == 1) {
      utils.openUrl("sms:" + options[0].value.replace(/\D/g,''));
    }
    if(options.length > 1) {
      Menu.popup({ view: view, actions: options, cancelButtonText: "Dismiss" }).then(a => {
        if(a != false) {
          utils.openUrl("sms:" + options[a.id].value.replace(/\D/g,''));
        }
      });
    }
  }

  public isWebsite(a: AttributeEntityData): boolean {
    return AttributeUtil.isWebsite(a);
  }

  public isBusinessCard(a: AttributeEntityData): boolean {
    return AttributeUtil.isCard(a);
  }

  public isEmail(a: AttributeEntityData): boolean {
    return AttributeUtil.isEmail(a);
  }
  
  public isPhone(a: AttributeEntityData): boolean {
    return AttributeUtil.isPhone(a);
  }

  public isHome(a: AttributeEntityData): boolean {
    return AttributeUtil.isHome(a);
  }

  public isWork(a: AttributeEntityData): boolean {
    return AttributeUtil.isWork(a);
  }

  public isSocial(a: AttributeEntityData): boolean {
    return AttributeUtil.isSocial(a);
  }

  
}

