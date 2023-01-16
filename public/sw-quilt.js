const addResourcesToCache = async (urls) => {
  const cache = await caches.open('quilt-v1');
  await cache.addAll(urls);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  return fetch(request);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/external/pyscript/releases/2022.12.1/pyscript.min.js',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide_py.tar',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.asm.js',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.asm.data',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.asm.wasm',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/repodata.json',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/micropip-0.1-py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyparsing-3.0.9-py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/packaging-21.3-py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/distutils.tar',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/numpy-1.22.4-cp310-cp310-emscripten_3_1_14_wasm32.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/opencv_python-4.6.0.66-cp310-cp310-emscripten_3_1_14_wasm32.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/matplotlib-3.5.2-cp310-cp310-emscripten_3_1_14_wasm32.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/cycler-0.11.0-py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/six-1.16.0-py2.py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/fonttools-4.33.3-py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/kiwisolver-1.4.3-cp310-cp310-emscripten_3_1_14_wasm32.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/PIL-9.1.1-cp310-cp310-emscripten_3_1_14_wasm32.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/python_dateutil-2.8.2-py2.py3-none-any.whl',
      'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pytz-2022.1-py2.py3-none-any.whl',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});
