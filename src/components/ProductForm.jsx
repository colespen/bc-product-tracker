import { useRouter, Link } from "next/router";
import { useState, useRef } from "react";
import { Tooltip } from "react-tooltip";

import { saveProduct, editProduct } from "../services/products";

import 'react-tooltip/dist/react-tooltip.css';
import styles from "../styles/Home.module.scss";

const ProductForm = (props) => {
  const {
    setProducts,
    id,
    product,
    formType,
    setView,
  } = props;

  const [newProduct, setNewProduct] = useState(product || {
    productName: "",
    productOwnerName: "",
    Developers: [],
    scrumMasterName: "",
    startDate: "",
    methodology: "",
  });
  const router = useRouter();
  const [formTitle, setFormTitle] = useState("");
  const formRef = useRef(null);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isConfirm, setIsConfirm] = useState(false);

  // console.log("ProductForm - product: ", product);
  // console.log("ProductForm - newProduct: ", newProduct);
  console.log("ProductForm -- formType: ", formType);


  const handleSaveProduct = () => {
    saveProduct(newProduct, setProducts);
  };
  const handleEditProduct = () => {
    editProduct(newProduct);
  };

  const handleOnChange = (e) => {
    const { name, value, id } = e.target;
    let newVal = value;
    if (name === "startDate") newVal = value.replace(/-/g, "/");
    if (name === "methodology") newVal = id;
    // set as array of strings if Developers
    setNewProduct(prev => ({
      ...prev,
      [name]: name === "Developers" ? [newVal] : newVal,
    }));
  };

  // max 5 dev's
  const handleAddDeveloper = () => {
    if (newProduct.Developers.length < 5) {
      setNewProduct(prev => ({
        ...prev,
        Developers: [...prev.Developers, ""],
      }));
    }
  };
  // remove dev
  const handleRemoveDeveloper = (index) => {
    setNewProduct(prev => ({
      ...prev,
      Developers: prev.Developers.filter((_, i) => i !== index),
    }));
  };

  const handleDeveloperChange = (index, value) => {
    setNewProduct(prev => {
      const newDevelopers = [...prev.Developers];
      newDevelopers[index] = value;
      return {
        ...prev,
        Developers: newDevelopers,
      };
    });
  };


  const handleOnSubmit = (e) => {
    const { btnId } = formRef.current;
    e.preventDefault();
    if (e.target.type === "reset") {
      handleReset();
    }
    // check for empty fields and trigger Tooltip on submit
    if (
      !newProduct.productName ||
      !newProduct.productOwnerName ||
      !newProduct.Developers.length ||
      newProduct.Developers.some((d) => !d) ||
      !newProduct.scrumMasterName ||
      !newProduct.startDate ||
      !newProduct.methodology
    ) {
      // setErrorMessage("Please fill out all fields.");
      return;
    } else {
      if (btnId === "add-btn") {
        console.log("SUBMITTED");
        setFormTitle("Added!");
        handleSaveProduct();
      }
      if (btnId === "edit-btn") {
        console.log("EDITED");
        setFormTitle("Edited!");
        handleEditProduct();
      }
      const tableViewDelay = setTimeout(() => {
        router.push("/");
        setView("TABLE");
      }, 500);
      handleReset();
      return () => clearTimeout(tableViewDelay);
    }
  };

  const handleReset = () => {
    setNewProduct({
      productName: "",
      productOwnerName: "",
      Developers: [],
      scrumMasterName: "",
      startDate: "",
      methodology: "",
    });
  };

  return (
    <>
      {!formTitle &&
        <h2>{!formType ? "Edit Product" : "Create Product"}</h2>}
      {formTitle && <h2>Product {formTitle}</h2>}
      <form
        ref={formRef}
        onSubmit={handleOnSubmit}
        className={styles.form}
      >
        <label>
          Product Name:<br />
          <input
            name="productName"
            value={newProduct.productName}
            onChange={handleOnChange}
            required
          />
        </label>
        <label>
          Product Owner Name:<br />
          <input
            name="productOwnerName"
            value={newProduct.productOwnerName}
            onChange={handleOnChange}
            required
          />
        </label>

        <div className={styles.developers}>
          Developers
          {newProduct.Developers.map((developer, index) => (
            <div key={index} className={styles.developersInner} >
              <small>
                Developer {index + 1}:<br />
                <input
                  name="Developers"
                  value={developer}
                  onChange={(e) => handleDeveloperChange(index, e.target.value)}
                  required
                />
              </small>
              {newProduct.Developers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDeveloper(index)}
                >
                  <small>Remove Developer</small>
                </button>
              )}
            </div>
          ))}
          {newProduct.Developers.length < 5 && (
            <button type="button" onClick={handleAddDeveloper}>
              Add Developer
            </button>
          )}
        </div>

        <label>
          Scrum Master Name:<br />
          <input
            name="scrumMasterName"
            value={newProduct.scrumMasterName}
            onChange={handleOnChange}
            required
          />
        </label>
        <label>
          Start Date:<br />
          <input
            name="startDate"
            value={newProduct.startDate.replace(/\//g, "-")}
            onChange={handleOnChange}
            type="date"
            required
            disabled={!formType}
          />
        </label>
        <label>
          Methodology:<br />
          <div className={styles.radioBtns}>
            <input
              name="methodology"
              id="Agile"
              value={newProduct.methodology}
              onChange={handleOnChange}
              type="radio"
              required
              checked={newProduct.methodology === "Agile"}
              style={{ width: "20px", minWidth: "20px" }}
            />
            <label htmlFor="agile">Agile</label>
            <input
              name="methodology"
              id="Waterfall"
              value={newProduct.methodology}
              onChange={handleOnChange}
              type="radio"
              required
              checked={newProduct.methodology === "Waterfall"}
              style={{ width: "20px", minWidth: "20px" }}
            />
            <label htmlFor="waterfall">Waterfall</label>
          </div>
        </label>

        <div className={styles.submitForm}>

          {formType &&
            <button id="add-btn" type="submit" data-tip data-for="submit-tooltip"
              onClick={(e) => formRef.current.btnId = e.target.id}
            >
              Add Product
              {/* <Link href="/">Add Product</Link> */}
              {/* Trying To Exit on Submit */}
            </button>}
          {!formType && <button id="edit-btn" type="submit" data-tip data-for="submit-tooltip"
            onClick={(e) => formRef.current.btnId = e.target.id}
          >
            {/* <Link href="/">Edit Product</Link> */}
            {/* Trying To Exit on Submit */}
          </button>}

          <button type="reset" onClick={handleReset}>Reset</button>
          <Tooltip id="submit-tooltip" place="top" type="error" effect="solid" />
        </div>
      </form>
    </>
  );
};

export default ProductForm;