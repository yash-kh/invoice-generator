import { Schema, model, Document } from "mongoose";

interface IQuotation extends Document {
  user: Schema.Types.ObjectId;
  products: Array<{
    name: string;
    qty: number;
    rate: number;
    gst: number;
  }>;
  pdfBuffer: Buffer;
  createdAt: Date;
}

const QuotationSchema = new Schema<IQuotation>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      rate: { type: Number, required: true },
      gst: { type: Number, required: true },
    },
  ],
  pdfBuffer: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Quotation = model<IQuotation>("Quotation", QuotationSchema);

export default Quotation;
