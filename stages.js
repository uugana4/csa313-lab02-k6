// Алхам 3: ачааллыг шатлан өсгөх (халаалт -> өсгөлт -> оргил -> буулт).
// Анхаар: нэг ажиллуулалт нэг л нэгтгэсэн summary өгдөг тул хүснэгтийн
// 5/30/100 VU-ийн тоог scripts/run-levels.sh-ээр ТУСАД НЬ ажиллуулж авна.
//   k6 run stages.js | tee results/stages.txt
import http from 'k6/http';
import { sleep, check } from 'k6';
import { TARGET, ENDPOINT } from './lib.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // халаалт
    { duration: '1m', target: 30 },   // өсгөлт
    { duration: '30s', target: 100 }, // оргил
    { duration: '30s', target: 0 },   // буулт
  ],
};

export default function () {
  const res = http.get(TARGET + ENDPOINT);
  check(res, { 'status 200 байна': (r) => r.status === 200 });
  sleep(1);
}
