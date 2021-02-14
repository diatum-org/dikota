import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures";
import * as utils from "tns-core-modules/utils/utils";

@Component({
    selector: "boardingp1",
    moduleId: module.id,
    templateUrl: "./boardingp1.component.xml"
})
export class BoardingP1Component implements OnInit {

  constructor(private router: RouterExtensions,
      private page: Page) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }

  public onSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.left) {
      this.router.navigate(["/boardingp2"], { clearHistory: true, animated: true,
          transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
      });
    }
    else {
      this.router.navigate(["/boardingp0"], { clearHistory: true, animated: true,
          transition: { name: "slideRight", duration: 300, curve: "easeIn" }
      });
    }
  }

  onNext(idx: number) {
    this.router.navigate(["/boardingp" + idx], { clearHistory: true, animated: false});
  }
}
