const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// Thiết lập kết nối đến SQL Server
const config = {
  user: 'ten_nguoi_dung',
  password: 'mat_khau_cua_ban',
  server: 'localhost',
  database: 'ten_cua_ban',
  options: {
    encrypt: false, // Nếu sử dụng kết nối không an toàn, đặt giá trị này thành true
  },
};

// API endpoint để lấy danh sách cơn bão
app.get('/api/retrieve_storms', async (req, res) => {
  try {
    const cityName = req.query.city_name;

    // Kết nối đến cơ sở dữ liệu
    await sql.connect(config);

    // Lấy danh sách cơn bão và sắp xếp chúng
    const result = await sql.query`
      SELECT *
      FROM Storm
      WHERE city_name = ${cityName}
      ORDER BY city_name DESC, detected_time ASC
    `;

    // Chuyển đổi kết quả sang định dạng JSON
    const stormList = result.recordset.map(storm => ({
      id: storm.id,
      city_name: storm.city_name,
      affected_areas_count: storm.affected_areas_count,
      detected_time: storm.detected_time.toISOString(), // Điều chỉnh định dạng ngày nếu cần
    }));

    res.json({ storms: stormList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi Nội Server' });
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await sql.close();
  }
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
