import AddProduct from "./AddProduct";

export const metadata = {
    title: "Add Product",
    description: "Add a new product",
};

export default function AddProductPage() {
    return (
        <div>
            <h1>Add Product</h1>
            <AddProduct />
        </div>
    );
}
