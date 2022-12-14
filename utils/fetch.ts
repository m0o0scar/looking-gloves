export const fetchWithProgress = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  onProgress?: (received: number, total: number) => void
) => {
  const response = await fetch(input, init);

  const reader = response.body!.getReader();
  const contentLength = +response.headers.get('Content-Length')! || 0;

  let receivedLength = 0;
  let chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;
    onProgress?.(receivedLength, contentLength);
  }

  onProgress?.(contentLength, contentLength);
  return new Blob(chunks);
};
