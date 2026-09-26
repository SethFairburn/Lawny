import { useEffect, useState } from "react";

function Products({ products, setProducts }) {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("Fertilizer");
  const [productAmount, setProductAmount] = useState("");
  const [productUnit, setProductUnit] = useState("lb");

  const productIcons = {
    Fertilizer: "🌱",
    "Pre-Emergent": "🧴",
    "Post-Emergent": "🧪",
    Fungicide: "🍄",
    Insecticide: "🐛",
    "Soil Amendment": "🪨",
    Other: "📦",
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, [setProducts]);

  const addProduct = () => {
    const newProduct = {
      name: productName,
      category: productType,
      amount: Number(productAmount),
      unit: productUnit,
    };

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((savedProduct) => {
        setProducts([...products, savedProduct]);

        setProductName("");
        setProductType("Fertilizer");
        setProductAmount("");
        setProductUnit("lb");
      });
  };

  const removeProduct = (productId) => {
    fetch(`http://localhost:8080/api/products/${productId}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        const updatedProducts = products.filter(
          (product) => product.id !== productId,
        );

        setProducts(updatedProducts);
      }
    });
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
            type="number"
            placeholder="Amount"
            value={productAmount}
            onChange={(event) => setProductAmount(event.target.value)}
          />

          <select
            value={productUnit}
            onChange={(event) => setProductUnit(event.target.value)}
          >
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="gal">gal</option>
            <option value="fl oz">fl oz</option>
          </select>

          <button onClick={addProduct}>+ Add Product</button>
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
              <div className="product-icon">
                {productIcons[product.category] || "📦"}
              </div>
              <div className="product-card-content">
                <h4>{product.name}</h4>
                <p>{product.category}</p>
                <span>
                  {product.amount} {product.unit}
                </span>
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
