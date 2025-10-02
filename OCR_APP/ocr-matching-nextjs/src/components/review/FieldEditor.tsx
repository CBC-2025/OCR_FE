import React from 'react';

interface FieldEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = '', 
  className = '' 
}) => {
  const [editedValue, setEditedValue] = React.useState(value);

  React.useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedValue(event.target.value);
  };

  const handleBlur = () => {
    onChange(editedValue);
  };

  return (
    <textarea
      value={editedValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`w-full border rounded p-2 min-h-[80px] resize-vertical ${className}`}
      rows={3}
    />
  );
};

export default FieldEditor;