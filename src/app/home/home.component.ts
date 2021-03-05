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

import { ContactEntry, ContactLayoutType } from '../contactEntry';

import { AttributeUtil } from '../attributeUtil';
import { DikotaService } from '../service/dikota.service';
import { EntryService } from '../service/entry.service';
import { EmigoService } from '../appdb/emigo.service';
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
  @ViewChild("res", {static: false}) contacts: ElementRef;
  @ViewChild("top", {static: false}) top: ElementRef;
  @ViewChild("nxt", {static: false}) next: ElementRef;
  @ViewChild("scr", {static: false}) scrollView: ElementRef;
  @ViewChild("lmu", {static: false}) leftMenu: ElementRef;
  @ViewChild("rmu", {static: false}) rightMenu: ElementRef;
  @ViewChild("bar", {static: false}) bar: ElementRef;
  private leftMenuVisible: boolean = false;
  private rightMenuVisible: boolean = false;
  private avatarSrc: ImageSource = null;
  private sub: Subscription[] = [];
  private selected: string = null;
  private scrollTop: number = null;
  private scrollBottom: number = null;
  private scrollIdx: Map<string, number>;
  private scrollVal: number[];
  private application: any;
  private orientation: any;
  private allset: boolean = true;
  private scrollFont: number = 12;
  private iOS: boolean;
  private searchSet: boolean = false;
  private search: string = null;
  private filter: string = null;
  private alertMsg: string = "";
  private nodeAlert: boolean = false;
  private registryAlert: boolean = false;
  public notify: boolean = false;
  public syncProgress: number = null;

  private entries: Map<string, ContactEntry>;

  constructor(private router: RouterExtensions,
      private zone: NgZone,
      private entryService: EntryService,
      private dikotaService: DikotaService,
      private emigoService: EmigoService) {
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
    this.emigoService.setEmigoSearchFilter(null);
    this.entries = new Map<string, ContactEntry>();
  }

  ngOnInit(): void {

    // load default icon
    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");

    // observe labels
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
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
    
    this.application.on(this.application.orientationChangedEvent, this.orientation);
  }

  ngAfterViewInit(): void {
    
    // observe filtered contacts
    this.sub.push(this.emigoService.filteredContacts.subscribe(c => {

      if(c.length > 0) {
        // timeout to avoid change-after-check error
        setTimeout(() => {
          this.allset = false;
        }, 1);
      }

      // load contact
      let stack = <StackLayout>this.contacts.nativeElement;
      stack.removeChildren();
      for(let i = 0; i < c.length; i++) {
        let e: ContactEntry = this.entries.get(c[i].emigoId);
        if(e == null) {
          e = new ContactEntry(this.emigoService, this.entryService, this.router, this.zone);
          this.entries.set(c[i].emigoId, e);
        }
        e.setContact(c[i], ContactLayoutType.Controls);
        stack.addChild(e.getLayout());
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
    }));
  }

  ngAfterContentInit(): void {
    // observe contact notifications
    this.sub.push(this.entryService.notifyUpdate.subscribe(n => {
      this.notify = n;
    }));
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

  private onSearchUpdate(s: string) {
    if(s == null) {
      this.emigoService.setEmigoSearchFilter(null);
      this.search = null;
    }
    else if(s.length == 0) {
      this.emigoService.setEmigoSearchFilter(null);
      this.search = null;
      this.searchSet = false;
    }
    else {
      this.emigoService.setEmigoSearchFilter(s);
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

  public onControl(prefix: string, e: any[] , view: Image, trim: boolean = true) {
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
      this.emigoService.setEmigoLabelFilter(null);
    }
    else if(label == "") {
      this.emigoService.setEmigoLabelFilter("");
    }
    else {
      this.emigoService.setEmigoLabelFilter(label);
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
        this.emigoService.clearEmigo();
        this.entryService.clear();
        this.dikotaService.clearToken();
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
