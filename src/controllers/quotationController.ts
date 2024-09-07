import { Request, Response } from "express";
import { z } from "zod";
import Quotation from "../models/Quotation";
import { generateInvoiceImage, generateInvoicePDF } from "../utils/template";
import { addProductsSchema } from "../utils/zod";

export const addProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { products } = addProductsSchema.parse(req.body);

    // Calculate GST and total amount
    const productsWithCalculations = products.map((product) => {
      const gst = product.rate * product.qty * 0.18;
      const amount = product.rate * product.qty + gst;
      return { ...product, gst, amount };
    });

    // Generate PDF Invoice as buffer
    const pdfBuffer = await generateInvoicePDF(productsWithCalculations);

    // Save quotation to database
    const quotation = new Quotation({
      user: userId,
      products: productsWithCalculations,
      pdfBuffer, // Store the PDF buffer in the database
    });
    await quotation.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice_${quotation.get("id")}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues });
    }
    res.status(400).json({ message: error.message });
  }
};

export const viewQuotations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const quotations = await Quotation.find({ user: userId });

    const response = quotations.map((quotation) => ({
      id: quotation._id,
      date: quotation.createdAt,
    }));

    res.status(200).json({ quotations: response });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const downloadQuotation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { format } = req.query;

    const quotation = await Quotation.findOne({
      _id: id,
      user: userId,
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    if (format === "image") {
      const imageBuffer = await generateInvoiceImage(quotation.products);

      // Set response headers to indicate an image download
      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice_${id}.png"`
      );

      // Send the image buffer to the client
      res.send(imageBuffer);
    } else {
      // Default to PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice_${id}.pdf"`
      );

      // Send the PDF buffer to the client
      res.send(quotation.pdfBuffer);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
