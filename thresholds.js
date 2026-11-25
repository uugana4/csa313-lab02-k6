// Алхам 4: SLO-г threshold болгож кодоор шалгах (PASS/FAIL).
// SLO-г ӨӨРИЙН baseline-аас гаргана (жишээ нь baseline p95 x 1.5):
//   python3 scripts/make-table.py    -> "санал болгох SLO" мөрийг хар
//   k6 run -e SLO_P95_MS=<тоо> thresholds.js | tee results/threshold-pass.txt
// FAIL үзүүлэхийн тулд санаатайгаар хатуу утга өгнө:
//   k6 run -e SLO_P95_MS=50 thresholds.js | tee results/threshold-fail.txt
// ЭСВЭЛ локал сервер рүү (илүү тогтвортой): -e TARGET=http://localhost:3000
import http from 'k6/http';
import { sleep, check } from 'k6';
import { TARGET, ENDPOINT } from './lib.js';

const SLO_P95_MS = __ENV.SLO_P95_MS;
if (!SLO_P95_MS) {
  throw new Error('SLO_P95_MS өгөөгүй байна. Жишээ: k6 run -e SLO_P95_MS=200 thresholds.js');
}

// Анхаар: энд stages ашиглахгүй (vus/duration-ийг stages давамгайлдаг тул).
export const options = {
  vus: 30,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<' + SLO_P95_MS], // SLO: p95 latency
    http_req_failed: ['rate<0.01'],             // SLO: алдааны хувь < 1%
  },
};

export default function () {
  const res = http.get(TARGET + ENDPOINT);
  check(res, { 'status 200 байна': (r) => r.status === 200 });
  sleep(1);
}
