export { };

declare global {
 
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



  interface IProductTable {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    createdAt: string;
    updatedAt: string;
  }

 type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
 
 interface IOrder {
   id: number;
   userId: number;
   productIds: number[];
   amount: number;
   totalPrice: number;
   status: OrderStatus;
   createdAt: string;
   updatedAt: string;

 }
 interface IOrderWithUser extends IOrder {
  userFullName?: string;
}

}
