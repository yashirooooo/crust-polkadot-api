"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFile = writeFile;
exports.readTemplate = readTemplate;

var _fs = _interopRequireDefault(require("fs"));

// Copyright 2017-2020 @polkadot/typegen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function writeFile(dest, generator, noLog) {
  !noLog && console.log(`${dest}\n\tGenerating`);
  let generated = generator();

  while (generated.includes('\n\n\n')) {
    generated = generated.replace(/\n\n\n/g, '\n\n');
  }

  !noLog && console.log('\tWriting');

  _fs.default.writeFileSync(dest, generated, {
    flag: 'w'
  });

  !noLog && console.log('');
}

function readTemplate(path) {
  return _fs.default.readFileSync(`${__dirname}/../templates/${path}.hbs`).toString();
}