import shortid from "shortid";

const location = (state, silent) => {
  if (silent) {
    return false;
  }

  if (
    state.src.charCodeAt(state.pos) !== 0x40 /* @ */ ||
    state.src.charCodeAt(state.pos + 1) !== 0x5b /* [ */
  ) {
    return false;
  }

  const REGEX = /@\[\s*(?<title>.+)\s*]\(\s*(?<lat>-?\d+(\.\d+)?)\s*,\s*(?<lng>-?\d+(\.\d+)?)\s*\)/;
  const matches = REGEX.exec(state.src.slice(state.pos));
  if (
    !matches ||
    !matches.groups.title ||
    !matches.groups.lat ||
    !matches.groups.lng
  ) {
    return false;
  }

  const { title, lat, lng } = matches.groups;

  const contentStartPos = state.pos + 2;
  const contentEndPos = state.pos + matches[0].length;

  state.pos = contentStartPos;

  let token = state.push("leaflet_open");
  token.nesting = 1;
  token.meta = { title, lat, lng };
  token = state.push("leaflet_close");
  token.nesting = -1;

  state.pos = contentEndPos;

  return true;
};
const renderOpenTag = (tokens, idx) => {
  const { title, lat, lng } = tokens[idx].meta;
  return `<div id="leaflet-${shortid.generate()}" data-title="${title}" data-lat="${lat}" data-lng="${lng}">`;
};
const renderCloseTag = () => {
  return "</div>";
};

export default (md) => {
  md.inline.ruler.before("emphasis", "leaflet", location);
  md.renderer.rules.leaflet_open = renderOpenTag;
  md.renderer.rules.leaflet_close = renderCloseTag;
};
