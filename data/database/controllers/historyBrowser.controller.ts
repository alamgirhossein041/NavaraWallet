import { getRepository } from "typeorm/browser";
import { BrowserHistory } from "../entities/historyBrowser";
import { SearchRecent } from "../entities/searchRecent";

export default class HistoryBrowserController {
  private historyBrowserRepository;
  private searchRecentRepository;
  private latestHistory: any;

  constructor() {
    this.historyBrowserRepository = getRepository(BrowserHistory);

    this.searchRecentRepository = getRepository(SearchRecent);
  }
  public async createHistoryBrowser(data): Promise<BrowserHistory> {
    const { url, title, icon } = data;
    if (this.latestHistory === url) {
      return;
    }
    const newBrowserHistory = new BrowserHistory();
    newBrowserHistory.url = url;
    newBrowserHistory.title = title;
    newBrowserHistory.icon = icon;
    this.latestHistory = url;
    return this.historyBrowserRepository.save(newBrowserHistory);
  }

  public async getHistoryBrowser(): Promise<BrowserHistory[]> {
    return this.historyBrowserRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async deleteHistoryById(id: string): Promise<any> {
    return this.historyBrowserRepository.delete(id);
  }

  public async deleteAllHistoryBrowser(): Promise<any> {
    return this.historyBrowserRepository.delete({});
  }

  public async suggestHistoryBrowser(query): Promise<BrowserHistory> {
    return this.historyBrowserRepository
      .createQueryBuilder("history")
      .where("history.url like :query", { query: `https://${query}%` })
      .getRawOne();
  }

  public async createSearchRecent(keyword: string): Promise<any> {
    return this.searchRecentRepository.save({ keyword });
  }

  public async getSearchRecent(): Promise<SearchRecent[]> {
    const searchRecentRepository = getRepository(SearchRecent);
    return searchRecentRepository
      .createQueryBuilder("searchRecent")
      .orderBy("searchRecent.createdAt", "DESC")
      .take(10)
      .getMany();
  }

  public async deleteAllSearchRecent(): Promise<any> {
    const searchRecentRepository = getRepository(SearchRecent);
    return searchRecentRepository.delete({});
  }
}
