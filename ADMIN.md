# Shopify Remix App — Admin (CRUD) Guide

> This guide explains the admin (embedded app) functionality for managing bundles, including full CRUD operations, security, and developer notes. It is safe for public sharing—no secrets or sensitive info included.

---

## 📦 What Does the Admin Do?

- **Full CRUD for Bundles:**
  - Create, read, update, and delete bundles from the Shopify admin (embedded app UI).
- **Shopify Product Integration:**
  - Fetches all products from your Shopify store for easy bundle creation and association.
- **Secure Access:**
  - Only authenticated Shopify admins can access or modify bundles.
- **Modern UX:**
  - Built with Shopify Polaris and modular React components.
- **Real-Time Storefront Sync:**
  - All admin changes are reflected instantly on the storefront via the theme app extension and app proxy.

---

## 🗂️ Key Files & Structure

```
app/routes/app.bundles/
├── index.jsx           # Main admin page, UI logic
├── route.handlers.js   # Loader & action handlers (CRUD logic)
├── services/
│   └── bundleServices.js # Database operations (CRUD)
├── components/         # UI components for CRUD (Index, View, Edit, Delete, etc.)
├── hooks/              # Custom hooks (modal manager, etc.)
├── ...
```

---

## 🧩 How CRUD Works

### 1. **Authentication**
- All admin routes use `authenticate.admin(request)` to ensure only logged-in Shopify admins can access or mutate data.

### 2. **Loader (Read Data)**
- `bundlesLoader` fetches all bundles from the database (`getBundles`) and all products from Shopify (via Admin GraphQL API).
- Loader data is passed to the main page/component for rendering.

### 3. **Create Bundle**
- Admins use a modal form to create new bundles, selecting products and entering details.
- The form data is sent to the backend, where `createBundle` (in `bundleServices.js`) creates the bundle in the database.

### 4. **Update Bundle**
- Admins can edit existing bundles using a modal/component.
- Changes are sent to the backend, where `updateBundle` updates the database record.

### 5. **Delete Bundle**
- Admins can delete bundles using a dedicated modal/component.
- The backend uses `deleteBundle` to securely remove the bundle from the database.

### 6. **UI/UX**
- Uses Shopify Polaris for a native admin feel.
- Modular React components for each CRUD operation.
- Modal management via custom hooks for a smooth workflow.

---

## 🔒 Security Best Practices
- All admin endpoints are protected by Shopify authentication.
- No sensitive data is exposed to the storefront or proxy endpoints.
- Use environment variables for all secrets and API keys.
- All CRUD actions are logged (console or error logs) for debugging and auditing.

---

## 📝 Example: CRUD Service Methods (`bundleServices.js`)

```js
// Get all bundles
export async function getBundles() {
  return await prisma.bundle.findMany();
}

// Create a new bundle
export async function createBundle(formData) {
  const name = formData.get("name");
  const description = formData.get("description");
  return await prisma.bundle.create({ data: { name, description } });
}

// Update a bundle
export async function updateBundle(id, data) {
  return await prisma.bundle.update({ where: { id }, data });
}

// Delete a bundle
export async function deleteBundle(id) {
  return await prisma.bundle.delete({ where: { id } });
}
```

---

## ⚡ How to Use (for Store Owners)

1. **Open the app from Shopify Admin.**
2. **View all bundles** in a table/list.
3. **Create a bundle** via the modal (select products, enter name/description).
4. **Edit or delete** any bundle directly from the UI.
5. **All changes appear instantly on the storefront block.**

---

## 🛡️ Developer Notes
- All Prisma/database logic is separated in `services/bundleServices.js` for maintainability.
- Loader/action logic is separated from UI for clarity.
- UI is fully modular and easy to extend.
- No sensitive info or secrets are present in this file or in the admin UI.

---

For more details, see the main README.md for full project setup and theme extension integration.
