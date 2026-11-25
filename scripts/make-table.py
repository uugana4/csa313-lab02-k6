#!/usr/bin/env python3
"""results/<prefix>-05vu.txt, -30vu.txt, -100vu.txt файлуудаас хүснэгт үүсгэнэ.

Тоонуудыг k6-ийн хадгалсан гаралтаас шууд уншдаг тул README-ийн хүснэгт
хавсаргасан файлуудтай ЯГ таарна.
  python3 scripts/make-table.py          # prefix = run (test.k6.io)
  python3 scripts/make-table.py local    # локал сервер
"""
import re
import sys
from pathlib import Path

prefix = sys.argv[1] if len(sys.argv) > 1 else "run"
root = Path(__file__).resolve().parent.parent
levels = [("05", 5), ("30", 30), ("100", 100)]
UNIT = {"µs": 0.001, "us": 0.001, "ms": 1.0, "s": 1000.0}


def to_ms(value, unit):
    return float(value) * UNIT[unit]


def parse(text):
    """k6 summary-аас p90, p95, avg (мс), throughput, нийт хүсэлт, error rate-ийг авна."""
    out = {}
    for line in text.splitlines():
        # http_req_duration-ийн үндсэн мөр ({expected_response:true} дэд мөрийг алгасна)
        if re.search(r"http_req_duration\.*:", line) and "{" not in line:
            for key, label in (("avg", "avg"), ("p(90)", "p90"), ("p(95)", "p95")):
                m = re.search(re.escape(key) + r"=([\d.]+)(µs|us|ms|s)\b", line)
                if m:
                    out[label] = to_ms(m.group(1), m.group(2))
        m = re.search(r"http_reqs\.*:\s*(\d+)\s+([\d.]+)/s", line)
        if m:
            out["reqs"], out["rps"] = int(m.group(1)), float(m.group(2))
        m = re.search(r"http_req_failed\.*:\s*([\d.]+)%", line)
        if m:
            out["fail"] = float(m.group(1))
    return out


rows, missing = [], []
for tag, vu in levels:
    f = root / "results" / f"{prefix}-{tag}vu.txt"
    if not f.exists():
        missing.append(f.name)
        continue
    data = parse(f.read_text(encoding="utf-8", errors="replace"))
    rows.append((vu, f.name, data))

lines = [
    "| VU | avg (мс) | p90 (мс) | p95 (мс) | Throughput (req/с) | Нийт хүсэлт | Error rate (%) | Эх файл |",
    "|---:|---:|---:|---:|---:|---:|---:|---|",
]


def fmt(d, k, digits=2):
    return f"{d[k]:.{digits}f}" if k in d else "?"


for vu, name, d in rows:
    lines.append(
        f"| {vu} | {fmt(d,'avg')} | {fmt(d,'p90')} | {fmt(d,'p95')} | "
        f"{fmt(d,'rps')} | {d.get('reqs','?')} | {fmt(d,'fail')} | `results/{name}` |"
    )

table = "\n".join(lines)
print(table)
if missing:
    print("\nОлдсонгүй:", ", ".join(missing))

base = next((d for vu, _, d in rows if vu == 5 and "p95" in d), None)
if base:
    print(f"\nBaseline p95 (5 VU) = {base['p95']:.2f} мс")
    print(f"Санал болгох SLO (baseline p95 x 1.5) = {base['p95'] * 1.5:.0f} мс")
    print("  -> k6 run -e SLO_P95_MS=%d thresholds.js" % round(base['p95'] * 1.5))

out = root / "results" / f"{prefix}-table.md"
out.write_text(table + "\n", encoding="utf-8")
print(f"\nХүснэгтийг хадгаллаа: results/{out.name}")
