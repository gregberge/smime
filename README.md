# smime
[![Build Status](https://travis-ci.org/hipush/smime.svg?branch=master)](https://travis-ci.org/hipush/smime)
[![Dependency Status](https://david-dm.org/hipush/smime.svg?theme=shields.io)](https://david-dm.org/hipush/smime)
[![devDependency Status](https://david-dm.org/hipush/smime/dev-status.svg?theme=shields.io)](https://david-dm.org/hipush/smime#info=devDependencies)

Node / io.js wrapper for OpenSSL S/MIME command.

## Install

```
npm install smime
```

## Usage

```js
var smime = require('smime');

smime.sign({
  content: fs.createReadStream('/path/to/file/to/sign'),
  key: '/path/to/key.pem',
  cert: '/path/to/cert.pem'
}).then(function (res) {
  console.log(res); // {pem, der, stdout, stderr, child}
});
```

## smime.sign(options, [cb])

Sign a content using smime.

**Options:**

```
@param {object} options Options
@param {stream.Readable} content Content stream
@param {string} key Key path
@param {string} cert Cert path
@param {function} [cb] Optional callback
```

**Result:**

```
@returns {object} result Result
@returns {string} result.pem Pem signature
@returns {string} result.der Der signature
@returns {string} result.stdout Strict stdout
@returns {string} result.stderr Strict stderr
@returns {ChildProcess} result.child Child process
```

## License

MIT
