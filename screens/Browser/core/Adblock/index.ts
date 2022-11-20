import { EasyList } from "./easylist";

export default class Adblock {
  private easyList: string[];
  constructor() {
    this.easyList = EasyList.split(/\r?\n/);
  }

  public isAd(url: string): boolean {
    const isAd = this.easyList.some((ad) => {
      if (ad.trim() !== "") {
        try {
          const regex = new RegExp(ad.replace(/\|/g, ""));
          return regex.test(url);
        } catch (error) {}
      } else {
        return false;
      }
    });
    return isAd;
  }
}
