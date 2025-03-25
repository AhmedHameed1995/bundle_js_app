import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import IndexComponent from "./components/IndexComponent";
import ViewComponent from "./components/ViewComponent";
import EditComponent from "./components/EditComponent";
import DeleteComponent from "./components/DeleteComponent";
import LoadingComponent from "./components/LoadingComponent";
import { getBundles, createBundle } from "./services/bundleServices";


// Main Page Component
export default function BundlesPage() {

  // Get data from loader
  const bundles = useLoaderData() || [];
  
  // Use useEffect for client-side only state initialization
  const [activeComponent, setActiveComponent] = useState("index");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to change active component with loading spinner
  const changeComponent = (component, item = null) => {
    setIsLoading(true);
    setSelectedItem(item);
    
    // Simulate loading delay
    setTimeout(() => {
      setActiveComponent(component);
      setIsLoading(false);
    }, 2000);
  };

  // Handler for updating a bundle
  const handleSave = (updatedItem) => {
    // Will be replaced with actual API call
    console.log("Saving updated item:", updatedItem);
    
    // Show loading spinner
    changeComponent("index");
  };

  // Handler for deleting a bundle
  const handleDelete = (id) => {
    // Will be replaced with actual API call
    console.log("Deleting item with ID:", id);
    
    // Show loading spinner
    changeComponent("index");
  };

  // Render the active component
  const renderActiveComponent = () => {
    // Always render Index on server, then handle client-side transitions
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
    
    if (isLoading) {
      return <LoadingComponent />;
    }

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
    <Page>
      <TitleBar title="Bundles" />
      <Layout>
        <Layout.Section>
          <Card padding="4">
            {renderActiveComponent()}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Loader function - Will be used to fetch data from backend
export async function loader({ request }) {
  try {
    const bundles = await getBundles();
    return json(bundles);
  } catch (error) {
    console.error("Error fetching bundles", error);
    return json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

// Additional Function
// Action function to handle form submissions for adding a new bundle
export async function action({ request }) {
  const formData = await request.formData();
  try {
    await createBundle(formData);
    return redirect("/bundles");
  } catch (error) {
    console.error("Error in action", error);
    return json({ error: "Failed to create bundle" }, { status: 500 });
  }
}