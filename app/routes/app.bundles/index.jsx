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
import { getBundles, updateBundle } from "./services/bundleServices";
import { authenticate } from "../../shopify.server";

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
    }, 100);
  };

  // Handler for updating a bundle
  const handleSave = async (updatedItem) => {
    try {
      // Perform the update directly here if you want to handle it client-side
      // Otherwise, the form submission in EditComponent will trigger the server-side update
      console.log("Saving updated item:", updatedItem);
      changeComponent("index");
    } catch (error) {
      console.error("Error saving item:", error);
    }
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
    // [START authenticate]
    const { admin } = await authenticate.admin(request);
    // [END authenticate]
    const bundles = await getBundles();
    return json(bundles);
  } catch (error) {
    console.error("Error fetching bundles", error);
    return json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

// Action function to handle form submissions
export async function action({ request, params }) {

  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "edit") {
    console.log(formData)
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");

    if (!id || !name || !description) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await updateBundle(id, { name, description });
      // return redirect("/bundles");

       // Fetch updated bundles
       const bundles = await getBundles();
      
       return json(bundles);
       
    } catch (error) {
      console.error("Error updating bundle:", error);
      return json({ error: "Failed to update bundle" }, { status: 500 });
    }
  }
  
  // If other actions are present, handle them here
  return redirect("/bundles");
}