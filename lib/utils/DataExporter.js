import { Parser as Json2csvParser } from 'json2csv';
import ExcelJS from 'exceljs';
import fs from 'fs';

class DataExporter {
  static async exportData(data, format) {
    switch (format.toLowerCase()) {
      case 'csv':
        await this.exportToCSV(data);
        break;
      case 'excel':
        await this.exportToExcel(data);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  static async exportToCSV(data) {
    const parser = new Json2csvParser();
    const csv = parser.parse(data);
    fs.writeFileSync('output.csv', csv);
    console.log('Data exported to output.csv');
  }

  static async exportToExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data');
    const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    sheet.columns = columns;
    sheet.addRows(data);
    await workbook.xlsx.writeFile('output.xlsx');
    console.log('Data exported to output.xlsx');
  }
}

export default DataExporter;
