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
  Card,
  Select,
  Badge,
  InlineStack,
  CalloutCard,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

const EditComponent = ({ item, onBack, isCreateNew, selectedProduct, selectedBundleType, shopDomain }) => {
  const [formData, setFormData] = useState({
    title: "",
    discount: "0",
    status: "Draft",
    name: "",
    description: "",
  });

  const shopify = useAppBridge();
  const navigation = useNavigation();
  const actionData = useActionData();
  const prevNavigationState = useRef(navigation.state);

  useEffect(() => {
    if (isCreateNew) {
      setFormData({
        title: "",
        discount: "0",
        status: "Draft",
        name: "",
        description: "",
      });
    } else if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        title: selectedProduct?.title || "",
        discount: "0",
        status: "Draft",
      });
    }
  }, [item, isCreateNew, selectedProduct]);

  useEffect(() => {
    if (
      prevNavigationState.current === "loading" &&
      navigation.state === "idle" &&
      actionData?.success
    ) {
      shopify.toast.show("Bundle updated successfully", { duration: 3000 });
      setTimeout(() => onBack(), 1000);
    }
    prevNavigationState.current = navigation.state;
  }, [navigation.state, actionData, shopify, onBack]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSubmitting = navigation.state === "submitting";
  
  // Fallback if shopDomain isn't available
  const productHandle = "mentos-ment-chewy-strawberry-1-32-oz-box-of-15-rolls";
  const productUrl = `https://${shopDomain}/products/${selectedProduct  ? selectedProduct.handle : ''}`;
  return (
    <>
      <Page
        backAction={{content: 'Products', onAction: onBack}}
        title={selectedProduct ? selectedProduct.title : `Create a new ${selectedBundleType} bundle`}
        titleMetadata={
          <InlineStack spacing="base" alignment="center">
            {selectedProduct ? (
              <Badge tone={selectedProduct.status == "ACTIVE" ? "success" : "info"}>
                {selectedProduct.status}
              </Badge>
            ) : (
              <Badge tone="warning">Not selected</Badge>
            )}
            {selectedBundleType ? (
              <Badge tone={selectedBundleType === "Simple" ? "success" : "info"}>
                {selectedBundleType}
              </Badge>
            ) : (
              <Badge tone="warning">Not selected</Badge>
            )}
          </InlineStack>
        }
        subtitle="Perfect for any pet"
        compactTitle
        primaryAction={{content: 'Save', disabled: true}}
        secondaryActions={[
          {
            content: 'Duplicate',
            accessibilityLabel: 'Secondary action label',
            onAction: () => alert('Duplicate action'),
          },
          {
            content: 'View on your store',
            onAction: () => window.open(productUrl, "_blank"), 
          },
        ]}
        actionGroups={[
          {
            title: 'Promote',
            actions: [
              {
                content: 'Share on Facebook',
                accessibilityLabel: 'Individual action label',
                onAction: () => alert('Share on Facebook action'),
              },
            ],
          },
        ]}
        pagination={{
          hasPrevious: true,
          hasNext: true,
        }}
      >
        <Layout>
          {/* Full Width Section for product details */}
          <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            <CalloutCard
              title="Customize the style of your checkout"
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
              primaryAction={{content: 'Customize checkout'}}
              secondaryAction={{content: 'Learn more about customizing checkout'}}
              
            >
              <p>Upload your store’s logo, change colors and fonts, and more.</p>
            </CalloutCard>
            <Card title="Bundle details" sectioned>
              {isCreateNew ? (
                <FormLayout>
                  <TextField
                    label="Title"
                    value={formData.title}
                    onChange={handleChange("title")}
                    placeholder="E.g. Build your perfect bundle"
                  />
                  <TextField
                    label="Discount"
                    value={formData.discount}
                    onChange={handleChange("discount")}
                    type="number"
                    suffix="%"
                  />
                  <Select
                    label="Product status"
                    options={["Draft", "Active"]}
                    value={formData.status}
                    onChange={handleChange("status")}
                  />
                </FormLayout>
              ) : selectedProduct ? (
                <div>
                  <p><strong>Title:</strong> {selectedProduct.title}</p>
                  <p><strong>Handle:</strong> {selectedProduct.handle}</p>
                  <p><strong>Variant ID:</strong> {selectedProduct.productVariantId}</p>
                  {selectedProduct.productImage && (
                    <img
                      src={selectedProduct.productImage}
                      alt={selectedProduct.productAlt || selectedProduct.title}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  )}
                  
                </div>
              ) : (
                <p>
                  Use to follow a normal section with a secondary section to create
                  a 2/3 + 1/3 layout on detail pages (such as individual product or
                  order pages). Can also be used on any page that needs to structure
                  a lot of content. This layout stacks the columns on small screens.
                </p>
              )}
            </Card>
          </BlockStack>
          </Layout.Section>
          <Layout.Section>
            <Card title="Bundle Information" sectioned>
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
    </>
  );
};

export default EditComponent;