const LATEST_API_VERSION = "0.2.0";
var apiVersions = {};
apiVersions["0.2.0"] = {
  VERSION: "0.2.0",
  getViewLink: function(pageData) {
    var urlData = {
      version: this.VERSION,
      compressed: false,
      body: pageData,
    };
    const hashObject = b64.encode(JSON.stringify(urlData));
    return `#${hashObject}`;
  },
  decode: function(urlData) {
    return urlData.body;
  },
}
apiVersions["0.0.1"] = {
  VERSION: "0.0.1",
  getViewLink: function(pageData) {
    return `#${b64.encode(pageData)}`;
  },
}

var b64 = (function() {

  function generateIndexDict(a) {
    let result = {}
    for (let i = 0; i < a.length; i++) {
      result[a[i]] = i;
    }
    return result;
  }

  const _a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const _aRev = generateIndexDict(_a);
  _aRev["-"] = _aRev["+"];
  _aRev["_"] = _aRev["/"];

  const _enc = new TextEncoder("utf-8");
  const _dec = new TextDecoder("utf-8");

  return {

    decode: function(s) {
      return this.binaryToAscii(this.base64ToBinary(s));
    },

    encode: function(s) {
      return this.binaryToBase64(this.asciiToBinary(s));
    },

    asciiToBinary: function(text) {
      return _enc.encode(text);
    },


    binaryToAscii: function(binary) {
      return _dec.decode(binary);
    },


    binaryToBase64: function(originalBytes) {
      let length = originalBytes.length;
      let added = (length % 3 == 0) ? 0 : (3 - length % 3);
      let bytes = new Uint8Array(length + added);
      bytes.set(originalBytes);

      let output = ""
      for (let i = 0; i < bytes.length; i += 3) {
        output += _a[ bytes[i] >>> 2 ];
        output += _a[ ((bytes[i] & 0x3) << 4) | (bytes[i + 1] >>> 4) ];
        output += _a[ ((bytes[i + 1] & 0xF) << 2) | (bytes[i + 2] >>> 6) ];
        output += _a[ bytes[i + 2] & 0x3F ];
      }

      if (added > 0) {
        output = output.slice(0, -added) + ("=".repeat(added));
      }

      return output;
    },


    base64ToBinary: function(s) {
      let bytes = []

      if (s.length % 4 == 1) {
        throw "Invalid base64 input";
      } else if (s.length % 4 != 0) {
        s += "=".repeat(4 - (s.length % 4));
      }

      for (let i = 0; i <= (s.length - 4); i += 4) {
        for (let j = 0; j < 4; j++) {
          if (s[i + j] != "=" && !(s[i + j] in _aRev)) {
            throw "Invalid base64 input";
          } else if (s[i + j] == "=" && Math.abs(s.length - (i + j)) > 2) {
            throw "Invalid base64 input";
          }
        }

        bytes.push((_aRev[s[i]] << 2) | (_aRev[s[i + 1]] >>> 4));
        if (s[i + 2] != "=") {
          bytes.push(((_aRev[s[i + 1]] & 0xF) << 4) | (_aRev[s[i + 2]] >>> 2));
        }
        if (s[i + 3] != "=") {
          bytes.push(((_aRev[s[i + 2]] & 0x3) << 6) | _aRev[s[i + 3]]);
        }
      }
      return new Uint8Array(bytes);
    }
  }
})();
