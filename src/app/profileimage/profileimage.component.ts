import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { PinchGestureEventData } from "tns-core-modules/ui/gestures";
import { PanGestureEventData } from "tns-core-modules/ui/gestures";
import { View } from "tns-core-modules/ui/core/view";
import { Size } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page"
import { Label } from "tns-core-modules/ui/label";
import { Image } from "tns-core-modules/ui/image";
import { ImageSource, fromAsset, fromFile, fromResource, fromBase64 } from "tns-core-modules/image-source";
import { GridLayout, ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout';
import { EventData } from 'tns-core-modules/data/observable';
import { CameraService } from "../service/camera.service";
import { GalleryService } from "../service/gallery.service";
import { BitmapService } from "../service/bitmap.service";
import { EmigoService } from "../appdb/emigo.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as utils from "tns-core-modules/utils/utils";
import * as application from "tns-core-modules/application";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';

@Component({
    selector: "profileimage",
    moduleId: module.id,
    templateUrl: "./profileimage.component.xml"
})
export class ProfileImageComponent implements OnInit, OnDestroy {

  private source: ImageSource = null;
  private avatarSrc: ImageSource = null;

  private applyReset: boolean;
  private applySave: boolean;
  private applyCrop: boolean;
  private applyText: string;

  private profileWidth: number;
  private profileHeight: number;
  private overlayWidth: number;
  private overlayHeight: number;

  private imgWidth: number;
  private imgHeight: number;
  private boxWidth: number;
  private boxHeight: number;

  private timeout: any = null;
  public moveVisible: string;
  public stretchVisible: string;
  public clearVisible: string;
  private scale: number;
  private deltaX: number;
  private deltaY: number;
  private sub: Subscription[] = [];
  public msg: string = "---";
  private orientationEvent: any;
  private iOS: boolean;
  private discard: any;

  private bound: GridLayout;
  private frame: Label;
  private profile: Image;
  private move: Image;
  private stretch: Image;
  private clear: Image;

  private dirty: boolean = false;

  @ViewChild("box", {static: false}) box: ElementRef;
  @ViewChild("frm", {static: false}) frm: ElementRef;
  @ViewChild("img", {static: false}) img: ElementRef;
  @ViewChild("mov", {static: false}) mov: ElementRef;
  @ViewChild("sth", {static: false}) sth: ElementRef;
  @ViewChild("clr", {static: false}) clr: ElementRef;

  constructor(private router: RouterExtensions,
      private bitmapService: BitmapService,
      private galleryService: GalleryService,
      private cameraService: CameraService,
      private emigoService: EmigoService,
      private page: Page) {
    this.iOS = (device.os == "iOS");
    this.clearVisible = "hidden";
    this.moveVisible = "hidden";
    this.stretchVisible = "hidden";
    this.applyText = "";
    this.applyCrop = false;
    this.applySave = false;
    this.applyReset = false;
  }

  ngOnInit(): void {

    // load default logo
    this.avatarSrc = ImageSource.fromFileSync("~/assets/avatar.png");

    // check if we are discarding changes
    if(application.android != null) {
      this.discard = (args: any) => {
        args.cancel = true;
        if(this.isDirty()) {
          dialogs.confirm({ message: "Are you sure you want to discard your changes?",
              okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
            if(flag) {
              this.goBack();
            }
          });
        }
        else {
          this.goBack();
        }
      };
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }

    // setup orientation callback
    //this.application = require('application');
    //this.orientationEvent = (args) => { this.onOrientation(); };
    //this.application.on(this.application.orientationChangedEvent, this.orientationEvent);
    //this.application.off(this.application.orientationChangedEvent, this.orientationEvent);

  }

  ngAfterViewInit() {

    // store reference to objects
    this.profile = <Image>this.img.nativeElement;
    this.move = <Image>this.mov.nativeElement;
    this.clear = <Image>this.clr.nativeElement;
    this.stretch = <Image>this.sth.nativeElement;
    this.bound = <GridLayout>this.box.nativeElement;
    this.frame = <Label>this.frm.nativeElement;

    this.sub.push(this.emigoService.identity.subscribe(i => {
      if(i == null || i.logo == null) {
        this.profile.imageSource = this.avatarSrc;
      }
      else {
        let src: ImageSource = ImageSource.fromBase64Sync(i.logo);
        this.clearOverlay();
        this.setImageSource(src);
      }
    }));
  }

  ngOnDestroy(): void {
    if(this.timeout != null) {
      clearTimeout(this.timeout);
    }
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
    this.profile.imageSource = null;
    utils.GC();
  }

  private goBack() {
    if(application.android != null) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }
    this.router.back();
  }

  private onOrientation() {
    if(this.profile != null && this.profile.imageSource != null) {
      //this.clearOverlay();
      this.applyCrop = false;
      this.applySave = false;
      this.applyText = "";
      this.clearVisible = "visible";
      this.moveVisible = "hidden";
      this.stretchVisible = "hidden";
      this.setImageSource(this.profile.imageSource);
    } 
  }

  isDirty() {
    return this.applySave || this.applyCrop || this.applyReset;
  }

  onBack() {
    if(this.isDirty()) {
      dialogs.confirm({ message: "Are you sure you want to discard your changes?",
          okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
        if(flag) {
          this.goBack();
        }
      });
    }
    else {
      this.goBack();
    }
  }

  onPan(args: PanGestureEventData) {

    if(isIOS) {
      args.deltaX *= this.scale;
      args.deltaY *= this.scale;
    }

    // correct for left
    let left = (this.scale * this.overlayWidth / 2) - (this.deltaX + args.deltaX);
    if(left > this.profileWidth / 2) {
      args.deltaX = (this.scale * this.overlayWidth / 2) - (this.deltaX + this.profileWidth / 2);
    }
    // correct for right
    let right = (this.scale * this.overlayWidth / 2) + (this.deltaX + args.deltaX);
    if(right > this.profileWidth / 2) {
      args.deltaX = (this.profileWidth / 2) - (this.scale * this.overlayWidth / 2) - this.deltaX;
    }
    // correct for top
    let top = (this.scale * this.overlayHeight / 2) - (this.deltaY + args.deltaY);
    if(top > this.profileHeight / 2) {
      args.deltaY = (this.scale * this.overlayHeight / 2) - (this.deltaY + this.profileHeight / 2);
    }
    // correct for bottom
    let bottom = (this.scale * this.overlayHeight / 2) + (this.deltaY + args.deltaY);
    if(bottom > this.profileHeight / 2) {
      args.deltaY = (this.profileHeight / 2) - (this.scale * this.overlayHeight / 2) - this.deltaY;
    }
  
    // reposition image
    if(args.state == 2) {
      this.move.translateX = this.deltaX + args.deltaX;
      this.move.translateY = this.deltaY + args.deltaY;
    }
    if(args.state == 3) {
      this.deltaX += args.deltaX;
      this.deltaY += args.deltaY;
      this.move.translateX = this.deltaX;
      this.move.translateY = this.deltaY;
    }
  }

  onPinch(args: PinchGestureEventData) {

    // correct for left
    let left = (this.scale * args.scale * this.overlayWidth / 2) - this.deltaX;
    if(left > this.profileWidth / 2) {
      args.scale = ((this.profileWidth / 2) + this.deltaX) / (this.scale * this.overlayWidth / 2);
    }
    // correct for right
    let right = (this.scale * args.scale * this.overlayWidth / 2) + this.deltaX;
    if(right > this.profileWidth / 2) {
      args.scale = ((this.profileWidth / 2) - this.deltaX) / (this.scale * this.overlayWidth / 2);
    }
    // correct for top
    let top = (this.scale * args.scale * this.overlayHeight / 2) - this.deltaY;
    if(top > this.profileHeight / 2) {
      args.scale = ((this.profileHeight / 2) + this.deltaY) / (this.scale * this.overlayHeight / 2);
    }
    // correct for bottom
    let bottom = (this.scale * args.scale * this.overlayHeight / 2) + this.deltaY;
    if(bottom > this.profileHeight / 2) {
      args.scale = ((this.profileHeight / 2) - this.deltaY) / (this.scale * this.overlayHeight / 2);
    }
 
    // scale image
    if(args.state == 2) {
      this.stretch.scaleX = this.scale * args.scale;
      this.stretch.scaleY = this.scale * args.scale;
    }
    if(args.state == 3) {
      this.scale *= args.scale;
      this.stretch.scaleX = this.scale;
      this.stretch.scaleY = this.scale;
    }
    if(this.stretch.scaleX > 1) {
      this.stretch.scaleX = 1;
    }
    if(this.stretch.scaleY > 1) {
      this.stretch.scaleY = 1;
    }
  }

  private setScale() {

    let boxRatio = this.boxWidth / this.boxHeight;
    let imgRatio = this.imgWidth / this.imgHeight;
    if(imgRatio > boxRatio) {
      // image will span horizontally
      this.profileHeight = this.boxWidth * this.imgHeight / this.imgWidth;
      this.profileWidth = this.boxWidth;
    }
    else {
      // image will span vertically
      this.profileWidth = this.boxHeight * this.imgWidth / this.imgHeight;
      this.profileHeight = this.boxHeight;
    }
    if(this.boxWidth > this.boxHeight) {
      this.overlayWidth = this.boxHeight;
      this.overlayHeight = this.boxHeight;
    }
    else {
      this.overlayWidth = this.boxWidth;
      this.overlayHeight = this.boxWidth;
    }

    let widthRatio = this.profileWidth / this.overlayWidth;
    let heightRatio = this.profileHeight / this.overlayHeight;
    if(widthRatio < heightRatio) {
      this.scale = widthRatio;
    }
    else {
      this.scale = heightRatio;
    }
  }

  private syncOverlay() {
    this.move.scaleX = this.scale;
    this.move.scaleY = this.scale;
    this.move.translateX = this.deltaX;
    this.move.translateY = this.deltaY;
    this.stretch.scaleX = this.scale;
    this.stretch.scaleY = this.scale;
    this.stretch.translateX = this.deltaX;
    this.stretch.translateY = this.deltaY;
  }

  onClear() {
    this.applySave = false;
    this.applyCrop = true;
    this.applyText = "CROP";
    this.clearVisible = "hidden";
    this.moveVisible = "hidden";
    this.stretchVisible = "visible";
    this.syncOverlay();
  }

  onStretch() {
    this.applySave = false;
    this.applyCrop = true;
    this.applyText = "CROP";
    this.clearVisible = "hidden";
    this.moveVisible = "visible";
    this.stretchVisible = "hidden";
    this.syncOverlay();
  }

  onMove() {
    if(this.imgWidth == this.imgHeight) {
      this.applySave = true;
      this.applyText = "SAVE";
    }
    else {
      this.applySave = false;
      this.applyText = "";
    }
    this.applyCrop = false;
    this.clearVisible = "visible";
    this.moveVisible = "hidden";
    this.stretchVisible = "hidden";
    this.syncOverlay();
  }

  private clearOverlay() {

    // reset overlay
    this.applyText = "";
    this.applySave = false;
    this.applyCrop = false;
    this.applyReset = false;
    this.moveVisible = "hidden";
    this.stretchVisible = "hidden";
    this.clearVisible = "hidden";
    this.deltaX = 0;
    this.deltaY = 0;
    this.scale = 1;
    this.syncOverlay();
  }

  onApply() {
    
    if(this.applyCrop) {

      // mark change has been made
      this.dirty = true;

      let left = (this.profileWidth / 2) - ((this.scale * this.overlayWidth / 2) - this.deltaX);
      left *= (this.imgWidth / this.profileWidth);
      left = Math.round(left);
      if(left < 0) {
        left = 0;
      }
      if(left > this.imgWidth) {
        left = this.imgWidth;
      }

      let right = (this.profileWidth / 2) + ((this.scale * this.overlayWidth / 2) + this.deltaX);
      right *= (this.imgWidth / this.profileWidth);
      right = Math.round(right);
      if(right < 0) {
        right = 0;
      }
      if(right > this.imgWidth) {
        right = this.imgWidth;
      }

      let top = (this.profileHeight / 2) - ((this.scale * this.overlayHeight / 2) - this.deltaY);
      top *= (this.imgHeight / this.profileHeight);
      top = Math.round(top);
      if(top < 0) {
        top = 0;
      }
      if(top > this.imgHeight) {
        top = this.imgHeight;
      }

      let bottom = (this.profileHeight / 2) + ((this.scale * this.overlayHeight / 2) + this.deltaY);
      bottom *= (this.imgHeight / this.profileHeight);
      bottom = Math.round(bottom);
      if(bottom < 0) {
        bottom = 0;
      }
      if(bottom > this.imgHeight) {
        bottom = this.imgHeight;
      }

      // make square crop
      if((right - left) > (bottom - top)) {
        right = (bottom - top) + left;
      }
      if((bottom - top) > (right - left)) {
        bottom = (right - left) + top;
      }
      
      this.clearOverlay();
      utils.GC();
      this.bitmapService.crop(this.profile.imageSource, left, right, top, bottom).then(s => {
        this.setImageSource(s);
      }).catch(err => {
        dialogs.alert({ message: err, okButtonText: "ok" });
      }); 
    }
    else if(this.applySave) {
      this.dirty = false;
      this.clearOverlay();
      this.bitmapService.resize(this.profile.imageSource, 1024, 1024).then(s => {
        let data: string = s.toBase64String("jpg", 25);
        this.emigoService.setImage(data);
        this.profile.imageSource = s;
      }).catch(err => {
        dialogs.alert({ message: err, okButtonText: "ok" });
      });
    }
    else if(this.applyReset) {
      this.emigoService.setImage(null);
      this.applyReset = false;
      this.applyText = "";
    }
  }

  setImageSource(s: ImageSource) {

    // remove previous layers
    this.bound.removeChild(this.profile);
    this.bound.removeChild(this.move);
    this.bound.removeChild(this.stretch);
    this.bound.removeChild(this.clear);

    // store actual image dimensiosn
    this.imgWidth = s.width;
    this.imgHeight = s.height;
   
    // set profile layer
    this.profile.imageSource = s;
    
    // place layers  
    this.bound.addChildAtCell(this.profile, 0, 0);
    this.bound.addChildAtCell(this.move, 0, 0);
    this.bound.addChildAtCell(this.stretch, 0, 0);
    this.bound.addChildAtCell(this.clear, 0, 0);
    
    // ugly, isn't there an event to wait on??
    if(this.timeout != null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      let size: Size = this.frame.getActualSize();
      if(size.width == 0 || size.height == 0) {
        dialogs.alert({ message: "Invalid grid dimensions", okButtonText: "ok" });
      }
      else {
        this.boxWidth = size.width;
        this.boxHeight = size.height;

        if(this.dirty) {
          if(this.imgWidth == this.imgHeight) {
            this.applyCrop = false;
            this.applySave = true;
            this.applyText = "SAVE";
            this.clearVisible = "visible";
          }
          else {
            this.applyCrop = true;
            this.applySave = false;
            this.applyText = "CROP";
            this.stretchVisible = "visible";
          }
        }
        else {
          this.clearVisible = "visible";
        }

        this.setScale();
        this.syncOverlay();
      }
    }, 500);
  }

  isEdit(): boolean {
    if(this.clearVisible == "visible") {
      return true;
    }
    if(this.moveVisible == "visible") {
      return true;
    }
    if(this.stretchVisible == "visible") {
      return true;
    }
    return false;
  }

  onCamera() {
    this.clearOverlay();
    utils.GC();
    this.cameraService.snap().then(s => {
      this.dirty = true;
      this.setImageSource(s);
    }).catch(err => {
      if(err == null) {
        dialogs.alert({ message: "unknown camera error", okButtonText: "ok" });
      }
      else {
        dialogs.alert({ message: err.toString(), okButtonText: "ok" });
      }
    });
  }

  onGallery() {
    this.clearOverlay();
    utils.GC();
    this.galleryService.snag().then(s => {
      this.dirty = true;
      this.setImageSource(s);
    }).catch(err => {
      if(err == null) {
        dialogs.alert({ message: "unknown gallery error", okButtonText: "ok" });
      }
      else {
        dialogs.alert({ message: err.toString(), okButtonText: "ok" });
      }
    });
  }

  onReset() {
    this.dirty = true;
    this.clearOverlay();
    this.profile.imageSource = this.avatarSrc;
    this.applyReset = true;
    this.applyText = "SAVE";
  }

}

