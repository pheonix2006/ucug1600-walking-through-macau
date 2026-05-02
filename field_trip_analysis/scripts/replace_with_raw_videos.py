from __future__ import annotations

import csv
import datetime as dt
import json
import os
import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(r"E:\Project\1600")
SOURCE_DIR = Path(
    r"E:\wechat\xwechat_files\wxid_y96utu6cuc6p22_a45e\msg\video\2026-05"
)
CUTOFF = dt.datetime(2026, 5, 2, 15, 54, 30)

ANALYSIS_DIR = ROOT / "field_trip_analysis"
DATA_DIR = ROOT / "data"
FRAMES_DIR = ANALYSIS_DIR / "frames"
BACKUP_DIR = ANALYSIS_DIR / "backups" / "before_raw_replacement_20260502"


def ffprobe(path: Path) -> dict:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(path),
    ]
    proc = subprocess.run(command, capture_output=True, text=True, check=True)
    data = json.loads(proc.stdout)
    video = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), {})
    duration = (
        video.get("duration")
        or data.get("format", {}).get("duration")
        or 0
    )
    return {
        "duration_s": round(float(duration), 2),
        "width": int(video.get("width") or 0),
        "height": int(video.get("height") or 0),
        "codec": video.get("codec_name", ""),
        "bit_rate": int(data.get("format", {}).get("bit_rate") or 0),
    }


def extract_frame(video: Path, at_seconds: float, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    make_writable(output)
    command = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        f"{max(at_seconds, 0):.3f}",
        "-i",
        str(video),
        "-frames:v",
        "1",
        "-q:v",
        "2",
        str(output),
    ]
    subprocess.run(command, check=True)


def make_writable(path: Path) -> None:
    if path.exists():
        os.chmod(path, 0o666)


def parse_classification_details(path: Path) -> dict[int, dict[str, str]]:
    details: dict[int, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| "):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) < 7 or not cells[0].isdigit():
            continue
        details[int(cells[0])] = {
            "base": cells[1],
            "type": cells[2],
            "category": cells[3],
            "location": cells[4],
            "description": cells[5],
            "confidence": cells[6],
        }
    return details


def data_targets() -> dict[int, Path]:
    targets: dict[int, Path] = {}
    for path in DATA_DIR.glob("*/*.mp4"):
        match = re.match(r"(\d+)_", path.name)
        if match:
            targets[int(match.group(1))] = path
    return targets


def selected_raw_files() -> list[Path]:
    cutoff_ts = CUTOFF.timestamp()
    files = [
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file()
        and path.name.lower().endswith("_raw.mp4")
        and path.stat().st_mtime >= cutoff_ts
    ]
    return sorted(files, key=lambda p: p.stat().st_mtime)


def backup_analysis_files() -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for name in ["manifest.csv", "manifest.json", "classification.md"]:
        src = ANALYSIS_DIR / name
        dst = BACKUP_DIR / name
        if src.exists() and not dst.exists():
            shutil.copy2(src, dst)


def write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def update_classification(report_table: str, summary: str) -> None:
    path = ANALYSIS_DIR / "classification.md"
    text = path.read_text(encoding="utf-8")
    marker = "## 2026-05-02 原始视频替换记录"
    if marker in text:
        text = text.split(marker, 1)[0].rstrip() + "\n\n"
    note = (
        "\n## 2026-05-02 原始视频替换记录\n\n"
        f"{summary}\n\n"
        "下表只列出本次 15:54:30（含）之后下载到的 `_raw.mp4`，描述沿用并复核原分类表中的空间内容说明。\n\n"
        "| 编号 | 分类 | 最可能地点 | 简单描述 | 替换状态 |\n"
        "|---:|---|---|---|---|\n"
        f"{report_table}\n"
    )
    path.write_text(text.rstrip() + "\n" + note, encoding="utf-8")


def main() -> None:
    backup_analysis_files()

    manifest_csv = ANALYSIS_DIR / "manifest.csv"
    manifest_json = ANALYSIS_DIR / "manifest.json"
    rows = list(csv.DictReader(manifest_csv.open(newline="", encoding="utf-8-sig")))
    manifest_items = json.loads(manifest_json.read_text(encoding="utf-8"))
    details = parse_classification_details(ANALYSIS_DIR / "classification.md")
    targets = data_targets()

    rows_by_base = {row["base"]: row for row in rows}
    json_by_base = {item["base"]: item for item in manifest_items}
    raw_files = selected_raw_files()
    raw_bases = {path.name[:-8] for path in raw_files}

    replacement_rows: list[dict[str, object]] = []
    table_lines: list[str] = []

    for raw in raw_files:
        base = raw.name[:-8]
        row = rows_by_base[base]
        index = int(row["index"])
        target = targets[index]
        cover = target.with_suffix(".jpg")
        info = ffprobe(raw)
        old_size = target.stat().st_size if target.exists() else 0

        make_writable(target)
        shutil.copy2(raw, target)

        duration = info["duration_s"]
        extract_frame(raw, duration * 0.5, cover)
        frame_paths = []
        for frame_idx, ratio in enumerate([0.25, 0.5, 0.75], start=1):
            frame = FRAMES_DIR / f"{index:02d}_{base}_f{frame_idx}.jpg"
            extract_frame(raw, duration * ratio, frame)
            frame_paths.append(str(frame))

        row["mp4"] = str(raw)
        row["duration_s"] = f"{duration:.2f}".rstrip("0").rstrip(".")

        item = json_by_base[base]
        item["mp4"] = str(raw)
        item["duration_s"] = duration
        item["frames"] = frame_paths

        detail = details.get(index, {})
        replacement_rows.append(
            {
                "index": index,
                "base": base,
                "category": detail.get("category", ""),
                "location": detail.get("location", ""),
                "description": detail.get("description", ""),
                "confidence": detail.get("confidence", ""),
                "source_raw": str(raw),
                "data_mp4": str(target),
                "data_cover": str(cover),
                "old_data_size_bytes": old_size,
                "raw_size_bytes": raw.stat().st_size,
                "duration_s": duration,
                "width": info["width"],
                "height": info["height"],
                "codec": info["codec"],
                "bit_rate": info["bit_rate"],
                "status": "已用原始视频替换 data 中同编号 mp4，并重抽封面与关键帧",
            }
        )
        table_lines.append(
            "| {index} | {category} | {location} | {description} | 已替换 |".format(
                index=index,
                category=detail.get("category", ""),
                location=detail.get("location", ""),
                description=detail.get("description", ""),
            )
        )

    video_bases = {row["base"] for row in rows if row.get("has_video") == "True"}
    missing_raw = sorted(
        video_bases - raw_bases,
        key=lambda base: int(rows_by_base[base]["index"]),
    )
    missing_rows = []
    for base in missing_raw:
        row = rows_by_base[base]
        index = int(row["index"])
        detail = details.get(index, {})
        missing_rows.append(
            {
                "index": index,
                "base": base,
                "category": detail.get("category", ""),
                "location": detail.get("location", ""),
                "description": detail.get("description", ""),
                "confidence": detail.get("confidence", ""),
                "status": "未找到 2026-05-02 15:54:30 之后的 _raw.mp4，data 保持原压缩版",
            }
        )

    write_csv(manifest_csv, rows, list(rows[0].keys()))
    manifest_json.write_text(
        json.dumps(manifest_items, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    replacement_fieldnames = [
        "index",
        "base",
        "category",
        "location",
        "description",
        "confidence",
        "source_raw",
        "data_mp4",
        "data_cover",
        "old_data_size_bytes",
        "raw_size_bytes",
        "duration_s",
        "width",
        "height",
        "codec",
        "bit_rate",
        "status",
    ]
    write_csv(
        ANALYSIS_DIR / "raw_replacement_manifest_20260502.csv",
        replacement_rows,
        replacement_fieldnames,
    )
    write_csv(
        ANALYSIS_DIR / "raw_missing_20260502.csv",
        missing_rows,
        ["index", "base", "category", "location", "description", "confidence", "status"],
    )

    non_video_after_cutoff = [
        path.name
        for path in SOURCE_DIR.iterdir()
        if path.is_file()
        and path.stat().st_mtime >= CUTOFF.timestamp()
        and not path.name.lower().endswith("_raw.mp4")
    ]

    summary = (
        f"- 本次识别并替换 `{len(replacement_rows)}` 个原始视频；"
        f"`{len(missing_rows)}` 个已有视频未找到对应 `_raw.mp4`，保持原状。\n"
        f"- 对已替换视频，`data/` 中同编号 `.mp4` 已换成原始文件，同名 `.jpg` 封面和 "
        "`field_trip_analysis/frames/` 关键帧已重新抽取。\n"
        f"- 15:54:30 之后另有非 `_raw.mp4` 文件："
        f"{', '.join(non_video_after_cutoff) if non_video_after_cutoff else '无'}。"
    )

    report_md = ANALYSIS_DIR / "raw_replacement_report_20260502.md"
    report_md.write_text(
        "# 2026-05-02 原始视频替换报告\n\n"
        f"来源目录：`{SOURCE_DIR}`\n\n"
        f"筛选时间：`{CUTOFF:%Y-%m-%d %H:%M:%S}`（含）之后修改的 `_raw.mp4`\n\n"
        f"{summary}\n\n"
        "## 已替换视频\n\n"
        "| 编号 | 分类 | 最可能地点 | 简单描述 | data 目标文件 |\n"
        "|---:|---|---|---|---|\n"
        + "\n".join(
            "| {index} | {category} | {location} | {description} | `{data_mp4}` |".format(
                **row
            )
            for row in replacement_rows
        )
        + "\n\n## 未找到 raw 的既有视频\n\n"
        "| 编号 | 分类 | 最可能地点 | 简单描述 | 状态 |\n"
        "|---:|---|---|---|---|\n"
        + "\n".join(
            "| {index} | {category} | {location} | {description} | {status} |".format(
                **row
            )
            for row in missing_rows
        )
        + "\n",
        encoding="utf-8",
    )

    update_classification("\n".join(table_lines), summary)

    print(
        json.dumps(
            {
                "replaced": len(replacement_rows),
                "missing_raw": len(missing_rows),
                "non_video_after_cutoff": non_video_after_cutoff,
                "report": str(report_md),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
