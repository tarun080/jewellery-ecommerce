import axios from "axios";
import stringify from "csv-stringify";

async function fetchTableData() {
  try {
    const response = await axios.get(
      "https://charts.mongodb.com/charts-jewelry-ecommerce-urrij"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

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

function downloadCSV(csvData) {
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "table-data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
