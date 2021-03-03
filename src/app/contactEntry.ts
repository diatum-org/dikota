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

import { Emigo } from './appdb/emigo';
import { Attribute } from './appdb/attribute';
import { AttributeUtil } from './attributeUtil';
import { EntryService } from './service/entry.service';
import { EmigoContact } from './appdb/emigoContact';
import { EmigoService } from './appdb/emigo.service';

export enum ContactLayoutType {
  Basic,
  Controls,
  Updates
}

export class ContactEntry {

  private maskSrc: ImageSource = null;
  private grid: GridLayout = null;
  private emigoService: EmigoService;
  private entryService: EntryService;
  private router: RouterExtensions;
  private zone: NgZone;

  private emigoSet: boolean = false;
  private identityRevision: number = null;
  private attributeRevision: number = null;
  private emigoId: string = null;
  private registry: string = null;
  private mode: ContactLayoutType = null;

  constructor(emigoService: EmigoService, 
        entryService: EntryService, 
        router: RouterExtensions, 
        zone: NgZone) {

    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");
    this.emigoService = emigoService;
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

  public async setContact(e: EmigoContact, mode: ContactLayoutType) {

    // reset on contact change
    if(!this.emigoSet || this.mode != mode ||
        (this.identityRevision == null && e.identityData != null) ||
        (this.identityRevision != null && e.identityData == null) ||
        (this.identityRevision != null && e.identityData != null && 
            this.identityRevision != e.identityData.revision) ||
        (this.attributeRevision == null && e.attributeData != null) || 
        (this.attributeRevision != null && e.attributeData == null) ||
        (this.attributeRevision != null && e.attributeData != null &&
            this.attributeRevision != e.attributeData.revision)) {

      // reset layout  
      this.grid.removeChildren();

      // 
      if(e.identityData == null) {
        e.identityData = { revision: null, icon: null };
      }
      if(e.attributeData == null) {
        e.attributeData = { revision: null, text: [], phone: [], email: [] };
      }

      // render name
      let name: Label = new Label();
      name.text = e.name;
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
      icon.src = this.entryService.getIcon(e.emigoId);

      // place icon
      this.grid.addChildAtCell(icon, 0, 0);
      this.grid.addChildAtCell(mask, 0, 0);
      
      if(mode == ContactLayoutType.Basic) {
 
        // render handle
        let handle: Label = new Label();
        handle.text = e.handle;
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
      else if(mode == ContactLayoutType.Updates) {

        // render status
        let status: Label = new Label();
        status.fontSize = 14;
        status.className = "text";
        if(e.status == "connected") {
          status.text = "Is now connected";
        }
        else if(e.status == "received") {
          status.text = "Sent you a request";
        }
        else {
          status.text = e.status;
        }

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
          this.entryService.notifyContact(e.emigoId);
        });
      }
      else {
 
        // position text
        name.paddingLeft = 12;
        name.paddingTop = 4;
        name.verticalAlignment = VerticalAlignment.top;
        name.on(Button.tapEvent, () => {
          this.selectContact(e);
        });

        // place attribute layout 
        let ctrl: GridLayout = new GridLayout();
        ctrl.addColumn(new ItemSpec(1, "star"));
        ctrl.addColumn(new ItemSpec(1, "auto"));
        this.grid.addChildAtCell(ctrl, 0, 1);

        // layout control buttons
        let btns: StackLayout = new StackLayout();
        btns.orientation = Orientation.horizontal;
        btns.horizontalAlignment = HorizontalAlignment.right;

        let fill: Label = new Label();
        fill.on(Button.tapEvent, () => {
          this.selectContact(e);
        });

        ctrl.addChildAtCell(fill, 0, 0);
        ctrl.addChildAtCell(name, 0, 0, 1, 2);

        if(e.attributeData != null && e.attributeData.text.length > 0) {
          let text: Image = new Image();
          text.on(Button.tapEvent, () => {
            this.onControl("sms", e.attributeData.text, text);
          });
          text.marginLeft = 16;
          text.width = 32;
          text.height = 32;
          text.translateY = 12;
          text.src = ImageSource.fromFileSync("~/assets/messaging.png");
          btns.addChild(text);
        }

        if(e.attributeData != null && e.attributeData.phone.length > 0) {
          let phone: Image = new Image();
          phone.on(Button.tapEvent, () => {
            this.onControl("tel", e.attributeData.phone, phone);
          });
          phone.marginLeft = 16;
          phone.width = 32;
          phone.height = 32;
          phone.translateY = 12;
          phone.src = ImageSource.fromFileSync("~/assets/telephone.png");
          btns.addChild(phone);
        }
    
        if(e.attributeData != null && e.attributeData.email.length > 0) {
          let email: Image = new Image();
          email.on(Button.tapEvent, () => {
            this.onControl("mailto", e.attributeData.email, email, false);
          });
          email.marginLeft = 16;
          email.width = 32;
          email.height = 32;
          email.translateY = 12;
          email.src = ImageSource.fromFileSync("~/assets/email.png");
          btns.addChild(email);
        }

        // add buttons to view
        ctrl.addChildAtCell(btns, 0, 1);

        this.grid.on(GestureTypes.swipe, () => {});
      }

      // store params
      this.mode = mode;
      this.emigoSet = true;
      this.identityRevision = e.identityData.revision;
      this.attributeRevision = e.attributeData.revision;
      this.emigoId = e.emigoId;
      this.registry = e.registry;
    }
  }

  private async selectContact(e: EmigoContact) {
    this.zone.run(async () => {
      if(this.emigoSet) {
        await this.emigoService.setContact(e.emigoId);
        this.router.navigate(["/contactprofile", this.emigoId, this.registry, true, false],
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
