export const Role = {
  SELLER: "seller",
  REGULAR_USER: "regular_user",
};

export const Permission = {
  BROWSE_CATEGORIES: "browse_categories",
  READ_CATEGORY: "read_category",
  EDIT_CATEGORY: "edit_category",
  ADD_CATEGORY: "add_category",
  DELETE_CATEGORY: "delete_category",

  BROWSE_PRODUCTS: "browse_products",
  READ_PRODUCT: "read_product",
  EDIT_PRODUCT: "edit_product",
  ADD_PRODUCT: "add_product",
  DELETE_PRODUCT: "delete_product",

  BROWSE_CART: "browse_cart",
  READ_CART: "read_cart",
  EDIT_CART: "edit_cart",
  ADD_CART: "add_cart",
  DELETE_CART: "delete_cart",

  BROWSE_ORDER_ITEMS: "browse_order_items",
  READ_ORDER_ITEM: "read_order_item",
  EDIT_ORDER_ITEM: "edit_order_item",
  ADD_ORDER_ITEM: "add_order_item",
  DELETE_ORDER_ITEM: "delete_order_item",

  BROWSE_ORDERS: "browse_orders",
  READ_ORDER: "read_order",
  EDIT_ORDER: "edit_order",
  ADD_ORDER: "add_order",
  DELETE_ORDER: "delete_order",
};

// Permission.BROWSE_BOOKS
export const PermissionAssignment = {
  [Role.SELLER]: [
    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.ADD_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_ORDERS,
    Permission.READ_ORDER,
  ],

  [Role.REGULAR_USER]: [
    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,

    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,

    Permission.BROWSE_CART,
    Permission.READ_CART,
    Permission.EDIT_CART,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.BROWSE_ORDER_ITEMS,
    Permission.READ_ORDER_ITEM,
    Permission.ADD_ORDER_ITEM,

    Permission.BROWSE_ORDERS,
    Permission.READ_ORDER,
    Permission.EDIT_ORDER,
    Permission.ADD_ORDER,
    Permission.DELETE_ORDER,
  ],
};
