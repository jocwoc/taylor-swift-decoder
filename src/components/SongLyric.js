// @flow
import "../style/SongLyric.css";
import { boldQueries } from "./utils.js";
import React from "react";

type SongLyricProps = {
  album: string,
  song: string,
  lyric: string,
  acronym: string,
  queries: Array<string>,
};

export default function SongLyric({
  album,
  song,
  lyric,
  acronym,
  queries,
}: SongLyricProps): React$MixedElement {
  return (
    <div className="SongLyric">
      <p>
        <span
          className="lyric"
          dangerouslySetInnerHTML={{
            __html: boldQueries(acronym, queries),
          }}
        />
      </p>
      {song}
      {album !== "NaN" ? "," : ""} <i>{album !== "NaN" ? album : ""}</i>
      <hr></hr>
    </div>
  );
}
