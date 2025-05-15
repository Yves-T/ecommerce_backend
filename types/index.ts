export interface Property {
  name: string;
  values: string;
}

export interface Product {
  id?: string;
  name: string;
  category?: Category;
  images?: ProductImage[];
  description: string;
  price: number;
  properties?: { [key: string]: string };
}

export interface Order {
  line_items: string;
  name: string;
  email: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  country: string;
  paid: boolean;
}

// line_ites JSON
// [
//   {
//     price_data: {
//       product_data: { name: "Macbook 14 Pro" },
//       currency: "EUR",
//       unit_amount: 199900,
//     },
//     quantity: 2,
//   },
//   {
//     price_data: {
//       product_data: { name: "Sony WH1000MX4 black" },
//       currency: "EUR",
//       unit_amount: 30000,
//     },
//     quantity: 1,
//   },
// ];

export interface ProductImage {
  id: string;
  imageId: string;
  imageUrl: string;
}

export interface UploadImage {
  images: File[];
}

export interface Category {
  id?: string;
  name: string;
  properties: Property[];
  parent?: Category;
  _count?: number;
}

export type LineItem = {
  quantity: number;
  price_data: {
    currency: string;
    product_data: { name: string };
    unit_amount: number;
  };
};
