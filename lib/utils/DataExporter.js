import { Parser as Json2csvParser } from 'json2csv';
import ExcelJS from 'exceljs';
import fs from 'fs';

class DataExporter {
  static async exportData(data, format, outputFile = 'output') {
    switch (format.toLowerCase()) {
      case 'csv':
        await this.exportToCSV(data, outputFile);
        break;
      case 'excel':
        await this.exportToExcel(data, outputFile);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  static async exportToCSV(data, outputFile) {
    const outputFileName = `${outputFile}.csv`;
    const parser = new Json2csvParser();
    const csv = parser.parse(data);
    fs.writeFileSync(`${outputFile}.csv`, csv);
    console.log(`Saved to the results to ${outputFileName}`);
  }

  static async exportToExcel(data, outputFile) {
    const outputFileName = `${outputFile}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data');
    const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    sheet.columns = columns;
    sheet.addRows(data);
    await workbook.xlsx.writeFile(outputFileName);
    console.log(`Saved to the results to ${outputFileName}`);
  }
}

export default DataExporter;
