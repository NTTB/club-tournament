export interface Route {
  path: string | RegExp | ((v: string) => boolean),
  component: any;
}