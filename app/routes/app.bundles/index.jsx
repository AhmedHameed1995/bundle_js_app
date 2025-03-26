// app/routes/app.bundles/index.jsx

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import IndexComponent from "./components/IndexComponent";
import ViewComponent from "./components/ViewComponent";
import EditComponent from "./components/EditComponent";
import DeleteComponent from "./components/DeleteComponent";
import LoadingComponent from "./components/LoadingComponent";
import { getBundles, updateBundle } from "./services/bundleServices"; // Ensure getBundles returns an array or defaults to []
import { authenticate } from "../../shopify.server";
import { ModalUI } from "./components/parent/Modal";
import TitleBarUI from "./components/parent/TitleBarUI";

export default function BundlesPage() {
  // Ensure loaderData is defined and defaults to empty arrays
  const { bundles = [], products = [] } = useLoaderData() || {};
  
  const [activeComponent, setActiveComponent] = useState("index");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);       // First modal: choose bundle type
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false); // Second modal: configuration
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);   // Third modal: product selection
  
  const [selectedType, setSelectedType] = useState("");          // "simple" or "infinite"
  const [selectedProduct, setSelectedProduct] = useState(null);    // Chosen product

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data); // Assuming setProducts updates the state holding product data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // Change active component with a simulated delay
  const changeComponent = (component, item = null) => {
    setIsLoading(true);
    setSelectedItem(item);
    setTimeout(() => {
      setActiveComponent(component);
      setIsLoading(false);
    }, 100);
  };

  const handleSave = async (updatedItem) => {
    try {
      console.log("Saving updated item:", updatedItem);
      changeComponent("index");
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = (id) => {
    console.log("Deleting item with ID:", id);
    changeComponent("index");
  };

  // Open the first modal for bundle type selection
  const handlePrimaryAction = () => {
    setIsModalOpen(true);
  };

  // First modal: when a type is chosen, store it and open the second modal
  const handleSelection = (type) => {
    setSelectedType(type);
    setIsModalOpen(false);
    setIsSecondModalOpen(true);
  };

  // Open the third modal for product selection and close the second modal
  const openProductModal = () => {
    fetchProducts(); // Fetch products when opening the modal
    setIsThirdModalOpen(true);
    setIsSecondModalOpen(false);
  };

  // Handle product selection from the third modal
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsThirdModalOpen(false);
  };

  const renderActiveComponent = () => {
    if (!isClient) {
      return (
        <IndexComponent 
          data={bundles} 
          onView={() => {}} 
          onEdit={() => {}} 
          onDelete={() => {}}
        />
      );
    }
    if (isLoading) return <LoadingComponent />;
    switch (activeComponent) {
      case "view":
        return (
          <ViewComponent 
            item={selectedItem} 
            onBack={() => changeComponent("index")} 
          />
        );
      case "edit":
        return (
          <EditComponent 
            item={selectedItem} 
            onBack={() => changeComponent("index")} 
            onSave={handleSave}
          />
        );
      case "delete":
        return (
          <DeleteComponent 
            item={selectedItem} 
            onBack={() => changeComponent("index")} 
            onConfirmDelete={handleDelete}
          />
        );
      case "index":
      default:
        return (
          <IndexComponent 
            data={bundles} 
            onView={(item) => changeComponent("view", item)}
            onEdit={(item) => changeComponent("edit", item)}
            onDelete={(item) => changeComponent("delete", item)}
          />
        );
    }
  };

  return (
    <>
      <TitleBarUI
        title="Bundles"
        badgeText="Draft"
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={() => alert("Secondary Action")}
        primaryActionContent="Primary Action"
        secondaryActionContent="Secondary Action"
        showBackButton={activeComponent !== "index"}
        onBack={() => changeComponent("index")}
      >
        {renderActiveComponent()}

        {/* First Modal: Choose Bundle Type */}
        <ModalUI
          title="Choose Bundle Type"
          primaryActionContent="Close"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <p>Select a bundle type:</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => handleSelection("simple")}>Simple</button>
            <button onClick={() => handleSelection("infinite")}>Infinite</button>
          </div>
        </ModalUI>

        {/* Second Modal: Based on Selection */}
        <ModalUI
          title={`You selected: ${selectedType}`}
          primaryActionContent="Close"
          isOpen={isSecondModalOpen}
          onClose={() => setIsSecondModalOpen(false)}
        >
          <p>
            Now you can configure your <strong>{selectedType}</strong> bundle.
          </p>
          <button onClick={openProductModal}>Select Product</button>
        </ModalUI>

        {/* Third Modal: Product Selection */}
        <ModalUI
          title="Select Product"
          primaryActionContent="Close"
          isOpen={isThirdModalOpen}
          onClose={() => setIsThirdModalOpen(false)}
        >
          <p>Select a product from the list:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <button key={product.id} onClick={() => handleProductSelect(product)}>
                  {product.title}
                </button>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </ModalUI>

        {selectedProduct && (
          <p>
            Selected Product: <strong>{selectedProduct.title}</strong>
          </p>
        )}
      </TitleBarUI>
    </>
  );
}

// Server-side loader function
export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    // Ensure getBundles returns an array; default to empty array if undefined
    const bundles = (await getBundles()) || [];
    
    // GraphQL query to fetch products
    const query = `#graphql
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }`;
      
    const response = await admin.graphql(query);
    const products = response.data?.products?.edges
      ? response.data.products.edges.map((edge) => edge.node)
      : [];
    
    return json({ bundles, products });
  } catch (error) {
    console.error("Error fetching data", error);
    return json({ bundles: [], products: [] }, { status: 500 });
  }
}

// Server-side action function
export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "edit") {
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");

    if (!id || !name || !description) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await updateBundle(id, { name, description });
      return { success: true };
    } catch (error) {
      console.error("Error updating bundle:", error);
      return json({ error: "Failed to update bundle" }, { status: 500 });
    }
  }
  
  return redirect("/bundles");
}
