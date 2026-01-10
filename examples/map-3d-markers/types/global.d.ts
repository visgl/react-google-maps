export declare global {
  // const or let does not work in this case, it has to be var
  // eslint-disable-next-line no-var
  var GOOGLE_MAPS_API_KEY: string | undefined;
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var process: any;
}
