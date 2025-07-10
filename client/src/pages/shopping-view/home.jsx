import { Button } from "@/components/ui/button";
// import bannerOne from "../../assets/banner-1.webp";
// import bannerTwo from "../../assets/banner-2.webp";
// import bannerThree from "../../assets/banner-3.webp";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import MakeupImg from "@/assets/makeup.svg";
import SkincareImg from "@/assets/skincare.svg";
import HaircareImg from "@/assets/haircare.svg";
import BathbodyImg from "@/assets/bathbody.svg";
import FragranceImg from "@/assets/fragrance.svg";
import AccessoriesImg from "@/assets/accessories.svg";
import MaybellineImg from "@/assets/maybelline.svg";
import LorealImg from "@/assets/loreal.svg";
import TheOrdinaryImg from "@/assets/theordinary.svg";
import CetaphilImg from "@/assets/cetaphil.svg";
import CeraveImg from "@/assets/cerave.svg";
import NeutrogenaImg from "@/assets/neutrogena.svg";
import TresemmeImg from "@/assets/tresemme.svg";
import PanteneImg from "@/assets/pantene.svg";
import DoveImg from "@/assets/dove.svg";
import NiveaImg from "@/assets/nivea.svg";
import HugoBossImg from "@/assets/hugoboss.svg";
import ZaraImg from "@/assets/zara.svg";
import DysonImg from "@/assets/dyson.svg";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "makeup", label: "Makeup", image: MakeupImg },
  { id: "skincare", label: "Skincare", image: SkincareImg },
  { id: "haircare", label: "Haircare", image: HaircareImg },
  { id: "bathbody", label: "Bath & Body", image: BathbodyImg },
  { id: "fragrance", label: "Fragrance", image: FragranceImg },
  { id: "accessories", label: "Accessories", image: AccessoriesImg },
];

const brandsWithIcon = [
  { id: "maybelline", label: "Maybelline", image: MaybellineImg },
  { id: "loreal", label: "L’Oreal", image: LorealImg },
  { id: "theordinary", label: "The Ordinary", image: TheOrdinaryImg },
  { id: "cetaphil", label: "Cetaphil", image: CetaphilImg },
  { id: "cerave", label: "CeraVe", image: CeraveImg },
  { id: "neutrogena", label: "Neutrogena", image: NeutrogenaImg },
  { id: "tresemme", label: "Tresemme", image: TresemmeImg },
  { id: "pantene", label: "Pantene", image: PanteneImg },
  { id: "dove", label: "Dove", image: DoveImg },
  { id: "nivea", label: "Nivea", image: NiveaImg },
  { id: "hugoboss", label: "Hugo Boss", image: HugoBossImg },
  { id: "zara", label: "Zara", image: ZaraImg },
  { id: "dyson", label: "Dyson", image: DysonImg },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute transform -translate-y-1/2 top-1/2 left-4 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute transform -translate-y-1/2 top-1/2 right-4 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="h-64 transition-shadow cursor-pointer hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                  <div className="flex items-center justify-center flex-1 w-full">
                    <img
                      src={categoryItem.image}
                      alt={categoryItem.label}
                      className="object-cover w-full h-40 rounded-lg shadow-md"
                    />
                  </div>
                  <span className="mt-4 text-lg font-bold">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center">Shop by Brand</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="h-64 transition-shadow cursor-pointer hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                  <div className="flex items-center justify-center flex-1 w-full">
                    <img
                      src={brandItem.image}
                      alt={brandItem.label}
                      className="object-cover w-full h-40 rounded-lg shadow-md"
                    />
                  </div>
                  <span className="mt-4 text-lg font-bold">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
