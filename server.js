// Алхам 5: туршилтын локал сервер (зөвхөн Node.js, нэмэлт сан хэрэггүй).
//   node server.js              -> http://localhost:3000
//   GET /      хурдан хариу
//   GET /slow  100 мс санаатайгаар удаашруулсан хариу
const http = require('http');
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    if (req.url === '/slow') {
      setTimeout(() => res.end('slow ok\n'), 100); // 100 мс хүлээлт
      return;
    }
    res.end('ok\n');
  })
  .listen(PORT, () => console.log('Сервер ажиллаж байна: http://localhost:' + PORT));
