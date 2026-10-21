const fs = require('fs');
const list = JSON.parse(fs.readFileSync('scripts/targeted_for_cure.json', 'utf8'));
list.forEach(i => {
  console.log(`ID ${i.id} (P${i.page}): AR='${i.ar}' | BN='${i.bn}'`);
});
