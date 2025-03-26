import { Modal, BlockStack } from "@shopify/polaris";

export function ModalUI({
  title,
  primaryActionContent,
  secondaryActionContent,
  isOpen,
  onClose,
  children,
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title || "Default Title"}
      primaryAction={{
        content: primaryActionContent || "Primary Action",
        onAction: onClose,
      }}
      secondaryActions={[
        {
          content: secondaryActionContent || "Secondary Action",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack>{children}</BlockStack>
      </Modal.Section>
    </Modal>
  );
}