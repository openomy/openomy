/* eslint-disable @typescript-eslint/no-explicit-any */

export const isObjectType = (value: unknown): value is object =>
  typeof value === "object";

export function flatten(obj: Record<string, any>) {
  const output: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    if (isObjectType(obj[key]) && obj[key] !== null) {
      const nested = flatten(obj[key]);

      for (const nestedKey of Object.keys(nested)) {
        output[`${key}.${nestedKey}`] = nested[nestedKey];
      }
    } else {
      output[key] = obj[key];
    }
  }

  return output;
}

export function unflatten(flatObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(flatObj).forEach((flatKey) => {
    const value = flatObj[flatKey];
    const keys = flatKey.split(".");

    let current = result;

    // 遍历路径中的每个键，除了最后一个
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      // 如果当前路径不存在，则创建新对象
      if (!(key in current)) {
        current[key] = {};
      }

      // 移动到下一级
      current = current[key];
    }

    // 设置最后一个键的值
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  });

  return result;
}
