import React, { useState } from 'react';

interface TextEditorProps {}

const TextEditor: React.FC<TextEditorProps> = () => {
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

  const handleDropdownChange = ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = target.value;
    setSelectedItem(selectedValue);
    setText('');
  };

  const handleTextChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(target.value);
  };

  const handleSave = () => {
    console.log('Saving:', text);
  };

  const handleView = () => {
    const previewFormatted = text.replace(/\n/g, '<br>');
    setPreviewText(previewFormatted);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-1">
      <table className="border-2 rounded w-full mb-3 bg-gray-800 text-white whitespace-nowrap">
        <thead>
          <tr>
            <th className="border-white border-2 text-center text-base">
              Patient ID
            </th>
            <th className="border-white border-2 text-center text-base">
              Patient Name
            </th>
            <th className="border-white border-2 text-center text-base">
              Age Yrs
            </th>
            <th className="border-white border-2 text-center text-base">
              Date
            </th>
            <th className="border-white border-2 text-center text-base">
              Gender
            </th>
            <th className="border-white border-2 text-center text-base">
              Ref Doctor
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-white border-2 text-center text-base">121</td>
            <td className="border-white border-2 text-center text-base">
              Karan
            </td>
            <td className="border-white border-2 text-center text-base">27</td>
            <td className="border-white border-2 text-center text-base">
              30-Aug-2023
            </td>
            <td className="border-white border-2 text-center text-base">
              Male
            </td>
            <td className="border-white border-2 text-center text-base">
              #01112
            </td>
          </tr>
        </tbody>
      </table>
      <select
        value={selectedItem || ''}
        onChange={handleDropdownChange}
        className="border-2 rounded w-full p-2 mb-2"
      >
        <option value="" disabled>
          Select a report
        </option>
        {reports.map(report => (
          <option key={report} value={report}>
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
            ? 'border-2 rounded w-full h-full mb-2 p-2 focus:outline-none focus:border-blue-500'
            : 'text-white px-4 py-2 rounded w-full mr-6 bg-gray-300'
        }`}
        style={{ minHeight: '65vh' }}
        disabled={!selectedItem}
        placeholder="Enter your report here..."
      ></textarea>

      <div className="flex mt-1">
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
          <div className="bg-white p-4 rounded overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Preview:</h2>

            <table className="border-2 rounded w-full mb-3 text-black whitespace-nowrap">
              <thead>
                <tr>
                  <th className="border-black border-2 text-center text-base">
                    Patient ID
                  </th>
                  <th className="border-black border-2 text-center text-base">
                    Patient Name
                  </th>
                  <th className="border-black border-2 text-center text-base">
                    Age Yrs
                  </th>
                  <th className="border-black border-2 text-center text-base">
                    Date
                  </th>
                  <th className="border-black border-2 text-center text-base">
                    Gender
                  </th>
                  <th className="border-black border-2 text-center text-base">
                    Ref Doctor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-black border-2 text-center text-base">
                    121
                  </td>
                  <td className="border-black border-2 text-center text-base">
                    Karan
                  </td>
                  <td className="border-black border-2 text-center text-base">
                    27
                  </td>
                  <td className="border-black border-2 text-center text-base">
                    30-Aug-2023
                  </td>
                  <td className="border-black border-2 text-center text-base">
                    Male
                  </td>
                  <td className="border-black border-2 text-center text-base">
                    #01112
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              className="border-2 rounded p-2 focus:outline-none focus:border-blue-500 overflow-y-auto whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: previewText || 'No preview available',
              }}
              style={{
                width: '1000px',
                maxHeight: '500px',
              }}
            />
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
