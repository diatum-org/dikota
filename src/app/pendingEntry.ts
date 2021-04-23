import { RouterExtensions } from "nativescript-angular/router";
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";
import { VerticalAlignment, HorizontalAlignment, Orientation } from "tns-core-modules/ui/enums";
import { Button } from "tns-core-modules/ui/button";
import { GestureTypes, SwipeGestureEventData } from "tns-core-modules/ui/gestures";
import { GestureEventData } from "tns-core-modules/ui/gestures";
import { NgZone } from '@angular/core';
import * as utils from "tns-core-modules/utils/utils";
import { EventData } from 'tns-core-modules/data/observable';
import { Menu } from "nativescript-menu";

import { Amigo } from './appdb/amigo';
import { Attribute } from './appdb/attribute';
import { AttributeUtil } from './attributeUtil';
import { EntryService, IdentityData, ProfileData, PendingData } from './service/entry.service';
import { PendingContact } from './appdb/pendingContact';
import { AmigoService } from './appdb/amigo.service';

export enum PendingLayoutType {
  Basic,
  Updates
}

export class PendingEntry {

  private maskSrc: ImageSource = null;
  private grid: GridLayout = null;
  private amigoService: AmigoService;
  private entryService: EntryService;
  private router: RouterExtensions;
  private zone: NgZone;

  private amigoSet: boolean = false;
  private revision: number = null;
  private amigoId: string = null;
  private registry: string = null;
  private mode: PendingLayoutType = null;

  constructor(amigoService: AmigoService, 
        entryService: EntryService, 
        router: RouterExtensions, 
        zone: NgZone) {

    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");
    this.amigoService = amigoService;
    this.entryService = entryService;
    this.router = router;  
    this.zone = zone;  

    // allocate new grid 
    this.grid = new GridLayout();
    this.grid.height = 64;
    this.grid.marginLeft = 16;
    this.grid.paddingTop = 8;
    this.grid.paddingBottom = 8;
    this.grid.addColumn(new ItemSpec(1, "auto"));
    this.grid.addColumn(new ItemSpec(1, "star"));
  }

  public getLayout(): GridLayout {
    return this.grid;
  }

  public async setPending(e: PendingContact, mode: PendingLayoutType) {

    // reset on contact change
    if(!this.amigoSet || mode != this.mode || 
        (this.revision == null && e.revision != null) ||
        (this.revision != null && e.revision == null) ||
        (this.revision != null && e.revision != null && 
            this.revision != e.pendingData.revision)) {
  
      // reset layout  
      this.grid.removeChildren();

      // set default identity data
      if(e.pendingData == null) {
        e.pendingData = { revision: null, name: "", handle: "", icon: null };
      } 

      // render name
      let name: Label = new Label();
      name.text = e.pendingData.name;
      name.fontSize = 18;
      name.className = "text";

      // render mask
      let mask: Image = new Image();
      mask.width = 48;
      mask.height = 48;
      mask.src = this.maskSrc;
      mask.on(Button.tapEvent, () => {
        this.selectContact(e);
      });

      // render icon
      let icon: Image = new Image();
      icon.width = 48;
      icon.height = 48;
      icon.src = this.entryService.getIcon(e.shareId);

      // place icon
      this.grid.addChildAtCell(icon, 0, 0);
      this.grid.addChildAtCell(mask, 0, 0);
      
      if(mode == PendingLayoutType.Basic) {
 
        // render handle
        let handle: Label = new Label();
        handle.text = e.pendingData.handle;
        handle.fontSize = 16;
        handle.className = "text";
         
        // position text
        let s: StackLayout = new StackLayout();
        s.paddingLeft = 16;
        s.verticalAlignment = VerticalAlignment.middle;
        s.addChild(name);
        s.addChild(handle);
        s.on(Button.tapEvent, () => {
          this.selectContact(e);
        });

        // place entry
        this.grid.addChildAtCell(s, 0, 1);
        
        this.grid.on(GestureTypes.swipe, () => {});
      }
      else if(mode == PendingLayoutType.Updates) {

        // render status
        let status: Label = new Label();
        status.fontSize = 14;
        status.className = "text";
        status.text = "Sent you a request";

        // position text
        let s: StackLayout = new StackLayout();
        s.paddingLeft = 16;
        s.verticalAlignment = VerticalAlignment.middle;
        s.addChild(name);
        s.addChild(status);
        s.on(Button.tapEvent, () => {
          this.selectContact(e);
        });

        // place update layout 
        let ctrl: GridLayout = new GridLayout();
        ctrl.addColumn(new ItemSpec(1, "star"));
        ctrl.addColumn(new ItemSpec(1, "auto"));

        // render date
        let date: Label = new Label();
        date.text = this.getOffset(e.updated);
        date.fontSize = 14;
        date.className = "text";
        date.verticalAlignment = VerticalAlignment.middle;
        date.paddingRight = 16;

        ctrl.addChildAtCell(s, 0, 0);
        ctrl.addChildAtCell(date, 0, 1);
        this.grid.addChildAtCell(ctrl, 0, 1);

        this.grid.on(GestureTypes.swipe, () => {
          this.entryService.notifyPending(e.shareId);
        });
      }

      // store fields
      this.mode = mode;
      this.amigoSet = true;
      this.revision = e.pendingData.revision;
      this.amigoId = e.pendingData.amigoId;
      this.registry = e.pendingData.registry;
    }
  }

  private async selectContact(e: PendingContact) {

    this.zone.run(async () => {
      if(this.amigoSet && e.pendingData != null) {
        await this.amigoService.setContact(e.pendingData.amigoId);
        this.router.navigate(["/contactprofile", this.amigoId, this.registry, true, e.shareId],
          { clearHistory: false, animated: true, transition:
          { name: "slideLeft", duration: 300, curve: "easeIn" }});
      }
    });
  }

  public onControl(prefix: string, e: any[], view: Image, trim: boolean = true) {

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
        let type = e[i].type == null ? "" : e[i].type;
        let value = e[i].value == null ? "" : e[i].value;
        actions.push({ id: i, title: type + ": " + value });
      }
      Menu.popup({ view: view, actions: actions, cancelButtonText: "Dismiss" }).then(a => {
        if(a.id > 0) {
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

}
