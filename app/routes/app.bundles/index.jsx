import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import IndexComponent from "./components/IndexComponent";
import ViewComponent from "./components/ViewComponent";
import EditComponent from "./components/EditComponent";
import DeleteComponent from "./components/DeleteComponent";
import LoadingComponent from "./components/LoadingComponent";
import { getBundles, updateBundle } from "./services/bundleServices";
import { authenticate } from "../../shopify.server";
import { ModalUI } from "./components/parent/Modal";
import TitleBarUI from "./components/parent/TitleBarUI";
import { Modal, Button, ButtonGroup } from "@shopify/polaris";

export default function BundlesPage() {
  const { bundles = [], products = [] } = useLoaderData() || {};
  const navigate = useNavigate();
  
  const [activeComponent, setActiveComponent] = useState("index");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Modal states
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedBundleType, setSelectedBundleType] = useState("");
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to open the first modal for bundle type selection
  const handleBuildBundle = () => {
    setIsTypeModalOpen(true);
  };

  // Function to handle bundle type selection and open the second modal
  const handleTypeSelection = (type) => {
    setSelectedBundleType(type);
    setIsTypeModalOpen(false);
    setIsSecondModalOpen(true);
  };

  // Function to handle selection in the second modal
  const handleSecondModalSelection = async (option) => {
    setIsSecondModalOpen(false);
    if (option === "create") {
      setIsCreateNew(true);
      setSelectedItem(null);
      setSelectedProduct(null);
      changeComponent("edit");
    } else if (option === "select") {
      try {
        const products = await window.shopify.resourcePicker({
          type: "product",
          action: "select",
          multiple: false,
        });
        if (products && products.length > 0) {
          const { id, title, handle, variants, images } = products[0];
          setSelectedProduct({
            id,
            title,
            handle,
            productVariantId: variants[0].id,
            productImage: images[0]?.originalSrc,
            productAlt: images[0]?.altText,
          });
          setIsCreateNew(false);
          setSelectedItem(products[0]);
          changeComponent("edit");
        }
      } catch (error) {
        console.error("Error selecting product:", error);
      }
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

  // Render active component function
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
            isCreateNew={isCreateNew}
            selectedProduct={selectedProduct}
            selectedBundleType={selectedBundleType}
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
        onPrimaryAction={handleBuildBundle}
        onSecondaryAction={() => alert("Secondary Action")}
        primaryActionContent="Build Bundle"
        secondaryActionContent="Secondary Action"
        showBackButton={activeComponent !== "index"}
        onBack={() => changeComponent("index")}
      >
        {renderActiveComponent()}

        {/* First Modal: Choose Bundle Type */}
        <ModalUI
          title="Choose Bundle Type"
          primaryActionContent="Close"
          isOpen={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
        >
          <p>Select a bundle type:</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => handleTypeSelection("Simple")}>Simple</button>
            <button onClick={() => handleTypeSelection("Infinite")}>Infinite</button>
          </div>
        </ModalUI>

        {/* Second Modal: Choose to create new or select existing */}
        <Modal
          open={isSecondModalOpen}
          onClose={() => setIsSecondModalOpen(false)}
          title="Create simple bundle"
        >
          <Modal.Section>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Button onClick={() => handleSecondModalSelection("create")}>
                Create new bundle product
              </Button>
              <p>A new product will be created and used as your bundle.</p>
              <Button onClick={() => handleSecondModalSelection("select")}>
                Select existing bundle product
              </Button>
              <p>An existing product will be used as your bundle.</p>
            </div>
          </Modal.Section>
          <Modal.Section>
            <ButtonGroup>
              <Button onClick={() => setIsSecondModalOpen(false)}>Cancel</Button>
              <Button url="#">Learn more</Button>
            </ButtonGroup>
          </Modal.Section>
        </Modal>
      </TitleBarUI>
    </>
  );
}

// Loader and action functions remain the same as in your original code
export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    
    const bundles = (await getBundles()) || [];
    
    const query = `#graphql
      query {
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              productType
              variants(first: 1) {
                edges {
                  node {
                    price
                    sku
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
        }
      }`;
      
    const response = await admin.graphql(query);
    const responseJson = await response.json();
    
    const products = responseJson.data?.products?.edges
      ? responseJson.data.products.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          price: edge.node.variants.edges[0]?.node.price,
          image: edge.node.images.edges[0]?.node.originalSrc
        }))
      : [];
    
    return Response.json({ bundles, products });
  } catch (error) {
    console.error("Error fetching data", error);
    return Response.json({ bundles: [], products: [] }, { status: 500 });
  }
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "edit") {
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");

    if (!id || !name || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await updateBundle(id, { name, description });
      return { success: true };
    } catch (error) {
      console.error("Error updating bundle:", error);
      return Response.json({ error: "Failed to update bundle" }, { status: 500 });
    }
  }
  
  return redirect("/bundles");
}