//
// client/src/components/EditableCell/index.jsx

import { useState, useEffect } from "react";

const EditableCell = ({ value, onChange, onBlur, isLoading, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value); // Sync value from parent when it changes
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(newValue); // Update useFormField state
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onBlur) onBlur(localValue); // Save on blur
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <td className={className} onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          type="text"
          className="editable-input"
          value={localValue}
          onChange={handleInputChange} // Calls useFormField's handleChange
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
        />
      ) : (
        <span className="editable-text">{value}</span>
      )}
    </td>
  );
};

export default EditableCell;
