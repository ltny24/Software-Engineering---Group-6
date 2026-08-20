package com.myus.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
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

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
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

    private static String cellString(Cell cell) {
        if (cell == null) {
            return "";
        }
        return new DataFormatter().formatCellValue(cell);
    }
}
