declare interface IResponse {
  code: number
  data?: any
  message: string
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
