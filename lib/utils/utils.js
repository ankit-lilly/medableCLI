export function pickNestedProperties(data, pick) {
  const properties = pick.split(",").map((s) => s.trim());
  if (Array.isArray(data)) {
    return data.map((item) =>
      properties.reduce((acc, curr) => {
        const nestedKeys = curr.split(".");
        let value = { ...item };
        for (const key of nestedKeys) {
          if (value && value.hasOwnProperty(key)) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
        const lastKey = nestedKeys.at(-1);
        acc[lastKey] = value;
        return acc;
      }, {})
    );
  }

  const result = {};

  properties.forEach((prop) => {
    const nestedKeys = prop.split(".").map((s) => s.trim());
    let value = { ...data };

    for (const key of nestedKeys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }
    result[prop] = value;
  });

  return result;
}
