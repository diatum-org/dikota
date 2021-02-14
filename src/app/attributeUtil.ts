export class AttributeDataEntry {
  value: string;
  type: string;
}

export class AttributeUtil {

  public static WEBSITE: string = 'b0e10c5cecaa8c451330740817e301a0cc6b22b57d0241ce3ffb20d8938dc067';
  public static CARD: string = '081272d5ec5ab6fb6d7d55d12697f6c91e66bb0db562ec059cbfc5cc2c36278b';
  public static EMAIL: string = 'da7084bf8a5187e049577d14030a8c76537e59830d224f6229548f765462c52b';
  public static PHONE: string = '6424b72bbf3b3a2e8387c03c4e9599275ab7e1b3abb515dc9e4c8f69be36003f';
  public static HOME: string = '89dd0b67823cb034b8eda59bb0a9af9a0707216830f32cd9634874c47c74a148';
  public static WORK: string = '9b9b2cb50f416956aa33e463bcdc131ab8fe5acf934a4179b87248ea4b102f60';
  public static SOCIAL: string = '4f181fd833399f33ea483b5e9dcf22fa81b7474ff53a38a327c5f2d1e71c5eb2';

  public static getSchemas(): string[] {
    return [ AttributeUtil.WEBSITE, AttributeUtil.CARD, AttributeUtil.EMAIL, AttributeUtil.PHONE, 
        AttributeUtil.HOME, AttributeUtil.WORK, AttributeUtil.SOCIAL ];
  }

  public static isWebsite(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.WEBSITE) {
      return true;
    }
    return false;
  }

  public static isCard(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.CARD) {
      return true;
    }
    return false;
  }

  public static isEmail(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.EMAIL) {
      return true;
    }
    return false;
  }

  public static isPhone(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.PHONE) {
      return true;
    }
    return false;
  }

  public static isHome(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.HOME) {
      return true;
    }
    return false;
  }

  public static isWork(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.WORK) {
      return true;
    }
    return false;
  }

  public static isSocial(a: any): boolean {
    if(a == null || a.obj == null) {
      return false;
    }
    if(a.schema == AttributeUtil.SOCIAL) {
      return true;
    }
  }

  public static getPhoneData(a: any[]): AttributeDataEntry[] {
    let attributes: AttributeDataEntry[] = [];
    if(a == null) {
      return attributes;
    }
    for(let i = 0; i < a.length; i++) {
      if(AttributeUtil.isPhone(a[i])) {
        if(a[i].obj.phone != null) {
          attributes.push({ value: a[i].obj.phone, type: a[i].obj.category });
        }
      }
      else if(AttributeUtil.isHome(a[i])) {
        if(a[i].obj.phoneNumber != null) {
          attributes.push({ value: a[i].obj.phoneNumber, type: 'Home' });
        }
      }
      else if(AttributeUtil.isWork(a[i])) {
        if(a[i].obj.phoneNumber != null) {
          attributes.push({ value: a[i].obj.phoneNumber, type: 'Work' });
        }
      }
      else if(AttributeUtil.isCard(a[i])) {
        if(a[i].obj.mainPhone != null) {
          attributes.push({ value: a[i].obj.mainPhone, type: 'Card Main' });
        }
        if(a[i].obj.directPhone != null) {
          attributes.push({ value: a[i].obj.directPhone, type: 'Card Direct' });
        }
        if(a[i].obj.mobilePhone != null) {
          attributes.push({ value: a[i].obj.mobilePhone, type: 'Card Mobile' });
        }
      }
    }
    return attributes;
  }

  public static getTextData(a: any[]): AttributeDataEntry[] {
    let attributes: AttributeDataEntry[] = [];
    if(a == null) {
      return attributes;
    }
    for(let i = 0; i < a.length; i++) {
      if(AttributeUtil.isPhone(a[i])) {
        if(a[i].obj.phone != null && a[i].obj.phoneSms) {
          attributes.push({ value: a[i].obj.phone, type: a[i].obj.category});
        }
      }
      else if(AttributeUtil.isHome(a[i])) {
        if(a[i].obj.phoneNumber != null && a[i].obj.phoneNumberSms) {
          attributes.push({ value: a[i].obj.phoneNumber, type: 'Home'});
        }
      }
      else if(AttributeUtil.isWork(a[i])) {
        if(a[i].obj.phoneNumber != null && a[i].obj.phoneNumberSms) {
          attributes.push({ value: a[i].obj.phoneNumber, type: 'Work'});
        }
      }
      else if(AttributeUtil.isCard(a[i])) {
        if(a[i].obj.mainPhone != null && a[i].obj.mainPhoneSms) {
          attributes.push({ value: a[i].obj.mainPhone, type: 'Card Main' });
        }
        if(a[i].obj.directPhone != null && a[i].obj.directPhoneSms) {
          attributes.push({ value: a[i].obj.directPhone, type: 'Card Direct' });
        }
        if(a[i].obj.mobilePhone != null && a[i].obj.mobilePhone) {
          attributes.push({ value: a[i].obj.mobilePhone, type: 'Card Mobile' });
        }
      }
    }
    return attributes;
  }

  public static getEmailData(a: any[]): AttributeDataEntry[] {
    let attributes: AttributeDataEntry[] = [];
    if(a == null) {
      return attributes;
    }
    for(let i = 0; i < a.length; i++) {
      if(AttributeUtil.isEmail(a[i])) {
        if(a[i].obj.email != null) {
          attributes.push({ value: a[i].obj.email, type: a[i].obj.category });
        }
      }
      else if(AttributeUtil.isWork(a[i])) {
        if(a[i].obj.emailAddress != null) {
          attributes.push({ value: a[i].obj.emailAddress, type: 'Work'});
        }
      }
      else if(AttributeUtil.isCard(a[i])) {
        if(a[i].obj.emailAddress != null) {
          attributes.push({ value: a[i].obj.email, type: 'Card'});
        }
      }
    }
    return attributes;
  }

}
