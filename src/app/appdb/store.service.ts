import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { BitmapService } from './bitmap.service';

import { Emigo } from './emigo';
import { EmigoEntryView } from './emigoEntryView';
import { Attribute } from './attribute';
import { Subject } from './subject';

import * as  base64 from "base-64";
import * as utf8 from "utf8";
var sqlite = require("nativescript-sqlite");

export class EmigoConnection {
  emigo: Emigo;
  attributes: Attribute[];
  labels: string[];
  attributeRevision: number;
  subjectRevision: number;
  identityError: boolean;
  attributeError: boolean;
  subjectError: boolean;
  appData: any;
  appState: any
}

export class EmigoUpdate {
  emigoId: string;
  revision: number;
  node: string;
  registry: string;
  attributeRevision: number;
  subjectRevision: number;
}

export class EmigoBase {
  emigoId: string;
  identityRevision: number;
  attributeRevision: number;
  subjectRevision: number;
  icon: string;
  name: string;
  handle: string;
  appData: any;
  appState: any;
}

export class EmigoSubject {
  emigoId: string;
  name: string;
  handle: string;
  icon: string;
  subjectId: string;
  created: number;
  modified: number;
  schema: string;
  data: any;
}

export class EmigoLabelId {
  emigoId: string;
  labelId: string;
}

@Injectable()
export class StoreService {
  private database: any = null;
  
  constructor(private bitmapService: BitmapService) {
  }

  public init(name: string): Promise<any> {
   
    return new Promise<any>((resolve, reject) => {
      
      // chain store setup
      (new sqlite(name)).then(db => {
        this.database = db;
        this.createAppTable().then(a => {
          resolve(a);
        }).catch(err => {
          console.log(err);
          reject("createAccountTable failed");
        });
      }).catch(err => {
        console.log(err);
        reject("new sqlite failed");
      });
    });
  }

  private createAppTable(): Promise<any> {
  
    // create tables
    let cmd: string = "create table if not exists app (key text, value text null, unique(key))";
    return new Promise<any>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        this.insertContext().then(a => {
          resolve(a);
        }).catch(err => {
          console.log(err);
          reject("insertContext failed");
        });
      }).catch(err => {
        console.log(err);
        reject("exectSQL createAppTable failed");
      });
    });
  }

  private insertContext(): Promise<any> {
  
    // insert app entry
    let cmd: string = "insert or ignore into app (key, value) values ('context', null)";
    return new Promise<any>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        this.getAppContext().then(a => {
          resolve(a);
        }).catch(err => {
          console.log(err);
          reject("getAppContext failed");
        });
      }).catch(err => {
        console.log(err);
        reject("execSQL insertContext failed");
      });
    });
  }

  private getAppContext(): Promise<any> {
   
    // query for app context
    let cmd: string = "select value from app where key='context'";
    return new Promise<any>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows.length > 0 && rows[0].length > 0) {
          if(rows[0][0] == null) {
            resolve(null);
          }
          else {
            // convert from base 64 string
            let obj = JSON.parse(utf8.decode(base64.decode(rows[0][0])));
            resolve(obj);
          }
        }
        else {
          reject("app context not found");
        }
      }).catch(err => {
        reject("all getAppContext failed");
      });
    });
  }

  public setAppContext(obj: any): Promise<void> {

    // convert to string
    if(obj == null) {
      return this.clearAppContext();
    }
    let data: string = base64.encode(utf8.encode(JSON.stringify(obj)));
 
    // update context
    let cmd: string = "update app set value='" + data + "' where key='context'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  }

  public clearAppContext(): Promise<void> {
    
    // clear context
    let cmd: string = "update app set value=null where key='context'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  }

  public getAppAccount(id: string): Promise<any> {
   
    // query for app account permission
    let cmd: string = "select value from app where key='account_" + id + "'";
    return new Promise<any>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows != null && rows.length > 0 && rows[0].length > 0 && rows[0][0] != null) {
          // convert from base 64 string
          let obj = JSON.parse(utf8.decode(base64.decode(rows[0][0])));
          resolve(obj);
        }
        else {
          resolve(null);
        }
      }).catch(err => {
        reject("all getAppAccount failed");
      });
    });
  }

  public setAppAccount(id: string, obj: any): Promise<void> {

    // convert to string
    if(obj == null) {
      return this.clearAppContext();
    }
    let data: string = base64.encode(utf8.encode(JSON.stringify(obj)));
 
    // update context
    let cmd: string = "insert or replace into app (key, value) values ('account_" + id + "', '" + data + "')";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  }

  public clearAppAccount(id: string): Promise<void> {
    
    // clear context
    let cmd: string = "delete from app where key='account_'" + id + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  }

  public getAppProperty(key: string): Promise<any> {
 
    // query for app property
    let cmd: string = "select value from app where key='prop_" + key + "'";

    return new Promise<any>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows != null && rows.length > 0 && rows[0].length > 0 && rows[0][0] != null) {
          // convert to object
          let obj = JSON.parse(utf8.decode(base64.decode(rows[0][0])));
          resolve(obj);
        }
        else {
          resolve(null);
        }
      });
    });
  }

  public setAppProperty(key: string, obj: any): Promise<void> {
  
    // convert to string
    if(obj == null) {
      return this.clearAppProperty(key);
    }
    let data: string = base64.encode(utf8.encode(JSON.stringify(obj)));
  
    // update proeprty
    let cmd: string = "insert or replace into app (key, value) values ('prop_" + key + "', '" + data + "')";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  }

  public clearAppProperty(key: string): Promise<void> {
  
    // clear proeprty
    let cmd: string = "delete from app where key='prop_" + key + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });
    });
  } 

  public setAccount(id: string): Promise<void> {
   
    // create tables for account
    return new Promise((resolve, reject) => {
      this.createProfileTable(id).then(() => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("createProfileTable failed");
      });
    });
  }

  private createProfileTable(id: string): Promise<void> {
  
    // create profile table
    let cmd: string = "create table if not exists profile_" + id + " (key text, value text null, unique(key))";
    return new Promise((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        this.createEmigoTable(id).then(() => {
          resolve();
        }).catch(err => {
          console.log(err);
          reject("createEmigoTable failed");
        });
      }).catch(err => {
        console.log(err);
        reject("execSQL createProfileTable failed");
      });
    });
  }

  public getProfileObject(id: string, key: string): Promise<any> {

    let cmd: string = "select value from profile_" + id + " where key='" + key + "'";
    return new Promise<any>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows != null && rows.length > 0 && rows[0].length > 0 && rows[0][0] != null) {
          let s: string = utf8.decode(base64.decode(rows[0][0]));
          resolve(JSON.parse(s));
        }
        resolve(null);
      }).catch(err => {
        console.log("all getProfileObject failed");
        reject();
      });
    });
  }

  public setProfileObject(id: string, key: string, obj: any): Promise<void> {

    // check if clearing object
    if(obj == null) {
      return this.clearProfileObject(id, key);
    }

    let s: string = base64.encode(utf8.encode(JSON.stringify(obj)));
    let cmd: string = "insert or replace into profile_" + id + 
        " (key, value) values ('" + key + "', '" + s + "')";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(() => {
        resolve();
      }).catch(err => {
        console.log("execSQL setProfileObject failed");
        reject();
      });
    });
  }

  public clearProfileObject(id: string, key: string): Promise<void> {

    let cmd: string = "delete from profile_" + id + " where key='" + key + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(() => {
        resolve();
      }).catch(err => {
        console.log("execSQL clearProfileObject failed");
        reject();
      });
    });
  }

  private createEmigoTable(id: string): Promise<void> {
    
    // create emigo table
    let cmd: string = "create table if not exists emigo_" + id + " (emigo_id text unique, revision integer, node text, registry text, safe_name text, safe_handle text, emigo text, icon text, attributes text, attribute_revision integer, subject_revision integer, update_timestamp integer, emigo_error integer, attribute_error integer, subject_error integer, app_data text, app_state text)";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        this.createFeedTable(id).then(() => {
          resolve();
        }).catch(err => {
          console.log(err);
          reject("createFeedTable failed");
        });
        resolve();
      }).catch(err => {
        console.log(err);
        reject("execSQL createEmigoTable failed");
      });
    });
  }

  public insertEmigo(id: string, emigoId: string): Promise<void> {
    
    let cmd = "insert or ignore into emigo_" + id + " (emigo_id) values ('" + emigoId + "')";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log("execSQL insertEmigo failed");
        reject();
      });
    });
  }
  
  public deleteEmigo(id: string, emigoId: string): Promise<void> {

    let lcmd = "delete from emigolabel_" + id + " where emigo_id='" + emigoId + "'";
    let fcmd = "delete from feed_" + id + " where emigo_id='" + emigoId + "'";
    let ecmd = "delete from emigo_" + id + " where emigo_id='" + emigoId + "'";

    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(ecmd).then(i => {
        this.database.execSQL(fcmd).then(i => {
          this.database.execSQL(lcmd).then(i => {
            resolve();
          }).catch(err => {
            console.log("execSQL deleteEmigoLabel failed");
            resolve();  // labels will become orphaned
          });
        }).catch(err => {
          console.log("execSQL deleteSubject failed");
          resolve();  // subjects will become orphaned
        });
      }).catch(err => {
        console.log("execSQL deleteEmigo failed");
        reject();
      });
    });
  }

  public clearEmigos(id: string): Promise<void> {
  
    let lcmd = "delete from emigolabel_" + id;
    let fcmd = "delete from feed_" + id;
    let ecmd = "delete from emigo_" + id;
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(ecmd).then(i => {
        this.database.execSQL(lcmd).then(i => {
          this.database.execSQL(fcmd).then(i => {
            resolve();
          }).catch(err => {
            console.log("execSQL delete feed failed");
            resolve(); // subjects will become orphaned
          });
        }).catch(err => {
          console.log("execSQL delete label failed");
          resolve(); // labels will become orphaned
        });
      }).catch(err => {
        console.log("execSQL delete emigo failed");
        reject();
      });
    });
  }

  private createFeedTable(id: string): Promise<void> {

    // create subject table
    let cmd: string = "create table if not exists feed_" + id + " (emigo_id text, subject_id text, revision integer, created integer, modified integer, schema text, data text, app_data text, unique(emigo_id, subject_id))";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        this.createEmigoLabelTable(id).then(() => {
          resolve();
        }).catch(err => {
          console.log(err);
          reject("createEmigoLabelTable failed");
        });
      }).catch(err => {
        console.log(err);
        reject("execSQL createFeedTable failed");
      });
    });
  }

  private createEmigoLabelTable(id: string): Promise<void> {
    
    // create label table
    let cmd: string = "create table if not exists emigolabel_" + id + " (emigo_id text, label_id text, unique(label_id, emigo_id))";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(c => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("execSQL createEmigoTable failed");
      });
    });
  }

  private getEmigoLabels(id: string): Promise<EmigoLabelId[]> {

    let cmd: string = "select emigo_id, label_id from emigoLabel_" + id;
    return new Promise<EmigoLabelId[]>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        let ids: EmigoLabelId[] = [];
        for(let i = 0; i < rows.length; i++) {
          let id: EmigoLabelId = new EmigoLabelId();
          id.emigoId = rows[i][0];
          id.labelId = rows[i][1];
          ids.push(id);
        }
        resolve(ids);
      }).catch(err => {
        console.log(err);
        reject("getEmigoLabels failed");
      });
    });
  }
  
  public async setEmigoLabels(id: string, view: EmigoEntryView[]) {

    let next: Set<string> = new Set<string>();
    for(let i = 0; i < view.length; i++) {
      if(view[i].labels != null) {
        for(let j = 0; j < view[i].labels.length; j++) {
          next.add(view[i].emigoId + ":" + view[i].labels[j]);
        }
      }
    }

    let curIds: EmigoLabelId[] = await this.getEmigoLabels(id);
    let cur: Set<string> = new Set<string>();
    for(let i = 0; i < curIds.length; i++) {
      cur.add(curIds[i].emigoId + ":" + curIds[i].labelId);
    }

    // add any pair not in cur
    for(let i = 0; i < view.length; i++) {
      if(view[i].labels != null) {
        for(let j = 0; j < view[i].labels.length; j++) {
          if(!cur.has(view[i].emigoId + ":" + view[i].labels[j])) {
            await this.setEmigoLabel(id, view[i].emigoId, view[i].labels[j]);
          }
        }
      }
    }

    // delete any pari not in next
    for(let i = 0; i < curIds.length; i++) {
      if(!next.has(curIds[i].emigoId + ":" + curIds[i].labelId)) {
        await this.clearEmigoLabel(id, curIds[i].emigoId, curIds[i].labelId);
      }
    }
  }
 
  private setEmigoLabel(id: string, emigoId: string, labelId: string): Promise<void> {

    let cmd: string = "insert or ignore into emigolabel_" + id + " values ('" + emigoId + "', '" + labelId + "')";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("setEmigoLabel failed");
      });
    });
  }

  private clearEmigoLabel(id: string, emigoId: string, labelId: string): Promise<void> {

    let cmd: string = "delete from emigolabel_" + id + " where emigo_id='" + emigoId + "' and label_id='" + labelId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("clearEmigoLabel failed");
      });
    });
  }

  public updateEmigoIdentity(id: string, emigoId: string, emigo: Emigo): Promise<void> {  
  
    let e: string = base64.encode(utf8.encode(JSON.stringify(emigo)));
    let n: string = "";
    if(emigo != null && emigo.name != null) {
      n = emigo.name.replace(/["',]/g, " ");
    }
    let h: string = "";
    if(emigo != null && emigo.handle != null) {
      h = emigo.handle.replace(/["',]/g, " ");
    }
    let nod: string = "";
    if(emigo != null && emigo.node != null) {
      nod = emigo.node.replace(/["',]/g, ".");
    }
    let reg: string = "";
    if(emigo != null && emigo.registry != null) {
      reg = emigo.registry.replace(/["',]/g, ".");
    }

    let cmd = "update emigo_" + id + " set emigo='" + e + "', node='" + nod + "', registry='" + reg + 
        "', revision=" + emigo.revision + ", safe_name='" + n + "', safe_handle='" + h + 
        "', icon=null where emigo_id='" + emigoId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        if(emigo != null && emigo.logo != null) {
          this.bitmapService.convert(emigo.logo).then(i => {
            this.updateEmigoIcon(id, emigoId, i).then(() => {
              resolve();
            }).catch(err => {
              console.log("updateEmigoIcon failed");
              reject();
            });
          }).catch(err => {
            console.log("BitmapService.convert failed");
            reject();
          });
        }
        else {
          this.updateEmigoIcon(id, emigoId, null).then(() => {
            resolve();
          }).catch(err => {
            console.log("updateEmigoIcon failed");
            reject();
          });
        }
      }).catch(err => {
        console.log("execSQL updateEmigoIdentity failed");
        reject();
      });
    });
  }

  private updateEmigoIcon(id: string, emigoId: string, icon: string): Promise<void> {

    // allow icon to be null
    let i: string;
    if(icon == null) {
      i = "null";
    }
    else {
      i = "'" + icon + "'";
    }

    let cmd = "update emigo_" + id + " set icon=" + i + " where emigo_id='" + emigoId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(u => {
        resolve();
      }).catch(err => {
        console.log("execSQL updateEmigoIcon failed");
        reject();
      });
    });
  }

  public updateEmigoAttributes(id: string, emigoId: string, rev: number, attributes: Attribute[]): Promise<void> {
    
    let a: string = base64.encode(utf8.encode(JSON.stringify(attributes)));
    let cmd = "update emigo_" + id + " set attribute_revision=" + rev + ", attributes='" + a + "' where emigo_id='" + 
        emigoId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(u => {
        resolve();
      }).catch(err => {
        console.log("execSQL updateEmigoAttributes failed");
        reject();
      });
    });
  }

  public updateEmigoAppState(id: string, emigoId: string, state: any): Promise<void> {

    let cmd: string;
    let s: string;
    if(state == null) {
      s = "null";
    }
    else {
      s = "'" + base64.encode(utf8.encode(JSON.stringify(state))) + "'";
    }
    cmd = "update emigo_" + id + " set app_state=" + s + " where emigo_id='" +  emigoId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(u => {
        resolve();
      }).catch(err => {
        console.log("execSQL updateEmigoAppState failed");
        reject();
      });
    });
  }
 
  public updateEmigoAppData(id: string, emigoId: string, rev: number, data: any): Promise<void> {

    let cmd: string;
    let d: string;
    if(data == null) {
      d = "null";
    }
    else {
      d = "'" + base64.encode(utf8.encode(JSON.stringify(data))) + "'";
    }
    if(rev == null) {
      cmd = "update emigo_" + id + " set app_data=" + d + " where emigo_id='" +  emigoId + 
        "' and attribute_revision IS NULL";
    }
    else {
      cmd = "update emigo_" + id + " set app_data=" + d + " where emigo_id='" +  emigoId + 
        "' and attribute_revision=" + rev;
    }
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(u => {
        resolve();
      }).catch(err => {
        console.log("execSQL updateEmigoAppData failed");
        reject();
      });
    });
  } 

  public getStaleEmigo(id: string, ts: number): Promise<EmigoUpdate> {
    
    let cmd: string = "select emigo_id, revision, node, registry, attribute_revision, subject_revision from emigo_" + id + 
        " where (update_timestamp IS NULL or update_timestamp < " + ts + ") order by update_timestamp asc limit 1";
    return new Promise<EmigoUpdate>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows == null || rows.length != 1 || rows[0].length != 6) {
          resolve(null);
        }
        else {
          let e: EmigoUpdate = new EmigoUpdate();
          e.emigoId = rows[0][0];
          e.revision = rows[0][1];
          e.node = rows[0][2];
          e.registry = rows[0][3];
          e.attributeRevision = rows[0][4];
          e.subjectRevision = rows[0][5];
          resolve(e);
        }
      }).catch(err => {
        console.log("all getStaleEmigo failed");
        reject();
      });
    });
  }

  public setStaleEmigo(id: string, emigoId: string, ts: number): Promise<void> {
    
    let cmd: string = "update emigo_" + id + " set update_timestamp=" + ts + " where emigo_id='" + emigoId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(u => {
        resolve();
      }).catch(err => {
        console.log("execSQL setStaleEmigo failed");
        reject();
      });
    });
  }

  public getEmigoUpdate(id: string, emigoId: string): Promise<EmigoUpdate> {
    
    let cmd: string = "select emigo_id, revision, node, registry, attribute_revision, subject_revision from emigo_" + id + 
        " where emigo_id='" + emigoId + "'";
    return new Promise<EmigoUpdate>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows == null || rows.length != 1 || rows[0].length != 6) {
          resolve(null);
        }
        else {
          let e: EmigoUpdate = new EmigoUpdate();
          e.emigoId = rows[0][0];
          e.revision = rows[0][1];
          e.node = rows[0][2];
          e.registry = rows[0][3];
          e.attributeRevision = rows[0][4];
          e.subjectRevision = rows[0][5];
          resolve(e);
        }
      }).catch(err => {
        console.log("all getStaleEmigo failed");
        reject();
      });
    });
  }

  private getLabels(id: string, emigoId: string): Promise<string[]> {

    let cmd: string = "select label_id from emigolabel_" + id + " where emigo_id='" + emigoId + "'";
    return new Promise<string[]>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        let labels: string[] = [];
        for(let i = 0; i < rows.length; i++) {
          labels.push(rows[i][0]);
        }
        resolve(labels);
      }).catch(err => {
        console.log(err);
        reject("getEmigoLabels failed");
      });
    });
  }

  public getEmigo(id: string, emigoId: string): Promise<EmigoConnection> {

    let cmd: string = "select emigo, attributes, attribute_revision, subject_revision, app_data, app_state" + 
        ", emigo_error, attribute_error, subject_error from emigo_" + id + " where emigo_id='" + emigoId + "'";
    return new Promise<EmigoConnection>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        if(rows == null || rows.length != 1 || rows[0].length != 9) {
          resolve(null);
        }
        else {
          let contact: EmigoConnection = new EmigoConnection();
          if(rows[0][0] != null) {
            contact.emigo = JSON.parse(utf8.decode(base64.decode(rows[0][0])));
          }
          if(rows[0][1] != null) {
            contact.attributes = JSON.parse(utf8.decode(base64.decode(rows[0][1])));
          }
          contact.attributeRevision = rows[0][2];
          contact.subjectRevision = rows[0][3];
          if(rows[0][4] != null) {
            contact.appData = JSON.parse(utf8.decode(base64.decode(rows[0][4])));
          }
          if(rows[0][5] != null) {
            contact.appState = JSON.parse(utf8.decode(base64.decode(rows[0][5])));
          }
          contact.identityError = !(parseInt(rows[0][6]) == 0);
          contact.attributeError = !(parseInt(rows[0][7]) == 0);
          contact.subjectError = !(parseInt(rows[0][8]) == 0);

          this.getLabels(id, emigoId).then(l => {
            contact.labels = l;
            resolve(contact);
          }).catch(err => {
            console.log("getEmigoLabels failed");
            contact.labels = [];
            resolve(contact);
          });
        }
      }).catch(err => {
        console.log("all getEmigo failed");
        reject();
      });
    });
  }

  public getEmigoIds(id: string): Promise<Map<string, number>> {
  
    let cmd: string = "select emigo_id, attribute_revision from emigo_" + id;
    return new Promise<Map<string, number>>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        let ids: Map<string, number> = new Map<string, number>();
        if(rows != null) {
          for(let i = 0; i < rows.length; i++) {
            if(rows[i].length == 2) {
              ids.set(rows[i][0], rows[i][1]);
            }
          }
        }
        resolve(ids);
      }).catch(err => {
        console.log("all getEmigoIds failed");
        reject();
      });
    });
  }

  public getEmigos(id: string, filter: string, labels: string[]): Promise<EmigoBase[]> {

    return new Promise<EmigoBase[]>((resolve, reject) => {

      let where: string = "";
      if(labels != null || filter != null) {

        // gernate where clause
        if(labels != null && filter != null) {
          if(labels.length == 0) {
            where += " left outer join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where label_id label_id is null and safe_name like '%" + filter + "%'";
          }
          else {
            where += " inner join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where label_id in ( '" + labels.join("', '") + "' ) and safe_name like '%" + filter + "%'";
          }
        }
        else if(labels != null) {
          if(labels.length == 0) {
            where += " left outer join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where label_id is null";
          }
          else {
            where += " inner join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where label_id in ( '" + labels.join("', '") + "' )";
          }
        }
        else if(filter != null) {
          where += " where safe_name like '%" + filter + "%'";
        }
      }

      // construct query
      let cmd: string = "select emigo_" + id  + ".emigo_id, revision, safe_name, safe_handle, icon, attribute_revision, subject_revision, app_data, app_state from emigo_" + id + where + " group by emigo_" + id + ".emigo_id order by safe_name collate nocase asc";
      this.database.all(cmd).then(rows => {
        let emigos: EmigoBase[] = [];
        for(let i = 0; i < rows.length; i++) {
          let e: EmigoBase = new EmigoBase();
          e.emigoId = rows[i][0];
          e.identityRevision = rows[i][1];
          e.name = rows[i][2];
          e.handle = rows[i][3];
          e.icon = rows[i][4];
          e.attributeRevision = rows[i][5];
          e.subjectRevision = rows[i][6];
          if(rows[i][7] != null) {
            e.appData = JSON.parse(utf8.decode(base64.decode(rows[i][7])));
          }
          else {
            e.appData = null;
          }
          if(rows[i][8] != null) {
            e.appState = JSON.parse(utf8.decode(base64.decode(rows[i][8])));
          }
          else {
            e.appState = null;
          }
          emigos.push(e);
        }
        resolve(emigos);
      }).catch(err => {
        console.log(err);
        reject("getEmigos failed");
      });
    });
  }

  private getEmigoSubjects(id: string, emigoId: string): Promise<Map<string, number>> {
    
    // retrieve current subjects for emigo
    let cmd: string = "select subject_id, revision from feed_" + id + " where emigo_id='" + emigoId + "'";
    return new Promise<Map<string, number>>((resolve, reject) => {
      this.database.all(cmd).then(rows => {
        let subjects: Map<string, number> = new Map<string, number>();
        for(let i = 0; i < rows.length; i++) {
          subjects.set(rows[i][0], rows[i][1]);
        }
        resolve(subjects);
      }).catch(err => {
        console.log(err);
        reject("getEmigoSubjects failed");
      });
    });
  }

  private addEmigoSubject(id: string, emigoId: string, s: Subject): Promise<void> {

    // construct data field
    let data: string;
    if(s.data == null) {
      data = "null";
    }
    else {
      data = "'" + base64.encode(utf8.encode(JSON.stringify(s.data))) + "'";
    }

    // store new subject
    let cmd: string = "insert or ignore into feed_" + id + " values('" + emigoId + "', '" + s.subjectId + "', " + s.revision + ", " + s.created + ", " + s.modified + ", '" + s.schema + "', " + data + ")";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(() => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("setEmigoSubject failed");
      });
    });
  }

  private setEmigoSubject(id: string, emigoId: string, s: Subject): Promise<void> {

    // construct data field
    let data: string;
    if(s.data == null) {
      data = "null";
    }
    else {
      data = "'" + base64.encode(utf8.encode(s.data)) + "'";
    }

    // update existing subject
    let cmd: string = "update feed_id" + id + " set revision=" + s.revision + ", created=" + s.created + ", modified=" + s.modified + ", schema='" + s.schema + "', data=" + data;
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(() => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("setEmigoSubject failed");
      });
    });
  }

  private clearEmigoSubject(id: string, emigoId: string, subjectId: string): Promise<void> {

    let cmd: string = "delete from feed_" + id + " where emigoId='" + emigoId + "' and subjectId='" + subjectId + "'";
    return new Promise<void>((resolve, reject) => {
      this.database.execSQL(cmd).then(i => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject("clearEmigoLabel failed");
      });
    });
  }

  public getFeed(id: string, labels: string[], count: number): Promise<EmigoSubject[]> {

    return new Promise<EmigoSubject[]>((resolve, reject) => {

      // gernate where clause
      let where: string = "";
      if(labels != null) {
        if(labels.length == 0) {
          where += " left outer join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where labelId is null";
        }
        else {
          where += " inner join emigolabel_" + id + " on emigo_" + id + ".emigo_id=emigolabel_" + id + ".emigo_id where labelId in ( '" + labels.join("', '") + "' )";
        }
      }

      // generate limit clause
      let limit: string = "";
      if(count != null) {
        limit = " limit " + count;
      }

      // construct query
      let cmd: string = "select emigo_" + id + ".emigo_id, safe_name, safe_handle, icon, subjectId, created, modified, schema, data from emigo_" + id + " inner join feed_" + id + " on emigo_" + id + ".emigo_id= feed_" + id + ".emigo_id" + where + " group by subjectId order by modified desc" + count;
      this.database.all(cmd).then(rows => {
        let subjects: EmigoSubject[] = [];
        for(let i = 0; i < rows.length; i++) {
          let s: EmigoSubject = new EmigoSubject();
          s.emigoId = rows[i][0];
          s.name = rows[i][1];
          s.handle = rows[i][2];
          s.icon = rows[i][3];
          s.subjectId = rows[i][4];
          s.created = rows[i][5];
          s.modified = rows[i][6];
          s.schema = rows[i][7];
          if(rows[i][8] != null) {
            s.data = JSON.parse(utf8.decode(base64.decode(rows[i][8])));
          }
          subjects.push(s);
        }
      });
    });
  }

}


