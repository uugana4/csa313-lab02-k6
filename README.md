# Лаб 2: Гүйцэтгэлийн хэмжүүрийг k6-аар хэмжих (F.CSA313)

**Оюутан:** А.Ууганбаяр (B242270014)

Энэ лабораторид k6 ашиглан latency (p90/p95), throughput, error rate хэмжүүрийг бодитоор хэмжиж, ачаалал өсөхөд гүйцэтгэл хэрхэн өөрчлөгдөхийг ажиглана.

## Ёс зүй
Load тестийг зөвхөн зөвшөөрөгдсөн бай руу хийсэн: **https://test.k6.io** болон өөрийн компьютер дээрх **локал сервер** (`server.js`). `lib.js` нь өөр хаяг өгвөл скриптийг ажиллахаас өмнө зогсооно.

## Файлууд
| Файл | Зорилго |
|---|---|
| `lib.js` | Бай (TARGET)-ын хаягийг шалгадаг нийтлэг хэсэг |
| `script.js` | Алхам 2: baseline тест (vus/duration командаас солигдоно) |
| `stages.js` | Алхам 3: ачааллыг шатлан өсгөх |
| `thresholds.js` | Алхам 4: SLO-г threshold болгон шалгах (PASS/FAIL) |
| `server.js` | Алхам 5: локал сервер (`/` хурдан, `/slow` 100 мс удаан) |
| `scripts/run-levels.sh` | 5/30/100 VU түвшнийг тусад нь ажиллуулж гаралтыг хадгална |
| `scripts/make-table.py` | `results/` дахь гаралтаас хүснэгт гаргана |
| `results/` | k6-ийн бүтэн текст гаралтууд |
| `screenshots/` | Summary гаралтын дэлгэцийн зургууд |

## Ажиллуулах
```bash
brew install k6            # macOS (Ubuntu дээр зааврын дагуу apt-аар)
k6 version

k6 run script.js | tee results/run-05vu.txt          # Алхам 2
bash scripts/run-levels.sh                           # Алхам 3: 5/30/100 VU
k6 run stages.js | tee results/stages.txt            # Алхам 3: stages
python3 scripts/make-table.py                        # хүснэгт + санал болгох SLO

k6 run -e SLO_P95_MS=<тоо> thresholds.js | tee results/threshold-pass.txt   # Алхам 4
k6 run -e SLO_P95_MS=50    thresholds.js | tee results/threshold-fail.txt

node server.js                                       # Алхам 5 (өөр terminal дээр)
bash scripts/run-levels.sh local http://localhost:3000
ENDPOINT=/slow bash scripts/run-levels.sh slow http://localhost:3000
```
