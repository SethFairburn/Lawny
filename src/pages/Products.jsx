import { useState } from "react";

function Products({ products, setProducts }) {

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("Fertilizer");
  const [productSize, setProductSize] = useState("");

  const addProduct = () => {
    const productIcons = {
      Fertilizer: "🌱",
      "Pre-Emergent": "🧴",
      "Post-Emergent": "🧪",
      Fungicide: "🍄",
      Insecticide: "🐛",
      "Soil Amendment": "🪨",
      Other: "📦",
    };

    const newProduct = {
      id: Date.now(),
      name: productName,
      type: productType,
      size: productSize,
      icon: productIcons[productType],
    };

    setProducts([...products, newProduct]);

    setProductName("");
    setProductType("Fertilizer");
    setProductSize("");
  };

  const removeProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    setProducts(updatedProducts);
  };

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">INVENTORY</p>
        <h2>Products</h2>
        <p>Keep track of the lawn products you have on hand.</p>
      </section>

      <section className="product-form">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ADD PRODUCT</p>
            <h3>Add to Inventory</h3>
          </div>
        </div>

        <div className="product-form-fields">
          <input
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
          />

          <select
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
          >
            <option value="Fertilizer">Fertilizer</option>
            <option value="Pre-Emergent">Pre-Emergent</option>
            <option value="Post-Emergent">Post-Emergent</option>
            <option value="Fungicide">Fungicide</option>
            <option value="Insecticide">Insecticide</option>
            <option value="Soil Amendment">Soil Amendment</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Size / amount"
            value={productSize}
            onChange={(event) => setProductSize(event.target.value)}
          />

          <button onClick={addProduct}>
            + Add Product
          </button>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVENTORY</p>
            <h3>Your Products</h3>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-icon">{product.icon}</div>

              <div className="product-card-content">
                <h4>{product.name}</h4>
                <p>{product.type}</p>
                <span>{product.size}</span>
              </div>

              <button
                className="product-remove"
                onClick={() => removeProduct(product.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Products;