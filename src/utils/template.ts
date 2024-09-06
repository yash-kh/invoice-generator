import puppeteer from "puppeteer";

interface Product {
    name: string;
    qty: number;
    rate: number;
}

export const generateInvoicePDF = async (products: Product[]): Promise<Buffer> => {
  const htmlContent = generateInvoiceHTML(products);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return Buffer.from(pdfBuffer);
};

const generateInvoiceHTML = (products: Product[]): string => {
  let productRows = "";
  products.forEach((product) => {
    productRows += `
        <tr>
          <td>${product.name}</td>
          <td class="purple">${product.qty}</td>
          <td>${product.rate.toFixed(2)}</td>
          <td>INR ${(product.rate * product.qty).toFixed(2)}</td>
        </tr>
      `;
  });

  const totalAmount = products.reduce(
    (total, product) => total + product.rate * product.qty,
    0
  );
  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f9f9f9;
          }
          .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          h1 {
            text-align: center;
            font-weight: normal;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          th, td {
            padding: 20px;
            text-align: left;
          }
          th {
            font-weight: bold;
            color: #555;
            border-bottom: 1px solid #ddd;
          }
          .total-section {
            width: 40%;
            margin-left: auto;
            margin-top: 20px;
            font-size: 16px;
            text-align: right;
          }
          .total-section table {
            width: 100%;
            border-collapse: collapse;
          }
          .total-section td {
            padding: 8px 10px;
          }
          .total-section .label {
            font-weight: bold;
            color: #555;
          }
          .total-section .amount {
            font-weight: bold;
            color: #000;
          }
          .grand-total {
            font-size: 20px;
            font-weight: bold;
          }
          .purple {
            color: #4a00e0;
          }
          .terms {
            background-color: #000000;
            color: #fff;
            padding: 30px;
            padding-left: 60px;
            padding-right: 60px;
            border-radius: 100px;
            margin-top: 40px;
          }
          .terms .head {
            padding-bottom: 10px;
          }
          .terms p {
            margin: 0;
            font-size: 14px;
          }
          .valid-date {
            margin-top: 30px;
            font-size: 14px;
            color: #555;
          }
          .grand-total-row {
            border-bottom: 2px solid #ddd;
            border-top: 2px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
  
          <div class="total-section">
            <table>
              <tr>
                <td class="label">Total</td>
                <td class="amount">INR ${totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">GST</td>
                <td class="amount">18%</td>
              </tr>
              <tr class="grand-total-row">
                <td class="label grand-total">Grand Total</td>
                <td class="grand-total purple">₹ ${grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>
  
          <div class="valid-date">Valid until: 12/04/23</div>
  
          <div class="terms">
            <p class="head">Terms and Conditions</p>
            <p>We are happy to supply any further information you may need and trust that you call on us to fill your order, which will receive our prompt and careful attention.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
