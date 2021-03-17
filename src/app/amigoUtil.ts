import { Amigo } from './appdb/amigo';

export class AmigoUtil {

  public static getSearchableAmigo(e: Amigo): string {

    let searchable = "";
    
    // amigo searchable on name, location, handle and description
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
