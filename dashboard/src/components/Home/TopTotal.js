import React, { useState } from "react";
import axios from "axios";

const TopTotal = (props) => {
	const { orders, products } = props;
	let totalSale = 0;
	if (orders) {
		orders.map((order) =>
			order.isPaid === true ? (totalSale = totalSale + order.totalPrice) : null
		);
	}

	const [tableData, setTableData] = useState([]);

	const handleDownload = () => {
		axios
			.get("http://localhost:5000/api/orders/prod_report/pdf", {
				responseType: "blob",
			})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", "chart.csv");
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			});
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
