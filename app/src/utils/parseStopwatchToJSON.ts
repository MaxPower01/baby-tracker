export function parseStopwatchToJSON(stopwatch: any): object {
  try {
    if (stopwatch == null) {
      return {};
    }
    const properties = Object.getOwnPropertyNames(stopwatch);
    const result = {} as any;
    for (const property of properties) {
      if (stopwatch[property] instanceof Date) {
        result[property] = (stopwatch[property] as Date).toISOString();
        continue;
      }
      result[property] = stopwatch[property];
    }
    return result;
  } catch (error) {
    console.error("StopwatchHelper: Failed to parse data: ", error);
    return {};
  }
}
