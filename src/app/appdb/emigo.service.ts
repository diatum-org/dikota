import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { ImageSource, fromBase64 } from "tns-core-modules/image-source";

import { getEmigoObject } from './emigo.util';

import { StoreService, EmigoBase, EmigoConnection, EmigoUpdate } from './store.service';
import { RegistryService } from './registry.service';
import { AccessService } from './access.service';
import { IdentityService } from './identity.service';
import { GroupService } from './group.service';
import { ProfileService } from './profile.service';
import { IndexService } from './index.service';
import { ShareService } from './share.service';
import { ContactService } from './contact.service';

import { Emigo } from './emigo';
import { EmigoMessage } from './emigoMessage';
import { EmigoEntry } from './emigoEntry';
import { EmigoEntryData } from './emigoEntryData';
import { EmigoEntryView } from './emigoEntryView';
import { ShareEntry } from './shareEntry';
import { Label } from './label';
import { LabelEntry } from './labelEntry';
import { Attribute } from './attribute';
import { AttributeData } from './attributeData';
import { AttributeEntryView } from './attributeEntryView';
import { ServiceAccess } from './serviceAccess';
import { PendingEmigo } from './pendingEmigo';
import { PendingEmigoView } from './pendingEmigoView';

export interface AttributeEntity {
  id: string;
  schema: string;
  obj: any;
  labels: Array<string>;
}

export interface AttributeEntityData {
  schema: string;
  obj: any;
}

export class EmigoView {
  id: string;
  name: string;
  handle: string;
  thumb: string;
  appData: any;
  appState: any;
  identityRevision: number;
  attributeRevision: number;
  subjectRevision: number;
  shareRevision: number;
  shareTimestamp: number;
}

export class EmigoContact {
  emigo?: Emigo;
  notes?: string;
  labels?: Set<string>;
  status?: string;
  attributeRevision?: number;
  subjectRevision?: number;
  attributes?: AttributeEntityData[];
  appData?: any;
  appState?: any;
  error?: boolean;
}

class Revision {
  public identity: number;
  public profile: number;
  public group: number;
  public index: number;
  public share: number;
}

class ShareView {
  private shareId: string;
  private status: string;
  private token: string;
  private shareRevision: number;
  private shareTimestamp: number;

  constructor(id: string, status: string, token: string, revision: number, timestamp: number) {
    this.shareId = id;
    this.status = status;
    this.token = token;
    this.shareRevision = revision;
    this.shareTimestamp = timestamp;
  }

  public getId(): string {
    return this.shareId;
  }

  public getStatus(): string {
    return this.status;
  }

  public getToken(): string {
    return this.token;
  }

  public getRevision(): number {
    return this.shareRevision;
  }

  public getTimestamp(): number {
    return this.shareTimestamp;
  }
}

@Injectable()
export class EmigoService {

  private attributeFilter: string[] = [];
  private token: string = null;
  private node: string = null;
  private serviceNode: string = null;
  private serviceToken: string = null;
  private emigoId: string = null;
  private access: any = null;
  private registry: string = null;
  private handle: string = null;
  private emigoStatus: string[] = ['connected'];
  private emigoFilter: string = null;
  private emigoLabels: string[] = null;
  private selectedEmigoId: string = null;
  private revision: Revision = null;
  private syncInterval: any = null;
  private syncCount: number = null;
  private pendingView: PendingEmigoView[];
  private indexView: Map<string, string>;
  private shareView: Map<string, ShareView>;
  private stale: number = (24 * 60 * 60);
  private refresh: number = 60;
  private identityError: boolean = false;
  private registryError: boolean = false;
  private profileError: boolean = false;
  private groupError: boolean = false;
  private indexError: boolean = false;
  private shareError: boolean = false;    

  // observables
  private syncProgress: BehaviorSubject<number>;
  private emigoIdentity: BehaviorSubject<Emigo>;
  private labelEntries: BehaviorSubject<LabelEntry[]>;
  private attributeEntries: BehaviorSubject<AttributeEntity[]>;
  private selected: BehaviorSubject<EmigoContact>;
  private updated: BehaviorSubject<EmigoContact>;
  private filteredEmigos: BehaviorSubject<EmigoView[]>;
  private pendingEmigos: BehaviorSubject<PendingEmigoView[]>;
  private connectedEmigos: BehaviorSubject<EmigoView[]>;
  private requestedEmigos: BehaviorSubject<EmigoView[]>;
  private receivedEmigos: BehaviorSubject<EmigoView[]>;
  private savedEmigos: BehaviorSubject<EmigoView[]>;
  private registryFlag: BehaviorSubject<boolean>;
  private nodeFlag: BehaviorSubject<boolean>;

  constructor(private registryService: RegistryService,
      private accessService: AccessService,
      private identityService: IdentityService,
      private groupService: GroupService,
      private profileService: ProfileService,
      private indexService: IndexService,
      private shareService: ShareService,
      private contactService: ContactService,
      private storeService: StoreService) {

    this.syncProgress = new BehaviorSubject<number>(null);
    this.emigoIdentity = new BehaviorSubject<Emigo>({ emigoId: null, node: null, revision: null, version: null });
    this.labelEntries = new BehaviorSubject<LabelEntry[]>([]);
    this.attributeEntries = new BehaviorSubject<AttributeEntity[]>([]);
    this.selected = new BehaviorSubject<EmigoContact>(null);
    this.updated = new BehaviorSubject<EmigoContact>(null);
    this.filteredEmigos = new BehaviorSubject<EmigoView[]>([]);
    this.pendingEmigos = new BehaviorSubject<PendingEmigoView[]>([]);
    this.connectedEmigos = new BehaviorSubject<EmigoView[]>([]);
    this.requestedEmigos = new BehaviorSubject<EmigoView[]>([]);
    this.receivedEmigos = new BehaviorSubject<EmigoView[]>([]);
    this.savedEmigos = new BehaviorSubject<EmigoView[]>([]);
    this.registryFlag = new BehaviorSubject<boolean>(false);
    this.nodeFlag = new BehaviorSubject<boolean>(false);
  }

  public init(db: string): Promise<any> {
    return this.storeService.init(db);
  }

  public setAppContext(obj: any): Promise<void> {
    return this.storeService.setAppContext(obj);
  }

  public clearAppContext(): Promise<void> {
    return this.storeService.clearAppContext();
  }

  public getAppProperty(key: string): Promise<any> {
    return this.storeService.getAppProperty(this.emigoId + "_" + key);
  }

  public setAppProperty(key: string, obj: any): Promise<void> {
    return this.storeService.setAppProperty(this.emigoId + "_" + key, obj);
  }

  public clearAppProperty(key: string): Promise<void> {
    return this.storeService.clearAppProperty(this.emigoId + "_" + key);
  }

  get nodeAlert() {
    return this.nodeFlag.asObservable();
  }

  get registryAlert() {
    return this.registryFlag.asObservable();
  }

  // observe syncrhonizing percent
  get synchronizing() {
    return this.syncProgress.asObservable();
  }

  // set account, validate token, return permissions, and periodically synchronize
  public setEmigo(emigoId: string, registry: string, token: string, filter: string[], serviceNode: string, serviceToken: string, 
      stale: number = 86400, refresh: number = 60): Promise<ServiceAccess> {

    // clear any perviously set account
    this.clearEmigo();

    // init observables
    this.syncProgress.next(null);
    this.emigoIdentity.next({ emigoId: emigoId, node: null, revision: null, version: null });
    this.labelEntries.next([]);
    this.attributeEntries.next([]);
    this.selected.next(null);
    this.updated.next(null);
    this.filteredEmigos.next([]);
    this.connectedEmigos.next([]);
    this.requestedEmigos.next([]);
    this.receivedEmigos.next([]);
    this.savedEmigos.next([]);
    this.registryFlag.next(false);
    this.nodeFlag.next(false);

    // init cached values
    this.indexView = new Map<string, string>();
    this.shareView = new Map<string, ShareView>();
    this.emigoId = emigoId;
    this.stale = stale;
    this.refresh = refresh;
    this.token = token;
    this.serviceNode = serviceNode;
    this.serviceToken = serviceToken;
    this.emigoStatus = ['connected'];
    this.emigoFilter = null;
    this.emigoLabels = null;
    this.selectedEmigoId = null;
    this.revision = new Revision();
    this.syncCount = 0;
    this.identityError = false;
    this.registryError = false;
    this.profileError = false;
    this.groupError = false;
    this.indexError = false;
    this.shareError = false;
    if(filter == null) {
      this.attributeFilter = [];
    }
    else {
      this.attributeFilter = filter;
    }

    return new Promise<ServiceAccess>((resolve, reject) => {

      // retrieve permission entry
      this.storeService.getAppAccount(emigoId).then(p => {

        if(p == null) {

          // pull registry
          this.registryService.getMessage(registry, emigoId).then(m => {
            let emigo: Emigo = getEmigoObject(m);

            // pull access
            this.accessService.getAccess(emigo.node, token).then(a => {
      
              // save access
              this.storeService.setAppAccount(emigoId, a).then(() => {
                this.access = a;

                // prepare account tables
                this.storeService.setAccount(emigoId).then(() => {

                  // set initial profile
                  this.node = emigo.node;
                  this.setNode().then(() => {
                    this.syncNode();  // not waiting for sync to complete
                    resolve(a);
                  }).catch(err => {
                    console.log("EmigoService.setNode failed");
                    reject();
                  });
                }).catch(err => {
                  console.log("StoreService.setAccount failed");
                  reject();
                });
              }).catch(err => {
                console.log("StoreService.setAppAccount failed");
                reject();
              });
            }).catch(err => {
              console.log("AccessService.getAccess failed");
              reject();
            });
          }).catch(err => {
            console.log("RegistryService.getMessage failed");
            reject();
          });
        }
        else {

          // prepare account tables
          this.access = p;
          this.storeService.setAccount(emigoId).then(() => {
            this.loadNode().then(() => {
              this.setEmigos();
              resolve(p);
            }).catch(err => {
              console.log("EmigoService.loadNode failed");
              reject();
            });
          }).catch(err => {
            console.log("StoreService.setAccount failed");
            reject();
          });
        }
      }).catch(err => {
        console.log("StoreService.getAppAccount failed");
        reject();
      });
    });
  }

  // clear account
  public clearEmigo(): void {

    // reset observables
    this.syncProgress.next(null);
    this.emigoIdentity.next({ emigoId: null, node: null, revision: null, version: null });
    this.labelEntries.next([]);
    this.attributeEntries.next([]);
    this.selected.next(null);
    this.updated.next(null);
    this.filteredEmigos.next([]);
    this.pendingEmigos.next([]);
    this.connectedEmigos.next([]);
    this.requestedEmigos.next([]);
    this.receivedEmigos.next([]);
    this.savedEmigos.next([]);
    this.registryFlag.next(false);
    this.nodeFlag.next(false);
    if(this.syncInterval != null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.emigoId = null;
  }

  // set node url
  private setNode(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.setProfileObject(this.emigoId, "node", this.node).then(() => {
        this.setAttributeFilter().then(() => {
          resolve();
        }).catch(err => {
          console.log("EmigoService.setAttributeFilter failed");
          reject();
        });
      }).catch(err => {
        console.log("EmigoService.setProfileObject node failed");
        reject();
      });    
    });
  }

  // set attribute filter
  private setAttributeFilter(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.setProfileObject(this.emigoId, "filter", this.attributeFilter).then(() => {
        this.storeService.clearProfileObject(this.emigoId, "attributes").then(() => {
          resolve();
        }).catch(err => {
          console.log("StoreService.clearProfileObject attributes failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.setProfileObject filter failed");
        reject();
      });
    });
  }   

  // sync node
  public async syncNode() {
    
    this.syncProgress.next(0);
    await this.syncIdentity();
      
    this.syncProgress.next(10);
    await this.syncLabels();
        
    this.syncProgress.next(20);
    await this.syncAttributes();
          
    this.syncProgress.next(30);
    await this.syncEmigos();

    this.syncProgress.next(40);
    await this.syncShares();

    this.syncProgress.next(50);
    let ids: string[] = [];
    this.indexView.forEach((value, key) => {
      ids.push(key);
    });
    for(let i = 0; i < ids.length; i++) {
      await this.syncContact(ids[i]);
      this.syncProgress.next(Math.floor(50 + 50 * (i / ids.length)));
    }
    this.syncProgress.next(null);

    // display contacts
    this.setEmigos();               

    // update in background
    this.syncCount = 0;
    this.syncChanges();
    this.syncInterval = setInterval(() => {
      this.syncChanges();
    }, 1000);
  }
  
  private syncContact(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.indexService.getEmigo(this.node, this.token, id).then(e => {
        this.storeService.insertEmigo(this.emigoId, id).then(() => {
          this.storeService.updateEmigoIdentity(this.emigoId, id, e.emigo).then(() => {
            let share: ShareView = this.shareView.get(id);
            if(share != null && share.getStatus() == "connected") {
              // sync attributes 
              this.storeService.updateEmigoAttributes(this.emigoId, id, 0, []).then(() => {
                this.contactService.getRevision(this.serviceNode, this.serviceToken, e.emigo.node, share.getToken()).then(r => {
                  this.contactService.getAttributes(this.serviceNode, this.serviceToken, e.emigo.node, share.getToken(),
                      this.attributeFilter).then(a => {
                    this.storeService.updateEmigoAttributes(this.emigoId, id, r, a).then(() => {
                      this.updateEmigoContact(id);
                      resolve();
                    }).catch(err => {
                      console.log("StoreService.updateEmigoAttributes failed");
                      resolve();
                    });
                  }).catch(err => {
                    console.log("ContactService.getAttributes failed");
                    resolve();
                  });
                }).catch(err => {
                  console.log("ContactService.getRevision failed");
                  resolve();
                });
              }).catch(err => {
                console.log("StoreService.updateEmigoAttributes failed");
                resolve();
              });
            }
            else {
              // no attributes to sync
              resolve();
            }
          }).catch(err => {
            console.log("StoreService.updateEmigoIdenntity failed");
            resolve();
          });
        }).catch(err => {
          console.log("StoreService.insertEmigo failed");
          resolve();
        });
      }).catch(err => {
        console.log("IndexService.getEmigo failed");
        resolve();
      });
    });
  }

  // sync identity
  public syncIdentity(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("not synchronizing identity module");
        resolve();
      }
      else {
        this.identityService.getMessage(this.node, this.token).then(m => {
          let emigo: Emigo = getEmigoObject(m);
          this.handle = emigo.handle;
          this.registry = emigo.registry;
          this.emigoIdentity.next(emigo);
          this.storeService.setProfileObject(this.emigoId, "emigo", emigo).then(() => {
            this.revision.identity = emigo.revision;
            this.setRevision();
            resolve();
          }).catch(err => {
            console.log("StoreService.setProfileObject failed");
            resolve();
          });
        }).catch(err => {
          console.log("IdentityService.getMessage failed");
          resolve();
        });
      }
    });
  }

  // sync labels
  public syncLabels(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableGroup != true) {
        console.log("not synchronizing group module");
        resolve();
      }
      else {
        this.groupService.getLabels(this.node, this.token).then(l => {
          if(l == null) {
            l = [];
          }
          this.labelEntries.next(l);
          this.storeService.setProfileObject(this.emigoId, "labels", l).then(() => {
            resolve();
          }).catch(err => {
            console.log("StoreService.setProfileObject failed");
            resolve();
          });
        }).catch(err => {
          console.log("GroupService.getLabels failed");
          resolve();
        });
      }
    });
  }

  // sync attributes
  public syncAttributes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("not synchronizing profile module");
        resolve();
      }
      else {
        this.profileService.getRevision(this.node, this.token).then(r => {
          this.profileService.getAttributes(this.node, this.token, this.attributeFilter).then(a => {
            if(a == null) {
              a = [];
            }
            this.attributeEntries.next(this.parseAttributes(a));
            this.storeService.setProfileObject(this.emigoId, "attributes", a).then(() => {
              this.revision.profile = r;
              this.setRevision();
              resolve();
            }).catch(err => {
              console.log("StoreService.setProfileObject failed");
              resolve();
            });
          }).catch(err => {
            console.log("ProfileService.getAttributes failed");
            resolve();
          });
        }).catch(err => {;
          console.log("ProfileService.getRevision failed");
          resolve();
        });
      }
    });
  }

  // sync index
  public syncEmigos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("not synchronizing index module");
        resolve();
      }
      else {
        this.indexService.getRevision(this.node, this.token).then(r => {
          this.indexService.getRequestIds(this.node, this.token).then(s => {
            this.storeService.setProfileObject(this.emigoId, "requests", s).then(() => {
              this.pendingView = s;
              this.indexService.getEmigoIds(this.node, this.token).then(async e => {
                if(e == null) {
                  e = [];
                }
                this.indexView.clear();
                for(let i = 0; i < e.length; i++) {
                  this.indexView.set(e[i].emigoId, e[i].notes);
                }
                await this.storeService.setEmigoLabels(this.emigoId, e);
                this.storeService.setProfileObject(this.emigoId, "index", e).then(() => {
                  this.revision.index = r;
                  this.setRevision();
                  resolve();
                }).catch(err => {
                  console.log("StoreService.setProfileObject index failed");
                  resolve();
                });
              }).catch(err => {
                console.log("IndexService.getEmigoIds failed");
                resolve();
              });
            }).catch(err => {
              console.log("StoreService.setProfileObjet requests failed");
              resolve();
            });
          }).catch(err => {
            console.log("IndexService.getRequestIds failed");
            resolve();
          });
        }).catch(err => {
          console.log("IndexService.getRevision failed");
          resolve();
        });
      }
    });
  }

  // sync shares
  private syncShares(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableShare != true) {
        console.log("not synchronizing share module");
        resolve();
      }
      else {
        this.shareService.getRevision(this.node, this.token).then(r => {
          this.shareService.getConnections(this.node, this.token).then(s => {
            if(s == null) {
              s = [];
            }
            this.shareView.clear();
            for(let i = 0; i < s.length; i++) {
              this.shareView.set(s[i].emigoId, new ShareView(s[i].shareId, s[i].status, s[i].token, s[i].revision, s[i].updated));
            }
            this.storeService.setProfileObject(this.emigoId, "share", s).then(() => {
              this.revision.share = r;
              this.setRevision();
              resolve();
            }).catch(err => {
              console.log("StoreService.setProfileObject share failed");
              resolve();
            });
          }).catch(err => {
            console.log("ShareService.getConnections failed");
            resolve();
          });
        }).catch(err => {
          console.log("ShareService.getRevision failed");
          resolve();
        });
      }
    });
  }

  // load node data
  private loadNode(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "node").then(n => {
        this.node = n;
        this.loadRevision().then(() => {
          
          // update in background
          this.syncCount = 0;
          this.syncChanges();
          this.syncInterval = setInterval(() => {
            this.syncChanges();
          }, 1000);
          
          resolve();
        }).catch(err => {
          console.log("EmigoService.ge failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.getProfileObject failed");
        reject();
      });
    });
  }

  // load revision object
  private loadRevision(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "revision").then(r => {
        if(r != null) {
          this.revision = r;
        }
        this.loadIdentity().then(() => {
          resolve();
        }).catch(err => {
          console.log("EmigoService.loadIdentity failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.getProfileObject failed");
        reject();
      });
    });
  }

  // load identity data
  private loadIdentity(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "emigo").then(e => {
        this.handle = e.handle;
        this.registry = e.registry;
        this.emigoIdentity.next(e);
        this.loadLabels().then(() => {
          resolve();
        }).catch(err => {
          console.log("EmigoService.loadLabels failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.getProfileObject failed");
        reject();
      });
    });
  }

  // load labels
  private loadLabels(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "labels").then(l => {
        if(l == null) {
          l = [];
        }
        this.labelEntries.next(l);
        this.loadAttributes().then(() => {
          resolve();
        }).catch(err => {
          console.log("EmigoService.loadAttributes failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.getProfileObject labels failed");
        reject();
      });
    });
  }

  // load attributes
  private loadAttributes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "filter").then(f => {
        if(f == null) {
          f = [];
        }
        if(JSON.stringify(f) != JSON.stringify(this.attributeFilter)) {
          this.storeService.clearEmigos(this.emigoId).then(() => {
            this.setAttributeFilter().then(() => {
              this.attributeEntries.next([]);
              this.loadEmigos().then(() => {
                resolve(); 
              }).catch(err => {
                console.log("EmigoService.loadEmigos failed");
                reject();
              });
            }).catch(err => {
              console.log("EmigoService.syncAttributeFilter failed");
              reject();
            });
          }).catch(err => {
            console.log("StoreService.clearEmigos failed");
            reject();
          });
        }
        else {
          this.storeService.getProfileObject(this.emigoId, "attributes").then(a => {
            if(a == null) {
              a = [];
            }
            this.attributeEntries.next(this.parseAttributes(a));
            this.loadEmigos().then(() => {
              resolve();
            }).catch(err => {
              console.log("EmigoService.loadEmigos failed");
              reject();
            });
          }).catch(err => {
            console.log("StoreService.getProfileObject attributes failed");
            reject();
          });
        }
      }).catch(err => {
        console.log("StoreService.getProfileObject filter failed");
        reject();
      });
    });
  }

  // private parse attributes
  private parseAttributes(a: AttributeEntryView[]): AttributeEntity[] {
    let entities: AttributeEntity[] = [];
    for(let i = 0; i < a.length; i++) {
      entities.push({ "id": a[i].attributeId, "schema": a[i].attribute.schema, 
          "obj": JSON.parse(a[i].attribute.data), "labels": a[i].labels });
    }
    return entities;
  }

  // load emigo id list
  private loadEmigos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "requests").then(s => {
        if(s == null) {
          s = [];
        }
        this.pendingView = s;
        this.storeService.getProfileObject(this.emigoId, "index").then(async e => {
          if(e == null) {
            e = [];
          }
          this.indexView.clear();
          for(let i = 0; i < e.length; i++) {
            this.indexView.set(e[i].emigoId, e[i].notes);
          }
          await this.storeService.setEmigoLabels(this.emigoId, e);
          this.loadShares().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.loadShares failed");
            resolve();
          });
        }).catch(err => {
          console.log("StoreService.getProfileObject index failed");
          reject();
        });
      }).catch(err => {
        console.log("StoreService.getProfileObject requests failed");
        reject();
      });
    });
  }

  // load share list
  private loadShares(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.getProfileObject(this.emigoId, "share").then(s => {
        if(s == null) {
          s = [];
        }
        this.shareView.clear();
        for(let i = 0; i < s.length; i++) {
          this.shareView.set(s[i].emigoId, new ShareView(s[i].shareId, s[i].status, s[i].token, s[i].revision, s[i].updated));
        }
        resolve();
      }).catch(err => {
        console.log("StoreService getProfileObject shares failed");
        resolve();
      });
    });
  }

  // observe emigo object
  get identity() {
    return this.emigoIdentity.asObservable();
  }

  // set identity name
  public setName(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.identityService.setName(this.node, this.token, name).then(m => {
          this.refreshEmigo(m).then(() => {
            resolve();
          }).catch(err => {
            console.log("IdentityService.setRegistry failed");
            reject();
          });
        }).catch(err => {
          console.log("IdentityService.setName failed");
          reject();
        });
      }
    });
  }

  // set identity description
  public setDescription(description: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.identityService.setDescription(this.node, this.token, description).then(m => {
          this.refreshEmigo(m).then(() => {
            resolve();
          }).catch(err => {
            console.log("IdentityService.setRegistry failed");
            reject();
          });
        }).catch(err => {
          console.log("IdentityService.setDescription failed");
          reject();
        });
      }
    });
  }

  // set identity image
  public setImage(image: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.identityService.setImage(this.node, this.token, image).then(m => {
          this.refreshEmigo(m).then(() => {
            resolve();
          }).catch(err => {
            console.log("IdentityService.setRegistry failed");
            reject();
          });
        }).catch(err => {
          console.log("IdentityService.setImage failed");
          reject();
        });
      }
    });
  }

  // set identity location
  public setLocation(location: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.identityService.setLocation(this.node, this.token, location).then(m => {
          this.refreshEmigo(m).then(() => {
            resolve();
          }).catch(err => {
            console.log("IdentityService.setRegistry failed");
            reject();
          });
        }).catch(err => {
          console.log("IdentityService.setLocation failed");
          reject();
        });
      }
    });
  }

  // set identity registry
  public setRegistry(registry: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.registryService.checkHandle(registry, this.handle, this.emigoId).then(f => {
          if(f == false) {
            console.log("RegistryService.checkHandle rejected");
            reject();
          }
          else {
            // there is a race condition where another user could claim handle
            // so app should still be flexible allowing for unregistered handle
            this.identityService.setRegistry(this.node, this.token, registry).then(m => {
              this.refreshEmigo(m).then(() => {
                resolve();
              }).catch(err => {
                console.log("IdentityService.setRegistry failed");
                reject();
              });
            }).catch(err => {
              console.log("IdentityService.setRegistry failed");
              reject();
            });
          }
        }).catch(err => {
          console.log("RegistryService.checkHandle failed");
          reject();
        });
      }
    });
  }

  // set identity handle
  public setHandle(handle: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity != true) {
        console.log("access denied to identity module");
        reject();
      }
      else {
        this.registryService.checkHandle(this.registry, handle, this.emigoId).then(f => {
          if(f == false) {
            console.log("RegistryService.checkHandle rejected");
            reject();
          }
          else {
            // there is a race condition where another user could claim handle
            // so app should still be flexible allowing for unregistered handle
            this.identityService.setHandle(this.node, this.token, handle).then(m => {
              this.refreshEmigo(m).then(() => {
                resolve();
              }).catch(err => {
                console.log("EmigoService.refreshEmigo failed");
                reject();
              });     
            }).catch(err => {
              console.log("IdentityService.setHandle failed");
              reject();
            });
          }
        }).catch(err => {
          console.log("RegistryService.checkHandle failed");
          reject();
        });
      }
    });
  }

  // check if identity is available
  public checkHandle(handle: string): Promise<boolean> {
    return this.registryService.checkHandle(this.registry, handle, this.emigoId);
  }

  private refreshEmigo(msg: EmigoMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let emigo: Emigo = getEmigoObject(msg);
      this.handle = emigo.handle;
      this.registry = emigo.registry;
      this.emigoIdentity.next(emigo);
      this.storeService.setProfileObject(this.emigoId, "emigo", emigo).then(() => {
        this.registryService.setMessage(this.registry, msg).then(() => {
          this.identityService.clearDirty(this.node, this.token, emigo.revision).then(() => {
            resolve();
          }).catch(err => {
            console.log("IdentityService.clearDirty failed");
            resolve();
          });
        }).catch(err => {
          console.log("RegistryService.setMessage failed");
          resolve();
        });
      }).catch(err => {
        console.log("StoreService.setProfileObject identity failed");
        reject();
      });
     });
  }

  // observe list of LabelEntry
  get labels() {
    return this.labelEntries.asObservable();
  }

  // add new label
  public addLabel(label: Label): Promise<LabelEntry> {
    return new Promise<LabelEntry>((resolve, reject) => {
      if(this.access.enableGroup != true) {
        console.log("access denied to group module");
        reject();
      }
      else {
        this.groupService.addLabel(this.node, this.token, label).then(e => {
          this.refreshLabels().then(() => {
            resolve(e);
          }).catch(err => {
            console.log("EmigoService.refreshLabels failed");
            reject();
          });
        }).catch(err => {
          console.log("GroupService.addLabel failed");
          reject();
        });
      }
    });
  }

  // edit label
  public updateLabel(id: string, label: Label): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableGroup != true) {
        console.log("access denied to group module");
        reject();
      }
      else {
        this.groupService.updateLabel(this.node, this.token, id, label).then(e => {
          this.refreshLabels().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshLabels failed");
            reject();
          });
        }).catch(err => {
          console.log("GroupService.updateLabel failed");
          reject();
        });
      }
    });
  }

  // remove label
  public deleteLabel(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableGroup != true) {
        console.log("access denied to group module");
        reject();
      }
      else {
        this.groupService.deleteLabel(this.node, this.token, id).then(e => {
          this.refreshLabels().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshLabels failed");
            reject();
          });
        }).catch(err => {
          console.log("GroupService.deleteLabel failed");
          reject();
        });
      }
    });
  }

  private refreshLabels(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.groupService.getRevision(this.node, this.token).then(r => {
        this.groupService.getLabels(this.node, this.token).then(l => {
          if(l == null) {
            l = [];
          }
          this.labelEntries.next(l);
          this.storeService.setProfileObject(this.emigoId, "labels", l).then(() => {
            this.revision.group = r;
            this.setRevision();
            resolve();
          }).catch(err => {
            console.log("StoreService.setProfileObject failed");
            reject();
          });
        }).catch(err => {
          console.log("GroupService.getLabels failed");
          reject();
        });
      }).catch(err => {
        console.log("GroupService.getRevision failed");
        reject();
      });
    });
  }


  // observe list of AttributeEntities
  get attributes() {
    return this.attributeEntries.asObservable();
  }

  // add a new attribute with labels
  public addAttribute(schema: string, obj: any, labels: string[]): Promise<AttributeEntity> {
    return new Promise<AttributeEntity>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("access denied to profile module");
        reject();
      }
      else {
        let a: AttributeData = { "schema": schema, "data": JSON.stringify(obj), "labels": labels };
        this.profileService.addAttribute(this.node, this.token, a).then(e => {
          let obj: any = null;
          if(e.attribute.data != null) {
            obj = JSON.parse(e.attribute.data);
          }
          let attribute: AttributeEntity = { id: e.attributeId, schema: e.attribute.schema, 
              obj: obj, labels: [] };
          this.refreshAttributes().then(() => {
            resolve(attribute);
          }).catch(err => {
            console.log("EmigoService.refreshAttributes failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.addAttribute failed");
          reject();
        });
      }
    });
  }

  // update attribute
  public updateAttribute(id: string, schema: string, obj: any) {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("access denied to profile module");
        reject();
      }
      else {
        let a: Attribute = { "schema": schema, "data": JSON.stringify(obj) };
        this.profileService.updateAttribute(this.node, this.token, id, a).then(e => {
          this.refreshAttributes().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshAttributes failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.updateAttribute failed");
          reject();
        });
      }
    });
  }

  // remove attribute
  public deleteAttribute(id: string) {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("access denied to profile module");
        reject();
      }
      else {
        this.profileService.removeAttribute(this.node, this.token, id).then(e => {
          this.refreshAttributes().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshAttributes failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.removeAttribute failed");
          reject();
        });
      }
    });
  }

  // set attribute label
  public setAttributeLabel(attributeId: string, labelId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("access denied to profile module");
        reject();
      }
      else {
        this.profileService.setAttributeLabel(this.node, this.token, attributeId, labelId).then(e => {
          this.refreshAttributes().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshAttributes failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.setAttributeLabel failed");
          reject();
        });
      }
    });
  }

  // clear attribute label
  public clearAttributeLabel(attributeId: string, labelId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile != true) {
        console.log("access denied to profile module");
        reject();
      }
      else {
        this.profileService.clearAttributeLabel(this.node, this.token, attributeId, labelId).then(e => {
          this.refreshAttributes().then(() => {
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshAttributes failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.clearAttributeLabel failed");
          reject();
        });
      }
    });
  }

  private refreshAttributes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.profileService.getRevision(this.node, this.token).then(r => {
        this.profileService.getAttributes(this.node, this.token, this.attributeFilter).then(a => {
          if(a == null) {
            a = [];
          }
          this.attributeEntries.next(this.parseAttributes(a));
          this.storeService.setProfileObject(this.emigoId, "attributes", a).then(() => {
            this.revision.profile = r;
            this.setRevision();
            resolve();
          }).catch(err => {
            console.log("StoreService.setProfileObject failed");
            reject();
          });
        }).catch(err => {
          console.log("ProfileService.getAttributes failed");
          reject();
        });
      }).catch(err => {
        console.log("ProfileService.getRevision failed");
        reject();
      });
    });
  }

  // remove emigo request
  public clearEmigoRequest(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        this.indexService.clearRequest(this.node, this.token, id).then(() => {
          this.refreshEmigos().then(() => {
            this.setEmigos();
            resolve();
          }).catch(err => {
            console.log("EmigoService.refreshEmigos failed");
            resolve();
          });
        }).catch(err => {
          console.log("IndexService.clearRequest failed");
          reject();
        });
      }
    });
  }

  // retrieve message for requesting emigo
  public getEmigoRequestMessage(id: string): Promise<EmigoMessage> {
    return new Promise<EmigoMessage>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        this.indexService.getRequestMessage(this.node, this.token, id).then(m => {
          resolve(m);
        }).catch(err => {
          console.log("IndexService.getRequestMessage failed");
          reject();
        });
      }
    });
  }

  // add emigo to index
  public addEmigo(m: EmigoMessage): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        let emigo: Emigo = getEmigoObject(m);
        if(this.indexView.has(emigo.emigoId)) {
          console.log("emigo already added");
          resolve();
        }
        else {
          this.indexService.addEmigo(this.node, this.token, m).then(e => {
            this.storeService.insertEmigo(this.emigoId, e.emigo.emigoId).then(() => {
              this.storeService.updateEmigoIdentity(this.emigoId, e.emigo.emigoId, e.emigo).then(() => {
                this.refreshEmigos().then(() => {
                  this.refreshShares().then(() => {
                    this.setEmigos();
                    resolve(e.emigo.emigoId);
                  }).catch(err => {
                    console.log("EmigoService.refreshShares failed");
                    reject();
                  });
                }).catch(err => {
                  console.log("EmigoService.refreshEmigos failed");
                  reject();
                }); 
              }).catch(err => {
                console.log("StoreService.updateEmigoIdentity failed");
                reject();
              });
            }).catch(err => {
              console.log("StoreService.insertEmigo failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.addEmigo failed");
            reject();
          });
        }
      }
    });
  }

  // remove emigo from index
  public deleteEmigo(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        if(!this.indexView.has(id)) {
          console.log("emigo already removed");
          resolve();
        }
        else {
          this.indexService.deleteEmigo(this.node, this.token, id).then(() => {
            this.storeService.deleteEmigo(this.emigoId, id).then(() => {
              this.refreshEmigos().then(() => {
                this.refreshShares().then(() => {
                  this.setEmigos();
                  resolve();
                }).catch(err => {
                  console.log("EmigoService.refreshShares failed");
                  reject();
                });
              }).catch(err => {
                console.log("EmigoService.refreshEmigos failed");
                reject();
              }); 
            }).catch(err => {
              console.log("StoreService.deleteEmigo failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.deleteEmigo failed");
            reject();
          });
        }
      }
    });
  }

  // add notes for emigo
  public updateEmigo(id: string, notes: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        if(!this.indexView.has(id)) {
          console.log("emigo entry not found");
          reject();
        }
        else {
          this.indexService.setEmigoNotes(this.node, this.token, id, notes).then(() => {
            this.refreshEmigos().then(() => {
              this.selectEmigoContact(this.selectedEmigoId);
              resolve();
            }).catch(err => {
              console.log("EmigoService.refreshEmigos failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.setEmigoNotes failed");
            reject();
          });
        }
      }
    });
  }

  // add a label for emigo
  public setEmigoLabel(emigoId: string, labelId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        if(!this.indexView.has(emigoId)) {
          console.log("emigo entry not found");
          reject();
        }
        else {
          this.indexService.setEmigoLabel(this.node, this.token, emigoId, labelId).then(e => {
            this.refreshEmigos().then(() => {
              this.setEmigos();
              resolve();
            }).catch(err => {
              console.log("EmigoService.refreshEmigos failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.addEmigoLabel failed");
            reject();
          });
        }
      }
    });
  }

  // clear a label from emigo
  public clearEmigoLabel(emigoId: string, labelId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex != true) {
        console.log("access denied to index module");
        reject();
      }
      else {
        if(!this.indexView.has(emigoId)) {
          console.log("emigo entry not found");
          reject();
        }
        else {
          this.indexService.clearEmigoLabel(this.node, this.token, emigoId, labelId).then(() => {
            this.refreshEmigos().then(() => {
              this.setEmigos();
              resolve();
            }).catch(err => {
              console.log("EmigoService.refreshEmigos failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.deleteEmigoLabel failed");
            reject();
          });
        }
      }
    });
  }

  // reload emigos from database
  private refreshEmigos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.indexService.getRevision(this.node, this.token).then(r => {
        if(this.revision.index == r) {
          resolve();
        }
        else {
          this.indexService.getRequestIds(this.node, this.token).then(s => {
            this.pendingView = s;
            this.storeService.setProfileObject(this.emigoId, "requests", s).then(() => {
              this.indexService.getEmigoIds(this.node, this.token).then(async e => {
                if(e == null) {
                  e = [];
                }
                this.indexView.clear();
                for(let i = 0; i < e.length; i++) {
                  this.indexView.set(e[i].emigoId, e[i].notes);
                }
                await this.storeService.setEmigoLabels(this.emigoId, e);
                this.storeService.setProfileObject(this.emigoId, "index", e).then(() => {
                  this.revision.index = r;
                  this.setRevision();
                  resolve();
                }).catch(err => {
                  console.log("StoreService.setProfileObject index failed");
                  resolve();
                });
              }).catch(err => {
                console.log("IndexService.getEmigoIds failed");
                resolve();
              });
            }).catch(err => {
              console.log("IndexService.setProfileObject requests failed");
              resolve();
            });
          }).catch(err => {
            console.log("IndexService.getRequestIds failed");
            resolve();
          });
        }
      }).catch(err => {
        console.log("IndexService.getRevision failed");
        resolve();
      });
    });
  }

  // observe EmigoContact of selected id
  get selectedEmigo() {
    return this.selected.asObservable();
  }

  // observe EmigoContact when updated
  get updatedEmigo() {
    return this.updated.asObservable();
  }

  // select emigo for viewing
  public selectEmigoContact(id: string): Promise<void> {
    this.selected.next(null);
    this.selectedEmigoId = id;
    return new Promise<void>((resolve, reject) => {
      if(this.selectedEmigoId != null) {
        this.getEmigoContact(id).then(e => {
          this.selected.next(e);
          resolve();
        }).catch(err => {
          console.log("EmigoService.getEmigoContact failed");
          reject();
        });
      }
      else {
        resolve();
      }
    });
  }

  // refresh emigo
  public refreshEmigoContact(id: string): void {
    this.refreshEmigos().then(() => {
      this.refreshShares().then(() => {
        this.setEmigos();
        this.storeService.getEmigoUpdate(this.emigoId, id).then(u => {
          this.updateContact(u);
        }).catch(err => {
          console.log("StoreService.getEmigoUpdate failed");
        });
      }).catch(err => {
        console.log("EmigoService.refreshShares failed");
      });
    }).catch(err => {
      console.log("EmigoService.refreshEmigos failed");
    });
  }

  // notify app of change
  private updateEmigoContact(id: string) {
    this.getEmigoContact(id).then(e => {
      this.updated.next(e);
    }).catch(err => {
      console.log("EmigoService.getEmigoContact failed");
      this.updated.next(null);
    });
  }

  public getEmigoContact(id: string): Promise<EmigoContact> {
    return new Promise<EmigoContact>((resolve, reject) => {
      this.storeService.getEmigo(this.emigoId, id).then(e => {
        if(e == null) {
          resolve({});
        }
        else {
          let notes: string = this.indexView.get(id);
          let share: ShareView = this.shareView.get(id);
          if(share == null) {
            share = new ShareView(id, null, null, null, null);
          }
          let attributes: AttributeEntityData[] = [];
          if(e.attributes != null) {
            for(let i = 0; i < e.attributes.length; i++) {
              attributes.push({ schema: e.attributes[i].schema, obj: JSON.parse(e.attributes[i].data) });
            }
          }
          let labels: Set<string> = new Set<string>();
          if(e.labels != null) {
            for(let i = 0; i < e.labels.length; i++) {
              labels.add(e.labels[i]);
            }
          }
          let contact: EmigoContact = { "emigo": e.emigo, "notes": notes, "labels": labels, 
              "status": share.getStatus(), "attributeRevision": e.attributeRevision, "subjectRevision": e.subjectRevision,
              "attributes": attributes, "appData": e.appData, "appState": e.appState, "error": e.identityError || e.attributeError || e.subjectError};
          resolve(contact);
        }
      }).catch(err => {
        console.log("StoreService.getEmigo failed");
        reject();
      });
    });
  }

  // set emigo app data
  public setEmigoData(id: string, revision: number, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.updateEmigoAppData(this.emigoId, id, revision, data).then(() => {
        this.setEmigos();
      }).catch(err => {
        console.log("StoreService.updateEmigoAppData failed");
        reject();
      });
    });
  }

  // set emigo app state
  public setEmigoState(id: string, state: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storeService.updateEmigoAppState(this.emigoId, id, state).then(() => {
        this.setEmigos();
      }).catch(err => {
        console.log("StoreService.updateEmigoAppState failed");
        reject();
      });
    });
  }

  // observe emigo view filtered list of emigos
  get filteredContacts() {
    return this.filteredEmigos.asObservable();
  }

  // observe pending contacts
  get pendingContacts() {
    return this.pendingEmigos.asObservable();
  }

  // observe connected contacts
  get connectedContacts() {
    return this.connectedEmigos.asObservable();
  }

  // observe requested contacts
  get requestedContacts() {
    return this.requestedEmigos.asObservable();
  }

  // observe received contacts
  get receivedContacts() {
    return this.receivedEmigos.asObservable();
  }

  // observe saved contacts
  get savedContacts() {
    return this.savedEmigos.asObservable();
  }

  // set current view
  private setView(): void {
    this.storeService.getEmigos(this.emigoId, this.emigoFilter, this.emigoLabels).then(e => {
      this.filteredEmigos.next(this.getEmigoViews(e, this.emigoStatus));
    }).catch(err => {
      console.log("StoreService.getEmigos failed");
      this.filteredEmigos.next([]);
    });
  }

  // set contact filter view
  public setFilter(filter: string): void {
    this.emigoFilter = filter;
    this.setView();
  }

  // set contact status view
  public setStatus(status: string[]): void {
    this.emigoStatus = status;
    this.setView();
  }

  // set contact label view
  public setLabels(ids: string[]): void {
    this.emigoLabels = ids;
    this.setView();
  }

  // request new contact
  public requestContact(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableShare != true) {
        console.log("access denied to share module");
        reject();
      }
      else {
        this.storeService.getEmigo(this.emigoId, id).then(c => {
          if(c == null) {
            console.log("contact not found");
            reject();
          }
          else {
            let share: ShareView = this.shareView.get(id);
            if(share == null) {
              this.shareService.addConnection(this.node, this.token, id).then(e => {
                this.applyShareStatus(e.emigoId, c.emigo.node, e.shareId).then(() => {
                  let emigo: EmigoUpdate = { "emigoId": c.emigo.emigoId, "revision": c.emigo.revision, 
                      "node": c.emigo.node, "registry": c.emigo.registry, 
                      "attributeRevision": c.attributeRevision, "subjectRevision": c.subjectRevision };
                  this.updateContact(emigo);
                  resolve();
                }).catch(err => {
                  console.log("EmigoSrevice.applyShareStatus failed");
                  reject();
                });
              }).catch(err => {
                console.log("ShareService.addConnection failed");
                reject();
              });
            }
            else {
              this.shareService.updateStatus(this.node, this.token, share.getId(), "requesting", share.getToken()).then(e => {
                this.applyShareStatus(e.emigoId, c.emigo.node, e.shareId).then(() => {
                  let emigo: EmigoUpdate = { "emigoId": c.emigo.emigoId, "revision": c.emigo.revision,
                      "node": c.emigo.node, "registry": c.emigo.registry,
                      "attributeRevision": c.attributeRevision, "subjectRevision": c.subjectRevision };
                  this.updateContact(emigo);
                  resolve();
                }).catch(err => {
                  console.log("EmigoService.applyShareStatus failed");
                  reject();
                });
              }).catch(err => {
                console.log("ShareService.updateStatus failed");
                reject();
              });
            }
          }
        }).catch(err => {
          console.log("StoreService.getEmigo failed");
          reject();
        });
      }
    });
  }

  // accept new contact
  public acceptContact(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableShare != true) {
        console.log("access denied to share module");
        reject();
      }
      else {
        let share: ShareView = this.shareView.get(id);
        if(share == null) {
          console.log("share not found");
          reject();
        }
        else {
          this.storeService.getEmigo(this.emigoId, id).then(c => {
            if(c == null) {
              console.log("emigo not found");
              reject();
            }
            else {
              this.shareService.updateStatus(this.node, this.token, share.getId(), "requesting", null).then(e => {
                this.applyShareStatus(id, c.emigo.node, share.getId()).then(() => {
                  let emigo: EmigoUpdate = { "emigoId": c.emigo.emigoId, "revision": c.emigo.revision, 
                      "node": c.emigo.node, "registry": c.emigo.registry, 
                      "attributeRevision": c.attributeRevision, "subjectRevision": c.subjectRevision };
                  this.updateContact(emigo);
                  resolve();
                }).catch(err => {
                  console.log("EmigoService.applyShareStatus failed");
                  reject();
                });
              }).catch(err => {
                console.log("ShareService.updateStatus failed");
                reject();
              });
            }
          }).catch(err => {
            console.log("StoreService.getEmigo failed");
            reject();
          });
        }
      }
    });
  }

  // deny, cancel or disconnect contact
  public closeContact(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableShare != true) {
        console.log("access denied to share module");
        reject();
      }
      else {
        let share: ShareView = this.shareView.get(id);
        if(share == null) {
          console.log("share not found");
          reject();
        }
        else {
          this.storeService.getEmigo(this.emigoId, id).then(c => {
            if(c == null) {
              console.log("emigo not found");
              reject();
            }
            else {
              let share: ShareView = this.shareView.get(id);
              if(share == null) {
                console.log("share not found");
                reject();
              }
              else {
                this.shareService.updateStatus(this.node, this.token, share.getId(), "closing", null).then(e => {
                  this.applyShareStatus(e.emigoId, c.emigo.node, e.shareId).then(() => {
                    let emigo: EmigoUpdate = { "emigoId": c.emigo.emigoId, "revision": c.emigo.revision, 
                        "node": c.emigo.node, "registry": c.emigo.registry, 
                        "attributeRevision": c.attributeRevision, "subjectRevision": c.subjectRevision };
                    this.refreshShares().then(() => {
                      this.setEmigos();
                      this.updateContact(emigo);
                      resolve();
                    }).catch(err => { // allow failure of refresh
                      console.log("EmigoService.refreshEmigos failed");
                      this.updateContact(emigo);
                      resolve();
                    });
                  }).catch(err => { // allow failure of apply
                    console.log("EmigoService.applyShareStatus failed");
                    let emigo: EmigoUpdate = { "emigoId": c.emigo.emigoId, "revision": c.emigo.revision, 
                        "node": c.emigo.node, "registry": c.emigo.registry, 
                        "attributeRevision": c.attributeRevision, "subjectRevision": c.subjectRevision };
                    this.refreshShares().then(() => {
                      this.setEmigos();
                      this.updateContact(emigo);
                      resolve();
                    }).catch(err => { // allow failure of refresh
                      console.log("EmigoService.refreshEmigos failed");
                      this.updateContact(emigo);
                      resolve();
                    });
                  });
                }).catch(err => {
                  console.log("ShareService.updateStatus failed");
                  reject();
                });
              }
            }
          }).catch(err => {
            console.log("StoreService.getEmigo failed");
            reject();
          });
        }
      }
    });
  }

  // update emigo observables
  private setEmigos(): void {
    // update selected emigo
    this.selectEmigoContact(this.selectedEmigoId);

    // update pending emigos
    this.pendingEmigos.next(this.pendingView);

    // update all emigos view
    this.storeService.getEmigos(this.emigoId, this.emigoFilter, this.emigoLabels).then(e => {
     this.filteredEmigos.next(this.getEmigoViews(e, this.emigoStatus));
    }).catch(err => {
      console.log("StoreService.getEmigos failed");
    });

    // update received emigos
    this.storeService.getEmigos(this.emigoId, null, null).then(e => {
      this.receivedEmigos.next(this.getEmigoViews(e, ['received']));
      this.requestedEmigos.next(this.getEmigoViews(e, ['requested']));
      this.connectedEmigos.next(this.getEmigoViews(e, ['connected']));
      this.savedEmigos.next(this.getEmigoViews(e, [null, 'requesting', 'requested', 'receiving', 'received', 'closing', 'closed']));
    }).catch(err => {
      console.log("StoreService.getEmigos failed");
    });
  }

  // deliver status to contact
  private applyShareStatus(emigoId: string, node: string, shareId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.shareService.getMessage(this.node, this.token, shareId).then(m => {
        this.shareService.setMessage(node, emigoId, m).then(s => {
          let status: string = null;
          let token: string = null;
          if(s.connected) {
            token = s.connected.token;
          }
          if(s.shareStatus == "received") {
            status = "requested";
          }
          if(s.shareStatus == "connected") {
            status = "connected";
          }
          if(s.shareStatus == "closed") {
            status = "closed";
          }
          if(status != null) {
            this.shareService.updateStatus(this.node, this.token, shareId, status, token).then(e => {
              this.refreshShares().then(() => {
                this.setEmigos();
                resolve();
              }).catch(err => {
                console.log("EmigoService.refreshShares failed");
                reject();
              });
            }).catch(err => {
              console.log("ShareService.updateStatus failed");
              reject();
            });
          }
          else {
            console.log("invalid share status");
            reject();
          }
        }).catch(err => {
          console.log("ShareService.setMessage failed");
          reject();
        });
      }).catch(err => {
        console.log("ShareService.getMessage failed");
        reject();
      });
    });
  }

  // reload emigos from database
  private refreshShares(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.shareService.getRevision(this.node, this.token).then(r => {
        if(this.revision.share == r) {
          resolve();
        }
        else {
          this.shareService.getConnections(this.node, this.token).then(s => {
            if(s == null) {
              s = [];
            }
            this.shareView.clear();
            for(let i = 0; i < s.length; i++) {
              this.shareView.set(s[i].emigoId, new ShareView(s[i].shareId, s[i].status, s[i].token, s[i].revision, s[i].updated));
            }
            this.storeService.setProfileObject(this.emigoId, "share", s).then(() => {
              this.revision.share = r;
              this.setRevision();
              resolve();
            }).catch(err => {
              console.log("StoreService.setProfileObject index failed");
              resolve();
            });
          }).catch(err => {
            console.log("ShareService.getConnections failed");
            resolve();
          });
        }
      }).catch(err => {
        console.log("IndexService.getRevision failed");
        resolve();
      });
    });
  }

  private hasStatus(arr: string[], val: string) {
    if(arr == null) {
      return false;
    }
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] == val) {
        return true;
      }
    }
    return false;
  }

  // convert internal to external type
  private getEmigoViews(base: EmigoBase[], status: string[]): EmigoView[] {
    let views: EmigoView[] = [];
    for(let i = 0; i < base.length; i++) {
      let share: ShareView = this.shareView.get(base[i].emigoId);
      if(status == null || (share != null && this.hasStatus(status, share.getStatus())) || (share == null && this.hasStatus(status, null))) {
        let shareRevision: number = null;
        let shareTimestamp: number = null;
        if(share != null) {
          shareRevision = share.getRevision();
          shareTimestamp = share.getTimestamp();
        }
        views.push({ id: base[i].emigoId, name: base[i].name, thumb: base[i].icon, handle: base[i].handle, 
        identityRevision: base[i].identityRevision, attributeRevision: base[i].attributeRevision, subjectRevision: base[i].subjectRevision,
        appData: base[i].appData, appState: base[i].appState, shareRevision: shareRevision, shareTimestamp: shareTimestamp });
      }
    }
    return views;
  }

  // save revision object
  private setRevision() {
    this.storeService.setProfileObject(this.emigoId, "revision", this.revision).then(() => {}).catch(err => {
      console.log("StoreService setProfileObject revision failed");
    });
  }

  // sync changes to identiy, profile, groups, and emigos
  private syncChanges() {

    // sync stale emigo (node, registry, contact)
    if(this.access.enableIndex) {
      if((this.syncCount % 60) == 0) { // check 1/min
        let d: Date = new Date();
        let epoch: number = Math.floor(d.getTime() / 1000);
        this.storeService.getStaleEmigo(this.emigoId, epoch - this.stale).then(e => {
          if(e != null) {
            this.updateContact(e);
          }
        });
      }
    }

    // sync once every 5min
    if((this.syncCount % this.refresh) == 0) {
   
      this.updateIdentity().then(() => {
        this.updateRegistry().then(() => {
          this.updateProfile().then(() => {
            this.updateGroup().then(() => {
      
              let index: number = this.revision.index;
              let share: number = this.revision.share;
              this.updateIndex().then(() => {
                this.updateShare().then(() => {

                  // update lists if change occured
                  if(index != this.revision.index || share != this.revision.share) {
                    this.setEmigos();
                  }

                  // check if account has been relocated
                  let nodeError: boolean = this.identityError || this.profileError || 
                      this.groupError || this.indexError || this.shareError;
                  if(nodeError) {
                    this.syncRegistry();
                  }

                  // update stored emigos
                  this.syncStore();

                }).catch(err => {
                  console.log("EmigoService.updateShare failed");
                });
              }).catch(err => {
                console.log("EmigoService.updateIndex failed");
              });

            }).catch(err => {
              console.log("EmigoService.updateGroup failed");
            });          
          }).catch(err => {
            console.log("EmigoService.updateProfile failed");
          });
        }).catch(err => {
          console.log("EmigoService.updateRegistry failed");
        });
      }).catch(err => {
        console.log("EmigoService.updateIdentity failed");
      });
    } 

    this.syncCount++;
  }

  private updateError(): void {
    // update error state
    let nodeError: boolean = this.identityError || this.profileError || this.groupError ||
        this.indexError || this.shareError;
    this.nodeFlag.next(nodeError);
    this.registryFlag.next(this.registryError);
  }

  private updateIdentity(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity) {
        this.identityService.getRevision(this.node, this.token).then(r => {
          if(this.revision.identity == null || this.revision.identity != r) {
            this.identityService.getMessage(this.node, this.token).then(m => {
              let emigo: Emigo = getEmigoObject(m);
              this.handle = emigo.handle;
              this.registry = emigo.registry;
              this.emigoIdentity.next(emigo);
              this.storeService.setProfileObject(this.emigoId, "emigo", emigo).then(() => {
                this.revision.identity = r;
                this.setRevision();
                this.identityError = false;
                this.updateError();
                resolve();
              }).catch(err => {
                console.log("StoreService.setProfileObject failed");
                this.identityError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("IdentityService.getMessage failed");
              this.identityError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to update
            this.identityError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("IdentityService.getRevision failed");
          this.identityError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to update
        this.identityError = false;
        this.updateError();
        resolve();
      }
    });
  }

  private updateRegistry(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIdentity) {
        this.identityService.getDirty(this.node, this.token).then(d => {
          if(d) {
            this.identityService.getMessage(this.node, this.token).then(m => {
              let emigo: Emigo = getEmigoObject(m);
              this.registryService.setMessage(this.registry, m).then(() => {
                this.identityService.clearDirty(this.node, this.token, emigo.revision).then(() => {
                  this.registryError = false;
                  this.updateError();
                  resolve();
                }).catch(err => {
                  console.log("IdentityService.clearDirty failed");
                  this.registryError = true;
                  this.updateError();
                  resolve();
                });
              }).catch(err => {
                console.log("RegistryService.setMessage failed");
                this.registryError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("EmigoService.getEmigoObject failed");
              this.registryError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to do
            this.registryError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("EmigoService.getDirty failed");
          this.registryError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to do
        this.registryError = false;
        this.updateError();
        resolve();
      }
    }); 
  }
 
  private updateProfile(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableProfile) {
        this.profileService.getRevision(this.node, this.token).then(r => {
          if(this.revision.profile == null || this.revision.profile != r) {
            this.profileService.getAttributes(this.node, this.token, this.attributeFilter).then(a => {
              if(a == null) {
                a = [];
              }
              this.attributeEntries.next(this.parseAttributes(a));
              this.storeService.setProfileObject(this.emigoId, "attributes", a).then(() => {
                this.revision.profile = r;
                this.setRevision();
                this.profileError = false;
                this.updateError();
                resolve();
              }).catch(err => {
                console.log("StoreService.setProfileObject attributes failed");
                this.profileError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("ProfileService.getAttributes failed");
              this.profileError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to update
            this.profileError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("ProfileService getRevision failed");
          this.profileError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to update
        this.profileError = false;
        this.updateError();
        resolve();
      }
    });
  }

  private updateGroup(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableGroup) {
        this.groupService.getRevision(this.node, this.token).then(r => {
          if(this.revision.group == null || this.revision.group != r) {
            this.groupService.getLabels(this.node, this.token).then(l => {
              if(l == null) {
                l = [];
              }
              this.labelEntries.next(l);
              this.storeService.setProfileObject(this.emigoId, "labels", l).then(() => {
                this.revision.group = r;
                this.setRevision();
                this.groupError = false;
                this.updateError();
                resolve();
              }).catch(err => {
                console.log("StoreService setProfileObject labels failed");
                this.groupError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("GroupService.getLabels failed");
              this.groupError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to do
            this.groupError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("GroupService.getRevision failed");
          this.groupError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to do
        resolve();
        this.groupError = false;
        this.updateError();
      }
    });
  }

  private updateIndex(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.access.enableIndex) {
        this.indexService.getRevision(this.node, this.token).then(r => {
          if(this.revision.index == null || this.revision.index != r) {
            this.indexService.getRequestIds(this.node, this.token).then(s => {
              if(s == null) {
                s = [];
              }
              this.storeService.setProfileObject(this.emigoId, "requests", s).then(() => {
                this.pendingView = s;
                this.indexService.getEmigoIds(this.node, this.token).then(async e => {
                  if(e == null) {
                    e = [];
                  }
                  this.indexView.clear();
                  for(let i = 0; i < e.length; i++) {
                    this.indexView.set(e[i].emigoId, e[i].notes);
                  }
                  await this.storeService.setEmigoLabels(this.emigoId, e);
                  this.storeService.setProfileObject(this.emigoId, "index", e).then(() => {
                    this.revision.index = r;
                    this.setRevision();
                    this.indexError = false;
                    this.updateError();
                    resolve();
                  }).catch(err => {
                    console.log("StoreService.setProfileObject index failed");
                    this.indexError = true;
                    this.updateError();
                    resolve();
                  });
                }).catch(err => {
                  console.log("IndexService.getEmigoIds failed");
                  this.indexError = true;
                  this.updateError();
                  resolve();
                });
              }).catch(err => {
                console.log("StoreService.setProfileObject requests failed");
                this.indexError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("IndexService.getRequestIds failed");
              this.indexError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to do
            this.indexError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("IndexService.getRevision failed");
          this.indexError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to do
        this.indexError = false;
        this.updateError();
        resolve();
      }
    });
  }

  private updateShare(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      if(this.access.enableShare) {
        this.shareService.getRevision(this.node, this.token).then(r => {
          if(this.revision.share == null || this.revision.share != r) {
            this.shareService.getConnections(this.node, this.token).then(s => {
              if(s == null) {
                s = [];
              }
              this.shareView.clear();
              for(let i = 0; i < s.length; i++) {
                this.shareView.set(s[i].emigoId, new ShareView(s[i].shareId, s[i].status, s[i].token, s[i].revision, s[i].updated));
              }
              this.storeService.setProfileObject(this.emigoId, "share", s).then(() => {
                this.revision.share = r;
                this.setRevision();
                this.shareError = false;
                this.updateError();
                resolve();
              }).catch(err => {
                console.log("StoreService.setProfileObject share failed");
                this.shareError = true;
                this.updateError();
                resolve();
              });
            }).catch(err => {
              console.log("ShareService.getConnections failed");
              this.shareError = true;
              this.updateError();
              resolve();
            });
          }
          else {
            // nothing to do
            this.shareError = false;
            this.updateError();
            resolve();
          }
        }).catch(err => {
          console.log("ShareService.getRevision failed");
          this.shareError = true;
          this.updateError();
          resolve();
        });
      }
      else {
        // nothing to do
        this.shareError = false;
        this.updateError();
        resolve();
      }
    });
  }


  private syncRegistry(): void {
  
    this.registryService.getRevision(this.registry, this.emigoId).then(r => {
      if(this.revision.identity == null || this.revision.identity < r) {
        this.registryService.getMessage(this.registry, this.emigoId).then(m => {
          let emigo: Emigo = getEmigoObject(m);
          this.node = emigo.node;
          this.storeService.setProfileObject(this.emigoId, "node", this.node).then(() => {
            console.log("detected account migration");
          }).catch(err => {
            console.log("StoreService.setProfileObject failed");
          });
        }).catch(err => {
          console.log("RegistryService.getMessage failed");
        });
      }
    }).catch(err => {
      console.log("RegistryService.getRevision failed");
    });
  }

  private syncStore(): void {
    
    if(this.access.enableIndex) {
      this.storeService.getEmigoIds(this.emigoId).then(e => {
      
        // update stored emigos
        e.forEach((value, key) => {
          if(!this.indexView.has(key)) {
            this.storeService.deleteEmigo(this.emigoId, key).then(() => {
              this.setEmigos();
            }).catch(err => {
              console.log("StoreService.deleteEmigo failed");
            });
          }
          else {
            let share: ShareView;
            if(this.shareView.has(key)) {
              share = this.shareView.get(key);
            }
            else {
              share = new ShareView(key, null, null, null, null);
            }
            if(share.getStatus() == "connected" && value == null) {
              // first init contact
              this.storeService.updateEmigoAttributes(this.emigoId, key, 0, []).then(() => {
                // then query server
                this.storeService.getEmigoUpdate(this.emigoId, key).then(u => {
                  this.updateContact(u);
                }).catch(err => {
                  console.log("StoreService.getEmigoUpdate failed");
                });
              }).catch(err => {
                console.log("StoreService.updateEmigoAttributes failed");
              });
            }
            if(share.getStatus() != "connected" && value != null) {
              this.storeService.getEmigoUpdate(this.emigoId, key).then(u => {
                this.updateContact(u);
              }).catch(err => {
                console.log("StoreService.getEmigoUpdate failed"); 
              });
            }
          }
        });

        // insert any missing emigos
        this.indexView.forEach((value, key) => {
          if(!e.has(key)) {
            this.storeService.insertEmigo(this.emigoId, key).then(() => {
              this.storeService.getEmigoUpdate(this.emigoId, key).then(u => {
                this.updateContact(u);
              }).catch(err => {
                console.log("StoreService.getEmigoUpdate failed");
              });
            }).catch(err => {
              console.log("StoreService.insertEmigo failed");
            });
          }
        });

      }).catch(err => {
        console.log("StoreService.getEmigoIds failed");
      });
    }
  }

  public updateContactIdentity(e: EmigoUpdate): Promise<EmigoUpdate> {

    return new Promise<EmigoUpdate>((resolve, reject) => {
      this.indexService.getEmigoRevision(this.node, this.token, e.emigoId).then(r => {
        if(e.revision == null || e.revision < r) {
          this.indexService.getEmigo(this.node, this.token, e.emigoId).then(i => {
            this.storeService.updateEmigoIdentity(this.emigoId, e.emigoId, i.emigo).then(() => {
              this.setEmigos();
              this.storeService.getEmigoUpdate(this.emigoId, e.emigoId).then(u => {
                resolve(u);
              });
            }).catch(err => {
              console.log("StoreService.updateEmigoIdentity failed");
              reject();
            });
          }).catch(err => {
            console.log("IndexService.getEmigo failed");
            reject();
          });
        }
        else {
          resolve(e);
        }
      }).catch(err => {
        console.log("IndexService.getEmigoRevision failed");
        reject();
      });
    });
  }

  public updateContact(emigo: EmigoUpdate): void {

    if(this.access.enableIndex) {
      // update stale time
      let d: Date = new Date();
      let epoch: number = Math.floor(d.getTime() / 1000);
      this.storeService.setStaleEmigo(this.emigoId, emigo.emigoId, epoch).then(() => {}).catch(err => {
        console.log("StoreService.setStaleEmigo failed");
      });

      // first try and sync with index
      this.updateContactIdentity(emigo).then(e => {
        let emigoId = e.emigoId;    
        
        // sync with registry
        this.registryService.getRevision(e.registry, emigoId).then(r => {
          if(r != e.revision) {
            this.registryService.getMessage(e.registry, emigoId).then(msg => {
              let emigo: Emigo = getEmigoObject(msg);
              this.storeService.updateEmigoIdentity(this.emigoId, emigoId, emigo).then(() => {
                this.setEmigos();
              }).catch(err => {
                console.log("StoreService.updateEmigoIdentity failed");
              });
              this.indexService.getEmigoRevision(this.node, this.token, emigoId).then(n => {
                if(r != n) {
                  this.indexService.setEmigo(this.node, this.token, msg).then(e => {}).catch(err => {
                    console.log("IndexService.setEmigo failed");
                  });
                }
              }).catch(err => {
                console.log("IndexService.getEmigoRevision failed");
              });
            }).catch(err => {
              console.log("RegistryService.getMessage failed");
            });
          }
          else {
            this.indexService.getEmigoRevision(this.node, this.token, emigoId).then(r => {
              if(e.revision != r) {
                this.indexService.getEmigo(this.node, this.token, emigoId).then(i => {
                  this.storeService.updateEmigoIdentity(this.emigoId, emigoId, i.emigo).then(() => {}).catch(err => {
                    console.log("StoreService.updateEmigoIdentity failed");
                  });
                }).catch(err => {
                  console.log("IndexService.getEmigo failed");
                });
              }
            });
          }
        }).catch(err => {
          console.log("RegistryService.getRevision failed");
        });

        // update attributes
        if(this.access.enableShare) {
          let share: ShareView = this.shareView.get(emigoId);
          if(share != null && share.getStatus() == "connected") {
  
            // update emigo attributes
            this.contactService.getRevision(this.serviceNode, this.serviceToken, e.node, share.getToken()).then(r => { 
              if(r != e.attributeRevision) {
                this.contactService.getAttributes(this.serviceNode, this.serviceToken, e.node, share.getToken(),
                    this.attributeFilter).then(a => {
                  this.storeService.updateEmigoAttributes(this.emigoId, emigoId, r, a).then(() => {
                    this.updateEmigoContact(emigoId);
                    this.setEmigos();
                  }).catch(err => {
                    console.log("StoreService.updateEmigoAttributes failed");
                  });
                }).catch(err => {
                  console.log("ContactService.getAttributes failed");
                });
              }
            }).catch(err => {
              console.log("ContactService.getRevision failed");
            });

            // update emigo subjects
          }
          else {
            if(e.attributeRevision != null) {
              this.storeService.updateEmigoAttributes(this.emigoId, emigoId, null, []).then(() => {
                this.updateEmigoContact(emigoId);
                this.setEmigos();
              });
            }
          }
        }
      }).catch(err => {
        console.log("EmigoService.updateContactIdentity failed");
      });
    }
  }

}
