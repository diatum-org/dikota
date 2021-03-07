import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { SwipeGestureEventData, SwipeDirection } from "tns-core-modules/ui/gestures";
import * as utils from "tns-core-modules/utils/utils";

@Component({
    selector: "boardingp4",
    moduleId: module.id,
    templateUrl: "./boardingp4.component.xml"
})
export class BoardingP4Component implements OnInit {

  constructor(private router: RouterExtensions,
      private page: Page) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }

  public onSwipe(args: SwipeGestureEventData) {
    if(args.direction == SwipeDirection.left) {
      this.onFinish();
    }
    else {
      this.router.navigate(["/boardingp3"], { clearHistory: true, animated: true,
          transition: { name: "slideRight", duration: 300, curve: "easeIn" }
      });
    }
  }

  onFinish() {
    this.router.navigate(["/home"], { clearHistory: true, animated: true,
        transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
    });
  }

  onPortal() {
    utils.openUrl("https://portal.diatum.net/app/#/account");
  }

}
