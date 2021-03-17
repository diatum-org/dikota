import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";
import { VerticalAlignment } from "tns-core-modules/ui/enums";
import { Button } from "tns-core-modules/ui/button";
import { GestureEventData } from "tns-core-modules/ui/gestures";
import * as utils from "tns-core-modules/utils/utils";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as geolocation from "nativescript-geolocation";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { NgZone } from '@angular/core';

import { Contact } from '../model/contact';
import { GpsLocation } from '../model/gpsLocation';
import { SearchArea } from '../model/searchArea';
import { DikotaService } from '../service/dikota.service';
import { AmigoService } from '../appdb/amigo.service';
import { ScaleService } from '../service/scale.service';

@Component({
    selector: "search",
    moduleId: module.id,
    templateUrl: "./search.component.xml"
})
export class SearchComponent implements OnInit, OnDestroy {

  private location: boolean = false;
  private nearby: boolean = false;
  private avatarSrc: ImageSource = null;
  private maskSrc: ImageSource = null;
  public loaderInterval: number = null;
  public busy: boolean = false;
  public search: string = "";
  public stopId: any = null;
  public watchId: number = null;
  @ViewChild("res", {static: false}) amigos: ElementRef;
  private ids: Set<string>;
  private iOS: boolean;
  private scaleMap: Map<string, Image>;
  private sub: Subscription[] = [];
  private noLocation: boolean = false;
  private noDirectory: boolean = false;

  constructor(private router: RouterExtensions,
      private zone: NgZone,
      private scaleService: ScaleService,
      private dikotaService: DikotaService,
      private amigoService: AmigoService) {
    this.scaleMap = new Map<string, Image>();
    this.ids = new Set<string>();
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    
    // load avatar
    this.avatarSrc = ImageSource.fromFileSync("~/assets/avatar.png");

    // load mask
    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");

    // set scaled image
    this.sub.push(this.scaleService.image.subscribe(s => {
      if(s != null && this.scaleMap.has(s.id)) {
        this.scaleMap.get(s.id).src = s.imgSource;
      }
    }));
  }

  ngOnDestroy(): void {
    clearInterval(this.loaderInterval);
    this.onLocation(false);
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onNearby() {
    this.noLocation = false;
    this.noDirectory = false; 
    this.nearby = true;
    this.clearEntries();
  }

  public onDirectory() {
    this.noLocation = false;
    this.noDirectory = false;
    this.nearby = false;
    this.onLocation(false);
    this.clearEntries();
  }

  public onLocation(flag: boolean) {
    if(this.stopId != null) {
      clearTimeout(this.stopId);
      this.stopId = null;
    }
    if(flag) {
      this.noLocation = false;
      geolocation.enableLocationRequest(true).then(() => {
        geolocation.isEnabled().then(flag => {
          // location watch enabled
          this.location = true;

          // start watching location
          this.watchId = geolocation.watchLocation(loc => {
            if(loc) {
              let gps: GpsLocation = { longitude: loc.longitude, latitude: loc.latitude, altitude: loc.altitude };
              this.dikotaService.setLocation(gps).then(() => {
                let min: GpsLocation = { longitude: loc.longitude - 0.01, 
                    latitude: loc.latitude - 0.01, altitude: loc.altitude - 100 };
                let max: GpsLocation = { longitude: loc.longitude + 0.01, 
                    latitude: loc.latitude + 0.01, altitude: loc.altitude + 100 };
                let area: SearchArea = { min: min, max: max };
                this.dikotaService.scan(area).then(e => {
                  if(e.length == 0 && this.ids.size == 0) {
                    this.noLocation = true;
                  }
                  this.addEntries(e);
                }).catch(err => {
                  console.log("DikotaService.scan failed");
                  dialogs.alert({ message: "failed to scan area", okButtonText: "ok" });
                });
              }).catch(err => {
                console.log("DikotaService.setLocation failed");
                dialogs.alert({ message: "failed to set location", okButtonText: "ok" });
              });
            }
          }, err => {
            console.log("geoLocation.watchLocation failed");
            dialogs.alert({ message: "failed to read location", okButtonText: "ok" });
          }, { updateTime: 2000 });
        }, err => {
          console.log("geoLocation.isEnabled failed");
          dialogs.alert({ message: "failed to check gps", okButtonText: "ok" });
        });

        // disable after 5min
        this.stopId = setTimeout(() => {
          this.onLocation(false);
        }, 300000);
      }, () => {
        this.location = false;
        console.log("geoLocation.enableLocationRequest failed");
        dialogs.alert({ message: "failed to enable location access", okButtonText: "ok" });
      });
    }
    else {
      this.location = false;
      if(this.watchId != null) {
        geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    }
  }

  private clearEntries() {
    // clear previous list 
    let stack = <StackLayout>this.amigos.nativeElement;
    while(stack.getChildrenCount() > 0) {
      let view = stack.getChildAt(0);
      stack.removeChild(view);
    }
    this.ids.clear();
  }

  private addEntries(c: Contact[]) {
    for(let i = 0; i < c.length; i++) {
      if(!this.ids.has(c[i].amigoId)) {
        let stack = <StackLayout>this.amigos.nativeElement;
        stack.addChild(this.getEntry(c[i]));
        this.ids.add(c[i].amigoId);
      }
    }
  }

  public isEmpty(): boolean {
    return this.ids.size == 0;
  }

  public onBack() {
    this.router.back();
  }

  public onApplySearch() {
    this.busy = true;
    this.clearEntries();
    this.noDirectory = false;
    this.noLocation = false;
    this.dikotaService.search(this.search).then(e => {
      if(e == null || e.length == 0) {
        this.noDirectory = true;
      }
      this.busy = false;
      this.addEntries(e);
    }).catch(err => {
      this.busy = false;
      dialogs.alert({ message: "failed to search directory", okButtonText: "ok" });
    });
  }

  public onSetSearch(value: string): void {
    this.search = value;
  }

  public onClearSearch(): void {
    this.search = "";
  }

  private getIcon(id: string, logo: string): Image {
    let img: Image = new Image();
    img.width = 64;
    img.height = 64;

    // scale image
    this.scaleMap.set(id, img);
    img.src = this.scaleService.setImage(id, logo);
    return img;
  }

  private getMask(): Image {
    let img: Image = new Image();
    img.width = 64;
    img.height = 64;
    img.src = this.maskSrc;
    return img;
  }

  private getEntry(e: Contact): GridLayout {
    let name: Label = new Label();
    name.text = e.name;
    name.fontSize = 18;
    name.className = "text";

    let handle: Label = new Label();
    handle.text = e.handle;
    handle.fontSize = 16; 
    handle.className = "text";

    let icon: Image = this.getIcon(e.amigoId, e.logo);
    let mask: Image = this.getMask();

    let s: StackLayout = new StackLayout();
    s.paddingLeft = 16;
    s.verticalAlignment = VerticalAlignment.middle;
    s.addChild(name);
    s.addChild(handle);

    let g: GridLayout = new GridLayout();
    g.on(Button.tapEvent, () => {
      
      this.zone.run(async () => { 

        // select contact for profile
        await this.amigoService.setContact(e.amigoId);
  
        this.router.navigate(["/contactprofile", e.amigoId, e.registry, e.available, false],
          { clearHistory: false, animated: true, transition: 
          { name: "slideLeft", duration: 300, curve: "easeIn" }});
      });
    });
    g.height = 64;
    g.marginLeft = 16;
    g.marginTop = 8;
    g.paddingBottom = 8;
    g.borderBottomWidth = 1;
    g.borderColor = "#F8F8F8";
    g.addColumn(new ItemSpec(1, "auto"));
    g.addColumn(new ItemSpec(1, "star"));
    g.addChildAtCell(icon, 0, 0);
    g.addChildAtCell(mask, 0, 0);
    g.addChildAtCell(s, 0, 1);
    return g;
  }

}
