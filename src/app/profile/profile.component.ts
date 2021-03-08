import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from 'tns-core-modules/data/observable';
import { ImageSource } from "tns-core-modules/image-source";
import { Menu } from "nativescript-menu";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';

import { AttributeUtil } from '../attributeUtil';
import { AppSettings } from '../app.settings';

import { Attribute } from '../appdb/attribute';
import { LabelEntry } from '../appdb/labelEntry';
import { AttributeView } from '../appdb/attributeView';

import { EmigoService } from '../appdb/emigo.service';

@Component({
    selector: "profile",
    moduleId: module.id,
    templateUrl: "./profile.component.xml"
})
export class ProfileComponent implements OnInit, OnDestroy {

  public menuSet: boolean = false;
  public attributeData: any[] = [];
  public labels: LabelEntry[] = [];
  private labelSet: Set<string> = null;
  private name: string = null;
  private handle: string = null;
  private registry: string = null;
  private location: string = null;
  private description: string = null;
  private sub: Subscription[] = [];
  private imgObject: any = null;
  private imageSrc: ImageSource = null;
  private avatarSrc: ImageSource = null;
  public header: string = "";
  private application: any;
  private orientation: any;
  private showHint: boolean = false;
  private iOS: boolean;
  @ViewChild("rmu", {static: false}) menu: ElementRef;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService) {

    this.application = require('application');
    this.orientation = (args) => { this.onOrientation(); };
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    
    // load default logo
    this.avatarSrc = ImageSource.fromFileSync("~/assets/avatar.png");

    this.sub.push(this.emigoService.identity.subscribe(i => {
      this.name = i.name;
      this.handle = i.handle;
      this.registry = i.registry;
      this.location = i.location;
      this.description = i.description;
      if(i.logo == null) {
        this.imageSrc = this.avatarSrc;
      }
      else {
        this.imageSrc = ImageSource.fromBase64Sync(i.logo);
      }
      if(this.imgObject != null) {
        this.imgObject.imageSource = this.imageSrc;
      }
      if(i.name == null && i.location == null && i.description == null && i.logo == null) {
        this.showHint = true;
      }
      else {
        this.showHint = false;
      }
    }));
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    }));

    this.sub.push(this.emigoService.attributes.subscribe(a => {
      let attr: any[] = [];
      for(let i = 0; i < a.length; i++) {

        // construct label set
        let labels: Set<string> = new Set<string>();
        for(let j = 0; j < a[i].labels.length; j++) {
          labels.add(a[i].labels[j]);
        }

        // build labels
        attr.push({ 
          attributeId: a[i].attribute.attributeId, 
          schema: a[i].attribute.schema, 
          obj: JSON.parse(a[i].attribute.data),
          labels: labels,
        });
      }
      this.attributeData = attr;
    }));

    this.application.on(this.application.orientationChangedEvent, this.orientation);
  }

  ngOnDestroy(): void {
    this.application.off(this.application.orientationChangedEvent, this.orientation);

    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public getHandle(): string {
    if(this.registry == null || this.handle == null) {
      return "";
    }
    if(this.registry == AppSettings.REGISTRY) {
      return this.handle;
    }
    var reg = /^(https:\/\/registry\.).*(\/app)$/
    if(reg.test(this.registry)) {
      return this.handle + " [" + this.registry.replace(/^(https:\/\/registry\.)/,"").replace(/(\/app)$/,"") + "]";
    }
    return "invalid registry";
  }

  private onOrientation() {
    setTimeout(() => {
      this.hideLabelMenu();
    }, 500);
  }

  public onBack() {
    this.router.back();
  }

  public onEdit() {
    this.router.navigate(["/profileedit"], { clearHistory: false });
  }

  public onImageLoaded(args: EventData) {
    this.imgObject = args.object;
    if(this.imageSrc != null) {
      this.imgObject.imageSource = this.imageSrc;
    }
  }

  public onMenu(ev): void {
    let actions: any[] = [ { id: 1, title: "Edit Public Image" }, { id: 2, title: "Edit Public Info" }, 
        { id: 3, title: "Add Info" }, { id: 4, title: "View as Label" } ];
    Menu.popup({ view: ev.view, actions: actions, cancelButtonText: "Dismiss"}).then(action => {
      if(action.id == 0) {
        this.router.navigate(["/publicprofile"], { clearHistory: false });
      }
      if(action.id == 1) {
        this.router.navigate(["/profileimage"], { clearHistory: false });
      }
      if(action.id == 2) {
        this.router.navigate(["/profileedit"], { clearHistory: false });
      }
      if(action.id >= 3) {
        this.router.navigate(["/profileattribute"], { clearHistory: false });
      }
      if(action.id == 4) {
        this.router.navigate(["/labelview"], { clearHistory: false });
      }
    }).catch(() => {
      console.log("popup menu failed");
    });
  }

  public onLabel(l: LabelEntry) {
    //this.labelService.setEntry(l);
    //this.router.navigate(["/labelprofile"], { clearHistory: false });
  }

  public isLabeled(l: LabelEntry): boolean {
    if(this.labelSet == null) {
      return false;
    }
    return this.labelSet.has(l.labelId);
  }

  public getSms(sms: boolean): string {
    if(sms == true) {
      return " (text)";
    }
    return "";
  }

  public viewAttribute(a: any) {
    this.router.navigate(["/attributeedit", a.attributeId], { clearHistory: false });
  }

  public showLabel(a: any, h: string) {

    // show label menu
    this.header = h;
    this.labelSet = a.labels;
    this.showLabelMenu();
  }

  public onCreate() {
    this.router.navigate(["/labelcreate"], { clearHistory: false, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  public onMenuSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.right) {
      this.hideLabelMenu();
    }
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

  public isWebsite(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isWebsite(a);
  }

  public isBusinessCard(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isCard(a);
  }

  public isEmail(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isEmail(a);
  }
  
  public isPhone(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isPhone(a);
  }

  public isHome(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isHome(a);
  }

  public isWork(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isWork(a);
  }

  public isSocial(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    return AttributeUtil.isSocial(a);
  }

}

