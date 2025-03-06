"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Germania_One } from "next/font/google";
import { Textarea } from "../ui/textarea";
import { ImageVariantType, ProductFormData } from "@/types/product.types";
import { productSchema } from "@/schema/product.schema";
import { useAddProduct } from "@/features/useProduct";
import Spinner from "../Spinner";

const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});

const ProductForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string>("");

  const { addProduct, addProductPending } = useAddProduct();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 20.5,
          license: "personal",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (values: ProductFormData) => {
    addProduct(values, {
      onSuccess: () => {
        form.reset();
        setImagePreview("");
      },
    });
  };

  return (
    <div className="full mx-auto md:p-6 p-2 space-y-4 bg-white">
      <h2
        className={`md:text-[38px] text-center text-[30px] text-[#d64e9d] font-bold ${germania.className}`}
      >
        Add New Product
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter product name"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter description"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="border p-2 rounded w-full"
                  />
                </FormControl>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 mt-3 rounded-md border"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Variants */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap gap-4 p-4 border rounded-lg bg-white shadow-sm"
              >
                {/* Variant Type */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SQUARE">Square (1:1)</SelectItem>
                            <SelectItem value="WIDE">
                              Widescreen (16:9)
                            </SelectItem>
                            <SelectItem value="PORTRAIT">
                              Portrait (3:4)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter price"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* License */}
                <FormField
                  control={form.control}
                  name={`variants.${index}.license`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>License</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select License" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="commercial">
                              Commercial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Variant Button */}
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="destructive"
                  className="self-end"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Add Variant Button */}
          <Button
            type="button"
            onClick={() =>
              append({ type: "SQUARE", price: 0, license: "personal" })
            }
          >
            Add Variant
          </Button>

          {/* Submit Button */}
          <div className="w-full flex justify-center">
            <Button type="submit" className="mt-4">
              {addProductPending ? <Spinner /> : "Submit Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
