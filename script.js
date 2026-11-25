// Алхам 2: анхны (baseline) тест. vus/duration нь командын мөрөөс өөрчлөгдөнө:
//   k6 run script.js | tee results/run-05vu.txt
//   k6 run --vus 30 --duration 1m script.js | tee results/run-30vu.txt
import http from 'k6/http';
import { sleep, check } from 'k6';
import { TARGET, ENDPOINT } from './lib.js';

// Командын мөрөнд --vus/--duration өгөөгүй бол эдгээр утга үйлчилнэ.
export const options = { vus: 5, duration: '30s' };

export default function () {
  const res = http.get(TARGET + ENDPOINT);
  // check: хариу 200 эсэхийг шалгана (амжилтгүй бол checks хувь буурна).
  check(res, { 'status 200 байна': (r) => r.status === 200 });
  sleep(1); // хэрэглэгч хүсэлт хооронд 1с "бодно"
}
