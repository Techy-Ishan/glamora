export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "makeup", label: "Makeup" },
      { id: "skincare", label: "Skincare" },
      { id: "haircare", label: "Haircare" },
      { id: "bathbody", label: "Bath & Body" },
      { id: "fragrance", label: "Fragrance" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "maybelline", label: "Maybelline" },
      { id: "loreal", label: "L’Oreal" },
      { id: "theordinary", label: "The Ordinary" },
      { id: "cetaphil", label: "Cetaphil" },
      { id: "cerave", label: "CeraVe" },
      { id: "neutrogena", label: "Neutrogena" },
      { id: "tresemme", label: "Tresemme" },
      { id: "pantene", label: "Pantene" },
      { id: "dove", label: "Dove" },
      { id: "nivea", label: "Nivea" },
      { id: "hugoboss", label: "Hugo Boss" },
      { id: "zara", label: "Zara" },
      { id: "dyson", label: "Dyson" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "makeup",
    label: "Makeup",
    path: "/shop/listing",
  },
  {
    id: "skincare",
    label: "Skincare",
    path: "/shop/listing",
  },
  {
    id: "haircare",
    label: "Haircare",
    path: "/shop/listing",
  },
  {
    id: "bathbody",
    label: "Bath & Body",
    path: "/shop/listing",
  },
  {
    id: "fragrance",
    label: "Fragrance",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  makeup: "Makeup",
  skincare: "Skincare",
  haircare: "Haircare",
  bathbody: "Bath & Body",
  fragrance: "Fragrance",
  accessories: "Accessories",
};

export const brandOptionsMap = {
  maybelline: "Maybelline",
  loreal: "L’Oreal",
  theordinary: "The Ordinary",
  cetaphil: "Cetaphil",
  cerave: "CeraVe",
  neutrogena: "Neutrogena",
  tresemme: "Tresemme",
  pantene: "Pantene",
  dove: "Dove",
  nivea: "Nivea",
  hugoboss: "Hugo Boss",
  zara: "Zara",
  dyson: "Dyson",
};

export const filterOptions = {
  category: [
    { id: "makeup", label: "Makeup" },
    { id: "skincare", label: "Skincare" },
    { id: "haircare", label: "Haircare" },
    { id: "bathbody", label: "Bath & Body" },
    { id: "fragrance", label: "Fragrance" },
    { id: "accessories", label: "Accessories" },
  ],
  brand: [
    { id: "maybelline", label: "Maybelline" },
    { id: "loreal", label: "L’Oreal" },
    { id: "theordinary", label: "The Ordinary" },
    { id: "cetaphil", label: "Cetaphil" },
    { id: "cerave", label: "CeraVe" },
    { id: "neutrogena", label: "Neutrogena" },
    { id: "tresemme", label: "Tresemme" },
    { id: "pantene", label: "Pantene" },
    { id: "dove", label: "Dove" },
    { id: "nivea", label: "Nivea" },
    { id: "hugoboss", label: "Hugo Boss" },
    { id: "zara", label: "Zara" },
    { id: "dyson", label: "Dyson" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
