import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from 'rxjs'; 
import { Page } from "tns-core-modules/ui/page";

import { AttributeUtil } from '../attributeUtil';
import { DikotaService } from '../service/dikota.service';
import { EntryService } from '../service/entry.service';
import { EmigoService } from '../appdb/emigo.service';
import { AppSettings } from '../app.settings';
import { AppContext } from '../model/appContext';
import { EmigoUtil } from '../emigoUtil';

@Component({
    selector: "root",
    moduleId: module.id,
    templateUrl: "./root.component.xml"
})
export class RootComponent implements OnInit, OnDestroy {

  private readySet: boolean;
  private sub: Subscription[];

  constructor(private router: RouterExtensions,
      private dikotaService: DikotaService,
      private entryService: EntryService,
      private emigoService: EmigoService,
      private page: Page) {
    this.page.actionBarHidden = true;
    this.readySet = false;
    this.sub = [];
  }

  ngOnInit(): void {

    this.emigoService.init(AppSettings.DB + "dikota_v048").then(c => {
      if(c == null) {
        this.router.navigate(["/login"], { clearHistory: true });
      }
      else {
        this.dikotaService.setToken(c.serviceToken);
        this.emigoService.setEmigo(c.emigoId, c.registry, c.token, c.appNode, c.appToken,
            AttributeUtil.getSchemas(), [], null, EmigoUtil.getSearchableEmigo, s => {}).then(p => {
          console.log("permissions: ", p);
          this.entryService.init();

          // navigate to home screen
          this.router.navigate(["/home"], { clearHistory: true });
        }).catch(err => {
          console.log("EmigoService.setEmigo failed");
        });
      }
    }).catch(err => {
      console.log("EmigoService.init failed");
    });
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

}
