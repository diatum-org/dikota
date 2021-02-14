import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AttributeUtil, AttributeDataEntry } from '../attributeUtil';
import { LabelEntry } from '../appdb/labelEntry';
import { EmigoService, AttributeEntity, EmigoContact } from '../appdb/emigo.service';
import { ContactView } from '../model/contactView';

@Injectable()
export class ContextService {

  private label: LabelEntry = null;
  private attribute: AttributeEntity = null;
  private emigo: ContactView = null;

  constructor(private emigoService: EmigoService) {
  }

  public setLabel(l: LabelEntry): void {
    this.clear();
    this.label = l;
  }

  public setAttribute(a: AttributeEntity): void {
    this.clear();
    this.attribute = a;
  }

  public setEmigo(e: ContactView): void {
    this.clear();
    this.emigo = e;
  }

  public clear(): void {
    this.label = null;
    this.attribute = null;
    this.emigo = null;
  }

  public getLabel(): LabelEntry {
    return this.label;
  }

  public getAttribute(): AttributeEntity {
    return this.attribute;
  }

  public getEmigo(): ContactView {
    return this.emigo;
  }
}


