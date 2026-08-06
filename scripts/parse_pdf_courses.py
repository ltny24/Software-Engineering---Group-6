#!/usr/bin/env python3
"""
Parse CLC_DeCuongTomTat.pdf into structured JSON course data.

Usage: python3 scripts/parse_pdf_courses.py
Output: src/frontend/src/data/courses.json
"""

import subprocess
import json
import re
import os
import sys

PDF_PATH = os.path.join(os.path.dirname(__file__), '..', 'CLC_DeCuongTomTat.pdf')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'frontend', 'src', 'data', 'courses.json')

# Sections in order of appearance
SECTION_NAMES = [
    'Mô tả học phần',
    'Mục tiêu của học phần',
    'Nội dung học phần',
    'Tài nguyên học phần',
]

# Pattern that marks the start of a real course entry
COURSE_HEADER_RE = re.compile(
    r'\x0cĐẠI HỌC QUỐC GIA TP\. HỒ CHÍ MINH\n'
    r'TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN\n\n'
    r'CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM\n'
    r'Độc lập – Tự do – Hạnh phúc\n'
    r'_____o 0 o_____\n\n'
    r'ĐỀ CƯƠNG TÓM TẮT\n'
    r'(\S+)\s*[–-]\s*(.+?)\n'
)


def extract_text(pdf_path: str) -> str:
    """Extract text from PDF using pdftotext."""
    result = subprocess.run(
        ['pdftotext', pdf_path, '-'],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return result.stdout


def split_into_courses(text: str) -> list[dict]:
    """Split the full text into individual course sections with code and name."""
    courses = []
    matches = list(COURSE_HEADER_RE.finditer(text))

    for i, match in enumerate(matches):
        code = match.group(1).strip()
        name = match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()

        courses.append({
            'code': code,
            'name': name,
            'raw': content,
        })

    print(f"Found {len(courses)} course sections")
    return courses


def parse_info_block(text: str) -> dict:
    """Parse the 'Thông tin chung' block."""
    info = {}

    # Mã học phần (may appear twice, take the one after "Mã học phần")
    m = re.search(r'Mã học phần\s*:\s*(\S+)', text)
    if m:
        info['code'] = m.group(1)

    # English name (optional)
    m = re.search(r'Tên tiếng Anh\s*:\s*(.+?)(?:\n|$)', text)
    if m:
        info['englishName'] = m.group(1).strip()

    # Khối kiến thức
    m = re.search(r'Khối kiến thức:\s*(.+?)(?:\n|$)', text)
    if m:
        info['knowledgeBlock'] = m.group(1).strip()

    # Số tín chỉ
    m = re.search(r'Số tín chỉ:\s*(\d+)', text)
    if m:
        info['totalCredits'] = int(m.group(1))

    # Lý thuyết
    m = re.search(r'Lý thuyết\s*:\s*(\d+)', text)
    if m:
        info['theoryHours'] = int(m.group(1))

    # Thực hành
    m = re.search(r'Thực hành\s*:\s*(\d+)', text)
    if m:
        info['practiceHours'] = int(m.group(1))

    # Bài tập
    m = re.search(r'Bài tập\s*:\s*(\d+)', text)
    if m:
        info['exerciseHours'] = int(m.group(1))

    # Học phần học trước (everything until next field or end of info block)
    m = re.search(r'Học phần (học trước|tiên quyết)\s*:\s*(.+?)(?=\n(?:Mô tả|Mục tiêu|Nội dung|Tài nguyên|$))', text, re.DOTALL)
    if m:
        prereq = m.group(2).strip()
        if prereq and prereq.lower() not in ('không', 'không có', ''):
            info['prerequisites'] = prereq
        else:
            info['prerequisites'] = ''

    return info


def extract_section(text: str, section_name: str) -> str:
    """Extract a named section from course text. Returns content up to next section."""
    idx = text.find(section_name + '\n')
    if idx == -1:
        idx = text.find(section_name + ' \n')  # variation
    if idx == -1:
        return ''

    # Start after the section header
    start = idx + len(section_name) + 1

    # Find the next section header
    end = len(text)
    for next_sec in SECTION_NAMES:
        next_idx = text.find('\n' + next_sec + '\n', start)
        if next_idx == -1:
            next_idx = text.find('\n' + next_sec + ' \n', start)
        if next_idx != -1 and next_idx < end:
            end = next_idx

    content = text[start:end].strip()
    # Clean up artifacts
    content = re.sub(r'\n\d+\n\f?', '\n', content)  # page numbers
    content = re.sub(r'\f', '', content)  # form feeds

    return content


def parse_course(course: dict) -> dict | None:
    """Parse a single course's raw text into structured data."""
    try:
        text = course['raw']

        # Extract Thông tin chung block
        info_start = text.find('Thông tin chung\n')
        if info_start == -1:
            return None

        # Find where info block ends (first section after it)
        info_end = len(text)
        for sec in SECTION_NAMES:
            sec_idx = text.find(sec + '\n', info_start + 1)
            if sec_idx == -1:
                sec_idx = text.find(sec + ' \n', info_start + 1)
            if sec_idx != -1 and sec_idx < info_end:
                info_end = sec_idx

        info_text = text[info_start:info_end]
        info = parse_info_block(info_text)

        # Extract sections
        description = extract_section(text, 'Mô tả học phần')
        objectives = extract_section(text, 'Mục tiêu của học phần')
        content = extract_section(text, 'Nội dung học phần')
        resources = extract_section(text, 'Tài nguyên học phần')

        return {
            'code': info.get('code', course['code']),
            'name': course['name'],
            'englishName': info.get('englishName', ''),
            'knowledgeBlock': info.get('knowledgeBlock', ''),
            'totalCredits': info.get('totalCredits', 0),
            'theoryHours': info.get('theoryHours', 0),
            'practiceHours': info.get('practiceHours', 0),
            'exerciseHours': info.get('exerciseHours', 0),
            'prerequisites': info.get('prerequisites', ''),
            'description': description,
            'objectives': objectives,
            'content': content,
            'resources': resources,
        }
    except Exception as e:
        print(f"Error parsing course {course.get('code', '?')}: {e}", file=sys.stderr)
        return None


def main():
    print(f"Extracting text from {PDF_PATH}...")
    text = extract_text(PDF_PATH)
    print(f"Extracted {len(text)} characters")

    print("Splitting into course sections...")
    raw_courses = split_into_courses(text)

    print("Parsing individual courses...")
    courses = []
    skipped = 0
    for i, rc in enumerate(raw_courses):
        course = parse_course(rc)
        if course:
            courses.append(course)
        else:
            skipped += 1
        if (i + 1) % 20 == 0:
            print(f"  Progress: {i + 1}/{len(raw_courses)}")

    print(f"Successfully parsed {len(courses)} courses ({skipped} skipped)")

    # Sort by code
    courses.sort(key=lambda c: c['code'])

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)

    file_size = os.path.getsize(OUTPUT_PATH)
    print(f"Written to {OUTPUT_PATH} ({file_size:,} bytes)")

    # Print summary table
    print(f"\n{'Code':<12} {'Cr':>3} {'Name':<55} {'Prereq'}")
    print("-" * 110)
    for c in courses:
        prereq = c.get('prerequisites', '')
        if len(prereq) > 40:
            prereq = prereq[:37] + '...'
        print(f"  {c['code']:<10} {c['totalCredits']:>3} {c['name']:<55} {prereq}")


if __name__ == '__main__':
    main()
