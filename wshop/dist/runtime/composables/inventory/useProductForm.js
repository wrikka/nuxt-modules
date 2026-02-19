import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a positive integer")
});
export const useProductForm = (product) => {
  const { $toast } = useNuxtApp();
  const router = useRouter();
  const isEditMode = !!product;
  const validationSchema = toTypedSchema(ProductFormSchema);
  const { handleSubmit, defineField, errors, isSubmitting } = useForm({
    validationSchema,
    initialValues: {
      name: product?.name ?? "",
      price: product?.price ? parseFloat(product.price) : 0,
      stock: product?.variants?.[0]?.stock ?? 0
    }
  });
  const [name, nameAttrs] = defineField("name");
  const [price, priceAttrs] = defineField("price");
  const [stock, stockAttrs] = defineField("stock");
  const onSubmit = handleSubmit(async (values) => {
    try {
      const submissionData = {
        ...values,
        price: values.price.toString()
        // Convert price back to string for the API
      };
      if (isEditMode && product) {
        await $fetch(`/api/products/${product.id}`, {
          method: "GET",
          body: JSON.stringify(submissionData),
          headers: { "Content-Type": "application/json" }
        });
        $toast.success("Product updated successfully");
      } else {
        await $fetch("/api/products", {
          method: "POST",
          body: JSON.stringify({ ...submissionData, status: "active" }),
          headers: { "Content-Type": "application/json" }
        });
        $toast.success("Product added successfully");
      }
      await router.push("/admin/products");
    } catch (error) {
      const message = isEditMode ? "Failed to update product" : "Failed to add product";
      $toast.error(message);
      console.error(message, error);
    }
  });
  return {
    name,
    nameAttrs,
    price,
    priceAttrs,
    stock,
    stockAttrs,
    errors,
    isSubmitting,
    onSubmit
  };
};
