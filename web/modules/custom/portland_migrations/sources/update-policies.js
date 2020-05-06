const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var columns = ['CATEGORY_NAME','CONTENT_ID','CONTENT_NAME','DEPTH','EXPIRE_DATE','LAST_UPDATED_DATE','PUBLISH_DATE','STATUS','SUMMARY_TEXT','POLICY_NUMBER','alphanumeric_order','TEXT','URL']
var _headers = []
columns.forEach(column => {
  _headers.push({
    id: column,
    title: column,
  })
})

var policies = []
// CATEGORY_NAME,CONTENT_ID,CONTENT_NAME,DEPTH,EXPIRE_DATE,LAST_UPDATED_DATE,PUBLISH_DATE,STATUS,SUMMARY_TEXT,POLICY_NUMBER,alphanumeric_order,TEXT,URL
fs.createReadStream('policies.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Clean up row['TEXT']
    // if(row['TEXT'].indexOf(' style="padding-left:"') >= 0) {
      row['TEXT'] = row['TEXT'].replace(/ style=\"padding-left: 30px;\"/gi, ' class="ml-1"')
      .replace(/ style=\"padding-left: 60px;\"/gi, ' class="ml-2"')
      .replace(/ style=\"padding-left: 90px;\"/gi, ' class="ml-3"')
      .replace(/ style=\"padding-left: 120px;\"/gi, ' class="ml-4"')
      .replace(/ style=\"padding-left: 150px;\"/gi, ' class="ml-5"')


      row['TEXT'] = row['TEXT'].replace(/ style=\"padding-left: 30px\"/gi, ' class="ml-1"')
      .replace(/ style=\"padding-left: 60px\"/gi, ' class="ml-2"')
      .replace(/ style=\"padding-left: 90px\"/gi, ' class="ml-3"')
      .replace(/ style=\"padding-left: 120px\"/gi, ' class="ml-4"')
      .replace(/ style=\"padding-left: 150px\"/gi, ' class="ml-5"')

      row['TEXT'] = row['TEXT'].replace(/ style=\"padding-left: 120px; text-align: left;\"/gi, ' class="ml-4"')

      row['TEXT'] = row['TEXT'].replace(/<table/gi, '<div class="table-responsive"><table class="table table-bordered table-hover"')
      row['TEXT'] = row['TEXT'].replace(/<\/table>/gi, '</table></div>')

      policies.push(row)

    // }
  })
  .on('end', () => {
    const csvWriter = createCsvWriter({
      path: 'out_policies.csv',
      header: _headers
    });
    csvWriter.writeRecords(policies)
      .then(() => console.log('The CSV file was written successfully'));
  });
