import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "@nativescript/angular";
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

import { getAmigoObject } from '../appdb/amigo.util';
import { Amigo } from '../appdb/amigo';
import { BitmapService } from '../service/bitmap.service';
import { EntryService } from '../service/entry.service';
import { AmigoService } from '../appdb/amigo.service';
import { AmigoContact } from '../appdb/amigoContact';
import { ContactEntry, ContactLayoutType } from '../contactEntry';

@Component({
    selector: "saved",
    moduleId: module.id,
    templateUrl: "./saved.component.xml"
})
export class SavedComponent implements OnInit, OnDestroy {

  private sub: Subscription[] = [];
  @ViewChild("res", {static: false}) saved: ElementRef;
  private iOS: boolean;
  private grids: Map<string, ContactEntry>;
  private empty: boolean;

  constructor(private router: RouterExtensions,
      private bitmapService: BitmapService,
      private entryService: EntryService,
      private amigoService: AmigoService,
      private zone: NgZone) {
    this.grids = new Map<string, ContactEntry>();
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    // observe list of saved amigos
    this.sub.push(this.entryService.savedContacts.subscribe(async c => {

      if(c.length == 0) {
        setTimeout(() => {
          this.empty = true;
        }, 1);
      }

      // load contacts
      let stack = <StackLayout>this.saved.nativeElement;
      stack.removeChildren();
      for(let i = 0; i < c.length; i++) {
        let e: ContactEntry = this.grids.get(c[i].amigoId);
        if(e == null) {
          e = new ContactEntry(this.amigoService, this.entryService, this.router, this.zone);
          this.grids.set(c[i].amigoId, e);
        }
        e.setContact(c[i], ContactLayoutType.Basic);
        stack.addChild(e.getLayout());
      }
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onBack() {
    this.router.back();
  }

  timeout(s: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, s));
  }

}




