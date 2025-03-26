import { useState, useCallback } from "react";
import { Badge, ButtonGroup, FullscreenBar, Button, Text } from "@shopify/polaris";

export function FullscreenBarUI({ title, badgeText, onPrimaryAction, onSecondaryAction, children }) {
  const [isFullscreen, setFullscreen] = useState(true);

  const handleActionClick = useCallback(() => {
    setFullscreen(false);
  }, []);

  const fullscreenBarMarkup = (
    <FullscreenBar onAction={handleActionClick}>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {/* Badge on Left */}
        {badgeText && <Badge tone="info">{badgeText}</Badge>}

        {/* Title in Center */}
        <div style={{ marginLeft: "1rem", flexGrow: 1 }}>
          <Text variant="headingLg" as="p">{title || "Page Title"}</Text>
        </div>

        {/* Button Group on Right */}
        <ButtonGroup>
          {onSecondaryAction && <Button onClick={onSecondaryAction}>Secondary Action</Button>}
          {onPrimaryAction && (
            <Button variant="primary" onClick={onPrimaryAction}>
              Primary Action
            </Button>
          )}
        </ButtonGroup>
      </div>
    </FullscreenBar>
  );

  return (
    <div style={{ height: "250px", width: "100%" }}>
      {isFullscreen && fullscreenBarMarkup}
      <div style={{ padding: "1rem" }}>
        {!isFullscreen && <Button onClick={() => setFullscreen(true)}>Go Fullscreen</Button>}
        {/* Render children here */}
        {children}
      </div>
    </div>
  );
}