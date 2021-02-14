import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageSource } from 'tns-core-modules/image-source';
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import * as Camera from "nativescript-camera";

@Injectable()
export class CameraService {

  constructor() {
  }

  public snap(): Promise<ImageSource> {

    return new Promise<ImageSource>((resolve, reject) => {

      // check if hardware is available
      if(Camera.isAvailable() == false) {
        reject(new Error("camera hardware not available"));
      }

      // request permission
      Camera.requestPermissions().then(() => {

        // capture picture
        Camera.takePicture({ width: 512, height: 512, keepAspectRatio: true, saveToGallery: false }).then(i => {

          // create image source
          let imgSource = new ImageSource();
          imgSource.fromAsset(i).then(s => {
            resolve(s);
          });
        }, err => {
          console.log("no picture selected");
        });
      }, () => {
        reject(new Error("camera not authorized"));
      });
    });
  }
}

