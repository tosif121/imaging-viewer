import React, { useState } from 'react';

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const reports = [
    'CHEST X RAY (PA VIEW)',
    'X-RAY HEEL (AXIAL LAT VIEW)',
    'X-RAY ABDOMEN (SUPINE VIEW)',
    'X-RAY ABDOMEN STANDING VIEW',
    'X-RAY ANKLE JOINT WITH HEEL (LAT VIEW)',
    'X-RAY HEEL',
  ];

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedItem(selectedValue);
    setText(''); // Clear the textarea content when a new item is selected
  };

  const handleSave = () => {
    // You can implement your save logic here, e.g., sending the text to a server or saving it locally.
    console.log('Saving:', text);
  };

  return (
    <div className="p-1">
      <select
        value={selectedItem || ''}
        onChange={handleDropdownChange}
        className="border-2 rounded w-full p-2 mb-4"
      >
        <option value="" disabled>
          Select a report
        </option>
        {reports.map((report, index) => (
          <option key={index} value={report}>
            {report}
          </option>
        ))}
      </select>
      {selectedItem && (
        <p className="mb-2 text-blue-500">Selected Report: {selectedItem}</p>
      )}
      <textarea
        value={text}
        onChange={handleTextChange}
        className="border-2 rounded w-full h-full mb-4 p-2 focus:outline-none focus:border-blue-500"
        style={{ minHeight: '65vh' }}
        placeholder={
          selectedItem
            ? `Enter your ${selectedItem} report here...`
            : 'Select a report from the dropdown'
        }
      ></textarea>
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save
      </button>
    </div>
  );
};

export default TextEditor;
