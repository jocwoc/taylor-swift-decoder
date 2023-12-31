// @flow
import "../style/InfoModal.css";
import { isMobile } from "./utils";
import { ModalText } from "./constants";
import React from "react";

const mobile = isMobile();

type InfoModalProps = {
  handler: () => void,
  display: boolean,
};

export default function InfoModal({
  handler,
  display,
}: InfoModalProps): React$MixedElement {
  const clickOutHandler = (event: any) => {
    if (event.target.className !== "ModalBox") {
      handler();
    }
  };

  return (
    <div
      className="InfoModal"
      onClick={clickOutHandler}
      style={{ display: display ? "block" : "none" }}
    >
      <div className={mobile ? "ModalBox ModalBox-mobile" : "ModalBox"}>
        <p dangerouslySetInnerHTML={{ __html: ModalText }} />
        {/** CREDITS: Please do not edit this. Feel free to add your own credits to ModalText. */}
        <p style={{ fontSize: "14px" }}>
          Made by jocwoc. 
          Adapted from <a href="https://shaynak.github.io/taylor-swift">Taylor Swift Lyric Searcher</a>
          &nbsp;made by&nbsp;<a href="http://shaynak.github.io">Shayna Kothari</a>
          &nbsp;using&nbsp;
          <a href="http://reactjs.org">React</a>. Lyrics scraped from&nbsp;
          <a href="http://genius.com">Genius</a>&nbsp;using&nbsp;
          <a href="https://github.com/johnwmillr/LyricsGenius">LyricsGenius</a>.
        </p>
        {/* <p style={{ fontSize: "12px" }}>p.s. scraped data is notably missing "HKSIF" from ME!</p> */}
      </div>
    </div>
  );
}
