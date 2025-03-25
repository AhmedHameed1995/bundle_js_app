import { Spinner } from "@shopify/polaris";

// Loading Spinner Component
const LoadingComponent = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <Spinner size="large" />
    </div>
  );
};

export default LoadingComponent;