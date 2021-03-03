import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";

import { BitmapService } from './bitmap.service';

export class ScaleEntry {
  id: string;
  imgSource: ImageSource;
};

class CacheEntry {
  id: string;
  imgSource: ImageSource;
  img: string;
  ref: number;
}

@Injectable()
export class ScaleService {

  private slotCount: number = 32;
  private avatarSrc: ImageSource;
  private cache: CacheEntry[] = [];
  private scaledImg: BehaviorSubject<ScaleEntry>;

  constructor(private bitmapService: BitmapService) {
    this.avatarSrc = ImageSource.fromFileSync("~/assets/savatar.png");
    for(let i = 0; i < this.slotCount; i++) {
      this.cache.push(null);
    }
    this.scaledImg = new BehaviorSubject<CacheEntry>(null);
    setInterval(() => {
      this.scale();
    }, 100);
  }

  get image() {
    return this.scaledImg.asObservable();
  }

  private scale() {
    for(let i = 0; i < this.slotCount; i++) {
      if(this.cache[i] != null && this.cache[i].imgSource == null) {
        let src: ImageSource = ImageSource.fromBase64Sync(this.cache[i].img);
        this.bitmapService.resize(src, 64, 64).then(s => {
          if(s == null) {
            this.cache[i].imgSource = this.avatarSrc;
          }
          else {
            this.cache[i].imgSource = s;
          }
          this.cache[i].img = null;
          let entry: ScaleEntry = { id: this.cache[i].id, imgSource: this.cache[i].imgSource };
          this.scaledImg.next(entry);
        }).catch(err => {
          console.log("BitmapService.convert failed");
          this.cache[i].imgSource = this.avatarSrc;
          let entry: ScaleEntry = { id: this.cache[i].id, imgSource: this.cache[i].imgSource };
          this.scaledImg.next(entry);
        }); 
        return;
      }
    }
  }

  public setImage(id: string, img: string): ImageSource {

    let idx: number = null;
    let idxRef: number = null;
    let hit: boolean = false;
    let empty: boolean = false;
    let entry: ScaleEntry = null;

    // return avatar if not image
    if(img == null) {
      return this.avatarSrc;
    }

    // find cache slot
    for(let i = 0; i < this.slotCount; i++) {
      
      if(this.cache[i] == null) {
        if(!empty) {
          idx = i;
          empty = true;
        }
      }
      else {
        if( this.cache[i].id == id) {

          // cache hit
          idx = i;
          hit = true;

          // reset ref count
          this.cache[i].ref = 0;

          // check if scaled       
          if(this.cache[i].imgSource != null) {
            entry = { id: id, imgSource: this.cache[i].imgSource };
          }
        }
        else {

          // cannot evict pending 
          if(this.cache[i].imgSource != null) {

            // select stale-est entry
            if(!hit && !empty && (idxRef == null || idxRef < this.cache[i].ref)) {
              idx = i;
              idxRef = this.cache[i].ref;
            }
          }

          // increment ref count
          this.cache[i].ref += 1;
        }
      }
    }

    // check if cache miss
    if(!hit) {
      if(idx == null) {
        this.slotCount += 1;
        this.cache.push({ id: id, imgSource: null, ref: 0, img: img });
      }
      else {
        this.cache[idx] = { id: id, imgSource: null, ref: 0, img: img };
      } 
    }

    // set avatar while waiting
    if(entry == null) {
      entry = { id: id, imgSource: this.avatarSrc };
    }
    
    return entry.imgSource; 
  }
}


