import { drawBlobToCanvas } from './canvas';

interface EndpointResponse {
  data: string[];
  duration: number;
}

export const convertPhotoToRGBD = async (file: File | Blob) => {
  // draw the image file onto canvas
  const canvas = await drawBlobToCanvas(file);

  // convert canvas to base64 encoded string
  const base64 = canvas.toDataURL('image/jpeg', 0.9);

  const endpoint = 'https://moscartong-lookingglassrgbd.hf.space/run/predict';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [base64],
    }),
  });

  const json = (await response.json()) as EndpointResponse;
  return json.data[0] as string;
};
