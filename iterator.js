function iterate(obj) {
  let keys = Object.keys(obj);

  keys.forEach((key) => {
    let value = obj[key];

    if (['range', 'start', 'end', 'raw'].includes(key)) {
      delete obj[key];
    } else if (value.constructor === Object || value.constructor.name === 'Node') {
      iterate(value);
    } else if (value.constructor === Array) {
      value.forEach((vl) => {
        iterate(vl);
      });
    }
  });
}
