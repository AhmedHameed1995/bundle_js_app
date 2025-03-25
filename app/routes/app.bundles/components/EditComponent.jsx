import { useState, useEffect, useRef } from "react";
import { Form, useNavigation, useActionData } from "@remix-run/react";
import {
  TextField,
  FormLayout,
  ButtonGroup,
  Button,
  BlockStack,
  Text,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

const EditComponent = ({ item, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Get the shopify object for toast notifications
  const shopify = useAppBridge();

  const navigation = useNavigation();
  const actionData = useActionData();
  const prevNavigationState = useRef(navigation.state);

  // Set initial form data
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
      });
    }
  }, [item]);

  // Show toast on successful submission
  useEffect(() => {
    if (
      prevNavigationState.current === "loading" &&
      navigation.state === "idle" &&
      actionData?.success
    ) {
      shopify.toast.show("Bundle updated successfully", { duration: 3000 });
      setTimeout(() => onBack(), 1000); // Wait 3 seconds before switching
    }
    prevNavigationState.current = navigation.state;
  }, [navigation.state, actionData, shopify]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <BlockStack>
        <Text variant="headingLg" as="h3">
          Edit Bundle
        </Text>
      </BlockStack>
      <br />
      <Form method="post">
        <input type="hidden" name="id" value={item?.id} />
        <input type="hidden" name="_action" value="edit" />
        <FormLayout>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange("name")}
            autoComplete="off"
            name="name"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            multiline={4}
            autoComplete="off"
            name="description"
          />
          <ButtonGroup>
            <Button submit primary loading={isSubmitting}>
              Save Changes
            </Button>
            <Button onClick={onBack} disabled={isSubmitting}>
              Cancel
            </Button>
          </ButtonGroup>
        </FormLayout>
      </Form>
    </div>
  );
};

export default EditComponent;