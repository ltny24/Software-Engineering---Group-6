package com.myus.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PushbackInputStream;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Reads a bulk-import file (CSV or XLSX) into a header list plus a list of
 * header-to-value maps.
 *
 * <p>Supports the UC-11a requirement of accepting both {@code .csv} and
 * {@code .xlsx} files. The first row is treated as the header; each subsequent
 * row is returned as a {@link LinkedHashMap} keyed by the (trimmed) header
 * label. Empty rows are skipped.</p>
 */
public final class ImportFileReader {

    private ImportFileReader() {
    }

    /**
     * A parsed import file: its ordered headers and its data rows.
     */
    public record ParsedFile(List<String> headers, List<Map<String, String>> rows) {
    }

    /**
     * Read a CSV or XLSX file into header-to-value maps.
     *
     * @param file the uploaded file
     * @return the parsed headers and rows
     * @throws IOException if the file cannot be read
     */
    public static ParsedFile read(MultipartFile file) throws IOException {
        String name = file.getOriginalFilename();
        if (name != null && name.toLowerCase().endsWith(".xlsx")) {
            return readXlsx(file);
        }
        return readCsv(file);
    }

    private static ParsedFile readCsv(MultipartFile file) throws IOException {
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreEmptyLines(true)
                .setTrim(true)
                .build();

        try (Reader reader = bomStrippingReader(file.getInputStream());
             CSVParser parser = format.parse(reader)) {

            Map<String, Integer> headerMap = parser.getHeaderMap();
            List<String> headers = new ArrayList<>(headerMap.keySet());
            List<Map<String, String>> rows = new ArrayList<>();

            for (CSVRecord record : parser) {
                Map<String, String> row = new LinkedHashMap<>();
                for (String header : headers) {
                    Integer index = headerMap.get(header);
                    String value = (index != null && index < record.size()) ? record.get(index) : null;
                    row.put(header, value);
                }
                rows.add(row);
            }
            return new ParsedFile(headers, rows);
        }
    }

    private static ParsedFile readXlsx(MultipartFile file) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> iterator = sheet.rowIterator();
            if (!iterator.hasNext()) {
                return new ParsedFile(List.of(), List.of());
            }

            Row headerRow = iterator.next();
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cellString(cell).trim());
            }

            List<Map<String, String>> rows = new ArrayList<>();
            while (iterator.hasNext()) {
                Row row = iterator.next();
                Map<String, String> map = new LinkedHashMap<>();
                boolean hasValue = false;
                for (int i = 0; i < headers.size(); i++) {
                    String header = headers.get(i);
                    if (header == null || header.isEmpty()) {
                        continue;
                    }
                    String value = i < row.getLastCellNum() ? cellString(row.getCell(i)).trim() : null;
                    map.put(header, value);
                    if (value != null && !value.isEmpty()) {
                        hasValue = true;
                    }
                }
                if (hasValue) {
                    rows.add(map);
                }
            }
            return new ParsedFile(headers, rows);
        }
    }

    /**
     * Wraps the raw CSV stream in a reader that strips a leading UTF-8 BOM.
     * Excel's "CSV UTF-8" export prepends {@code EF BB BF}; if it is left on the
     * first header cell it becomes {@code ﻿username} and the required-column
     * lookup fails even though the file is otherwise correct.
     */
    private static Reader bomStrippingReader(InputStream in) throws IOException {
        PushbackInputStream pushback = new PushbackInputStream(in, 3);
        byte[] bom = new byte[3];
        int read = pushback.read(bom, 0, 3);
        if (!(read == 3 && (bom[0] == (byte) 0xEF && bom[1] == (byte) 0xBB && bom[2] == (byte) 0xBF))) {
            if (read > 0) {
                pushback.unread(bom, 0, read);
            }
        }
        return new InputStreamReader(pushback, StandardCharsets.UTF_8);
    }

    private static String cellString(Cell cell) {
        if (cell == null) {
            return "";
        }
        // Excel stores dates as numbers; DataFormatter would render them using the
        // cell's display format (e.g. "2/2/05"), which fails the yyyy-MM-dd check.
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            try {
                return cell.getLocalDateTimeCellValue().toLocalDate().toString();
            } catch (RuntimeException ignored) {
                // fall through to DataFormatter for non-date numeric cells
            }
        }
        return new DataFormatter().formatCellValue(cell);
    }
}
