import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";
import {
  fetchActiveParlors,
  createAppointment,
} from "@/store/shop/parlor-slice";
import { useToast } from "@/components/ui/use-toast";

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

function ParlorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { parlorList, isLoading } = useSelector((state) => state.shopParlors);

  const [selectedParlor, setSelectedParlor] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (parlorList.length === 0) {
      dispatch(fetchActiveParlors());
    }
  }, [dispatch, parlorList.length]);

  useEffect(() => {
    if (parlorList.length > 0) {
      const parlor = parlorList.find((p) => p._id === id);
      setSelectedParlor(parlor);
    }
  }, [parlorList, id]);

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s._id === service._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== service._id);
      } else {
        return [
          ...prev,
          {
            serviceId: service._id,
            serviceName: service.name,
            duration: service.duration,
            price: service.price,
          },
        ];
      }
    });
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );
  };

  const calculateTotalAmount = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  };

  const handleBookAppointment = () => {
    if (!user) {
      toast({
        title: "Please login to book appointment",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      parlorId: selectedParlor._id,
      customerId: user.id,
      services: selectedServices,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      customerNotes: customerNotes || "",
    };

    dispatch(createAppointment(appointmentData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Appointment booked successfully!",
        });
        navigate("/shop/account");
      } else {
        toast({
          title: "Failed to book appointment",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading || !selectedParlor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/shop/parlors")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Parlors
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Parlor Info & Services */}
          <div className="space-y-6 lg:col-span-2">
            {/* Parlor Image */}
            <Card>
              <CardContent className="p-0">
                {selectedParlor.images && selectedParlor.images.length > 0 ? (
                  <img
                    src={selectedParlor.images[0]}
                    alt={selectedParlor.name}
                    className="object-cover w-full h-64 rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-64 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100">
                    <Users className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parlor Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {selectedParlor.name}
                    </h2>
                  </div>
                </div>

                <p className="mb-6 text-gray-600">
                  {selectedParlor.description}
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">
                        {selectedParlor.address?.street}
                      </div>
                      <div className="text-gray-600">
                        {selectedParlor.address?.city},{" "}
                        {selectedParlor.address?.state} -{" "}
                        {selectedParlor.address?.pincode}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{selectedParlor.contact?.phone}</span>
                  </div>
                  {selectedParlor.contact?.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{selectedParlor.contact?.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">Our Services</h3>
                <p className="mb-6 text-gray-600">
                  Select the services you&apos;d like to book
                </p>

                <div className="space-y-4">
                  {selectedParlor.services?.map((service) => (
                    <div key={service._id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={service._id}
                          checked={selectedServices.some(
                            (s) => s.serviceId === service._id
                          )}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={service._id}
                            className="text-lg font-medium cursor-pointer"
                          >
                            {service.name}
                          </Label>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} min
                            </div>
                            <div className="text-lg font-bold text-pink-600">
                              Rs.{service.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold">Booking Summary</h3>

                {selectedServices.map((service) => (
                  <div
                    key={service.serviceId}
                    className="flex items-center justify-between mb-2"
                  >
                    <span className="text-sm">{service.serviceName}</span>
                    <span className="font-medium">Rs.{service.price}</span>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Duration:</span>
                    <span>{calculateTotalDuration()} min</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>Rs.{calculateTotalAmount()}</span>
                  </div>
                </div>

                {calculateTotalAmount() > 0 && (
                  <Button
                    className="w-full mt-4"
                    onClick={handleBookAppointment}
                  >
                    Book Appointment
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold">
                  Book Your Appointment
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label>Select Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start w-full font-normal text-left"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {selectedDate
                            ? selectedDate.toDateString()
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Select Time *</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Notes</Label>
                    <Textarea
                      id="notes"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleBookAppointment}
                      disabled={
                        !selectedDate ||
                        !selectedTime ||
                        selectedServices.length === 0
                      }
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParlorDetail;
