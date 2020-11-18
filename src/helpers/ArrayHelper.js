
export default class ArrayHelper {
  static splitData(data, dir = 'even') {
    return data.filter((_, i) =>
      (dir === "even" && i % 2 === 0) || (dir === "odd" && i % 2 !== 0)
    );
  }
}
