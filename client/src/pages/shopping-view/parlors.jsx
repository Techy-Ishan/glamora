import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Search,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";
import { fetchActiveParlors, searchParlors } from "@/store/shop/parlor-slice";
import bannerImage from "@/assets/IMG-20250708-WA0004.jpg"; // Update with your actual banner image path

function ShoppingParlors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const { parlorList, isLoading } = useSelector((state) => state.shopParlors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchActiveParlors());
  }, [dispatch]);

  const handleSearch = () => {
    const searchParams = {};
    if (searchCity.trim()) searchParams.city = searchCity.trim();
    if (searchQuery.trim()) searchParams.service = searchQuery.trim();

    if (Object.keys(searchParams).length > 0) {
      dispatch(searchParlors(searchParams));
    } else {
      dispatch(fetchActiveParlors());
    }
  };

  const handleParlorClick = (parlor) => {
    navigate(`/shop/parlors/${parlor._id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative flex items-end text-white bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bannerImage})`,
          minHeight: "60vh",
        }}
      >
        <div className="container px-4 pb-16 mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Find Your Perfect Beauty Parlor
          </h1>
          <p className="mb-8 text-xl">
            Book appointments with top-rated beauty professionals
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search services (haircut, facial, etc.)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-900"
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Enter city"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="text-gray-900"
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Parlors Grid */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Available Parlors</h2>
          <div className="text-gray-600">{parlorList.length} parlors found</div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                  <div className="h-3 mb-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : parlorList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-lg text-gray-500">No parlors found</div>
            <p className="mt-2 text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parlorList.map((parlor) => (
              <Card
                key={parlor._id}
                className="transition-shadow duration-300 cursor-pointer hover:shadow-lg"
                onClick={() => handleParlorClick(parlor)}
              >
                <div className="relative">
                  {parlor.images && parlor.images.length > 0 ? (
                    <img
                      src={parlor.images[0]}
                      alt={parlor.name}
                      className="object-cover w-full h-48 rounded-t-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 rounded-t-lg bg-gradient-to-br from-pink-100 to-purple-100">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {parlor.name}
                    </h3>
                  </div>

                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {parlor.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {parlor.address?.city}, {parlor.address?.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {parlor.contact?.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      9:00 AM - 8:00 PM
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {parlor.services?.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service.name}
                      </Badge>
                    ))}
                    {parlor.services?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{parlor.services.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Starting from{" "}
                      <span className="font-semibold text-pink-600">
                        Rs.500
                      </span>
                    </div>
                    <Button size="sm">
                      Book Now
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingParlors;
