export {};

declare global {
  interface Window {
    pyCreateObject: (object: any, variableName: string) => void;
    pyOnReady: () => void;
    pyodideGlobals: any;
  }
}
