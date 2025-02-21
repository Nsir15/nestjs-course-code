/**
 * Trae AI
这两种导出方式有重要的区别：

export * from './utils/storage':
会重新导出模块中的所有命名导出
不会重新导出默认导出（default export）
如果源文件使用 export const xxx 这样的命名导出，这种方式可以直接转发所有命名导出
export { default as Storage } from './utils/storage':
专门用于重新导出默认导出
将源文件的默认导出重命名为 Storage 并作为命名导出
适用于源文件使用 export default xxx 的情况
在你的例子中，因为 Storage 是使用 export default Storage 导出的，所以应该使用第二种方式：
 */
export { default as Storage } from './utils/Storage'
export { default as request } from './request/request'
export * from './components'
export * from './request/wrapRequest'
