import axios from "services/axios.customize";

// export const fetchAccountAPI = () => {
//   const urlBackend = "/api/v1/auth/account";
//   return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
//     headers: {
//       delay: 1000,
//     },
//   });
// };
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

export const updateUserAPI = async (id: string, data: Partial<IUserTable>) => {
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

export const bulkCreateUserAPI = async (users: Partial<IUserTable>[]) => {
  try {
    // Step 1: Get all existing users
    const existingRes = await axios.get(`/users`);
    const existingUsers = existingRes.data;
    const existingEmails = new Set(existingUsers.map((user: any) => user.email));

    // Step 2: Get max ID
    let maxId = existingUsers.reduce((max: number, user: any) => {
      const idNum = parseInt(user.id, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);

    // Step 3: Filter out duplicate emails and prepare valid users
    const now = new Date().toISOString();
    const validUsers: IUserTable[] = [];
    let countError = 0;

    for (const user of users) {
      if (existingEmails.has(user.email)) {
        countError++;
        continue;
      }

      maxId++;

      validUsers.push({
        id: maxId.toString(),
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role || "customer",
        createdAt: now,
        updatedAt: now,
      });
    }

    // Step 4: Send each user with POST
    const postRequests = validUsers.map((user) => axios.post(`/users`, user));
    await Promise.all(postRequests);

    return {
      success: true,
      data: {
        countSuccess: validUsers.length,
        countError,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Bulk create failed",
    };
  }
};

// export const bulkCreateUserAPI = (
//   hoidanit: {
//     fullName: string;
//     password: string;
//     email: string;
//     phone: string;
//   }[]
// ) => {
//   const urlBackend = "/api/v1/user/bulk-create";
//   return axios.post<IBackendRes<IResponseImport>>(urlBackend, hoidanit);
// };

//Book Module
export const getBooksAPI = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
    headers: {
      delay: 500,
    },
  });
};
export const getCategoryAPI = () => {
  const urlBackend = `/api/v1/database/category`;
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folder,
    },
  });
};

export const createBookAPI = (
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const updateBookAPI = (
  _id: string,
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const deleteBookAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getBookByIdAPI = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackend, {
    headers: {
      delay: 500,
    },
  });
};

export const createOrderAPI = (
  name: string,
  address: string,
  phone: string,
  totalPrice: number,
  type: string,
  detail: any
) => {
  const urlBackend = "/api/v1/order";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    name,
    address,
    phone,
    totalPrice,
    type,
    detail,
  });
};

export const getHistoryAPI = () => {
  const urlBackend = `/api/v1/history`;
  return axios.get<IBackendRes<IHistory[]>>(urlBackend);
};

export const updateUserInfoAPI = (
  _id: string,
  avatar: string,
  fullName: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    phone,
    avatar,
    _id,
  });
};

export const updateUserPasswordAPI = (
  email: string,
  oldpass: string,
  newpass: string
) => {
  const urlBackend = "/api/v1/user/change-password";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    email,
    oldpass,
    newpass,
  });
};

export const getOrdersAPI = (query: string) => {
  const urlBackend = `/api/v1/order?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

export const getDashboardAPI = () => {
  const urlBackend = `/api/v1/database/dashboard`;
  return axios.get<
    IBackendRes<{
      countOrder: number;
      countUser: number;
      countBook: number;
    }>
  >(urlBackend);
};
