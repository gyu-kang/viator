import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import MarkdownIt from "markdown-it";
import MarkdownItContainer from "markdown-it-container";
import { Map, Marker, TileLayer, Tooltip } from "react-leaflet";
import Leaflet from "../utils/MarkdownItLeaflet";

const Container = styled.div`
  height: 100%;
  position: relative;
  padding: 15px ${(props) => (props.timelineEnabled ? "15px" : "0")} 15px 0;
  font-family: "Roboto Slab", "Noto Serif KR", serif;
  font-weight: 300;
  word-break: break-all;

  &::after {
    content: "";
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    background-color: lightgray;
    visibility: ${(props) => (props.timelineEnabled ? "visible" : "hidden")};
  }

  .timeline {
    position: relative;

    .timeline-pin {
      float: right;
      margin-right: -29px;
      padding: 0 0 0 36px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: dimgray;
      white-space: nowrap;

      &::after {
        content: " ";
        width: 13px;
        height: 13px;
        border: 1px solid dimgray;
        border-radius: 100%;
        background-color: white;
        margin: 0 8px;
        z-index: 1;
      }
    }
  }

  .timeline:not(:last-child) {
    margin-bottom: 1em;
  }

  .resized-image {
    width: 90%;
    max-width: 600px;
  }

  .leaflet-container {
    width: 90%;
    max-width: 600px;
    height: 400px;

    .leaflet-tooltip {
      font-family: "Roboto Slab", "Noto Serif KR", serif;
    }
  }
`;

const renderMarkdownText = (text) => {
  const markdownIt = new MarkdownIt({
    breaks: true,
  });
  markdownIt.use(MarkdownItContainer, "timeline", {
    validate(params) {
      return params.trim().match(/^timeline\s+(.*)$/);
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^timeline\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        return `<div class="timeline"><span class="timeline-pin">${markdownIt.utils.escapeHtml(
          m[1]
        )}</span>`;
      }
      return "</div>";
    },
  });
  markdownIt.use(Leaflet);
  markdownIt.renderer.rules.image = (tokens, idx) => {
    const src = markdownIt.utils.escapeHtml(tokens[idx].attrs[0][1]);
    return `<img class="resized-image" src="${src}" />`;
  };
  return markdownIt.render(text);
};

const renderLeaflet = () => {
  document
    .querySelectorAll('[id^="leaflet-"][data-title][data-lat][data-lng]')
    .forEach((elem) => {
      const position = [
        elem.getAttribute("data-lat"),
        elem.getAttribute("data-lng"),
      ];
      const map = (
        <Map center={position} zoom={14}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Tooltip permanent>
              <span>{elem.getAttribute("data-title")}</span>
            </Tooltip>
          </Marker>
        </Map>
      );

      ReactDOM.render(map, document.getElementById(elem.getAttribute("id")));
    });
};

const RenderedHtml = ({ className, text }) => {
  useEffect(() => {
    renderLeaflet();
  });

  const isTimelineEnabled = () => {
    return /:::\s*timeline\s+(.*)/.test(text);
  };

  return (
    <Container
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdownText(text) }}
      timelineEnabled={isTimelineEnabled()}
    />
  );
};

RenderedHtml.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

RenderedHtml.defaultProps = {
  className: "",
};

export default RenderedHtml;
