// app/routes/app.bundles/route.handlers.js
import { redirect } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import { getBundles, updateBundle } from "./services/bundleServices";

export async function bundlesLoader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    
    const bundles = (await getBundles()) || [];
    
    const query = `#graphql
      query {
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              productType
              variants(first: 1) {
                edges {
                  node {
                    price
                    sku
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
            }
          }
        }
      }`;
      
    const response = await admin.graphql(query);
    const responseJson = await response.json();
    
    const products = responseJson.data?.products?.edges
      ? responseJson.data.products.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          price: edge.node.variants.edges[0]?.node.price,
          image: edge.node.images.edges[0]?.node.originalSrc
        }))
      : [];
    
    // Include the shop domain in the loader data
    const shopDomain = session.shop;
    return Response.json({ bundles, products, shopDomain });
  } catch (error) {
    console.error("Error fetching data", error);
    return Response.json({ bundles: [], products: [], shopDomain: null }, { status: 500 });
  }
}

export async function bundlesAction({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "edit") {
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");

    if (!id || !name || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await updateBundle(id, { name, description });
      return { success: true };
    } catch (error) {
      console.error("Error updating bundle:", error);
      return Response.json({ error: "Failed to update bundle" }, { status: 500 });
    }
  }
  
  return redirect("/bundles");
}