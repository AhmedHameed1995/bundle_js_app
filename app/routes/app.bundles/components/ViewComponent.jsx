import { BlockStack, Button, Card, Text } from "@shopify/polaris";

// View Component - Displaying record details
const ViewComponent = ({ item, onBack }) => {
  return (
    <div>
      <BlockStack>
        <Text variant="headingLg" as="h3">View Bundle</Text>
      </BlockStack>
      <br />
      <Card sectioned>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", rowGap: "10px" }}>
          <Text variant="bodyMd" fontWeight="bold">ID:</Text>
          <Text variant="bodyMd">{item.id}</Text>
          
          <Text variant="bodyMd" fontWeight="bold">Name:</Text>
          <Text variant="bodyMd">{item.name}</Text>
          
          <Text variant="bodyMd" fontWeight="bold">Description:</Text>
          <Text variant="bodyMd">{item.description}</Text>
          
          <Text variant="bodyMd" fontWeight="bold">Created At:</Text>
          <Text variant="bodyMd">{new Date(item.createdAt).toLocaleString()}</Text>
          
          <Text variant="bodyMd" fontWeight="bold">Updated At:</Text>
          <Text variant="bodyMd">{new Date(item.updatedAt).toLocaleString()}</Text>
        </div>
      </Card>
      <br />
      <Button onClick={onBack}>Back to List</Button>
    </div>
  );
};

export default ViewComponent;