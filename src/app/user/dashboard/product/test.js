import axios  from 'axios';
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`/user/api/auth/products?id=${productId}`, productData
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: productData,
    );
    
    const data = response.data;
    
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to update product');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/api/products/${productId}`);
    
    const data = response.data;
    
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to delete product');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Duplicate product (could be a POST to /api/products with copy flag)
export const duplicateProduct = async (product) => {
  try {
    const productData = {
      name: `${product.name} (Copy)`,
      price: product.price,
      description: product.description,
      category: product.category,
      storeId: storeId,
      // Add other fields as needed
    };
    
    const response = await axios.post('/api/products', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: productData,
    });
    
    const data = response.data;
    
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to duplicate product');
    }
    
    return data;
  } catch (error) {
    console.error('Error duplicating product:', error);
    throw error;
  }
};