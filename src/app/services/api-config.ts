// api-config.ts

export interface ApiConfig {
  name: string;
  baseUrl: string;
  path: string;
  token?: string | null;
  username?: string | null;
  password?: string | null;
}

// Local host for db access
export const apiConfig: ApiConfig[] = [
  {
    name: 'ProductsAPI',
    baseUrl: 'http://localhost:3000',
    path: 'api/products/all',
    token: null,
    username: null,
    password: null
  },
  // Additional API configurations can be added here as needed
];
// ===================== //
// Music Info Providers  //
// ===================== //
export const LastFM: any[] = [
  {
    ApiKey: "b9f058a6a93bc4155bbfe8be5363f1a8",
    SharedSecret: "807321b30846b75c581faf791c44d914",
    ApiUrl: "http://ws.audioscrobbler.com/2.0/"
  },
]

export const Discogs: any[] = [
  {
    ConsumerKey: "rdzRnzytYaVXQMZLoCKA",
    ConsumerSecret: "YekDUvRyopeCygVaWIjVhkAwJgnRYHHW",
    RequestTokenURL: "https://api.discogs.com/oauth/request_token",
    AuthorizeURL: "https://www.discogs.com/oauth/authorize",
    AccessTokenURL: "https://api.discogs.com/oauth/access_token",
    ApiUrl: "https://api.discogs.com"
  },
]

export const MusicBrainz: any[] = [{
  ApiUrl: "https://musicbrainz.org/ws/2/"
}]

export const Shazam: any[] = [
  {
    X_RapidAPI_Key: "b5dd3059b1mshb1c48325984e6ffp15c0acjsn46a52b9c45bf",
    X_RapidAPI_Host: "shazam.p.rapidapi.com",
    Search_Endpoint: "https://shazam.p.rapidapi.com/search"
}
]

export const OneMusicAPI: any[] = [{ APiKey: "e02e2a54b7b6d61e73f6dc77d24da5f3" }]
// ============================ //
// End of Music Info Providers  //
// ============================ //
