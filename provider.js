// ============================================================
// SineWix — Nuvio Provider (WuPlay uyumlu)
// ============================================================

var fetch = require("node-fetch");

var API_BASE = "https://ydfvfdizipanel.ru/public/api";
var API_KEY  = "9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA";

var HEADERS = {
  "Accept": "application/json",
  "Accept-Encoding": "gzip",
  "Cache-Control": "max-age=0",
  "Connection": "Keep-Alive",
  "hash256": "711bff4afeb47f07ab08a0b07e85d3835e739295e8a6361db77eebd93d96306b",
  "signature": "3082058830820370a00302010202145bbfbba9791db758ad12295636e094ab4b07dc24300d06092a864886f70d01010b05003074310b3009060355040613025553311330110603550408130a43616c69666f726e6961311630140603550407130d4d6f756e7461696e205669657731143012060355040a130b476f6f676c6520496e632e3110300e060355040b1307416e64726f69643110300e06035504031307416e64726f69643020170d3231313231353232303433335a180f32303531313231353232303433335a3074310b3009060355040613025553311330110603550408130a43616c69666f726e6961311630140603550407130d4d6f756e7461696e205669657731143012060355040a130b476f6f676c6520496e632e3110300e060355040b1307416e64726f69643110300e06035504031307416e64726f696430820222300d06092a864886f70d01010105000382020f003082020a0282020100a5106a24bb3f9c0aaf3a2b228f794b5eaf1757ba758b19736a39d1bdc73fc983a7237b8d5ca5156cfa999c1dab3418bbc2be0920e0ee001c8aa4812d1dae75d080f09e91e0abda83ff9a76e8384a4429f4849248069a59505b12ac2c14ba2e4d1a13afcdaf54e508697ff928a9f738e6f4a6fc27409c55329eb149b5ff89c5a2d7c06bf9e62086f955cad17d7be2623ee9d5ec56068eadc23cb0965a13ff97d49fe10ef41afc6eeca36b4ace9582097faff89f590bc831cdb3a69eec5d15b67c3f2cad49e37ed053733e3d2d400c47755b932bdbe15d749fd6ad1dce30ba5e66094dfb6ee6f64cafb807e11b19a990c5d078c6d6701cda0bdeb21e99404ff166074f4c89b04c418f4e7940db5c78647c475bcfb85d4c4e836ee7d7c1d53e9e736b5d96d4b4d8b98209064b729ac6a682d55a6a930e518d849898bb28329ca0aaa133b5e5270a9d5940cac6af4802a57fd971efda91abb602882dd6aa6ce2b236b57b52ee2481498f0cacbcc2c36c238bc84becad7eaaf1125b9a1ca9ded6c79f3f283a52050377809b2a9995d66e1636b0ed426fdd8685c47cb18e82077f4aefcc07887e1dc58b4d64be1632f0e7b4625da6f40c65a8512a6454a4b96963e7f876136e6c0069a519a79ad632078ed965aa12482458060c030ed50db706d854f88cb004630b49285d8af8b471ff8f6070687826412287b50049bcb7d1b6b62ef90203010001a310300e300c0603551d13040530030101ff300d06092a864886f70d01010b0500038202010051c0b7bd793181dc29ca777d3773f928a366c8469ecf2fa3cfb076e8831970d19bb2b96e44e8ccc647cf0696bb824ac61c23d958525d283cab26037b04d58aa79bf92192db843adf5c26a980f081d2f0e14f759fc5ff4c5bb3dce0860299bfe7b349a8155a2efaf731ba25ce796a80c1442c7bf80f8c1a7912ff0b6f6592264315337251a846460194fa594f81f38f9e5233a63201e931ad9cab5bf119f24025613f307194eaa6eb39a83f3c05a49ba34455b1aff7c6839bbb657d9392ffdf397432af6e56ba9534a8b07d7060fe09691c6cf07cb5324f67b3cc0871a8c621d81fe71d71085c55206a4f57e25f774fd4b979b299e8bb076b50fca42fa57da2d519fd35a4a7c0137babaed4345f8031b63b6a71f5e8268f709d658ccd7c2a58849379d25bfa598c3f4a2c3d9b7d89285fefeb7f0ec65137d38b08ce432a15688b624a179e6a4a505ebc3bcdfbc4d4330508ee2d8d0f016924dcec21a6838ef7d834c6f43bde4a5201ed0b3bb4e9bd377b470e36bcf5bc3d56169dbd8e39567aa7dce4d1a8a8a54a5e1aa6fb1a8aab0062669a966f96e15ccce6fe12ea5e6a8b8c8823bdc94988ca39759fd1cc8fd8ae5c3d74db50b174cf7d77655016c075c91d439ed01cc0a9f695c99fad3b5495fb6cb1e01a5fa020cc6022a85c07ec55f9eba89719f86e49d34ab5bd208c5f70cced2b7b7963c014f8404432979b506de29e",
  "User-Agent": "EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)"
};

// -------------------------------------------------------
// IMDb ID -> dahili SID önbelleği (process boyunca)
// -------------------------------------------------------
var imdbCache = {};  // { "tt1234567": "456" }

// -------------------------------------------------------
// KATALOGLAR
// -------------------------------------------------------
var CATALOGS = [
  { id: "sw-latest-series",    type: "series", name: "SineWix — Son Diziler",        path: "/genres/latestseries/all/" + API_KEY,              source: "paged",    perPage: 12 },
  { id: "sw-latest-movies",    type: "movie",  name: "SineWix — Son Filmler",        path: "/genres/latestmovies/all/" + API_KEY,              source: "paged",    perPage: 12 },
  { id: "sw-latest-animes",    type: "series", name: "SineWix — Son Animeler",       path: "/genres/latestanimes/all/" + API_KEY,              source: "paged",    itemType: "anime", perPage: 12 },
  { id: "sw-crime-series",     type: "series", name: "SineWix — Suç Dizileri",       path: "/genres/mediaLibrary/show/80/serie/" + API_KEY,    source: "paged",    perPage: 12 },
  { id: "sw-crime-movies",     type: "movie",  name: "SineWix — Suç Filmleri",       path: "/genres/mediaLibrary/show/80/movie/" + API_KEY,    source: "paged",    perPage: 12 },
  { id: "sw-mystery-series",   type: "series", name: "SineWix — Gizem Dizileri",     path: "/genres/mediaLibrary/show/9648/serie/" + API_KEY,  source: "paged",    perPage: 12 },
  { id: "sw-mystery-movies",   type: "movie",  name: "SineWix — Gizem Filmleri",     path: "/genres/mediaLibrary/show/9648/movie/" + API_KEY,  source: "paged",    perPage: 12 },
  { id: "sw-animation-movies", type: "movie",  name: "SineWix — Animasyon Filmleri", path: "/genres/mediaLibrary/show/16/movie/" + API_KEY,    source: "paged",    perPage: 12 },
  { id: "sw-war-series",       type: "series", name: "SineWix — Savaş Dizileri",     path: "/genres/mediaLibrary/show/10769/serie/" + API_KEY, source: "paged",    perPage: 12 },
  { id: "sw-latest-episodes",  type: "series", name: "SineWix — Son Bölümler",       path: "/media/seriesEpisodesAll/" + API_KEY,              source: "episodes", perPage: 15 }
];

// -------------------------------------------------------
// MANIFEST
// -------------------------------------------------------
var catalogDefs = CATALOGS.map(function(c) {
  return { id: c.id, type: c.type, name: c.name };
});
catalogDefs.push({ id: "sw-search-series", type: "series", name: "SineWix — Dizi/Anime Ara", extra: [{ name: "search", isRequired: false }] });
catalogDefs.push({ id: "sw-search-movie",  type: "movie",  name: "SineWix — Film Ara",       extra: [{ name: "search", isRequired: false }] });

var manifest = {
  id: "community.sinewix.wuplay",
  version: "1.0.0",
  name: "SineWix",
  description: "Türkçe film, dizi ve anime — SineWix",
  logo: "https://sinewix.com/favicon.ico",
  resources: ["catalog", "meta", "stream"],
  types: ["movie", "series"],
  // Hem sinewix hem tt (IMDb) prefix'lerini kabul et
  idPrefixes: ["sinewix", "tt"],
  catalogs: catalogDefs,
  behaviorHints: { adult: false, p2p: false }
};

// -------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// -------------------------------------------------------
function apiGet(path) {
  return fetch(API_BASE + path, { headers: HEADERS })
    .then(function(res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " — " + path);
      return res.json();
    });
}

function safe(url) {
  if (!url) return undefined;
  return url.replace(/^http:\/\//, "https://");
}

function metaId(item) {
  // IMDb ID varsa onu kullan — WuPlay tutarlı ID için bunu tercih eder
  if (item.imdb_id) return item.imdb_id;
  // Yoksa dahili prefix
  var kind = item._kind || item.type;
  if (kind === "movie")  return "sinewixm" + item.id;
  if (kind === "anime")  return "sinewixa" + item.id;
  return "sinewixs" + item.id;
}

function videoId(imdbId, internalSid, s, e) {
  // Video ID'si IMDb ID bazlı olursa WuPlay stream isteğinde aynı ID gelir
  if (imdbId) return imdbId + ":" + s + ":" + e;
  return "sinewixs" + internalSid + ":" + s + ":" + e;
}

// ID'yi parse et — hem tt hem sinewix formatını destekle
function parseId(id) {
  // IMDb formatı: tt1234567  veya  tt1234567:2:5
  var mtt = /^(tt\d+)(?::(\d+):(\d+))?$/.exec(id);
  if (mtt) {
    return {
      kind:    "imdb",   // IMDb ID — tip sonradan belirlenir
      imdbId:  mtt[1],
      season:  mtt[2] ? Number(mtt[2]) : undefined,
      episode: mtt[3] ? Number(mtt[3]) : undefined
    };
  }

  // sinewix formatı: sinewixs123  veya  sinewixs123:2:5
  var m = /^sinewix([sma])(\d+)(?::(\d+):(\d+))?$/.exec(id);
  if (!m) return null;
  return {
    kind:    m[1] === "m" ? "movie" : m[1] === "a" ? "anime" : "series",
    sid:     m[2],
    season:  m[3] ? Number(m[3]) : undefined,
    episode: m[4] ? Number(m[4]) : undefined
  };
}

// IMDb ID'ye karşılık gelen dahili SID'yi bul
// Önce önbellekte ara, yoksa API'de ara
function resolveSid(imdbId, type) {
  if (imdbCache[imdbId]) {
    console.log("[resolveSid] önbellekten:", imdbId, "->", imdbCache[imdbId]);
    return Promise.resolve(imdbCache[imdbId]);
  }

  // IMDb ID'den tt kısmını at, sayıyı al
  var numericId = imdbId.replace(/^tt0*/, "");

  // 1. Önce doğrudan /media/detail ile dene (film için)
  if (type === "movie") {
    return apiGet("/media/detail/" + numericId + "/" + API_KEY)
      .then(function(data) {
        if (data && data.id) {
          imdbCache[imdbId] = String(data.id);
          return String(data.id);
        }
        throw new Error("film bulunamadı");
      })
      .catch(function() {
        return searchBySid(imdbId, numericId);
      });
  }

  // 2. Dizi için /series/show ile dene
  return apiGet("/series/show/" + numericId + "/" + API_KEY)
    .then(function(data) {
      if (data && data.id) {
        imdbCache[imdbId] = String(data.id);
        return String(data.id);
      }
      throw new Error("dizi bulunamadı");
    })
    .catch(function() {
      return searchBySid(imdbId, numericId);
    });
}

// Arama endpoint'iyle SID bul (fallback)
function searchBySid(imdbId, numericId) {
  return apiGet("/search/" + encodeURIComponent(imdbId) + "/" + API_KEY)
    .then(function(data) {
      var results = data.search || [];
      if (!results.length) throw new Error("arama sonucu yok: " + imdbId);
      var sid = String(results[0].id);
      imdbCache[imdbId] = sid;
      console.log("[resolveSid] arama ile bulundu:", imdbId, "->", sid);
      return sid;
    });
}

function releaseInfo(a, b) {
  var y1 = a ? String(a).slice(0, 4) : "";
  var y2 = b ? String(b).slice(0, 4) : "";
  if (y1 && y2 && y1 !== y2) return y1 + "-" + y2;
  return y1 || y2 || undefined;
}

function toGenres(v) {
  if (Array.isArray(v)) return v.length ? v : undefined;
  if (!v || typeof v !== "string") return undefined;
  var arr = v.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
  return arr.length ? arr : undefined;
}

function toMeta(item, forceKind) {
  var kind = forceKind || item.type;
  var stremioType = kind === "movie" ? "movie" : "series";
  item._kind = kind;
  return {
    id:          metaId(item),
    type:        stremioType,
    name:        item.name || item.title || item.original_name || "",
    poster:      safe(item.poster_path),
    background:  safe(item.backdrop_path_tv || item.backdrop_path),
    description: item.overview || "",
    releaseInfo: releaseInfo(item.release_date, item.first_air_date),
    genres:      toGenres(item.genre_name) || toGenres(item.genresname) || item.genreslist,
    imdbRating:  item.vote_average ? String(item.vote_average) : undefined
  };
}

function toStreams(videos, label) {
  var streams = (videos || [])
    .filter(function(v) { return v.link; })
    .map(function(v) {
      return {
        url:   safe(v.link),
        name:  "SineWix",
        title: v.lang || v.name || "TR",
        behaviorHints: {
          bingeGroup:  "sinewix-addon-" + (label || "default"),
          notWebReady: false
        }
      };
    });

  console.log("[toStreams] toplam video:", (videos || []).length, "| link var:", streams.length);
  return streams;
}

// -------------------------------------------------------
// CATALOG
// -------------------------------------------------------
function getCatalog(type, id, extra) {
  var search = extra && extra.search;
  var skip   = Number((extra && extra.skip) || 0);

  if (id === "sw-search-series" || id === "sw-search-movie") {
    if (!search || !search.trim()) return Promise.resolve({ metas: [] });
    return apiGet("/search/" + encodeURIComponent(search.trim()) + "/" + API_KEY)
      .then(function(data) {
        var wantMovie = id === "sw-search-movie";
        var metas = (data.search || [])
          .map(function(item) { return toMeta(item); })
          .filter(function(m) {
            return wantMovie ? m.type === "movie" : m.type === "series";
          });
        return { metas: metas };
      })
      .catch(function(err) {
        console.error("[catalog/search]", err.message);
        return { metas: [] };
      });
  }

  var cat = null;
  for (var i = 0; i < CATALOGS.length; i++) {
    if (CATALOGS[i].id === id) { cat = CATALOGS[i]; break; }
  }
  if (!cat || type !== cat.type) return Promise.resolve({ metas: [] });

  var page = Math.floor(skip / (cat.perPage || 12)) + 1;

  return apiGet(cat.path + "?page=" + page)
    .then(function(data) {
      var items = data.data || [];

      if (cat.source === "episodes") {
        var seen = {};
        items = items.filter(function(item) {
          if (!item.id || seen[item.id]) return false;
          seen[item.id] = true;
          return true;
        });
      }

      var metas = items.map(function(item) {
        return toMeta(item, cat.itemType || undefined);
      });

      return { metas: metas };
    })
    .catch(function(err) {
      console.error("[catalog/" + id + "]", err.message);
      return { metas: [] };
    });
}

// -------------------------------------------------------
// META
// -------------------------------------------------------
function getMeta(type, id) {
  var p = parseId(id);
  if (!p) return Promise.resolve({ meta: null });

  // IMDb ID ile gelen meta isteği
  if (p.kind === "imdb") {
    var apiType = type === "movie" ? "movie" : "series";
    return resolveSid(p.imdbId, apiType)
      .then(function(sid) {
        if (apiType === "movie") {
          return apiGet("/media/detail/" + sid + "/" + API_KEY)
            .then(function(data) {
              return buildMovieMeta(id, data);
            });
        }
        return apiGet("/series/show/" + sid + "/" + API_KEY)
          .then(function(data) {
            return buildSeriesMeta(id, p.imdbId, sid, data);
          });
      })
      .catch(function(err) {
        console.error("[meta/imdb/" + id + "]", err.message);
        return { meta: null };
      });
  }

  // Film (sinewix prefix)
  if (p.kind === "movie") {
    return apiGet("/media/detail/" + p.sid + "/" + API_KEY)
      .then(function(data) { return buildMovieMeta(id, data); })
      .catch(function(err) {
        console.error("[meta/movie/" + id + "]", err.message);
        return { meta: null };
      });
  }

  // Dizi / Anime (sinewix prefix)
  return apiGet("/series/show/" + p.sid + "/" + API_KEY)
    .then(function(data) { return buildSeriesMeta(id, null, p.sid, data); })
    .catch(function(err) {
      console.error("[meta/series/" + id + "]", err.message);
      return { meta: null };
    });
}

function buildMovieMeta(id, data) {
  return {
    meta: {
      id:          id,
      type:        "movie",
      name:        data.title || data.name || data.original_name || "",
      poster:      safe(data.poster_path),
      background:  safe(data.backdrop_path_tv || data.backdrop_path),
      description: data.overview || "",
      releaseInfo: releaseInfo(data.release_date, data.release_date),
      genres:      toGenres(data.genresname) || data.genres,
      imdbRating:  data.vote_average ? String(data.vote_average) : undefined
    }
  };
}

function buildSeriesMeta(id, imdbId, sid, data) {
  var seasons = (data.seasons || []).slice().sort(function(a, b) {
    return Number(a.season_number) - Number(b.season_number);
  });

  var videos = [];
  seasons.forEach(function(season) {
    var sNum = Number(season.season_number);
    (season.episodes || []).forEach(function(ep) {
      var eNum = Number(ep.episode_number);
      videos.push({
        // IMDb ID varsa video ID'si tt formatında — WuPlay stream isteğiyle eşleşir
        id:        videoId(imdbId, sid, sNum, eNum),
        title:     ep.name || (eNum + ". Bölüm"),
        season:    sNum,
        episode:   eNum,
        overview:  ep.overview || "",
        released:  ep.air_date ? ep.air_date + "T00:00:00.000Z" : undefined,
        thumbnail: safe(ep.still_path)
      });
    });
  });

  var first = seasons[0];
  var last  = seasons[seasons.length - 1];

  return {
    meta: {
      id:          id,
      type:        "series",
      name:        data.name || data.original_name || "",
      poster:      safe(data.poster_path),
      background:  safe(data.backdrop_path_tv || data.backdrop_path),
      description: data.overview || "",
      releaseInfo: releaseInfo(
        data.first_air_date || (first && first.air_date),
        (last && last.air_date) || data.first_air_date
      ),
      genres:      toGenres(data.genresname) || data.genreslist,
      videos:      videos
    }
  };
}

// -------------------------------------------------------
// STREAM
// -------------------------------------------------------
function getStreams(type, id) {
  var p = parseId(id);
  if (!p) {
    console.error("[stream] parse edilemeyen ID:", id);
    return Promise.resolve({ streams: [] });
  }

  console.log("[stream] istek — kind:", p.kind, "imdbId:", p.imdbId, "season:", p.season, "episode:", p.episode);

  // IMDb ID ile gelen stream isteği (WuPlay'in gönderdiği format)
  if (p.kind === "imdb") {
    var apiType = type === "movie" ? "movie" : "series";
    return resolveSid(p.imdbId, apiType)
      .then(function(sid) {
        if (apiType === "movie") {
          return apiGet("/media/detail/" + sid + "/" + API_KEY)
            .then(function(data) {
              console.log("[stream/imdb/movie] ham videos:", JSON.stringify(data.videos || []));
              return { streams: toStreams(data.videos, "movie") };
            });
        }

        if (p.season === undefined || p.episode === undefined) {
          return { streams: [] };
        }

        return apiGet("/series/show/" + sid + "/" + API_KEY)
          .then(function(data) {
            var season = (data.seasons || []).find(function(s) {
              return Number(s.season_number) === p.season;
            });
            if (!season) { console.error("[stream/imdb/series] sezon yok:", p.season); return { streams: [] }; }

            var ep = (season.episodes || []).find(function(e) {
              return Number(e.episode_number) === p.episode;
            });
            if (!ep) { console.error("[stream/imdb/series] bölüm yok:", p.episode); return { streams: [] }; }

            console.log("[stream/imdb/series] ham ep.videos:", JSON.stringify(ep.videos || []));
            return { streams: toStreams(ep.videos, "s" + p.season + "e" + p.episode) };
          });
      })
      .catch(function(err) {
        console.error("[stream/imdb/" + id + "]", err.message);
        return { streams: [] };
      });
  }

  // sinewix prefix'li stream (eski format — geriye dönük uyumluluk)
  if (p.kind === "movie") {
    return apiGet("/media/detail/" + p.sid + "/" + API_KEY)
      .then(function(data) {
        console.log("[stream/movie] ham videos:", JSON.stringify(data.videos || []));
        return { streams: toStreams(data.videos, "movie") };
      })
      .catch(function(err) {
        console.error("[stream/movie/" + id + "]", err.message);
        return { streams: [] };
      });
  }

  if (p.season === undefined || p.episode === undefined) {
    return Promise.resolve({ streams: [] });
  }

  return apiGet("/series/show/" + p.sid + "/" + API_KEY)
    .then(function(data) {
      var season = (data.seasons || []).find(function(s) {
        return Number(s.season_number) === p.season;
      });
      if (!season) return { streams: [] };

      var ep = (season.episodes || []).find(function(e) {
        return Number(e.episode_number) === p.episode;
      });
      if (!ep) return { streams: [] };

      console.log("[stream/series] ham ep.videos:", JSON.stringify(ep.videos || []));
      return { streams: toStreams(ep.videos, "s" + p.season + "e" + p.episode) };
    })
    .catch(function(err) {
      console.error("[stream/series/" + id + "]", err.message);
      return { streams: [] };
    });
}

// -------------------------------------------------------
// EXPORT
// -------------------------------------------------------
module.exports = {
  manifest:   manifest,
  getCatalog: getCatalog,
  getMeta:    getMeta,
  getStreams:  getStreams
};
