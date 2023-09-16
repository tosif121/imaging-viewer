import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';

const reports = [
  {
    id: 1,
    name: 'X - RAY - HEEL LATERAL VIEW',
    content: {
      OBSERVATION: `-- The visualized bones are normal.
                      -- Soft tissues are normal.
                      -- Ankle joint appears normal.`,
      IMPRESSION: `• No significant abnormality seen.`,
    },
  },
  {
    id: 2,
    name: 'X - RAY - HEEL LATERAL VIEW',
    content: {
      OBSERVATION: `--  Visualized bones of pelvis are normal.
                      --  The hip joint appears normal.
                      --  No abnormality is seen in head, neck and visualized parts of femur.
                      --  No abnormal radio opaque shadow seen.`,
      IMPRESSION: `• No significant abnormality noted.`,
    },
  },
  {
    id: 3,
    name: 'X – RAY - HIP AP STANDING VIEW',
    content: {
      OBSERVATION: `--  Visualized parts of tibia and fibula appear normal.
                      --  The visualized parts of ankle joint appear normal.
                      -- Soft tissues are normal.`,
      IMPRESSION: `• No significant abnormality seen.`,
    },
  },
];

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (selectedItem) {
      const selectedReport = reports.find(
        report => `${report.name}-${report.id}` === selectedItem.value
      );
      if (selectedReport) {
        const initialText = `
          ${selectedReport.name}

         OBSERVATION:
            ${selectedReport.content.OBSERVATION}

         IMPRESSION:
            ${selectedReport.content.IMPRESSION}
        `;
        setText(initialText);
      }
    } else {
      setText('');
    }
  }, [selectedItem]);

  useEffect(() => {
    setPreviewText(text);
  }, [text]);

  const handleSave = () => {
    console.log('Saving:', text);
  };

  const handleView = () => {
    if (selectedItem) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const reportOptions = reports.map(report => ({
    value: `${report.name}-${report.id}`,
    label: report.name,
  }));

  const handleDropdownChange = (
    selectedOption: {
      value: string;
      label: string;
    } | null
  ) => {
    setSelectedItem(selectedOption);
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
      <ReactSelect
        value={selectedItem}
        onChange={selectedOption => handleDropdownChange(selectedOption)}
        options={reportOptions}
        placeholder="Select a report"
        isSearchable={true}
      />

      <p className="mb-2 text-blue-500">
        Selected Report: {selectedItem ? selectedItem.label : ''}
      </p>

      <textarea
        contentEditable={!selectedItem ? false : true}
        className={`${
          selectedItem
            ? 'border-2 rounded w-full h-full mb-2 p-2 focus:outline-none focus:border-blue-500 text-primary-dark'
            : 'text-white px-4 py-2 rounded w-full mr-6 bg-gray-300'
        }`}
        style={{ minHeight: '65vh', whiteSpace: 'pre-line' }}
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={!selectedItem}
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
