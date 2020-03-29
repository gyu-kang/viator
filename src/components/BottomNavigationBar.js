import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Dropdown, Input } from "semantic-ui-react";
import qs from "query-string";

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(34, 36, 38, 0.15);
  background-color: white;
  z-index: 9999;
`;
const TagDropdown = styled(Dropdown)`
  &&& {
    padding: 11px;

    .menu > .item {
      color: hsla(0, 0%, 0%, 0.8);
      font-size: 13px;
      font-weight: 300;
    }
  }
`;
const SearchInput = styled(Input)`
  width: 60%;
  max-width: 200px;

  &&& {
    input {
      font-family: "Roboto Slab", "Noto Serif KR", serif;
    }
  }
`;
const DefaultToolBar = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: hsla(0, 0%, 0%, 0.8);
  font-family: "Roboto Slab", "Noto Serif KR", serif;
`;
const OptionalToolBar = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const BottomNavigationBar = ({ children, tags }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const history = useHistory();

  const handleTagClick = (event, data) => {
    const query = { method: "tag", query: data.value };
    history.push({
      pathname: "/search",
      search: qs.stringify(query),
    });
  };
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const query = { method: "text", query: searchQuery };
      history.push({
        pathname: "/search",
        search: qs.stringify(query),
      });
    }
  };

  return (
    <Container>
      <DefaultToolBar>
        <TagDropdown icon="filter" pointing="top left" floating>
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              {tags.map((tag) => {
                return (
                  <Dropdown.Item
                    key={tag.name}
                    icon="tag"
                    text={`${tag.name} (${tag.posts.length})`}
                    value={tag.name}
                    onClick={handleTagClick}
                  />
                );
              })}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </TagDropdown>
        <SearchInput
          icon="search"
          placeholder="Search"
          onChange={handleSearchQueryChange}
          onKeyPress={handleKeyPress}
        />
      </DefaultToolBar>
      <OptionalToolBar>{children}</OptionalToolBar>
    </Container>
  );
};

BottomNavigationBar.propTypes = {
  children: PropTypes.element.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      posts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired
  ).isRequired,
};

export default BottomNavigationBar;
