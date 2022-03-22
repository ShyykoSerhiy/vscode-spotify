export declare global {
  interface Window {
    vscode: {
      postMessage: (x: any) => void;
      setState: ({}: any) => void;
      getState: () => void;
    };
  }
}
declare module "*.png" {
  const value: any;
  export = value;
}
