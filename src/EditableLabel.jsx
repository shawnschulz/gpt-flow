// EditableLabel.jsx

import React from 'react';
import './TextInputNodeStyle.css';

const EditableLabel = (props) => {
  const { text, onInput } = props;

  const handleInput = (event) => {
    onInput(event.target.textContent);
  };

  return (
    <span
      className="editable-label"
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
    >
      {text}
    </span>
  );
};

export default EditableLabel;
