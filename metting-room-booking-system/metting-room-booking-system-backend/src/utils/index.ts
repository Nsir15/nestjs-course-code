import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * 使用MD5算法对字符串进行哈希处理
 *
 * @param str 需要进行哈希处理的字符串
 * @returns 返回字符串的MD5哈希值，以十六进制字符串表示
 */
export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

/**
 * 创建一个解析整数的管道函数
 *
 * @param key 指定的键名
 * @returns 返回一个新的 ParseIntPipe 实例
 */
export const generateParseIntPipe = (key: string) => {
  return new ParseIntPipe({
    exceptionFactory: () => {
      throw new BadRequestException(`${key}必须是数字`);
    },
  });
};
