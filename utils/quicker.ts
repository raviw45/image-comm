export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const getAspectRatioClass = (type: string) => {
  switch (type) {
    case "SQUARE":
      return "aspect-[1/1]";
    case "PORTRAIT":
      return "aspect-[3/4]";
    case "WIDE":
      return "aspect-[16/9]";
    default:
      return "aspect-[4/3]";
  }
};
