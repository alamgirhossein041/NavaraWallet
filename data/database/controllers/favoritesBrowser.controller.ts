import { getRepository } from "typeorm/browser";
import { BrowserFavorites } from "../entities/favoritesBrowser";

export default class FavoritesBrowserController {
  private favoritesBrowserRepository;
  constructor() {
    this.favoritesBrowserRepository = getRepository(BrowserFavorites);
  }

  public async createFavoritesBrowser(data): Promise<BrowserFavorites> {
    const { url, title, icon } = data;
    const newBrowserFavorites = new BrowserFavorites();
    newBrowserFavorites.url = url;
    newBrowserFavorites.title = title;
    newBrowserFavorites.icon = icon;

    const browserFavorites = await this.favoritesBrowserRepository.save(
      newBrowserFavorites
    );
    if (browserFavorites) {
      return browserFavorites;
    }
  }

  public async getFavoritesBrowser(): Promise<BrowserFavorites[]> {
    return this.favoritesBrowserRepository.find({
      order: {
        createdAt: "DESC",
      },
      take: 8,
    });
  }

  public async deleteFavoritesByUrl(url: string): Promise<any> {
    return this.favoritesBrowserRepository.delete({ url });
  }

  public async findFavoritesByUrl(url: string): Promise<BrowserFavorites> {
    return this.favoritesBrowserRepository.findOne({ url });
  }
}
