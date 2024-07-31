"use client";
import { useEffect, useState } from "react";

interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
}

class Product implements IProduct {
  name = "";
  description = "";
  price = 0;
}

export default function Home() {
  const [formProduct, setFormProduct] = useState<IProduct>(new Product());
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => getProducts(), []);

  const createProduct = () => {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formProduct),
    })
      .then(() => setFormProduct(new Product()))
      .then(getProducts);
  };

  const getProducts = () => {
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products`)
      .then((res) => res.json())
      .then((products: IProduct[]) =>
        products.toSorted((a: any, b: any) => a.id - b.id)
      )
      .then(setProducts);
  };

  const updateProduct = () =>
    fetch(
      `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/${formProduct.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formProduct),
      }
    )
      .then(() => setFormProduct(new Product()))
      .then(getProducts);

  const deleteProduct = (id: number | undefined) =>
    fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/${id}`, {
      method: "DELETE",
    }).then(getProducts);

  const renderProducts = () => (
    <div className="flex flex-col gap-2 overflow-y-auto px-5 scrollbar">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 bg-zinc-800 p-2 rounded-md"
        >
          <div>{product.id}</div>
          <div className="flex-1">{product.name}</div>
          <div>$ {product.price.toFixed(2)}</div>
          <div className="flex gap-2">
            <button
              onClick={async () => setFormProduct({ ...product })}
              className="bg-green-500 p-2 rounded-md"
            >
              Update
            </button>
            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 p-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderForm = () => (
    <div className="flex gap-5 items-end mt-5">
      {formProduct.id && (
        <div className="flex flex-col">
          <label htmlFor="id">Product ID</label>
          <input
            id="id"
            type="button"
            disabled
            value={formProduct.id}
            className="py-2"
          />
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formProduct.name}
          onChange={(e) =>
            setFormProduct({ ...formProduct, name: e.target.value })
          }
          className="bg-zinc-700 p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={formProduct.description}
          onChange={(e) =>
            setFormProduct({ ...formProduct, description: e.target.value })
          }
          className="bg-zinc-700 p-2 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          value={formProduct.price}
          onChange={(e) =>
            setFormProduct({ ...formProduct, price: +e.target.value })
          }
          className="bg-zinc-700 p-2 rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={formProduct.id ? updateProduct : createProduct}
          className="bg-blue-500 px-4 py-2 rounded-md "
        >
          {formProduct.id ? "Save" : "Create New Product"}
        </button>
        {formProduct.id && (
          <button
            onClick={() => setFormProduct(new Product())}
            className="bg-red-500 p-2 rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-10">
      {renderForm()}
      {renderProducts()}
    </div>
  );
}
