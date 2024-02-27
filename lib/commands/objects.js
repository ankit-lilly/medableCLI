import MedableClient from '../MedableClient.js';

import Transformer from '../utils/Transformer.js';
import { pickNestedProperties } from '../utils/utils.js';
import handleError from '../utils/errorHandler.js';
import DataExporter from '../utils/DataExporter.js';

export function setupObjectCommand(program) {
  program
    .command('get [object]')
    .option('-l, --limit <number>')
    .option('-s, --skip <number>')
    .option('-w, --where <jsonString>', 'Specify the filter conditions as a JSON string')
    .option('-e, --expand <string>', 'Comma separated list of fields to expand')
    .option('-i, --include <string>', 'Common separated list of fields to include')
    .option('-p, --paths <string>', 'Comma separated list of paths to include')
    .option('-m, --map <string>', 'Map function')
    .option('--pick <string>', 'list of properties to pick')
    .option('-f, --filter <string>', 'Filter function')
    .option('--find <string>', 'Find function')
    .option('--all', 'Get all objects')
    .option('--export <format>', 'Export results to file. Formats: csv, excel')
    .option('--file <filename>', 'Name of the file where the output will be saved')
    .action((opts, cmd) => {
      const {
        limit,
        skip,
        where,
        expand,
        include,
        paths,
        map,
        filter,
        find,
        pick,
        export: exportFormat,
        file: outputFile,
      } = cmd;
      const client = MedableClient.getClient();
      client
        .getObject(opts, { params: { limit, where, skip, expand, include, paths } })
        .then((res) => {
          let data = res.data;

          if (filter) {
            data = Transformer.filter(data, filter);
          }
          if (find) {
            data = Transformer.find(data, find);
          }

          if (map) {
            data = Transformer.map(data, map);
          }

          if (pick) {
            data = pickNestedProperties(data, pick);
          }

          if (exportFormat) {
            return DataExporter.exportData(data, exportFormat, outputFile).catch(handleError);
          }
          return data;
        })
        .then(JSON.stringify)
        .then(console.log)
        .catch(handleError);
    });

  program
    .command('post [object]')
    .requiredOption('-b, --body', 'Body to post')
    .action((opts) => {
      console.log('Options', opts);
      // call post function
    });
}
