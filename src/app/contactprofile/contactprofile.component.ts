import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router'
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
import { ContactView } from '../model/contactView';

import { Attribute } from '../appdb/attribute';
import { LabelEntry } from '../appdb/labelEntry';
import { getAmigoObject } from '../appdb/amigo.util';
import { RegistryService } from '../appdb/registry.service';
import { AmigoService } from '../appdb/amigo.service';
import { AmigoMessage } from '../appdb/amigoMessage';
import { Amigo } from '../appdb/amigo';
import { ShareEntry } from '../appdb/shareEntry';
import { AppSettings } from '../app.settings';
import { AmigoEntry } from '../appdb/amigoEntry';
import { AmigoView } from '../appdb/amigoView';
import { AmigoContact } from '../appdb/amigoContact';
import { DikotaService } from '../service/dikota.service';

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
  private sub: Subscription[] = [];
  private application: any;
  private orientation: any;
  private iOS: boolean;
  private labels: LabelEntry[] = [];

  private imageObj: any = null;
  private imageSrc: ImageSource = null;

  private amigoMessage: AmigoMessage = null;

  private contact: AmigoContact = null;
  
  private amigoId: string;
  private registry: string;
  private available: boolean;
  private pending: boolean;  
  private shareId: string;

  private amigo: Amigo = null;
  private entry: AmigoEntry = null;
  private labelSet: Set<string> = null;
  private attr: any[] = [];
  
  @ViewChild("img", {static: false}) img: ElementRef;
  @ViewChild("rmu", {static: false}) menu: ElementRef;

  constructor(private router: RouterExtensions,
      private route: ActivatedRoute,
      private registryService: RegistryService,
      private dikotaService: DikotaService,
      private amigoService: AmigoService) {

    this.application = require('application');
    this.orientation = (args) => { this.onOrientation(); };
    this.iOS = (device.os == "iOS");
  }

  private setAmigoEntry(e: AmigoEntry) {
    this.entry = e;
    this.labelSet = new Set<string>();
    for(let i = 0; i < e.labels.length; i++) {
      this.labelSet.add(e.labels[i]);
    }
  }

  ngOnInit(): void {

    // handle orientation change
    this.application.on(this.application.orientationChangedEvent, this.orientation);

    // retrieve labels
    this.sub.push(this.amigoService.labels.subscribe(l => {
      this.labels = l;
    }));

    // retrieve contact
    this.route.params.forEach(p => {

      this.amigoId = p.amigo;
      this.registry = p.registry;
      this.available = p.available == "true";
      this.pending = p.pending != "false";
      this.shareId = p.pending;
    
      // subscribe to selected contact 
      this.sub.push(this.amigoService.selectedContact.subscribe(c => {
        
        // case to load from store
        if(this.contact == null && c != null) {

          // load identity
          this.amigoService.getContactIdentity(this.amigoId).then(e => {

            if(e != null) {
              this.amigo = e;
              this.setImage(this.amigo.logo);
            }
          }).catch(err => {
            console.log(err);
          });

          // load notes
          this.amigoService.getAmigo(this.amigoId).then(e => {
            this.setAmigoEntry(e);
          }).catch(err => {
            console.log(err);
          });

          // load attributes
          this.attr = [];
          this.amigoService.getContactProfile(p.amigo).then(a => {
            for(let i = 0; i < a.length; i++) {
              this.attr.push({ id: a[i].attributeId, schema: a[i].schema, obj: JSON.parse(a[i].data) });
            }
          }).catch(err => {
            console.log(err);
          }); 
        }

        // check if has been loaded from registry
        if(c == null) {
          if(this.amigo == null || this.amigoMessage == null) {
            this.registryService.getMessage(this.registry, this.amigoId).then(m => {
              this.amigoMessage = m;
              this.amigo = getAmigoObject(m);
              this.setImage(this.amigo.logo);
            }).catch(err => {
              console.log(err);
            });
          }
        }

        // check if any revisions have changed
        if(this.contact != null && c != null) {

          // check if identity should reload
          if(this.contact.identityRevision != c.identityRevision) {
            this.amigoService.getContactIdentity(this.amigoId).then(e => {
              this.amigo = e;
              this.setImage(this.amigo.logo);
            }).catch(err => {
              console.log(err);
            });
          }

          // check if attributes should reload
          if(this.contact.attributeRevision != c.attributeRevision) {
            this.attr = [];
            this.amigoService.getContactProfile(p.amigo).then(a => {
              for(let i = 0; i < a.length; i++) {
                this.attr.push({ id: a[i].attributeId, schema: a[i].schema, obj: JSON.parse(a[i].data) });
              }
            }).catch(err => {
              console.log(err);
            }); 
          }
        }

        // update applied contact object
        this.contact = c;
      }));
    });
  }

  ngOnDestroy(): void {
    this.application.off(this.application.orientationChangedEvent, this.orientation);
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private setImage(img: string) {
    if(img == null) {
      this.imageSrc = ImageSource.fromFileSync("~/assets/avatar.png");
    }
    else {
      this.imageSrc = ImageSource.fromBase64Sync(img);
    }
    if(this.imageObj != null && this.imageSrc != null) {
      this.imageObj.imageSource = this.imageSrc;
    }
  }

  public onImageLoaded(args: EventData) {
    this.imageObj = args.object;
    this.imageObj.imageSource = this.imageSrc;
  }

  public getHandle(): string {
    if(this.amigo == null) {
      return null;
    }
    return this.amigo.handle;
  }

  public canSave(): boolean {

    if(this.contact == null && this.amigoMessage != null) {
      if(this.pending == true || this.available == true) {
        return true;
      }
    }
    return false;
  }

  public onSave(): void {
    
    if(this.busy == false) {
      this.busy = true;
      this.amigoService.addAmigo(this.amigoMessage).then(i => {
        this.busy = false;
        this.pending = false;
      }).catch(err => {
        this.busy = false;
        console.log("AmigoService.addAmigo failed");
        dialogs.alert({ message: "failed to save contact", okButtonText: "ok" });
      });
    }
  }

  public canRequest(): boolean {

    // can request even if not saved
    if(this.contact == null) {
      return true;
    }

    // request not an option if needs to be saved
    if(this.pending == true) {
      return false;
    }

    // states in which can request
    if(this.contact.status == "requested" || this.contact.status == "received" || this.contact.status == "connected") {
      return false;
    }

    return true;
  }

  public async onRequest() {

    if(this.busy) {
      return;
    }

    this.busy = true;   
    try { 

      // add contact if not yet added
      if(this.contact == null) {
        await this.amigoService.addAmigo(this.amigoMessage);
      }

      // add connection to contact if not yet added
      if(this.contact.shareId == null) {
        let e = await this.amigoService.addConnection(this.amigoId);
        this.contact.shareId = e.shareId;
      }

      // send connection request
      this.amigoService.openConnection(this.amigoId, this.contact.shareId, this.contact.node);
    }
    catch(err) {
      console.log(err);
      dialogs.alert({ message: "failed to request contact", okButtonText: "ok" });
    }
    this.busy = false;
  }

  public canAccept(): boolean {
  
    if(this.contact == null && this.pending == true && this.amigoMessage != null) {
      return true;
    }
    if(this.contact != null && this.contact.status == "received") {
      return true;
    }
    return false;
  }

  public onAccept(): void {

    if(this.busy == false) {

      if(this.contact == null && this.pending == true) {
        this.amigoService.addAmigo(this.amigoMessage).then(i => {
          this.pending = false;
          this.amigoService.addConnection(this.amigoId).then(e => {
            this.amigoService.openConnection(this.amigoId, e.shareId, this.amigo.node).then(s => {
              this.busy = false;
            }).catch(err => {
              this.busy = false;
              console.log(err);
              dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
            });
          }).catch(err => {
            this.busy = false;
            console.log(err);
            dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
          });
        }).catch(err => {
          this.busy = false;
          console.log(err);
          dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
        });
      }

      if(this.contact != null && this.contact.status == "received") {
        // add and request
        this.busy = true;
        this.amigoService.addConnection(this.amigoId).then(e => {
          this.amigoService.openConnection(this.amigoId, e.shareId, this.contact.node).then(s => {
            this.busy = false;
          }).catch(err => {
            this.busy = false;
            console.log(err);
            dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
          });
        }).catch(err => {
          this.busy = false;
          console.log(err);
          dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
        });
      }
    }
  }

  public canDeny(): boolean {
  
    if(this.contact == null && this.pending == true) {
      return true;
    }

    if(this.contact != null && this.contact.status == "received") {
      return true;
    }
    return false;
  }

  public onDeny() {

    if(this.busy == false) {
      if(this.contact == null && this.pending == true) {
        this.busy = true;
        this.amigoService.clearAmigoRequest(this.shareId).then(() => {
          this.pending = false;
          this.busy = false;
        }).catch(err => {
          this.busy = false;
          console.log(err);
          dialogs.alert({ message: "failed to deny pending request", okButtonText: "ok" });
        }); 
      }

      if(this.contact != null && this.contact.status == "received") {
        this.busy = true;
        this.amigoService.closeConnection(this.amigoId, this.contact.shareId, this.contact.node).then(s => {
          this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(() => {
            this.busy = false;
          }).catch(err => {
            this.busy = false;
            console.log(err);
            dialogs.alert({ message: "failed to deny connection", okButtonText: "ok" });
          });  
        }).catch(err => {
          console.log(err);
          this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(() => {
            this.busy = false;
          }).catch(err => {
            this.busy = false;
            console.log(err);
            dialogs.alert({ message: "failed to deny connection", okButtonText: "ok" });
          });
        });
      }
    }
  }

  public canCancel(): boolean {
    
    if(this.contact != null && this.contact.status == "requested") {
      return true;
    }
    return false;
  }

  public onCancel(): void {

    if(this.contact != null && this.busy == false) {
      this.busy = true;
      this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log(err);
        dialogs.alert({ message: "failed to cancel request", okButtonText: "ok" });
      });
    }
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
    this.notesSet = false;
    let actions = [];
    if(this.contact != null) {
      if(this.contact.status == "connected") {
        actions.push({ id: 1, title: "Disconnect" });
      }
      actions.push({ id: 0, title: "Delete Contact" });
      actions.push({ id: 2, title: "Refresh Contact" });
    }
    actions.push({ id: 3, title: "Report Profile" });
    Menu.popup({ view: ev.view, actions: actions, cancelButtonText: "Dismiss" }).then(action => {
      if(action.id == 0) {
        dialogs.confirm({ message: "Are you sure you want to delete this contact?",
            okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(flag => {
          if(flag) {
            this.busy = true;
            this.amigoService.removeAmigo(this.amigoId).then(() => {
              this.busy = false;
            }).catch(err => {
              console.log("AmigoService.deleteAmigo failed");
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
            this.amigoService.closeConnection(this.amigoId, this.contact.shareId, this.contact.node).then(() => {
              this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(() => {
                this.busy = false;
              }).catch(err => {
                this.busy = false;
                console.log(err);
                dialogs.alert({ message: "failed to disconnect", okButtonText: "ok" });
              });
            }).catch(err => {
              // remove connection even if frienndly close failed
              this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(() => {
                this.busy = false;
              }).catch(err => {
                this.busy = false;
                console.log(err);
                dialogs.alert({ message: "failed to disconnect", okButtonText: "ok" });
              });
            });
          }
        });
      }
      if(action.id == 2) {
        this.amigoService.refreshContact(this.contact.amigoId);
      }
      if(action.id == 3) {
        dialogs.confirm({ message: "Are you sure you want to report this profile?",
            okButtonText: "Yes, Report", cancelButtonText: "No, Cancel" }).then(flag => {
          if(flag) {
            this.busy = true;
            this.dikotaService.report(this.amigoId).then(() => {
              this.busy = false;
            }).catch(err => {
              this.busy = false;
              console.log(err);
              dialogs.alert({ message: "failed to report profile", okButtonText: "ok" });
            });
          }
        });
      }
    });
  }

  public getLabels(): string {

    // check if labels are loaded
    if(this.labelSet == null || this.labels == null) {
      return "Add a label";
    }

    // construct label list
    let l: string = null;
    for(let i = 0; i < this.labels.length; i++) {
      if(this.labelSet.has(this.labels[i].labelId)) {
        if(l == null) {
          l = this.labels[i].name;
        }
        else {
          l += ", " + this.labels[i].name;
        }
      }
    }

    // check if label was assigned
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
    if(this.labelBusy != true && this.labelSet != null) {
      this.labelBusy = true;
      if(this.labelSet.has(l.labelId)) {
        this.amigoService.clearAmigoLabel(this.amigoId, l.labelId).then(e => {
          this.labelBusy = false;
          this.setAmigoEntry(e);
        }).catch(err => {
          this.labelBusy = false;
          console.log(err);
          dialogs.alert({ message: "failed to clear labeal", okButtonText: "ok" });
        });
      }
      else {
        this.amigoService.setAmigoLabel(this.amigoId, l.labelId).then(e => {
          this.labelBusy = false;
          this.setAmigoEntry(e);
        }).catch(err => {
          this.labelBusy = false;
          console.log(err);
          dialogs.alert({ message: "failed to set labeal", okButtonText: "ok" });
        });
      }
    }
  }

  public isLabeled(l: LabelEntry): boolean {
    if(this.labelSet != null && this.labelSet.has(l.labelId)) {
      return true;
    }
    return false;
  }

  public clearNotes() {

    if(this.contact != null && this.entry != null) {
      if(this.notesSet) {
        this.notesSet = false;
        this.notes = this.entry.notes;
      }
      else {
        if(this.entry.notes != null) {
          this.busy = true;
          this.amigoService.updateAmigoNotes(this.entry.amigoId, null).then(e => {
            this.busy = false;
            this.entry = e;
          }).catch(err => {
            this.busy = false;
            console.log(err);
            dialogs.alert({ message: "failed to clear notes", okButtonText: "ok" });
          });
        }
      }
    }
  }

  public getHint(): string {
    if(this.notesSet) {
      return "";
    }
    return this.hint;
  }

  public getNotes(): string {
    if(this.entry == null || this.entry.notes == null) {
      return "Add personal notes about the contact";
    }
    return this.entry.notes;
  }

  public onNotes() {
    this.notesSet = true;
    if(this.entry == null || this.entry.notes == null) {
      this.notes = "";
    }
    else {
      this.notes = this.entry.notes;
    }
  }

  public setNotes() {

    if(this.contact != null && this.entry != null) {
      this.busy = true;
      this.amigoService.updateAmigoNotes(this.entry.amigoId, this.notes).then(e => {
        this.busy = false;
        this.entry = e;
        this.notesSet = false;
      }).catch(err => {
        this.busy = false;
        console.log(err);
        dialogs.alert({ message: "failed to set notes", okButtonText: "ok" });
      });
    }
  }

  public updateNotes(n: string) {
    this.notes = n;
  }

  public showLabelMenu(): void {
    this.notesSet = false;
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
    clipboard.setText(a.obj.link);

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

  public isWebsite(a): boolean {
    return AttributeUtil.isWebsite(a);
  }

  public isBusinessCard(a): boolean {
    return AttributeUtil.isCard(a);
  }

  public isEmail(a): boolean {
    return AttributeUtil.isEmail(a);
  }
  
  public isPhone(a): boolean {
    return AttributeUtil.isPhone(a);
  }

  public isHome(a): boolean {
    return AttributeUtil.isHome(a);
  }

  public isWork(a): boolean {
    return AttributeUtil.isWork(a);
  }

  public isSocial(a): boolean {
    return AttributeUtil.isSocial(a);
  }

  
}

