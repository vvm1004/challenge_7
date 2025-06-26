import axios from "services/axios.customize";


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//User Module
export const getUsersAPI = async (params: Record<string, any>) => {
  await delay(50);
  const res = await axios.get("/users", { params });
  return {
    result: res.data.data, // mảng user
    total: res.data.items, // tổng số user
  };
};

export const deleteUserAPI = async (id: number) => {
  try {
    await axios.delete(`/users/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export const createUserAPI = async (data:
  IUserTable
) => {
  try {
    const response = await axios.post(`/users`, data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }
};

export const updateUserAPI = async (id: number, data: Partial<IUserTable>) => {
  try {
    const response = await axios.patch(`/users/${id}`, data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
};

export const checkEmailDuplicateAPI = async (email: string) => {
  try {
    const response = await axios.get(`/users?email=${email}`);
    return {
      success: true,
      isDuplicate: response.data.length > 0,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to check email",
    };
  }
};
export const getUserByIdAPI = async (id: number) => {
  return await axios.get(`users/${id}`);
};

//Product Module
export const getProductsAPI = async (params: Record<string, any>) => {
  await delay(50);

  const res = await axios.get("/products", { params });

  return {
    result: res.data.data,
    total: res.data.items,
  };
};
export const deleteProductAPI = async (id: number) => {
  try {
    await axios.delete(`/products/${id}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete product",
    };
  }
}
export const createProductAPI = async (data:
  IProductTable
) => {
  try {
    const response = await axios.post(`/products`, data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create product",
    };
  }
};


export const getCategoryAPI = async () => {
  try {
    const res = await axios.get("/categories");
    return { data: res.data };
  } catch (err) {
    return { message: "Failed to fetch categories" };
  }
};


export const updateProductAPI = async (id: number, data: Partial<IProductTable>) => {
  try {
    const response = await axios.patch(`/products/${id}`, data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
};
export const getProductByIdAPI = async (id: number) => {
  return await axios.get(`/products/${id}`);
};

// Order Module

export const getOrdersAPI = async (params: Record<string, any>) => {
  await delay(50);
  const res = await axios.get("/orders", { params });
  return {
    result: res.data.data, 
    total: res.data.items, 
  };
};

export const updateOrderAPI = async (id: number, data: Partial<IProductTable>) => {
  try {
    const response = await axios.patch(`/orders/${id}`, data);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update order",
    };
  }
};

// Dashboard Module
export const getDashboardAPI = async () => {
  try {
    const [userRes, productRes, orderRes] = await Promise.all([
      axios.get("/users", { params: { _page: 1, _per_page: 1 } }),
      axios.get("/products", { params: { _page: 1, _per_page: 1 } }),
      axios.get("/orders", { params: { _page: 1, _per_page: 1 } }),
    ]);

    return {
      success: true,
      data: {
        countUser: userRes.data.items || 0,
        countProduct: productRes.data.items || 0,
        countOrder: orderRes.data.items || 0,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch dashboard stats",
    };
  }
};

