import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, ElementRef, QueryList } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from '@angular/router';
import { EventData } from 'tns-core-modules/data/observable';
import { Menu } from "nativescript-menu";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures";
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";
import { TextView } from "tns-core-modules/ui/text-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import * as clipboard from "nativescript-clipboard";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { AnimationCurve } from "tns-core-modules/ui/enums";

import { AttributeUtil } from '../attributeUtil';
import { EmigoService } from '../appdb/emigo.service';
import { LabelEntry } from '../appdb/labelEntry';

@Component({
    selector: "labelview",
    moduleId: module.id,
    templateUrl: "./labelview.component.xml"
})
export class LabelViewComponent implements OnInit, OnDestroy {
i
  private imageObj: any = null;
  public imageSrc: ImageSource = null;
  public avatarSrc: ImageSource = null;
  public menuSet: boolean = false;
  public selected: LabelEntry = null;
  public ready: boolean = false;
  public labeled = [];
  public loaded: boolean = false;
  public active: boolean = false;
  public saving: boolean = false;
  public labeling: boolean = false;
  public notesActive: boolean = false;
  public notesHint: string = "";
  public emigoId: string;
  public shareId: string;
  public registry: string;
  public node: string;
  public name: string;
  public handle: string;
  public status: string;
  public location: string;
  public description: string;
  public notes: string;
  public labelName: string = "No Label / User Directory";
  private iOS: boolean;
  private application: any;
  private orientation: any;
  private sub: Subscription[] = [];
  public labels: LabelEntry[] = [];
  public attributes: any[] = [];
  @ViewChild("stk", {static: false}) stk: ElementRef;
  @ViewChild("tvn", {static: false}) tvn: ElementRef;
  @ViewChild("rmu", {static: false}) menu: ElementRef;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService) {
    this.iOS = (device.os == "iOS");
    this.application = require('application');
    this.orientation = (args) => { this.onOrientation(); };
  }

  ngOnInit(): void {

    // load default logo
    this.avatarSrc = ImageSource.fromFileSync("~/assets/avatar.png");

    this.emigoService.getAttributes().then(a => {
      for(let i = 0; i < a.length; i++) {

        // construct label set
        let labels: Set<string> = new Set<string>();
        for(let j = 0; j < a[i].labels.length; j++) {
          labels.add(a[i].labels[j]);
        }

        // construct data object
        this.attributes.push({ 
          id: a[i].attribute.attributeId, 
          schema: a[i].attribute.schema, 
          obj: JSON.parse(a[i].attribute.data),
          labels: labels,
        });
      }
    });

    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    }));

    this.sub.push(this.emigoService.identity.subscribe(i => {
      this.name = i.name;
      this.handle = i.handle;
      this.location = i.location;
      this.description = i.description;
      if(i.logo != null) {
        this.imageSrc = ImageSource.fromBase64Sync(i.logo);
      }
      else {
        this.imageSrc = this.avatarSrc;
      }  
      if(this.imageObj != null) {
        this.imageObj.imageSource = this.imageSrc;
      } 
    }));

    this.application.on(this.application.orientationChangedEvent, this.orientation);
  }

  ngOnDestroy(): void {
    this.application.off(this.application.orientationChangedEvent, this.orientation);

    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onImageLoaded(args: EventData) {
    this.imageObj = args.object;
    if(this.imageSrc != null) {
      this.imageObj.imageSource = this.imageSrc;
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

  public isSelected(id: string): boolean {
    if(this.selected == null) {
      if(id == null) {
        return true;
      }
      else {
        return false;
      }
    }
    if(this.selected.labelId == id) {
      return true;
    }
    else {
      return false;
    }
  }

  public onLabel(l: LabelEntry) {
    this.selected = l;
    this.labeled.length = 0;
    this.hideLabelMenu();
    if(l == null) {
      this.labelName = "No Label / User Directory";
    }
    else {
      this.labelName = l.name;
      for(let i = 0; i < this.attributes.length; i++) {
        let a = this.attributes[i];
        if(a.labels.has(l.labelId)) {
          this.labeled.push(a);
        }
      }
    }
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

  public isWebsite(a): boolean {
    return AttributeUtil.isWebsite(a);
  }

  public isCard(a): boolean {
    return AttributeUtil.isCard(a);
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

  public onMenuSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.right) {
      this.hideLabelMenu();
    }
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

  public isPhoneNumber(p: string): boolean {
    if(p == null || p == "") {
      return false;
    }
    return true;
  }

  public hasSms(sms: boolean): string {
    if(sms) {
      return "(text)";
    }
    return "";
  }

  public isSms(sms: boolean): boolean {
    if(sms == true) {
      return true;
    }
    return false;
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

  public setSocial(l: string) {
    clipboard.setText(l);
  }

  public isBusinessCardLocation(b: any) {
    if(b == null) {
      return false;
    }
    if(b.streetPo != null || b.cityTown != null || b.provinceStateCounty != null || b.postalCode != null || b.country != null) {
      return true;
    }
    return false;
  }

  public isBusinessCardSms(b: any) {
    if(b == null) {
      return false;
    }
    if(b.mainPhoneSms || b.directPhoneSms || b.mobilePhoneSms) {
      return true;
    }
    return false;
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

  public isBusinessCardPhone(b: any) {
    if(b == null) {
      return false;
    }
    if(b.mainPhone != null || b.directPhone != null || b.mobilePhone != null) {
      return true;
    }
    return false;
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

}

