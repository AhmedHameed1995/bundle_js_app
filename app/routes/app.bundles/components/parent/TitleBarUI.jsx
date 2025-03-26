import { ButtonGroup, Button, Text, Badge } from "@shopify/polaris";

function TitleBarUI({
  title,
  badgeText,
  onPrimaryAction,
  primaryActionContent = "Primary Action",
  showBackButton = false,
  onBack,
}) {
  return (
    <>
      {/* Fullscreen Bar UI with optional Back button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Back Button (conditionally rendered) */}
          {showBackButton && (
            <Button onClick={onBack} plain>
              ← Back
            </Button>
          )}
          {/* Title */}
          <Text variant="headingLg" as="p" style={{ marginLeft: showBackButton ? "1rem" : "0" }}>
            {title}
          </Text>
          {/* Badge (conditionally rendered) */}
          {badgeText && (
            <Badge tone="info" style={{ marginLeft: "1rem" }}>
              {badgeText}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <ButtonGroup>
          <Button variant="primary" onClick={onPrimaryAction}>
            {primaryActionContent}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default TitleBarUI;