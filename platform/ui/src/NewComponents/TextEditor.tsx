import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import jsPDF from 'jspdf';
import axios from 'axios';

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const apiUrl = 'http://dev.iotcom.io:5500/templates';
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the response data here
        setReports(response.data);
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    // Define the data you want to send in the request body
    const requestData = {
      StudyInstanceUID: '1.2.840.113704.9.1000.16.0.20230715132938816',
    };

    // Convert the requestData object into a query string
    const queryString = Object.keys(requestData)
      .map(
        key =>
          encodeURIComponent(key) + '=' + encodeURIComponent(requestData[key])
      )
      .join('&');

    // Make the API request when the component mounts
    fetch(`http://dev.iotcom.io:5500/StudyID?${queryString}`, {
      method: 'GET', // Use GET method
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData, 'responseData');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const selectedReport = reports.find(
        report => `${report.name}-${report.templateID}` === selectedItem.value
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
  }, [selectedItem, reports]);

  useEffect(() => {
    setPreviewText(text);
  }, [text]);

  const handleSave = () => {
    if (text && selectedItem) {
      const doc = new jsPDF();

      // Split the text into lines
      const lines = text.split('\n');

      // Calculate the height of each line and the total height of all lines
      const lineHeight = 10; // You can adjust this value as needed
      const totalHeight = lines.length * lineHeight;

      // Set the font size and starting position
      doc.setFontSize(12);
      let yPos = 10; // Starting y-position

      // Loop through the lines and add them to the PDF
      lines.forEach(line => {
        doc.text(10, yPos, line);
        yPos += lineHeight;

        if (yPos + lineHeight > doc.internal.pageSize.height) {
          doc.addPage();
          yPos = 10;
        }
      });

      const reportName = selectedItem.label.replace(/ /g, '_');
      const pdfFileName = `${reportName}.pdf`;

      doc.save(pdfFileName);
    } else {
      console.warn('Cannot generate PDF without text or selected report');
    }
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
    value: `${report.name}-${report.templateID}`,
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
          disabled={!text || !selectedItem}
          onClick={handleSave}
          className={`${
            text ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
          } text-white px-4 py-2 rounded w-full mr-6`}
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
