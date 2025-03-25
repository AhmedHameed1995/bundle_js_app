import React from "react";
import { Button, DataTable, ButtonGroup, Text } from "@shopify/polaris";

const IndexComponent = ({ data, onEdit, onView, onDelete }) => {
  const rows = data.map((item) => [
    item.id,
    item.name,
    item.description,
    new Date(item.createdAt).toISOString(),
    <ButtonGroup key={`actions-${item.id}`}>
      <Button onClick={() => onView(item)} size="slim" primary>View</Button>
      <Button onClick={() => onEdit(item)} size="slim" primary>Edit</Button>
      <Button onClick={() => onDelete(item)} destructive size="slim">Delete</Button>
    </ButtonGroup>
  ]);

  return (
    <div>
      <Text variant="headingLg" as="h3">All Bundles</Text>
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text"]}
        headings={["ID", "Name", "Description", "Created At", "Actions"]}
        rows={rows}
      />
    </div>
  );
};

export default IndexComponent;