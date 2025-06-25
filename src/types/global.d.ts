export { };

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IRegister {
    _id: string;
    email: string;
    fullName: string;
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    id?: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: "admin" | "customer";
    createdAt: string; // vẫn là string nhưng định dạng ISO datetime
    updatedAt: string;
  }


  interface IResponseImport {
    countSuccess: number;
    countError: number;
    detail: any;
  }

  interface IBookTable {
    id?: number;
    name: string;
    description?: string;
    author: string;
    price: number;
    stock: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
  }


  interface ICart {
    _id: string;
    quantity: number;
    detail: IBookTable;
  }

  // interface IHistory {
  //   _id: string;
  //   name: string;
  //   type: string;
  //   email: string;
  //   phone: string;
  //   userId: string;
  //   detail: {
  //     bookName: string;
  //     quantity: number;
  //     _id: string;
  //   }[];
  //   totalPrice: number;
  //   createdAt: Date;
  //   updatedAt: Date;
  // }

  // interface IOrderTable extends IHistory { }

 type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
 
 interface IOrder {
   id: number;
   userId: number;
   productIds: number[];
   amount: number;
   totalPrice: number;
   status: OrderStatus;
   createdAt: string;
 }
 interface IOrderWithUser extends IOrder {
  userFullName?: string;
}

}
