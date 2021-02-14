import { Injectable, Type, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CreateService {

  private emailAddress: string = null;
  private phoneNumber: string = null;
  private password: string = null;
  private phoneUtil: any;
  private pnf: any;

  constructor() {
    this.pnf = require('google-libphonenumber').PhoneNumberFormat;
    this.phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
  }

  public getEmailAddress(): string {
    return this.emailAddress;
  }
  public setEmailAddress(value: string): void {
    this.emailAddress = value;
  }    

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
  public setPhoneNumber(value: string): void {
    this.phoneNumber = value;
  }

  public getPassword(): string {
    return this.password;
  }
  public setPassword(value: string): void { 
    this.password = value;
  }
}
