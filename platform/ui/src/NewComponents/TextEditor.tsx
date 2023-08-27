import React, { useState } from 'react';

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    console.log('Saving:', text);
  };
  const handleView = () => {
    setPreviewText(text);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        className={`${
          selectedItem
            ? 'border-2 rounded w-full h-full mb-4 p-2 focus:outline-none focus:border-blue-500'
            : 'text-white px-4 py-2 rounded w-full mr-6 bg-gray-300'
        }`}
        style={{ minHeight: '65vh' }}
        disabled={!selectedItem}
        placeholder={
          selectedItem
            ? `Enter your ${selectedItem} report here...`
            : 'Select a report from the dropdown'
        }
      ></textarea>

      <div className="flex mt-3">
        <button
          onClick={handleView}
          className={`${
            text ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
          } text-white px-4 py-2 rounded w-full mr-6`}
          disabled={!text}
        >
          View
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Save
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-96 h-80">
            <h2 className="text-lg font-semibold mb-2">Preview:</h2>
            <div className="border-2 rounded p-2 focus:outline-none focus:border-blue-500 h-48 overflow-y-auto">
              {previewText || 'No preview available'}
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
