import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import jsPDF from 'jspdf';
import axios from 'axios';
import moment from 'moment';
import {
  getDataFromServer,
  postDatatoServer,
  uploadImageToServer,
} from '../utils/services';

const TextEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [previewText, setPreviewText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reports, setReports] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [getUploadImages, setGetUploadImages] = useState([]);

  const url = window.location.href;
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const studyInstanceUIDs = urlParams.get('StudyInstanceUIDs');

  useEffect(() => {
    function handleResponse(responseData) {
      if (responseData.status === 'success') {
        setReports(responseData.response);
      }
    }

    const endpoint = 'templates';
    const params = {
      token: '',
    };
    const props = {};

    getDataFromServer({
      end_point: endpoint,
      params,
      call_back: handleResponse,
      props,
    });
  }, []);

  useEffect(() => {
    function handleResponse(responseData) {
      if (responseData.status === 'success') {
        setTableData(responseData.response[0]);
      } else {
        console.error('Error:', responseData.error);
      }
    }
    const endpoint = 'StudyID';
    const requestBody = {
      StudyInstanceUID: studyInstanceUIDs,
    };
    const props = {
      header: true,
    };

    postDatatoServer({
      end_point: endpoint,
      body: requestBody,
      call_back: handleResponse,
      props,
    });
  }, []);

  const handleUploadImage = async (item, key) => {
    try {
      const endPoint = 'upload/report';

      const promisesArray = getUploadImages.map(async file => {
        const responseImage = await uploadImageToServer({
          end_point: `${endPoint}/?id=${tableData.id}`,
          data: file,
          props: item,
        });
        return responseImage;
      });

      console.log(promisesArray, 'promisesArray');
      const dataArray = await Promise.all(promisesArray);

      if (dataArray.length > 0) {
        setGetUploadImages([]);
        console.log('successful');
      }
      // toast.success('Upload successful');
    } catch (err) {
      console.error('Error occurred during image upload:', err);
    }
  };

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
      // Add the table data to the PDF
      doc.setFontSize(12);
      doc.text(10, 10, `Patient ID: ${tableData.patientID}`);
      doc.text(10, 20, `Patient Name: ${tableData.name}`);
      doc.text(10, 30, `Date: ${formattedDate}`);
      doc.text(10, 40, `Location: ${tableData.location}`);
      doc.text(10, 50, `Ref Doctor: ${tableData.ReferringPhysicianName}`);

      // Split the text into lines
      const lines = text.split('\n');

      // Calculate the height of each line and the total height of all lines
      const lineHeight = 10; // You can adjust this value as needed
      let yPos = 60; // Starting y-position for text

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
      setGetUploadImages(pdfFileName);
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

  const formattedDate = moment(tableData.Date, 'D/M/YYYY, h:mm:ss a').format(
    'DD-MMMM-YYYY'
  );

  return (
    <div className="p-1">
      <table className="min-w-full border text-center text-sm font-light text-white mb-3">
        <thead className="border-b font-medium">
          <tr>
            <th scope="col" className="border-r">
              Patient ID
            </th>
            <th scope="col" className="border-r">
              Patient Name
            </th>
            <th scope="col" className="border-r">
              Date
            </th>
            <th scope="col" className="border-r">
              Location
            </th>
            <th scope="col" className="border-r">
              Ref Doctor
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b font-medium">
            <td className="border-r">{tableData.patientID}</td>
            <td className="border-r">{tableData.name}</td>
            <td className="border-r">{formattedDate}</td>
            <td className="border-r">{tableData.location}</td>
            <td className="border-r">{tableData.ReferringPhysicianName}</td>
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
            <table className="min-w-full border text-center text-sm font-light mb-3 text-dark">
              <thead className="border-b font-medium">
                <tr>
                  <th scope="col" className="border-r">
                    Patient ID
                  </th>
                  <th scope="col" className="border-r">
                    Patient Name
                  </th>
                  <th scope="col" className="border-r">
                    Date
                  </th>
                  <th scope="col" className="border-r">
                    Location
                  </th>
                  <th scope="col" className="border-r">
                    Ref Doctor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b font-medium">
                  <td className="border-r">{tableData.patientID}</td>
                  <td className="border-r">{tableData.name}</td>
                  <td className="border-r">{formattedDate}</td>
                  <td className="border-r">{tableData.location}</td>
                  <td className="border-r">
                    {tableData.ReferringPhysicianName}
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
