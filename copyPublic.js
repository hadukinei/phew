import fs from 'fs';

fs.cpSync('public', 'dist/public', {recursive: true});
