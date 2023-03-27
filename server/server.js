import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

app.use(function (req, res, next, callback) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE,OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Authorization");

	// CORS OPTIONS request, simply return 200
	if (req.method == "OPTIONS") {
		res.statusCode = 200;
		res.end();
		callback.onOptions();
		return;
	}
	next();
});

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID);
});

const doc = new PDFDocument();
const stream = doc.pipe(blobStream());

doc.fontSize(25).text("Order Data Report", { align: "center" });

// Fetch order data from MongoDB and add it to the PDF
// code to fetch order data from MongoDB
app.get("/generate-pdf/:orderId", (req, res) => {
	const orderId = req.params.orderId;
	// Fetch order data from MongoDB for the specific order
	Order.findById(orderId, (err, order) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}
		if (!order) {
			return res.status(404).send("Order not found");
		}
		// Add order data to PDF
		doc.fontSize(14);
		doc.text(`Order ID: ${order._id}`, { underline: true });
		doc.text(`Customer Name: ${order.customerName}`);
		doc.text(`Order Date: ${order.orderDate}`);
		doc.text(`Product Name: ${order.productName}`);
		doc.text(`Quantity: ${order.quantity}`);
		doc.text(`Price: ${order.price}`);

		// Send PDF as response
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=order-${orderId}.pdf`
		);
		stream.pipe(res);
	});
});

doc.end();

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
