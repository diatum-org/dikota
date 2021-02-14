import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";
import { VerticalAlignment, HorizontalAlignment, Orientation } from "tns-core-modules/ui/enums";
import { Button } from "tns-core-modules/ui/button";
import { TouchGestureEventData, SwipeGestureEventData, SwipeDirection, GestureEventData } from "tns-core-modules/ui/gestures";
import { ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Subscription } from "rxjs";
import { EventData } from 'tns-core-modules/data/observable';
import { Menu } from "nativescript-menu";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { NgZone } from "@angular/core";

import { AttributeUtil, AttributeDataEntry } from '../attributeUtil';
import { DikotaService } from '../service/dikota.service';
import { ContextService } from '../service/context.service';
import { MonitorService } from '../service/monitor.service';
import { EmigoService, EmigoView, EmigoContact, AttributeEntity } from '../appdb/emigo.service';
import { Emigo } from '../appdb/emigo';
import { LabelEntry } from '../appdb/labelEntry';

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./home.component.xml"
})
export class HomeComponent implements OnInit, OnDestroy {

  public sync: number = null;
  private labelId: string = null;
  public name: string = null;
  private imgObject: any = null;
  private imgSource: ImageSource = null;
  public labels: LabelEntry[] = [];
  @ViewChild("res", {static: false}) emigos: ElementRef;
  @ViewChild("top", {static: false}) top: ElementRef;
  @ViewChild("nxt", {static: false}) next: ElementRef;
  @ViewChild("scr", {static: false}) scrollView: ElementRef;
  @ViewChild("lmu", {static: false}) leftMenu: ElementRef;
  @ViewChild("rmu", {static: false}) rightMenu: ElementRef;
  @ViewChild("bar", {static: false}) bar: ElementRef;
  private leftMenuVisible: boolean = false;
  private rightMenuVisible: boolean = false;
  private avatarSrc: ImageSource = null;
  private maskSrc: ImageSource = null;
  private viewSrc: ImageSource = null;
  private phoneSrc: ImageSource = null;
  private textSrc: ImageSource = null;
  private emailSrc: ImageSource = null;
  private sub: Subscription[] = [];
  private selected: string = null;
  private grids: Map<string, GridLayout>;
  private scrollTop: number = null;
  private scrollBottom: number = null;
  private scrollIdx: Map<string, number>;
  private scrollVal: number[];
  private application: any;
  private orientation: any;
  private allset: boolean = false;
  private count: number = null;
  private scrollFont: number = 12;
  private iOS: boolean;
  private searchSet: boolean = false;
  private search: string = null;
  private filter: string = null;
  private alertMsg: string = "";
  private nodeAlert: boolean = false;
  private registryAlert: boolean = false;
  private afterInit: boolean = false;
  private contacts: EmigoView[] = [];
  public notify: boolean = false;
  public syncProgress: number = null;

  constructor(private router: RouterExtensions,
      private zone: NgZone,
      private monitorService: MonitorService,
      private contextService: ContextService,
      private dikotaService: DikotaService,
      private emigoService: EmigoService) {
    this.grids = new Map<string, GridLayout>();
    this.scrollVal = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.scrollIdx = new Map<string, number>();
    this.scrollIdx.set('A', 0);
    this.scrollIdx.set('B', 1);
    this.scrollIdx.set('C', 2);
    this.scrollIdx.set('D', 3);
    this.scrollIdx.set('E', 4);
    this.scrollIdx.set('F', 5);
    this.scrollIdx.set('G', 6);
    this.scrollIdx.set('H', 7);
    this.scrollIdx.set('I', 8);
    this.scrollIdx.set('J', 9);
    this.scrollIdx.set('K', 10);
    this.scrollIdx.set('L', 11);
    this.scrollIdx.set('M', 12);
    this.scrollIdx.set('N', 13);
    this.scrollIdx.set('O', 14);
    this.scrollIdx.set('P', 15);
    this.scrollIdx.set('Q', 16);
    this.scrollIdx.set('R', 17);
    this.scrollIdx.set('S', 18);
    this.scrollIdx.set('T', 19);
    this.scrollIdx.set('U', 20);
    this.scrollIdx.set('V', 21);
    this.scrollIdx.set('W', 22);
    this.scrollIdx.set('X', 23);
    this.scrollIdx.set('Y', 24);
    this.scrollIdx.set('Z', 25);

    this.application = require('application');
    this.orientation = (args) => { this.onOrientation(); };
    this.iOS = (device.os == "iOS");
    this.emigoService.setLabels(null);
  }

  ngOnInit(): void {

    // load mask
    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");

    // load default icon
    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");

    // load messaging icon
    this.textSrc = ImageSource.fromFileSync("~/assets/messaging.png");
    
    // load email icon
    this.emailSrc = ImageSource.fromFileSync("~/assets/email.png");

    // load telephone icon
    this.phoneSrc = ImageSource.fromFileSync("~/assets/telephone.png");

    // observe labels
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    })); 

    // observe notify flag
    this.sub.push(this.monitorService.notifyFlag.subscribe(n => {
      this.notify = n;
    }));

    // observe node alert
    this.sub.push(this.emigoService.nodeAlert.subscribe(f => {
      this.nodeAlert = f;
      this.setAlert();
    }));

    // observe registry alert
    this.sub.push(this.emigoService.registryAlert.subscribe(f => {
      this.registryAlert = f;
      this.setAlert();
    }));

    // observe sync status
    this.sub.push(this.emigoService.synchronizing.subscribe(s => {
      this.syncProgress = s;
    }));

    // observe identity
    this.sub.push(this.emigoService.identity.subscribe(i => {
      
      // extract name
      if(i == null || i.name == null) {
        this.name = null;
      }
      else {
        this.name = i.name;
      }

      // extract logo
      if(i == null || i.logo == null) {
        this.imgSource = this.avatarSrc;
      }
      else {
        this.imgSource = ImageSource.fromBase64Sync(i.logo);
      }

      // load logo
      if(this.imgObject != null) {
        this.imgObject.imageSource = this.imgSource;
      }
    }));

    // update dikota profile
    this.dikotaService.getProfileRevision().then(n => {
      this.emigoService.getAppProperty("dikota_revision").then(r => {
        if(r == null || r.num != n) {
          this.dikotaService.getProfile().then(p => {
            this.emigoService.setAppProperty("dikota_revision", { num: n }).then(() => {
              this.emigoService.setAppProperty("dikota_profile", p).then(() => {}).catch(err => {
                console.log("EmigoService.setAppProperty failed");
              });
            }).catch(err => {
              console.log("EmigoService.setAppProperty failed");
            });
          }).catch(err => {
            console.log("DikotaService.getProfile failed");
          });
        }
      }).catch(err => {
        console.log("EmigoService.getAppProperty failed");
      });
    }).catch(err => {
      console.log("DikotaService.getProfileRevision failed");
    });
    
    this.sub.push(this.emigoService.filteredContacts.subscribe(c => {
      if(this.count == null || this.count == 0) {
        this.count = c.length;
      }

      // determine scroll range for each letter
      for(let i = 0; i < 26; i++) {
        this.scrollVal[i] = 0;
      }
      for(let i = 0; i < c.length; i++) {
        this.scrollVal[this.getScrollIdx(c[i].name)] += 1;
      }
      let prev: number = 0;
      for(let i = 0; i < 26; i++) {
        this.scrollVal[i] = this.scrollVal[i] * 64 + prev;
        prev = this.scrollVal[i];
      }

      this.contacts = c;
      this.applyContacts();
    }));

    this.application.on(this.application.orientationChangedEvent, this.orientation);
  }

  ngAfterViewInit(): void {
    this.afterInit = true;
    this.applyContacts();
  }

  ngOnDestroy(): void {
    this.application.off(this.application.orientationChangedEvent, this.orientation);

    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private getScrollIdx(s: string): number {
    if(s != null) {
      let str: string = s.toUpperCase();
      if(this.scrollIdx.has(str.charAt(0))) {
        return this.scrollIdx.get(str.charAt(0));
      }
    }
    return 0;
  }

  private setAlert(): void {
    if(this.nodeAlert && this.registryAlert) {
      this.alertMsg = "Communication Error";
    }
    else if(this.nodeAlert) {
      this.alertMsg = "Node Communication Error";
    }
    else if(this.registryAlert) {
      this.alertMsg = "Registry Communication Error";
    }
    else {
      this.alertMsg = "";
    }
  }

  private applyContacts() {

    if(this.afterInit) {
      // populate list of emigos
      let e: EmigoView[] = this.contacts;
      let stack = <StackLayout>this.emigos.nativeElement;
      let views: Map<string, GridLayout> = new Map<string, GridLayout>();
      for(let i = 0; i < e.length; i++) {
        let id: string = e[i].id + "-" + e[i].identityRevision + "-" + e[i].attributeRevision;
        if(e[i].appData != null) {
          id += "-" + e[i].appData.revision;
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
          let g: GridLayout = this.getGridView(e[i]);
          stack.insertChild(g, i);
          views.set(id, g);
        }
      }
      while(stack.getChildrenCount() > e.length) {
        stack.removeChild(stack.getChildAt(e.length));
      }
      this.grids = views;
    }
  }

  private selectContact(e: EmigoView): void {
    this.emigoService.selectEmigoContact(e.id).then(() => {
      this.contextService.setEmigo({ id: e.id, handle: e.handle, registry: null, pending: false, available: true });
      this.zone.run(() => {
        this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
          transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
      });
    }).catch(err => {
      console.log("EmigoService.selectEmigoContact failed");
      dialogs.alert({ message: "failed to select contact", okButtonText: "ok" });
    });
  }

  private getGridView(e: EmigoView): GridLayout {

    let name: Label = new Label();
    name.text = e.name;
    name.fontSize = 18;
    name.className = "text";
    name.translateY = -12;
    name.verticalAlignment = VerticalAlignment.middle;
    name.paddingLeft = 12;
    name.on(Button.tapEvent, () => {
      this.selectContact(e);
    }); 
  
    let mask: Image = new Image();
    mask.width = 48;
    mask.height = 48;
    mask.src = this.maskSrc;
    mask.on(Button.tapEvent, () => {
      this.emigoService.selectEmigoContact(e.id).then(() => {
        this.contextService.setEmigo({ id: e.id, handle: e.handle, registry: null, pending: false, available: true });
        this.zone.run(() => {
          this.router.navigate(["/contactprofile"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
        });
      }).catch(err => {
        console.log("EmigoService.selectEmigoContact failed");
        dialogs.alert({ message: "failed to select contact", okButtonText: "ok" });
      });
    });

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

    let g: GridLayout = new GridLayout();
    g.on(Button.tapEvent, () => {});
    g.height = 64;
    g.marginLeft = 16;
    g.paddingTop = 8;
    g.paddingBottom = 8;
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);

    let ctrl: GridLayout = new GridLayout();
    ctrl.addColumn(new ItemSpec(1, "star"));
    ctrl.addColumn(new ItemSpec(1, "auto"));
    g.addChildAtCell(ctrl, 0, 1);
    g.addChildAtCell(name, 0, 1);

    let fill: Label = new Label();
    fill.on(Button.tapEvent, () => {
      this.selectContact(e);
    });
    ctrl.addChildAtCell(fill, 0, 0);   
 
    let btns: StackLayout = new StackLayout();
    btns.orientation = Orientation.horizontal;
    btns.horizontalAlignment = HorizontalAlignment.right;

    if(e.appData != null && e.appData.hasText) {
      let text: Image = new Image();
      text.on(Button.tapEvent, () => {
        this.emigoService.getEmigoContact(e.id).then(c => {
          let texts: AttributeDataEntry[] = AttributeUtil.getTextData(c.attributes);
          this.onControl("sms", texts, text);
        });
      });
      text.marginLeft = 16;  
      text.width = 32;
      text.height = 32;
      text.translateY = 12;
      text.src = this.textSrc;
      btns.addChild(text);
    }
    
    if(e.appData != null && e.appData.hasPhone) {
      let phone: Image = new Image();
      phone.on(Button.tapEvent, () => {
        this.emigoService.getEmigoContact(e.id).then(c => {
          let phones: AttributeDataEntry[] = AttributeUtil.getPhoneData(c.attributes);
          this.onControl("tel", phones, phone);
        });
      });
      phone.marginLeft = 16;
      phone.width = 32;
      phone.height = 32;
      phone.translateY = 12;
      phone.src = this.phoneSrc;
      btns.addChild(phone);
    }

    if(e.appData != null && e.appData.hasEmail) {
      let email: Image = new Image();
      email.on(Button.tapEvent, () => {
        this.emigoService.getEmigoContact(e.id).then(c => {
          let emails: AttributeDataEntry[] = AttributeUtil.getEmailData(c.attributes);
          this.onControl("mailto", emails, email, false);
        });
      });
      email.marginLeft = 16;
      email.width = 32;
      email.height = 32;
      email.translateY = 12;
      email.src = this.emailSrc;
      btns.addChild(email);
    }

    // add buttons to view
    ctrl.addChildAtCell(btns, 0, 1);

    return g;
  }

  private onSearchUpdate(s: string) {
    if(s == null) {
      this.emigoService.setFilter(null);
      this.search = null;
    }
    else if(s.length == 0) {
      this.emigoService.setFilter(null);
      this.search = null;
      this.searchSet = false;
    }
    else {
      this.emigoService.setFilter(s);
      this.search = s;
    }  
  }

  private onSearchSet() {
    this.filter = this.search;
    this.searchSet = true;
  }

  private onSearchClear() {
    this.filter = null;
    this.onSearchUpdate(null);
  }

  private onOrientation() {
    setTimeout(() => {
      this.setScrollFont();
      this.leftMenuVisible = true;
      this.rightMenuVisible = true;
      this.dismissMenu();
    }, 500);
  }

  private getWidth(g: GridLayout): number {
    return (g.getMeasuredWidth() / screen.mainScreen.scale) + 16;
  }

  private setScrollFont() {
    let a = <Label>this.top.nativeElement;
    let b = <Label>this.next.nativeElement;
    let diff = b.getLocationOnScreen().y - a.getLocationOnScreen().y;
    if(diff == 0) {
      setTimeout(() => { this.setScrollFont() }, 1000);
    }
    else {
      if((b.getLocationOnScreen().y - a.getLocationOnScreen().y) > 16) {
        this.scrollFont = 12;
      }
      else {
        this.scrollFont = 6;
      }
    }
  }

  private setMenuPos() {
    this.leftMenuVisible = false;
    this.rightMenuVisible = false;

    let left: GridLayout = <GridLayout>this.leftMenu.nativeElement;
    let right: GridLayout = <GridLayout>this.rightMenu.nativeElement;
    
    let leftWidth = this.getWidth(left);
    let rightWidth = this.getWidth(right);

    if(leftWidth == 0 || rightWidth == 0) {
      setTimeout(() => { this.setMenuPos() }, 1000);
    }
    else {
      left.translateX = -1 * leftWidth;
      right.translateX = rightWidth;
    }
  }

  private onScroll(y: number) {
    this.scrollTop = null;
    this.scrollBottom = null;
    let a = <Label>this.top.nativeElement;
    let b = <Label>this.next.nativeElement;
    let h = 26 * (b.getLocationOnScreen().y - a.getLocationOnScreen().y);
    if(h == 0) {
      setTimeout(() => { this.onScroll(y); }, 1000);
    }
    else {
      this.scrollTop = y;
      this.scrollBottom = y + h;
    }
  }

  public isLabeled(l: string): boolean {
    if(this.labelId == l) {
      return true;
    }
    return false;
  }

  public onTouch(ev: TouchGestureEventData) {
    let s = <GridLayout>this.bar.nativeElement;
    let barHeight = s.getMeasuredHeight() / screen.mainScreen.scale;
    let barOffset = (screen.mainScreen.heightPixels / screen.mainScreen.scale) - barHeight;
    let pos = Math.floor((26 * (ev.getY() - barOffset)) / barHeight);
    let view = <ScrollView>this.scrollView.nativeElement;
    let offset = 0;
    if(pos > 0 && pos < 26) {
      offset = this.scrollVal[pos-1];
    }
    view.scrollToVerticalOffset(offset, false);
  }

  private isVisible(idx: number): boolean {
    if(this.scrollTop == null || this.scrollBottom == null) {
      return false;
    }

    // compute vertical range for letter
    let top = 0;
    if(idx > 0) {
      top = this.scrollVal[idx - 1];
    }
    let bottom = this.scrollVal[idx];

    // check if range overlaps with scroll view
    if(top >= this.scrollTop && top <= this.scrollBottom) {
      return true;
    }
    if(bottom >= this.scrollTop && bottom <= this.scrollBottom) {
      return true;
    }
    if(top <= this.scrollTop && bottom >= this.scrollBottom) {
      return true;
    }
    return false;
  }

  public getScrollWeight(idx: number): string {
    if(this.isVisible(idx)) {
      return "Bold";
    }
    return "Normal";
  }

  public getScrollSize(idx: number): string {
    if(this.isVisible(idx)) {
      let n: number = this.scrollFont + 2;
      return n.toString();
    }
    return this.scrollFont.toString();
  }

  public onScreenTap() {
    this.dismissMenu();
  }

  private dismissMenu() {
    if(this.leftMenuVisible) {
      let left: GridLayout = <GridLayout>this.leftMenu.nativeElement;
      left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: AnimationCurve.easeOut }).catch(err => {
        console.log(err);
      });
      this.leftMenuVisible = false;
    }
    if(this.rightMenuVisible) {
      let right: GridLayout = <GridLayout>this.rightMenu.nativeElement;
      right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: AnimationCurve.easeOut }).catch(err => {
        console.log(err);
      });
      this.rightMenuVisible = false;
    }
  }

  onMainMenu(): void {
    let left: GridLayout = <GridLayout>this.leftMenu.nativeElement;
    let right: GridLayout = <GridLayout>this.rightMenu.nativeElement;
    if(this.leftMenuVisible) {
      left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.leftMenuVisible = false;
    }
    else {
      left.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.leftMenuVisible = true;
    }
    if(this.rightMenuVisible) {
      right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.rightMenuVisible = false;
    }
  }

  onLabelMenu(): void {
    let left: GridLayout = <GridLayout>this.leftMenu.nativeElement;
    let right: GridLayout = <GridLayout>this.rightMenu.nativeElement;
    if(this.rightMenuVisible) {
      right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.rightMenuVisible = false;
    }
    else {
      right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.rightMenuVisible = true;
    }
    if(this.leftMenuVisible) {
      left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: AnimationCurve.easeOut });
      this.leftMenuVisible = false;
    }
  }

  public onControl(prefix: string, e: AttributeDataEntry[], view: Image, trim: boolean = true) {
    if(e == null || e.length == 0) {
      console.log("no entry option");
    }
    else if(e.length == 1) {
      if(trim) {
        utils.openUrl(prefix + ":" + e[0].value.replace(/\D/g,''));
      }
      else {
        utils.openUrl(prefix + ":" + e[0].value);
      }
    }
    else {
      let actions: any[] = [];
      for(let i = 0; i < e.length; i++) {
        actions.push({ id: i, title: e[i].type + ": " + e[i].value });
      }
      Menu.popup({ view: view, actions: actions, cancelButtonText: "Dismiss" }).then(a => {
        if(a != false) {
          if(trim) {
            utils.openUrl(prefix + ":" + e[a.id].value.replace(/\D/g,''));
          }
          else {
            utils.openUrl(prefix + ":" + e[a.id].value);
          }
        }
      });
    }
  }

  public onLabelSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.right) {
      this.dismissMenu();
    }
  }

  public onLabel(label: string): void {
    this.labelId = label;
    if(label == null) {
      this.emigoService.setLabels(null);
    }
    else if(label == "") {
      this.emigoService.setLabels([]);
    }
    else {
      this.emigoService.setLabels([ label ]);
    }
  }

  public onCreateEdit(): void {
    this.router.navigate(["/labels"], { clearHistory: false, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onMainSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.left) {
      this.dismissMenu();
    }
  }

  public onImageLoaded(args: EventData) {
    this.imgObject = args.object;
    if(this.imgSource != null) {
      this.imgObject.imageSource = this.imgSource;
    }
  }

  public onAbout() {
    this.router.navigate(["/about"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onSettings() {
    this.router.navigate(["/settings"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onTour() {
    this.router.navigate(["/boardingp0"], { clearHistory: true, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onProfile() {
    this.router.navigate(["/profile"], { clearHistory: false, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onSearch() {
    this.router.navigate(["/search"], { clearHistory: false, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onPending() {
    this.router.navigate(["/pending"], { clearHistory: false, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onSaved() {
    this.router.navigate(["/saved"], { clearHistory: false, animated: true, 
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
    setTimeout(() => {
      this.dismissMenu();
    }, 300);
  }

  public onLogout() {
    dialogs.confirm({ message: "Log out of Dikota?", okButtonText: "Log Out", cancelButtonText: "Cancel" }).then(flag => {
      if(flag) {
        this.monitorService.stop();
        this.dikotaService.clearToken();
        this.emigoService.clearEmigo();
        this.emigoService.clearAppContext().then(() => {
          this.router.navigate(["/root"], { clearHistory: true });
        }).catch(err => {
          console.log("EmigoService.clearAppContext failed");
          dialogs.alert({ message: "internal error [EmigoService.clearAppContext]", okButtonText: "ok" });
        });
      }
    });
  }
}
