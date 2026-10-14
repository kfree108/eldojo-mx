#!/usr/bin/env python3
"""El Dojo schedule: one source (horario.json), every page in sync.

    python3 tools/horario.py          rewrite every schedule on the site from horario.json
    python3 tools/horario.py --check  change nothing; exit 1 if any page disagrees with horario.json

What it rewrites (between the generated markers):
  * index.html             home timetable (the SCHED block) and Google opening hours (JSON-LD)
  * brazilian-jiu-jitsu/   Jiu-Jitsu class table
  * entrena-de-visita/     visitor table (classes with a "visita" label; back-to-back ones share a row)
What it only checks: every other page (academia/course.json, guías, …) — any written time range
such as "18:00–19:30" or "de 16:00 a 17:00" must be a real class (or a visitor row) in horario.json.
Standard library only, so it runs anywhere (GitHub Actions, either Mac).
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DAYS = {1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo"}
SCHEMA_DAYS = {1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"}
TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
RANGE = re.compile(r"(\d{1,2}:\d{2})\s*(?:–|—|-|a)\s*(\d{1,2}:\d{2})")


def load():
    with open(os.path.join(ROOT, "horario.json"), encoding="utf-8") as f:
        data = json.load(f)
    classes = data["classes"]
    errors = []
    for i, c in enumerate(classes):
        where = f"horario.json class #{i + 1} ({c.get('title')})"
        if c.get("day") not in DAYS:
            errors.append(f"{where}: day must be 1 (lunes) … 7 (domingo)")
        for key in ("start", "end"):
            if not TIME.match(str(c.get(key, ""))):
                errors.append(f"{where}: {key} must look like 08:30")
        if TIME.match(str(c.get("start", ""))) and TIME.match(str(c.get("end", ""))) and c["end"] <= c["start"]:
            errors.append(f"{where}: ends before it starts")
        for key in ("art", "title", "app_class"):
            if not c.get(key):
                errors.append(f"{where}: missing {key}")
    if errors:
        sys.exit("\n".join(errors))
    return sorted(classes, key=lambda c: (c["day"], c["start"], c["end"]))


def detail(c):
    return " · ".join(x for x in (c.get("ages"), c.get("instructor")) if x)


def js_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def gen_home(classes):
    lines = ["// horario:start — generated from /horario.json by tools/horario.py; edit horario.json, not this block",
             "// [start, end, art, class, detail]", "const SCHED = {"]
    days = sorted({c["day"] for c in classes} | {1, 2, 3, 4, 5, 6})
    for i, d in enumerate(days):
        if d == 7 and not any(c["day"] == 7 for c in classes):
            continue
        row = ", ".join("[" + ", ".join(js_str(x) for x in (c["start"], c["end"], c["art"], c["title"], detail(c))) + "]"
                        for c in classes if c["day"] == d)
        lines.append(f"  {d}: [{row}]" + ("," if i < len(days) - 1 else ""))
    lines += ["};", "// horario:end"]
    return "\n".join(lines)


def gen_hours(classes):
    out = []
    for d in sorted({c["day"] for c in classes}):
        day = [c for c in classes if c["day"] == d]
        opens, closes = min(c["start"] for c in day), max(c["end"] for c in day)
        out.append(f'{{"@type": "OpeningHoursSpecification", "dayOfWeek": "{SCHEMA_DAYS[d]}", "opens": "{opens}", "closes": "{closes}"}}')
    return ",\n        ".join(out)


def gen_bjj(classes, indent="          "):
    rows = []
    for c in classes:
        if c["art"] != "bjj":
            continue
        label = c["title"] + (f" · {c['ages']}" if c.get("ages") else "")
        rows.append(f"{indent}<tr><td>{DAYS[c['day']]}</td><td>{c['start']}–{c['end']}</td>"
                    f"<td>{html.escape(label)}</td><td>{html.escape(c.get('instructor') or '—')}</td></tr>")
    return "\n".join(rows)


def visita_rows(classes):
    """Visitor-friendly classes; back-to-back classes on the same day share one row."""
    rows = []
    for c in classes:
        if not c.get("visita"):
            continue
        last = rows[-1] if rows else None
        if last and last["day"] == c["day"] and last["end"] == c["start"]:
            last["end"] = c["end"]
            last["label"] += " · " + c["visita"]
            last["bold"] = last["bold"] or c["day"] == 6
        else:
            rows.append({"day": c["day"], "start": c["start"], "end": c["end"], "label": c["visita"], "bold": c["day"] == 6})
    return rows


def gen_visita(classes, indent="        "):
    out = []
    for r in visita_rows(classes):
        cells = (DAYS[r["day"]], f"{r['start']}–{r['end']}", html.escape(r["label"]))
        if r["bold"]:
            cells = tuple(f"<strong>{x}</strong>" for x in cells)
        out.append(f"{indent}<tr>" + "".join(f"<td>{x}</td>" for x in cells) + "</tr>")
    return "\n".join(out)


def replace_between(text, start, end, body, path):
    a, b = text.find(start), text.find(end)
    if a == -1 or b == -1 or b < a:
        raise SystemExit(f"{path}: markers {start!r} … {end!r} not found")
    return text[: a + len(start)] + "\n" + body + "\n" + text[b:]


def render(classes):
    """Return {path: new_text} for every generated file."""
    out = {}
    p = "index.html"
    t = open(os.path.join(ROOT, p), encoding="utf-8").read()
    a, b = t.find("// horario:start"), t.find("// horario:end")
    if a == -1 or b == -1:
        raise SystemExit(f"{p}: '// horario:start' … '// horario:end' markers not found")
    t = t[:a] + gen_home(classes) + t[b + len("// horario:end"):]
    t = re.sub(r'("openingHoursSpecification": \[\n        ).*?(\n      \])',
               lambda m: m.group(1) + gen_hours(classes) + m.group(2), t, count=1, flags=re.S)
    out[p] = t
    p = "brazilian-jiu-jitsu/index.html"
    t = open(os.path.join(ROOT, p), encoding="utf-8").read()
    out[p] = replace_between(t, "<!-- horario:bjj:start -->", "          <!-- horario:bjj:end -->", gen_bjj(classes), p)
    p = "entrena-de-visita/index.html"
    t = open(os.path.join(ROOT, p), encoding="utf-8").read()
    out[p] = replace_between(t, "<!-- horario:visita:start -->", "        <!-- horario:visita:end -->", gen_visita(classes), p)
    return out


def stray_ranges(classes, generated):
    """Time ranges written anywhere else on the site that are not a class or a visitor row."""
    allowed = {(c["start"], c["end"]) for c in classes} | {(r["start"], r["end"]) for r in visita_rows(classes)}
    problems = []
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("assets", "tools", "node_modules")]
        for name in files:
            if not name.endswith((".html", ".json", ".js", ".md")) or name == "horario.json":
                continue
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, ROOT)
            text = open(path, encoding="utf-8", errors="ignore").read()
            # Generated regions are verified exactly; skip them here.
            text = re.sub(r"// horario:start.*?// horario:end|<!-- horario:\w+:start -->.*?<!-- horario:\w+:end -->", "", text, flags=re.S)
            for m in RANGE.finditer(text):
                start, end = (x.zfill(5) for x in m.groups())
                if not (TIME.match(start) and TIME.match(end)) or end <= start:
                    continue
                if (start, end) not in allowed:
                    line = text.count("\n", 0, m.start()) + 1
                    problems.append(f"{rel}:{line}: '{m.group(0)}' is not a class in horario.json")
    return problems


def main():
    check = "--check" in sys.argv[1:]
    classes = load()
    rendered = render(classes)
    changed = [p for p, t in rendered.items() if open(os.path.join(ROOT, p), encoding="utf-8").read() != t]
    problems = stray_ranges(classes, rendered)
    if check:
        for p in changed:
            print(f"{p}: schedule differs from horario.json — run python3 tools/horario.py")
        for p in problems:
            print(p)
        if changed or problems:
            sys.exit(1)
        print(f"OK: {len(classes)} classes, every page matches horario.json")
        return
    for p in changed:
        with open(os.path.join(ROOT, p), "w", encoding="utf-8") as f:
            f.write(rendered[p])
        print(f"updated {p}")
    for p in problems:
        print("FIX BY HAND:", p)
    if problems:
        sys.exit(1)
    if not changed:
        print("already in sync")


if __name__ == "__main__":
    main()
