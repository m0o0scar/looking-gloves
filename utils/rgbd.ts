function imageFileToBase64(file: File) {
  return new Promise<string>((resolve, error) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => error(e);
    reader.readAsDataURL(file);
  });
}

interface EndpointResponse {
  data: string[];
  duration: number;
}

export const convertPhotoToRGBD = async (file: File) => {
  // convert image file into base64 encoded string
  const base64 = await imageFileToBase64(file);

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
