import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import * as imagepicker from "nativescript-imagepicker";
import { BitmapService } from './bitmap.service';

@Injectable()
export class GalleryService {

  constructor(private bitmapService: BitmapService) {
  }

  public snag(): Promise<ImageSource> {

    return new Promise<ImageSource>((resolve, reject) => {

      let context = imagepicker.create({ mode: "single", mediaType: imagepicker.ImagePickerMediaType.Image } );

      context.authorize().then(() => {
        context.present().then(sel => {

          if(sel.length > 0) {
            let a = sel[0];

            // create image source
            a.options = { width: 1024, height: 1024, keepAspectRatio: true };
            let imgSource = new ImageSource();
            imgSource.fromAsset(a).then(i => {
              if(i.width == 0 || i.height == 0) {
                reject(new Error("invalid image dimensions"));
              }
              resolve(i);
            }).catch(err => {
                reject(new Error("failed to load image"));
            });
          }
          else {
            reject(new Error("no image selected"));
          }
        }).catch(err => {
          console.log("no image selected");
        });
      }).catch(err => {
        reject(new Error(err));
      });
    });
  }
}

