import { useState, useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
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

  // Track navigation state for form submission
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <BlockStack>
        <Text variant="headingLg" as="h3">Edit Bundle</Text>
      </BlockStack>
      <br />
      <Form method="post">
        <input type="hidden" name="id" value={item?.id} />
        <input type="hidden" name="_action" value="edit" />
        <FormLayout>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            autoComplete="off"
            name="name"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            multiline={4}
            autoComplete="off"
            name="description"
          />
          <ButtonGroup>
            <Button submit primary loading={isSubmitting}>Save Changes</Button>
            <Button onClick={onBack} disabled={isSubmitting}>Cancel</Button>
          </ButtonGroup>
        </FormLayout>
      </Form>
    </div>
  );
};

export default EditComponent;