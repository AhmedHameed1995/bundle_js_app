import { useState, useEffect } from "react";
import { Form } from "@remix-run/react";
import {
  TextField,
  FormLayout,
  ButtonGroup,
  Button,
  BlockStack,
  Text,
} from "@shopify/polaris";

// Edit Component - Form for editing records
const EditComponent = ({ item, onBack, onSave }) => {
  // Initialize form data with empty values, then update after mount
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  // Set form data after component mounts to avoid hydration mismatch
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
      });
    }
  }, [item]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...item, ...formData });
  };

  return (
    <div>
      <BlockStack>
        <Text variant="headingLg" as="h3">Edit Bundle</Text>
      </BlockStack>
      <br />
      <Form method="post" onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <FormLayout>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            autoComplete="off"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            multiline={4}
            autoComplete="off"
          />
          <ButtonGroup>
            <Button submit primary>Save Changes</Button>
            <Button onClick={onBack}>Cancel</Button>
          </ButtonGroup>
        </FormLayout>
      </Form>
    </div>
  );
};

export default EditComponent;