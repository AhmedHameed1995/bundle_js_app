import { 
    Button, 
    ButtonGroup, 
    Banner, 
    BlockStack, 
    Text 
  } from "@shopify/polaris";
  
  // Delete Component - Confirmation before deletion
  const DeleteComponent = ({ item, onBack, onConfirmDelete }) => {
    return (
      <div>
        <BlockStack>
          <Text variant="headingLg" as="h3">Delete Bundle</Text>
        </BlockStack>
        <br />
        <Banner
          title={`Are you sure you want to delete "${item.title}"?`}
          status="critical"
        >
          <p>This action cannot be undone.</p>
        </Banner>
        <br />
        <ButtonGroup>
          <Button onClick={() => onConfirmDelete(item.id)} destructive>Delete</Button>
          <Button onClick={onBack}>Cancel</Button>
        </ButtonGroup>
      </div>
    );
  };
  
  export default DeleteComponent;