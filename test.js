React Node PayPal Invoice


Tarun Purohit
Send and generate invoice using react js and nodejs after paypal payment

To send and generate an invoice using React.js and Node.js after a PayPal payment, you can follow these steps:

Set up a PayPal account and create an application in the PayPal developer dashboard.

Integrate the PayPal checkout process into your React.js application using the PayPal REST API. You can use the paypal-rest-sdk module to handle PayPal transactions.

After the payment is complete, PayPal will send a webhook notification to your Node.js server. You can use the express module to handle the webhook notification.

In the webhook handler, extract the transaction details from the PayPal notification and generate an invoice using a Node.js module like pdfkit or jspdf.

Once the invoice is generated, you can send it to the customer using a Node.js email module like nodemailer.

Here's some example code to help you get started:

React.js:

jsx
Copy code
import React from 'react';
import ReactDOM from 'react-dom';
import { PayPalButton } from "react-paypal-button-v2";

function PayPalCheckout() {
  const onSuccess = (details, data) => {
    // Send payment details to your Node.js server
    fetch('/paypal-payment', {
      method: 'POST',
      body: JSON.stringify({details, data}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  };

  return (
    <PayPalButton
      amount="0.01"
      onSuccess={onSuccess}
    />
  );
}

ReactDOM.render(
  <PayPalCheckout />,
  document.getElementById('root')
);
Node.js:

javascript
Copy code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

app.use(bodyParser.json());

app.post('/paypal-payment', (req, res) => {
  const details = req.body.details;
  const data = req.body.data;

  // Generate invoice
  const invoiceDoc = new PDFDocument();
  invoiceDoc.text(`Invoice for payment ID ${details.id}`);
  const invoicePdfBuffer = invoiceDoc.pipe(Buffer.concat([]));

  // Send invoice to customer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: details.payer.email_address,
    subject: 'Invoice for your PayPal payment',
    text: 'Thank you for your payment! Please find your invoice attached.',
    attachments: [
      {
        filename: `invoice-${details.id}.pdf`,
        content: invoicePdfBuffer
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending invoice email');
    } else {
      console.log('Invoice email sent: ' + info.response);
      res.send('Invoice sent');
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
Note that this code is just a starting point and may need to be modified to fit your specific use case.




Tarun Purohit
How to download table from mongodb chart in csv format using react js

To download a table from MongoDB chart in CSV format using React.js, you can use the following steps:

Fetch the data from the MongoDB chart API endpoint using the fetch method or a library like axios.

Convert the data into CSV format using a library like jsonexport or csv-stringify.

Create a download link for the CSV file using the Blob constructor and the URL.createObjectURL method.

Trigger the download by simulating a click on the download link.

Here's an example code snippet to help you get started:

jsx
Copy code
import React, { useState } from 'react';
import axios from 'axios';
import jsonexport from 'jsonexport';

function TableDownload() {
  const [tableData, setTableData] = useState([]);

  const handleDownload = async () => {
    try {
      const response = await axios.get('https://<your-mongodb-chart-api-endpoint>');
      const csvData = await jsonexport(response.data);

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const downloadLink = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadLink;
      link.setAttribute('download', 'table-data.csv');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download CSV</button>
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.id}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
Note that this code is just a starting point and may need to be modified to fit your specific use case. Additionally, make sure to replace <your-mongodb-chart-api-endpoint> with the actual API endpoint for your MongoDB chart.




Tarun Purohit
Download table from mongodb chart in csv format using react js

To download a table from a MongoDB chart in CSV format using React.js, you can follow these steps:

Install the necessary libraries: axios and csv-stringify.
Copy code
npm install axios csv-stringify
Create a function to fetch the data from the MongoDB chart API endpoint using axios.
jsx
Copy code
import axios from 'axios';

async function fetchTableData() {
  try {
    const response = await axios.get('https://<your-mongodb-chart-api-endpoint>');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
Replace <your-mongodb-chart-api-endpoint> with the actual API endpoint for your MongoDB chart.

Create a function to convert the table data into CSV format using csv-stringify.
jsx
Copy code
import stringify from 'csv-stringify';

function convertToCSV(data) {
  return new Promise((resolve, reject) => {
    stringify(data, (err, csv) => {
      if (err) {
        reject(err);
      } else {
        resolve(csv);
      }
    });
  });
}
Create a function to download the CSV file.
jsx
Copy code
function downloadCSV(csvData) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'table-data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
This function takes the CSV data as a parameter, creates a Blob object from it, creates a URL for the blob, and creates a hidden <a> element with the URL and the download attribute set to the desired filename. It then simulates a click on the link to trigger the download.

Use these functions in your component.
jsx
Copy code
import { useEffect, useState } from 'react';
import axios from 'axios';
import stringify from 'csv-stringify';

function TableDownload() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchTableData();
      setTableData(data);
    }
    fetchData();
  }, []);

  const handleDownload = async () => {
    try {
      const csvData = await convertToCSV(tableData);
      downloadCSV(csvData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download CSV</button>
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.id}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
This code fetches the table data on mount using useEffect and the fetchTableData function, and sets the data in state using setTableData. The handleDownload function converts the table data to CSV format using convertToCSV and downloads the file using downloadCSV. The table is rendered using the map method on the tableData array.

Note that this code is just a starting point and may need to be modified to fit your specific





ChatGPT Mar 14 Version. Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.




Invoice
front-end:
import React, { useState, useEffect } from 'react';
import Dashboard_donor from './Dashboard_donor';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';

const Req_history = () => {
  const [donorRequests, setDonorRequests] = useState([]);
  const Donor_name = sessionStorage.getItem('Donor_name');

  useEffect(() => {
    const getDonorRequests = async () => {
      const res = await fetch(`http://localhost:3001/controllers/donation_history?donor_name=${Donor_name}`);
      const getdata = await res.json();
      setDonorRequests(getdata);
    };
    getDonorRequests();
  }, [Donor_name]);

  const handleGenerateReport = async (reqNo) => {
    const res = await fetch(`http://localhost:3001/controllers/donation_report?req_no=${reqNo}`);
    const blob = await res.blob();
    saveAs(blob, `report_request_${reqNo}.pdf`);
  };

  return (
    <div>
      <Dashboard_donor />
      <h2>Donation history</h2>
      <Container className="my-4 text-center">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Request No.</th>
            <th>Blood Quantity</th>
            <th>Health issue</th>
            <th>Date</th>
            <th>Status</th>
            <th>Donation status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donorRequests.map((donation) => (
            <tr key={donation.Req_no}>
              <td>{donation.Req_no}</td>
              <td>{donation.Blood_qty}</td>
              <td>{donation.Health_issues}</td>
              <td>{donation.Donation_date}</td>
              <td>{donation.Status}</td>
              <td>{donation.Donation_status}</td>
              <td>
                {donation.Donation_status === "donated" ? (
                  <Button variant="primary" onClick={() => handleGenerateReport(donation.Req_no)}>
                    Generate Report
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Container>
    </div>
  );
};

export default Req_history;


back-end:

import pdfMake from 'pdfmake';


const donation_report = (app, db) => {
  // GET request to generate report for a specific request number
  app.get('/controllers/donation_report', async (req, res) => {
    const reqNo = req.query.req_no;
    const sqlQuery = `SELECT * FROM donor_req WHERE Req_no = '${reqNo}';`;
    db.query(sqlQuery, async (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        
        const fonts = {
          Roboto: {
            normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
            bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
            italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
            bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
          }
        };
        const printer = new pdfMake(fonts);
        const pdfDefinition = {
          content: [
            { text: `Donation Report for Request No. ${reqNo}`, style: 'header' },
            { text: '\n\n' },
            { text: `Donation Date: ${result[0].Donation_date}`, style: 'subheader' },
            { text: `Donor Name: ${result[0].Donor_name}`, style: 'subheader' },
            { text: `Donor ID: ${result[0].Donor_id}`, style: 'subheader' },
            { text: `Blood Type: ${result[0].Blood_grp}`, style: 'subheader' },
            { text: `Blood Quantity: ${result[0].Blood_qty}`, style: 'subheader' },
            
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true
            },
            subheader: {
              fontSize: 14,
              bold: true
            }
          },
          footer: {
            columns: [
              { text: 'This report was computer generated.', alignment: 'center', fontSize: 10 }
            ]
          }
        };
        const pdfDoc = printer.createPdfKitDocument(pdfDefinition);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report_request_${reqNo}.pdf`);
        pdfDoc.pipe(res);
        pdfDoc.end();
      } else {
        res.status(404).json({ error: `No donation request found with Request No. ${reqNo}` });
      }
    });
  });
};

export default donation_report;


import React from 'react';
import axios from 'axios';

const DownloadButton = ({ invoiceId }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(`/invoice/${invoiceId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleDownload}>Download PDF</button>
  );
};

export default DownloadButton;