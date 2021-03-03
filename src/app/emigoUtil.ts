import { Emigo } from './appdb/emigo';

export class EmigoUtil {

  public static getSearchableEmigo(e: Emigo): string {

    let searchable = "";
    
    // emigo searchable on name, location, handle and description
    if(e != null) {
      if(e.name != null) {
        searchable += e.name.toLowerCase() + " ";
      }
      if(e.location != null) {
        searchable += e.location.toLowerCase() + " ";
      }
      if(e.handle != null) {
        searchable += e.handle.toLowerCase() + " ";
      }
      if(e.description != null) {
        searchable += e.description.toLowerCase() + " ";
      }
    }

    return searchable;
  }
}
