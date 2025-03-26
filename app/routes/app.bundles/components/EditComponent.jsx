import { useState, useEffect, useRef } from "react";
import { Form, useNavigation, useActionData } from "@remix-run/react";
import {
  TextField,
  FormLayout,
  ButtonGroup,
  Button,
  BlockStack,
  Text,
  Page,
  Layout,
  Card
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
      <Page fullWidth>
        <Layout>
          <Layout.Section variant="oneThird">
            <Card title="Order details" sectioned>
              <p>
                Use to follow a normal section with a secondary section to create
                a 2/3 + 1/3 layout on detail pages (such as individual product or
                order pages). Can also be used on any page that needs to structure
                a lot of content. This layout stacks the columns on small screens.
              </p>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card title="Tags" sectioned>
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
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      
    </div>
  );
};

export default EditComponent;