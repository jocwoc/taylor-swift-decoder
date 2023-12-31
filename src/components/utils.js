// @flow


// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const cleanLyric = (lyric: string): string => {
  // Replace special quotes with normal quotes
  let cleaned_lyric = lyric.replace(/\u2018|\u2019/g, "'");
  cleaned_lyric = cleaned_lyric.replace(/\u201C|\u201D/g, '"');
  // Replace special unicode spaces with standard space
  cleaned_lyric = cleaned_lyric.replace(
    /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
    " "
  );
  // Replace dashes with space and single hyphen
  cleaned_lyric = cleaned_lyric.replace(/\u2013|\u2014/g, " - ");
  // Replace cyrillic + accented Es with normal Es
  cleaned_lyric = cleaned_lyric.replace(/\u0435|\u00e9/g, "e");
  return cleaned_lyric;
};

export const containsQuery = (acronym: string, query: string): Array => {
  query = cleanLyric(query.toUpperCase());
  acronym = cleanLyric(acronym.toUpperCase());
  // query = query.replace(/\u00e9/g, "e");
  // acronym = acronym.replace(/\u00e9/g, "e");

  let array1;
  const matches = [];

  const query_sections = query.split("_").map(escapeRegExp);
  const inner_regexp = query_sections.join("\\w");
  const regex = new RegExp(inner_regexp,'g')
  // const regex = new RegExp(
  //  `([\\(\\)\\.\\-?!;:,\\s\u2026"]|^'*)${inner_regexp}('*[\\(\\)\\.\\-?!;:,\\s\u2026"]|$)`
  // ); 
  // const match = cleanLyric(acronym.toUpperCase()).match(inner_regexp)
  while (array1 = regex.exec(acronym)){
    matches.push([array1.index,query.length]);
  }
  // const match = cleanLyric(acronym.toUpperCase()).exec(inner_regexp)
  // Adding length of the first capturing group (1 or 0) to `start` so it starts at word
  //const start = match != null ? match.index + match[1].length : -1;
  // const start = match != null ? match.index: -1;
  // Subtracting capturing group lengths to make sure only length of word is sent
  // const length =
  //   match != null ? match[0].length - (match[1].length + match[2].length) : -1;
  // const length = match != null ? match[0].length : -1;
  // return {
  //   matches,
  // };
  return matches;
};

export const getQueryLength = (query: string): number => {
  return query.replace("*", "").length;
};

export const queriesFound = (acronym: string, query: string): number => {
  acronym = cleanLyric(acronym);
  query = cleanLyric(query);

  const matches = containsQuery(acronym,query)
  return matches.length;
};

export const isMobile = (): boolean => {
  const mobileRegex = new RegExp(
    `Android|webOS|iPhone|iPad|BlackBerry|Phone|Mobile`
  );
  return navigator.userAgent.search(mobileRegex) >= 0;
};

export const boldQueries = (lyric: Array<string>, acronym: string, queries: Array<string>): string => {
  acronym = cleanLyric(acronym);
  let matches = [];
  let boldedLyric = "";
  queries.forEach( (query) => {
    matches = matches.concat(containsQuery(acronym,query));
    }
  )
  boldedLyric = matches.sort ((a, b) => {
    return a[0] - b[0];            
  })
  .map ((match) => {
    return boldQuery(lyric,match);
  })
  .join("\<br\>");
  // return queries.reduce(boldQuery, lyric);
  return boldedLyric
};

export const boldQuery = (lyric: Array<string>, match_index: Array<number>): string => {
  // query = cleanLyric(query);
  const start = match_index[0];
  const end = match_index[0] + match_index[1];
  let boldedLyric = "";

  boldedLyric =
    boldedLyric +
    (start<4 ? 
      lyric.slice(0,start).join(" ") 
      : "..." + lyric.slice(start-3,start).join(" ") ) + " " +
    '<span class="query">' +
    lyric.slice(start, end)
    .map((word) => {
      return word.replace(/[a-zA-Z0-9]/,'<span class="initial">$&</span>')
    })
    .join(" ") + 
    "</span>" + " " +
    lyric.slice(end,end+3).join(" ") + " " +
    (end+3 > lyric.length ? "" : "...");

  // do {
  //   let { start, length } = containsQuery(acronym, query);
  //   if (start === -1) {
  //     return boldedLyric + lyric;
  //   }
  //   end = start + length;

  //   boldedLyric =
  //     boldedLyric +
  //     lyric.slice(start-5, start).join(" ") +
  //     '<span class="query">' +
  //     lyric.slice(start, end+1).join(" ") +
  //     "</span>" + 
  //     lyric.slice(end+1,end+5).join(" ");
  //   lyric = lyric.substring(end);
  // } while (lyric.length > 0);
  return boldedLyric;
};

export const URL_QUERY_PARAM = "query";
export const URL_ALBUM_PARAM = "album";

export const getURLQueryStrings = (): Array<string> => {
  const currentURL = new URL(window.location);
  return currentURL.searchParams.getAll(URL_QUERY_PARAM);
};

export const getURLAlbumStrings = (): Array<string> => {
  const currentURL = new URL(window.location);
  return currentURL.searchParams.getAll(URL_ALBUM_PARAM);
};
