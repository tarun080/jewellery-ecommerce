import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";
import pdfkit from "pdfkit";
const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
	"/",
	protect,
	asyncHandler(async (req, res) => {
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		} = req.body;

		if (orderItems && orderItems.length === 0) {
			res.status(400);
			throw new Error("No order items");
			return;
		} else {
			const order = new Order({
				orderItems,
				user: req.user._id,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
			});

			const createOrder = await order.save();
			res.status(201).json(createOrder);
		}
	})
);

// ADMIN GET ALL ORDERS
orderRouter.get(
	"/all",
	protect,
	admin,
	asyncHandler(async (req, res) => {
		const orders = await Order.find({})
			.sort({ _id: -1 })
			.populate("user", "id name email");
		res.json(orders);
	})
);
// USER LOGIN ORDERS
orderRouter.get(
	"/",
	protect,
	asyncHandler(async (req, res) => {
		const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
		res.json(order);
	})
);

// GET ORDER BY ID
orderRouter.get(
	"/:id",
	protect,
	asyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id).populate(
			"user",
			"name email"
		);

		if (order) {
			res.json(order);
		} else {
			res.status(404);
			throw new Error("Order Not Found");
		}
	})
);

// ORDER IS PAID
orderRouter.put(
	"/:id/pay",
	protect,
	asyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.email_address,
			};

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404);
			throw new Error("Order Not Found");
		}
	})
);

// ORDER IS PAID
orderRouter.put(
	"/:id/delivered",
	protect,
	asyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);

		if (order) {
			order.isDelivered = true;
			order.deliveredAt = Date.now();

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404);
			throw new Error("Order Not Found");
		}
	})
);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDgwOGEzY2ZmZjhkMDU0NThlZjllMyIsImlhdCI6MTY3OTg5NTkzNiwiZXhwIjoxNjgyNDg3OTM2fQ.-ctHUkuAi5_g6Nn_l0rzadNARsSeNtTAd5sHDsCmigc

orderRouter.get("/invoices/:id/pdf", async (req, res) => {
	try {
		const invoice = await Order.findById(req.params.id).populate("user");
		if (!invoice) {
			return res.status(404).send("Invoice not found");
		}

		const doc = new pdfkit();
		doc.pipe(res);
		doc.font("Helvetica-Bold").fontSize(24);
		doc
			.image(
				"F:\\Radhe Jewellers\\website\\client frontend\\public\\images\\logo.png",
				{
					fit: [100, 100],
					align: "left",
					valign: "center",
				}
			)
			.text("Radhe Jewellers", {
				align: "center",
			});
		doc.moveDown();
		doc
			.font("Helvetica-Bold")
			.fontSize(24)
			.text("Invoice", { align: "center" });
		doc.moveDown();
		doc.font("Helvetica").fontSize(12).text(`Invoice Number: ${invoice._id}`);
		doc
			.font("Helvetica")
			.fontSize(12)
			.text(`Customer Name: ${invoice.user.name}`);
		doc.font("Helvetica").fontSize(12).text(`Date: ${invoice.paidAt}`);
		doc.moveDown();
		doc.font("Helvetica-Bold").fontSize(16).text("Items", { underline: true });
		doc.moveDown();
		invoice.orderItems.forEach((item) => {
			doc.font("Helvetica").fontSize(12).text(item.name);
			doc
				.font("Helvetica-Bold")
				.fontSize(12)
				.text(`$${item.price.toFixed(2)}`, { align: "right" });
			doc.moveDown();
		});
		doc.moveDown();
		doc
			.font("Helvetica-Bold")
			.fontSize(16)
			.text(`Total: $${invoice.totalPrice.toFixed(2)}`, { align: "right" });

		doc.end();
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

orderRouter.get("/invoices/:id/pdf", async (req, res) => {
	try {
		const invoice = await Order.findById(req.params.id).populate("user");
		if (!invoice) {
			return res.status(404).send("Invoice not found");
		}

		const doc = new pdfkit();
		doc.pipe(res);
		doc.font("Helvetica-Bold").fontSize(24);
		doc
			.image(
				"F:\\Radhe Jewellers\\website\\client frontend\\public\\images\\logo.png",
				{
					fit: [100, 100],
					align: "left",
					valign: "center",
				}
			)
			.text("Radhe Jewellers", {
				align: "center",
			});
		doc.moveDown();
		doc
			.font("Helvetica-Bold")
			.fontSize(24)
			.text("Invoice", { align: "center" });
		doc.moveDown();
		doc.font("Helvetica").fontSize(12).text(`Invoice Number: ${invoice._id}`);
		doc
			.font("Helvetica")
			.fontSize(12)
			.text(`Customer Name: ${invoice.user.name}`);
		doc.font("Helvetica").fontSize(12).text(`Date: ${invoice.paidAt}`);
		doc.moveDown();
		doc.font("Helvetica-Bold").fontSize(16).text("Items", { underline: true });
		doc.moveDown();
		invoice.orderItems.forEach((item) => {
			doc.font("Helvetica").fontSize(12).text(item.name);
			doc
				.font("Helvetica-Bold")
				.fontSize(12)
				.text(`$${item.price.toFixed(2)}`, { align: "right" });
			doc.moveDown();
		});
		doc.moveDown();
		doc
			.font("Helvetica-Bold")
			.fontSize(16)
			.text(`Total: $${invoice.totalPrice.toFixed(2)}`, { align: "right" });

		doc.end();
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

orderRouter.get("/reports/pdf", async (req, res) => {
	try {
		const orders = await Order.find();
		if (!orders) {
			return res.status(404).send("Invoice not found");
		}
		console.log(Array.isArray(orders));
		const doc = new pdfkit();
		doc.pipe(res);
		doc.font("Helvetica-Bold").fontSize(24);
		doc
			.image(
				"F:\\Radhe Jewellers\\website\\client frontend\\public\\images\\logo.png",
				{
					fit: [100, 100],
					align: "left",
					valign: "center",
				}
			)
			.text("Radhe Jewellers", {
				align: "center",
			});
		doc.moveDown();
		doc
			.fontSize(14)
			.text("Product Sales Report", { align: "center" })
			.moveDown();
		doc
			.fontSize(12)
			.text(`Generated on ${new Date().toLocaleString()}`)
			.moveDown();
		doc.fontSize(12).text(`Total Orders: ${orders.length}`).moveDown();
		doc
			.fontSize(12)
			.text(
				`Total Revenue: ${orders.reduce(
					(sum, order) => sum + order.totalPrice,
					0
				)} USD`
			)
			.moveDown();
		doc.moveDown();
		doc.fontSize(12).text("Product Sales:", { underline: true }).moveDown();
		console.log(Array.isArray(orders));
		if (orders && orders.length > 0) {
			orders.forEach((order, index) => {
				doc.fontSize(12).text(`Order #${index + 1}:`);
				order.products.forEach((product) => {
					doc
						.fontSize(10)
						.text(
							`- ${product.product.name} x ${product.quantity} @ ${product.product.price} USD`
						);
				});
				doc
					.fontSize(12)
					.text(`Order Total: ${order.totalPrice} USD`)
					.moveDown();
			});
		} else {
			console.log("orders is empty");
		}
		console.log(doc);
		doc.end();
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default orderRouter;
