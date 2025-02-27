import { ProductError, ProductErrorType } from "../layout";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "error") {
    throw new ProductError(ProductErrorType.NOT_FOUND_ERROR, "ProductError");
  }

  return <h1>Product: {id}</h1>;
}
