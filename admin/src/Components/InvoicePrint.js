export const printInvoice = (order) => {
  const printWindow = window.open("", "_blank");

  const html = `
  <html>
    <head>
      <title>Hóa đơn ${order.code}</title>
      <style>
        body {
          font-family: "Segoe UI", Arial, sans-serif;
          padding: 15px 25px;
          line-height: 1.4;
          color: #222;
          font-size: 13px;
          max-width: 800px;
          margin: auto;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6px;
          margin-bottom: 10px;
        }

        .header img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .shop-info {
          text-align: right;
          font-size: 12px;
          line-height: 1.3;
        }

        .shop-info h3 {
          margin: 0;
          color: #dc3545;
          font-size: 15px;
        }

        h2 {
          text-align: center;
          font-size: 16px;
          margin: 6px 0 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 6px;
          text-align: left;
          font-size: 12px;
        }

        th {
          background: #f4f4f4;
        }

        .summary {
          margin-top: 8px;
          text-align: right;
          font-weight: bold;
          font-size: 13px;
        }

        .footer {
          text-align: center;
          margin-top: 15px;
          font-style: italic;
          color: #555;
          font-size: 12px;
        }

        .sign-section {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          text-align: center;
        }

        .sign-section div {
          width: 45%;
        }

        .sign-section p {
          margin-top: 40px;
          border-top: 1px solid #333;
          display: inline-block;
          padding-top: 2px;
          width: 120px;
        }

        .qr-code {
          text-align: right;
          margin-top: 5px;
        }

        .qr-code img {
          width: 70px;
          height: 70px;
        }

        @page {
          size: A4;
          margin: 10mm;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>

    <body>
      <div class="header">
        <img src="/Logo.png" alt="Logo"/>
        <div class="shop-info">
          <h3>WeHome</h3>
          <p>Hotline: 0909.090.909</p>
          <p>www.wehome.vaa.vn</p>
          <p>CN1: 18A/1 Cộng Hòa, Tân Sơn Nhất, TP.HCM</p>
          <p>CN2: 104 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM</p>
        </div>
      </div>

      <h2>HÓA ĐƠN BÁN HÀNG</h2>

      <p><strong>Mã đơn:</strong> ${order.code}</p>
      <p><strong>Khách hàng:</strong> ${order.customer}</p>
      <p><strong>Địa chỉ:</strong> ${order.address}</p>
      <p><strong>Ngày đặt:</strong> ${order.date}</p>
      ${
        order.shipping
          ? `<p><strong>Đơn vị vận chuyển:</strong> ${order.shipping.carrier} (${order.shipping.trackingCode})</p>`
          : ""
      }

      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>SL</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${order.products
            .map(
              (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${p.qty}</td>
                <td>${p.price.toLocaleString()} ₫</td>
                <td>${(p.qty * p.price).toLocaleString()} ₫</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <p class="summary">Tổng cộng: ${order.total.toLocaleString()} ₫</p>
      <p><strong>Thanh toán:</strong> ${
        order.paid ? "Đã thanh toán" : "Chưa thanh toán"
      }</p>

      <div class="qr-code">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${
          order.code
        }&size=80x80" alt="QR"/>
      </div>

      <div class="sign-section">
        <div>
          <strong>Khách hàng</strong>
          <p>(Ký tên)</p>
        </div>
        <div>
          <strong>Nhân viên</strong>
          <p>(Ký tên)</p>
        </div>
      </div>

      <div class="footer">
        <p>Cảm ơn quý khách đã mua hàng tại WeHome!</p>
      </div>
    </body>
  </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
