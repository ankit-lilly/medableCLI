import vm from "node:vm";

export default class Transform {
  static createTransformFunction(data, operation, code, initialValue) {
    const script = new vm.Script(
      `(data) => data.${operation}(${code}${
        initialValue ? `, ${initialValue}` : ""
      })`,
    );
    const context = new vm.createContext({ data });
    return script.runInContext(context);
  }

  static filter(data, code) {
    const filterFunction = this.createTransformFunction(data, "filter", code);
    return filterFunction(data);
  }

  //  static map(data, code) {
  //    const script = new vm.Script(`(data) => data.map(${code})`);
  //    const context = new vm.createContext({ data });
  //    const mapFunction = script.runInContext(context);
  //    return mapFunction(data);
  //  }

  static map(data, code) {
    const mapFunction = this.createTransformFunction(data, "map", code);
    return mapFunction(data);
  }

  static reduce(data, code, initialValue) {
    const reduceFunction = this.createTransformFunction(
      data,
      "reduce",
      code,
      initialValue,
    );
    return reduceFunction(data);
  }

  static find(data, code) {
    const findFunction = this.createTransformFunction(data, "find", code);
    return findFunction(data);
  }
}
