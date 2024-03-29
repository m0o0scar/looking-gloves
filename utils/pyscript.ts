const loadPyScript = () => {
  const url = '/external/pyscript/releases/2022.12.1/pyscript.min.js';
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  document.body.appendChild(script);
};

const pyReadyCallback = () => {
  console.log('Python is ready!');
  document.dispatchEvent(new Event('pyscriptready'));
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

  window.pyOnReady = pyReadyCallback;

  const tag = document.createElement('py-script');
  tag.setAttribute('src', '/pyscripts/quiltDetector.py');
  document.body.appendChild(tag);
};

let inited = false;

export const initPyScript = () => {
  if (typeof window === 'undefined') return;

  if (inited) {
    pyReadyCallback();
  } else {
    inited = true;
    injectPyConfig();
    injectQuiltDetectorFn();
    loadPyScript();
  }
};

export const isPyScriptReady = () => {
  return typeof window.pyodideGlobals !== 'undefined';
};

export const getQuiltColsRows = async (img: HTMLImageElement) => {
  const [cols, rows] = await window.pyodideGlobals.get('getQuiltColsRows')(img);
  return { cols, rows };
};
