exports.brandNameHandler = str =>
  str.replace(/[^a-zA-Z0-9\s-]+/g, '').toLowerCase();
