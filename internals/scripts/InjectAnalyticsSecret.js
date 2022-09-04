const fs = require('fs');
const path = require('path');

const analyticsFilePath = path.join(
  __dirname,
  '..',
  '..',
  'app',
  'services',
  'analytics-token.ts'
);

console.log('analyticsPath', analyticsFilePath);

fs.writeFileSync(
  analyticsFilePath,
  `export const analyticsApiSecret = '${process.env.ANALYTICS_API_SECRET}';`
);
