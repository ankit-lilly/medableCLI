import Excel from 'exceljs';

class Sheet {
  constructor(name) {
    this.name = name;
    const workbook = new Excel.Workbook();

    const sheet = workbook.addWorksheet('Data', {
      showGridLines: false,
      pageSetup: { paperSize: 9, orientation: 'landscape' },
      properties: {
        defaultRowHeight: 20,
        columnCount: 5,
        actualColumnCount: 5,
        defaultColWidth: 30,
      },
    });

    this.workbook = workbook;
    this.sheet = sheet;
    this.columns = [];
  }

  _capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  addColumns({
    name,
    style = {
      alignment: { vertical: 'middle' },
    },
  }) {
    this.columns.push({
      header: name,
      key: name,
      style,
    });
    return this;
  }

  addHeader(columns) {
    this.sheet.columns = columns;
    this.sheet.getRow(1).font = {
      size: 14,
      bold: true,
    };

    this.sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      fgColor: { argb: 'cccccc' },
    };

    return this;
  }

  addRow(row) {
    this.sheet.addRow(row);
    return this;
  }

  async save() {
    await this.workbook.xlsx.writeFile(this.name);
  }

  async writeToExcel(records) {
    this.addHeader(
      Object.keys(records?.[0]).map((s) => ({
        name: s,
        key: s,
        header: s
          ?.split('_')
          ?.map((s) => this._capitalize(s))
          ?.join(' '),
      })),
    );

    records.forEach((s) => this.addRow(s));

    await this.save();
    return this.name;
  }
}

export default Sheet;
