export const convertToFormData = (values: any) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("description", values.description);

  if (values.image instanceof File) {
    formData.append("image", values.image);
  }
  const containsValue = Array.isArray(values.variants);
  const variants = [...values.variants];

  values.variants.forEach((variant: any, index: any) => {
    formData.append(`variants[${index}][name]`, variant.name);
    formData.append(`variants[${index}][price]`, variant.price.toString());
    formData.append(`variants[${index}][license]`, variant.license);
  });
  return formData;
};
