// app/routes/app.bundles/hooks/useModalManager.js
import { useState } from 'react';
import { BUNDLE_TYPES, MODAL_ACTIONS } from '../constants';

export function useModalManager() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedBundleType, setSelectedBundleType] = useState('');
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openTypeModal = () => setIsTypeModalOpen(true);
  const closeTypeModal = () => setIsTypeModalOpen(false);

  const openSecondModal = () => setIsSecondModalOpen(true);
  const closeSecondModal = () => setIsSecondModalOpen(false);

  const handleTypeSelection = (type) => {
    setSelectedBundleType(type);
    closeTypeModal();
    openSecondModal();
  };

  const handleSecondModalSelection = async (option, shopify) => {
    closeSecondModal();

    if (option === MODAL_ACTIONS.CREATE) {
      setIsCreateNew(true);
      return { selectedItem: null, selectedProduct: null };
    } 

    if (option === MODAL_ACTIONS.SELECT) {
      try {
        const products = await shopify.resourcePicker({
          type: "product",
          action: "select",
          multiple: false,
        });

        if (products && products.length > 0) {
          const { id, title, handle, variants, images } = products[0];
          const selectedProduct = {
            id,
            title,
            handle,
            productVariantId: variants[0].id,
            productImage: images[0]?.originalSrc,
            productAlt: images[0]?.altText,
          };

          return { 
            selectedItem: products[0], 
            selectedProduct,
            isCreateNew: false 
          };
        }
      } catch (error) {
        console.error("Error selecting product:", error);
      }
    }

    return { selectedItem: null, selectedProduct: null, isCreateNew: false };
  };

  const resetModals = () => {
    setIsTypeModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedBundleType('');
    setIsCreateNew(false);
    setSelectedProduct(null);
  };

  return {
    isTypeModalOpen,
    isSecondModalOpen,
    selectedBundleType,
    isCreateNew,
    selectedProduct,
    setIsCreateNew, // Now returned
    setSelectedProduct, // Now returned
    openTypeModal,
    closeTypeModal,
    openSecondModal,
    closeSecondModal,
    handleTypeSelection,
    handleSecondModalSelection,
    resetModals
  };
}