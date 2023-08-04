// @flow
import "../style/QueriedLyrics.css";
import React from "react";
import SongLyric from "./SongLyric";
import { containsQuery, isMobile, queriesFound } from "./utils.js";

const acronymsJSON = require("../taylor-swift-acronyms/acronyms.json")
const albumMap = require("../taylor-swift-lyrics/album_map.json");
const mobile = isMobile();
type QueriedLyricsProps = {
  queries: Array<string>,
  selectedAlbums: Array<string>,
  isLoading: boolean,
};

export default function QueriedLyrics({
  queries,
  selectedAlbums,
  isLoading,
}: QueriedLyricsProps): React$MixedElement {
  const isSelectedAlbum = (album: string): boolean => {
    if (selectedAlbums.length === 0) {
      return true;
    }
    for (const albumCategory of albumMap[album]) {
      if (selectedAlbums.includes(albumCategory)) {
        return true;
      }
    }

    return false;
  };

  const countOccurrences = (): { occurrences: number, songs: number } => {
    let found = 0;
    let songs = 0;
    for (const query of queries) {
      for (const album in acronymsJSON) {
        if (album !== "Uncategorized" && isSelectedAlbum(album)) {
          for (const song in acronymsJSON[album]) {
            let foundInSong = false;
            for (let i = 0; i < acronymsJSON[album][song].length; i++) {
              const songAcronym = acronymsJSON[album][song][i];
              const timesFound = queriesFound(songAcronym.acronym, query);
              found += timesFound;
              foundInSong = foundInSong || timesFound > 0;
            }
            songs += foundInSong ? 1 : 0;
          }
        }
      }
    }
    return { occurrences: found, songs: songs };
  };

  const { occurrences, songs } = countOccurrences();
  let counter = 0;
  return (
    <div>
      <div className={mobile ? "QueriedLyrics-mobile" : "QueriedLyrics"}>
        {isLoading ? <div className="loading"></div> : Object.keys(acronymsJSON)
          .sort((album1, album2) => {
            if (album1 === "Unreleased Songs") {
              return 1;
            } else if (album2 === "Unreleased Songs") {
              return -1;
            }            
            return 0;            
          })
          .map((album) =>
            Object.keys(acronymsJSON[album]).map((song) =>
              acronymsJSON[album][song].map((songAcronym) => {
                if (albumMap[album] == undefined) {
                  console.log(song);
                console.log(album);
                }
                counter++;                             
                if (
                  isSelectedAlbum(album) &&
                  queries.some(
                    (query) =>
                      containsQuery(songAcronym.acronym, query).length !== 0
                  ) &&
                  album !== "Uncategorized"
                ) {
                  return (
                    <SongLyric
                      key={counter}
                      album={
                        !albumMap[album].includes("Collaborations") &&
                        !albumMap[album].includes("Movie Soundtracks")
                          ? albumMap[album]
                          : album
                      }
                      song={song}
                      lyric={songAcronym.lyric}
                      acronym={songAcronym.acronym}
                      queries={queries}
                    />
                  );
                }
                return <></>;
              })
            )
          )}
      </div>
      <div className={mobile ? "totalResults-mobile" : "totalResults"}>
        Found {occurrences} usage{occurrences === 1 ? "" : "s"} in {songs} song
        {songs === 1 ? "" : "s"}
        {selectedAlbums.length > 0 ? " from selected albums" : ""}
      </div>
    </div>
  );
}
