// Бүх k6 скриптийн нийтлэг хэсэг.
// ЁС ЗҮЙ: load тестийг зөвхөн зөвшөөрөгдсөн бай руу (test.k6.io эсвэл локал сервер) хийнэ.
// Өөр хаяг өгвөл скрипт ажиллахаас өмнө зогсоно.
const ALLOWED = /^https?:\/\/(test\.k6\.io|localhost|127\.0\.0\.1)(:\d+)?(\/|$)/;

// TARGET орчны хувьсагчаар солигдоно: k6 run -e TARGET=http://localhost:3000 script.js
export const TARGET = __ENV.TARGET || 'https://test.k6.io';
// ENDPOINT: локал серверийн /slow зэргийг сонгоход ашиглана.
export const ENDPOINT = __ENV.ENDPOINT || '/';

if (!ALLOWED.test(TARGET)) {
  throw new Error(
    'ЗӨВШӨӨРӨГДӨӨГҮЙ БАЙ: ' + TARGET +
    ' — зөвхөн test.k6.io эсвэл localhost руу тест хийнэ.'
  );
}
