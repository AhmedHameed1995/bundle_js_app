import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Modal, Button, ButtonGroup } from "@shopify/polaris";

// Import route handlers
import { bundlesLoader, bundlesAction } from "./route.handlers";

// Import custom hooks and constants
import { useModalManager } from "./hooks/useModalManager";
import { BUNDLE_TYPES, COMPONENT_STATES, MODAL_ACTIONS } from "./constants";

// Import components
import IndexComponent from "./components/IndexComponent";
import ViewComponent from "./components/ViewComponent";
import EditComponent from "./components/EditComponent";
import DeleteComponent from "./components/DeleteComponent";
import LoadingComponent from "./components/LoadingComponent";
import { ModalUI } from "./components/parent/Modal";
import TitleBarUI from "./components/parent/TitleBarUI";

// Export loader and action
export { bundlesLoader as loader, bundlesAction as action };

export default function BundlesPage() {
  const { bundles = [], products = [], shopDomain } = useLoaderData() || {};
  const navigate = useNavigate();
  
  const [activeComponent, setActiveComponent] = useState(COMPONENT_STATES.INDEX);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Destructure all necessary values from useModalManager, including setters
  const {
    isTypeModalOpen,
    isSecondModalOpen,
    selectedBundleType,
    isCreateNew,
    selectedProduct,
    setIsCreateNew, // Add this
    setSelectedProduct, // Add this
    openTypeModal,
    closeTypeModal,
    openSecondModal,
    closeSecondModal,
    handleTypeSelection,
    handleSecondModalSelection,
  } = useModalManager();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      changeComponent(COMPONENT_STATES.INDEX);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = (id) => {
    console.log("Deleting item with ID:", id);
    changeComponent(COMPONENT_STATES.INDEX);
  };

  const handleSecondModalAction = async (option) => {
    const result = await handleSecondModalSelection(option, window.shopify);
    
    if (result.selectedItem) {
      setSelectedItem(result.selectedItem);
    }
    
    if (result.selectedProduct) {
      setSelectedProduct(result.selectedProduct); // Now defined
    }

    if (result.isCreateNew !== undefined) {
      setIsCreateNew(result.isCreateNew); // Now defined
    }

    closeSecondModal();
    changeComponent(COMPONENT_STATES.EDIT);
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
      case COMPONENT_STATES.VIEW:
        return (
          <ViewComponent 
            item={selectedItem} 
            onBack={() => changeComponent(COMPONENT_STATES.INDEX)} 
          />
        );
      case COMPONENT_STATES.EDIT:
        return (
          <EditComponent 
            item={selectedItem} 
            onBack={() => changeComponent(COMPONENT_STATES.INDEX)} 
            onSave={handleSave}
            isCreateNew={isCreateNew}
            selectedProduct={selectedProduct}
            selectedBundleType={selectedBundleType}
            shopDomain={shopDomain} 
          />
        );
      case COMPONENT_STATES.DELETE:
        return (
          <DeleteComponent 
            item={selectedItem} 
            onBack={() => changeComponent(COMPONENT_STATES.INDEX)} 
            onConfirmDelete={handleDelete}
          />
        );
      case COMPONENT_STATES.INDEX:
      default:
        return (
          <>
            <TitleBarUI
                title="Bundles"
                badgeText="Draft"
                onPrimaryAction={openTypeModal}
                onSecondaryAction={() => alert("Secondary Action")}
                primaryActionContent="Build Bundle"
                secondaryActionContent="Secondary Action"
                showBackButton={false}
            />
            <IndexComponent 
              data={bundles} 
              onView={(item) => changeComponent(COMPONENT_STATES.VIEW, item)}
              onEdit={(item) => changeComponent(COMPONENT_STATES.EDIT, item)}
              onDelete={(item) => changeComponent(COMPONENT_STATES.DELETE, item)}
            />          
          </>
        );
    }
  };

  return (
    <>
      <div style={{ padding: "0 1rem" }}>
        {renderActiveComponent()}

        {/* First Modal: Choose Bundle Type */}
        <ModalUI
          title="Choose Bundle Type"
          primaryActionContent="Close"
          isOpen={isTypeModalOpen}
          onClose={closeTypeModal}
        >
          <p>Select a bundle type:</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => handleTypeSelection(BUNDLE_TYPES.SIMPLE)}>
              Simple
            </button>
            <button onClick={() => handleTypeSelection(BUNDLE_TYPES.INFINITE)}>
              Infinite
            </button>
          </div>
        </ModalUI>

        {/* Second Modal: Choose to create new or select existing */}
        <Modal
          open={isSecondModalOpen}
          onClose={closeSecondModal}
          title="Create simple bundle"
        >
          <Modal.Section>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Button 
                onClick={() => handleSecondModalAction(MODAL_ACTIONS.CREATE)}
              >
                Create new bundle product
              </Button>
              <p>A new product will be created and used as your bundle.</p>
              <Button 
                onClick={() => handleSecondModalAction(MODAL_ACTIONS.SELECT)}
              >
                Select existing bundle product
              </Button>
              <p>An existing product will be used as your bundle.</p>
            </div>
          </Modal.Section>
          <Modal.Section>
            <ButtonGroup>
              <Button onClick={closeSecondModal}>Cancel</Button>
              <Button url="#">Learn more</Button>
            </ButtonGroup>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}