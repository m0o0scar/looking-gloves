const loadPyScript = () => {
  const url = '/external/pyscript/releases/2022.12.1/pyscript.min.js';
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  document.body.appendChild(script);
};

const injectPyConfig = () => {
  const config = {
    splashscreen: {
      autoclose: true,
    },
    packages: ['numpy', 'opencv-python', 'matplotlib'],
  };
  const tag = document.createElement('py-config');
  tag.setAttribute('type', 'json');
  tag.innerText = JSON.stringify(config);
  document.body.appendChild(tag);
};

const injectQuiltDetectorFn = () => {
  window.pyCreateObject = (object: any, variableName: string) => {
    // Bind a variable whose name is the string variableName to the object called 'object'
    const execString = `window.${variableName} = object`;
    console.log("Running '" + execString + "'");
    eval(execString);
  };

  window.pyOnReady = () => {
    console.log('Python is ready!');
    document.dispatchEvent(new Event('pyscriptready'));
  };

  const tag = document.createElement('py-script');
  tag.setAttribute('src', '/pyscripts/quiltDetector.py');
  document.body.appendChild(tag);
};

export const initPyScript = () => {
  if (typeof window === 'undefined') return;
  injectPyConfig();
  injectQuiltDetectorFn();
  loadPyScript();
};

export const isPyScriptReady = () => {
  return typeof window.pyodideGlobals !== 'undefined';
};

export const getQuiltColsRows = async (file: File) => {
  const [cols, rows] = await window.pyodideGlobals.get('getQuiltColsRows')(file);
  return { cols, rows };
};
