import React, { useState } from "react";
import PropTypes from "prop-types";
import { parseISO } from "date-fns";
import styled from "styled-components";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import {
  Button,
  Form as SemanticForm,
  Icon,
  Label,
  Tab,
} from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import RenderedHtml from "./RenderedHtml";

const UPLOAD_IMAGE = gql`
  mutation uploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`;

const Form = styled(SemanticForm)`
  flex: 1;
  display: flex;
  flex-direction: column;

  &&& {
    textarea {
      height: 100%;
      max-height: 100%;
      resize: none;
    }
  }
`;
const Field = styled(Form.Field)`
  &&& {
    font-family: "Sen", sans-serif;
    a,
    button {
      font-family: "Sen", sans-serif;
    }
    input,
    textarea,
    p {
      font-family: "Roboto Slab", "Noto Serif KR", serif;
      font-weight: 300;
      font-size: 14px;
    }
    textarea {
      padding: 0;
      border: none;
      line-height: 1.4285em;
    }
  }
`;
const EditorField = styled(Field)`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;
const EditorTab = styled(Tab)`
  flex: 1;
  display: flex;
  flex-direction: column;

  &&& {
    .segment {
      flex: 1;
      margin: 0;

      ${({ activeIndex }) =>
        activeIndex &&
        `
        padding-top: 0;
        padding-bottom: 0;
        border: none;
        box-shadow: none;
      `}
    }
  }
`;
const AddedTagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
`;
const AddedTag = styled.li`
  list-style: none;
  margin: 0 3px;
  font-family: "Roboto Slab", "Noto Serif KR", serif;

  .ui.label {
    font-weight: 300;
  }
`;
const SubmitButton = styled(Button)`
  &&& {
    font-family: "Sen", serif;
  }
`;

const Editor = ({ onFormSubmit, post }) => {
  const [title, setTitle] = useState(post.title);
  const [startDate, setStartDate] = useState(
    post.startDate !== "" ? parseISO(post.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    post.endDate !== "" ? parseISO(post.endDate) : null
  );
  const [markdownText, setMarkdownText] = useState(post.markdownText);
  const [tags, setTags] = useState(post.tags);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [titleError, setTitleError] = useState(false);
  const [travelPeriodError, setTravelPeriodError] = useState(false);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const handleFileDrop = (e) => {
    const { files } = e.dataTransfer;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        e.stopPropagation();
        e.preventDefault();

        const { selectionStart, selectionEnd } = e.target;
        const stringBeforeCursor = markdownText.substring(0, selectionStart);
        const stringAfterCursor = markdownText.substring(selectionEnd);
        uploadImage({ variables: { file } }).then((response) => {
          setMarkdownText(
            `${stringBeforeCursor}![${response.data.uploadImage}](${response.data.uploadImage})${stringAfterCursor}`
          );
        });
      }
    }
  };

  const handleTitleInputChange = (event) => setTitle(event.target.value);
  const handleStartDateInputChange = (event, data) => setStartDate(data.value);
  const handleEndDateInputChange = (event, data) => setEndDate(data.value);
  const handleTabSelectionChange = (event, { activeIndex }) =>
    setActiveTabIndex(activeIndex);
  const handleMarkdownTextareaChange = (event) =>
    setMarkdownText(event.target.value);
  const handleFormSubmit = (event) => {
    event.preventDefault();

    setTitleError(false);
    setTravelPeriodError(false);

    if (title === "") {
      setTitleError(true);
      return;
    }
    if (startDate === null || endDate === null || startDate > endDate) {
      setTravelPeriodError(true);
      return;
    }

    onFormSubmit(title, startDate, endDate, markdownText, tags);
  };

  const addTag = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  const removeTag = (index) => {
    const copiedTags = tags;
    copiedTags.splice(index, 1);
    setTags([...copiedTags]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Field error={titleError}>
        <label>Title</label>
        <Form.Input
          value={title}
          onChange={handleTitleInputChange}
          onKeyPress={handleKeyPress}
        />
      </Field>
      <Form.Group width="equals">
        <Field error={travelPeriodError}>
          <label>Travel Period</label>
          <SemanticDatepicker
            value={startDate}
            onChange={handleStartDateInputChange}
          />
          {" ~ "}
          <SemanticDatepicker
            value={endDate}
            onChange={handleEndDateInputChange}
          />
        </Field>
      </Form.Group>
      <EditorField>
        <EditorTab
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: "Markdown",
              render: () => (
                <Tab.Pane attached={false}>
                  <textarea
                    value={markdownText}
                    onChange={handleMarkdownTextareaChange}
                    onDrop={handleFileDrop}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: "Preview",
              render: () => (
                <Tab.Pane attached={false}>
                  <RenderedHtml text={markdownText} />
                </Tab.Pane>
              ),
            },
          ]}
          activeIndex={activeTabIndex}
          onTabChange={handleTabSelectionChange}
        />
      </EditorField>
      <Field>
        <label>Tags</label>
        <Form.Input
          onKeyPress={handleKeyPress}
          onKeyUp={addTag}
          placeholder="Press enter to add a tag."
        />
        <AddedTagList>
          {tags.map((tag, index) => (
            <AddedTag key={tag}>
              <Label tag size="small">
                <span>{tag}</span>
                <Icon name="delete" onClick={() => removeTag(index)} />
              </Label>
            </AddedTag>
          ))}
        </AddedTagList>
      </Field>
      <SubmitButton
        type="submit"
        primary
        fluid
        disabled={!title || !startDate || !endDate || !markdownText}
      >
        Submit
      </SubmitButton>
    </Form>
  );
};

Editor.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    markdownText: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

Editor.defaultProps = {
  post: {
    title: "",
    startDate: "",
    endDate: "",
    markdownText: "",
    tags: [],
  },
};

export default Editor;
