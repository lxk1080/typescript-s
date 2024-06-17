/* eslint-disable */

declare interface Window {
  test: number
}

declare module 'someModule' {
  function fn (a: number): void {}
  export { fn }
}
