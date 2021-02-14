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
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { NgZone } from "@angular/core";

import { getEmigoObject } from '../appdb/emigo.util';
import { Emigo } from '../appdb/emigo';
import { ContextService } from '../service/context.service';
import { BitmapService } from '../appdb/bitmap.service';
import { EmigoService, EmigoView } from '../appdb/emigo.service';

@Component({
    selector: "saved",
    moduleId: module.id,
    templateUrl: "./saved.component.xml"
})
export class SavedComponent implements OnInit, OnDestroy {

  private avatarSrc: ImageSource = null;
  private maskSrc: ImageSource = null;
  private sub: Subscription[] = [];
  @ViewChild("res", {static: false}) saved: ElementRef;
  private iOS: boolean;
  private emigos: EmigoView[] = [];
  private grids: Map<string, GridLayout>;
  private afterInit: boolean = false;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private contextService: ContextService,
      private zone: NgZone) {
    this.grids = new Map<string, GridLayout>();
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    
    // load mask
    this.maskSrc = ImageSource.fromFileSync("~/assets/mask.png");

    // load default icon
    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");
    
    // observe list of saved emigos
    this.sub.push(this.emigoService.savedContacts.subscribe(c => {
      this.emigos = c;
      this.setContacts();
    }));
  }

  ngAfterViewInit(): void {
    this.afterInit = true;
    this.setContacts();
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private setContacts() {
  
    if(this.afterInit) {
      // populate list of saved contacts
      let stack = <StackLayout>this.saved.nativeElement;
      let views: Map<string, GridLayout> = new Map<string, GridLayout>();
      for(let i = 0; i < this.emigos.length; i++) {
        let emigo: EmigoView = this.emigos[i];
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
          let g: GridLayout = this.getView(emigo);
          stack.insertChild(g, i);
          views.set(id, g);
        }
      }
      while(stack.getChildrenCount() > this.emigos.length) {
        stack.removeChild(stack.getChildAt(this.emigos.length));
      }
      this.grids = views;
    }
  }

  private getView(e: EmigoView): GridLayout {
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

  public onBack() {
    this.router.back();
  }

}
