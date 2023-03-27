import React, { useState } from "react";
import axios from "axios";
import json2csv from "json2csv";
import { saveAs } from "file-saver";

const TopTotal = (props) => {
  const { orders, products } = props;
  let totalSale = 0;
  if (orders) {
    orders.map((order) =>
      order.isPaid === true ? (totalSale = totalSale + order.totalPrice) : null
    );
  }

  const [tableData, setTableData] = useState([]);

  const chartId = "6412e46c-058e-4c83-822d-ecc49544cf00";
  const baseUrl = "https://charts.mongodb.com";

  const handleDownload = async () => {
    const response = await axios.get(
      `${baseUrl}/api/charts/versions/csv/${chartId}`
    );

    // Convert JSON data to CSV format
    const csvData = json2csv.parse(response.data);

    // Create a Blob object for the CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

    // Save the CSV file using FileSaver.js library
    saveAs(blob, "data.csv");
    // try {
    //   const response = await axios.get(
    //     `${baseUrl}/api/charts/versions/csv/${chartId}`
    //   );
    //   // console.log(response.data);
    //   // const csvData = await jsonexport(response.data);
    //   const $ = cheerio.load(response.data);
    //   const csvData = $("pre").text();
    //   console.log(csvData);

    //   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    //   const downloadLink = URL.createObjectURL(blob);

    //   const link = document.createElement("a");
    //   link.href = downloadLink;
    //   link.setAttribute("download", "table-data.csv");
    //   link.style.display = "none";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error(error);
    // }
    // try {
    //   const response = await axios.get(
    //     "https://charts.mongodb.com/charts-jewelry-ecommerce-urrij/embed/charts?id=6412e46c-058e-4c83-822d-ecc49544cf00"
    //   );
    //   const data = response.data;

    //   stringify(data, { header: true }, (err, csvData) => {
    //     if (err) throw err;

    //     const blob = new Blob([csvData], { type: "text/csv" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "data.csv");
    //     document.body.appendChild(link);
    //     link.click();
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className="row">
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-primary">
              <i className="text-primary fas fa-usd-circle"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Sales</h6>{" "}
              <span>${totalSale.toFixed(0)}</span>
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-success">
              <i className="text-success fas fa-bags-shopping"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Orders</h6>
              {orders ? <span>{orders.length}</span> : <span>0</span>}
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <span className="icon icon-sm rounded-circle alert-warning">
              <i className="text-warning fas fa-shopping-basket"></i>
            </span>
            <div className="text">
              <h6 className="mb-1">Total Products</h6>
              {products ? <span>{products.length}</span> : <span>0</span>}
            </div>
          </article>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card card-body mb-4 shadow-sm">
          <article className="icontext">
            <div className="text">
              <button onClick={handleDownload}>Download Reports</button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TopTotal;
