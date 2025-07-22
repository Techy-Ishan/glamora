import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchCustomerAppointments,
  cancelAppointment,
} from "@/store/shop/parlor-slice";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react";

function ShoppingAppointments() {
  const dispatch = useDispatch();
  const { customerAppointments, isLoading } = useSelector(
    (state) => state.shopParlors
  );

  console.log("ShoppingAppointments component loaded");
  console.log("customerAppointments:", customerAppointments);
  console.log("isLoading:", isLoading);

  useEffect(() => {
    console.log("Dispatching fetchCustomerAppointments");
    dispatch(fetchCustomerAppointments());

    // Refresh appointments every 30 seconds to catch new bookings
    const interval = setInterval(() => {
      dispatch(fetchCustomerAppointments());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: "secondary",
        label: "Pending",
        icon: AlertCircleIcon,
      },
      confirmed: {
        variant: "default",
        label: "Confirmed",
        icon: CheckCircleIcon,
      },
      completed: {
        variant: "default",
        label: "Completed",
        icon: CheckCircleIcon,
      },
      cancelled: {
        variant: "destructive",
        label: "Cancelled",
        icon: XCircleIcon,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleRefresh = () => {
    dispatch(fetchCustomerAppointments());
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        console.log("Cancelling appointment:", appointmentId);
        await dispatch(cancelAppointment(appointmentId)).unwrap();
        // Refresh the appointments list after successful cancellation
        dispatch(fetchCustomerAppointments());
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        alert("Failed to cancel appointment. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    console.log("Customer appointments loading...");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customerAppointments || customerAppointments.length === 0) {
    console.log(
      "No customer appointments found, customerAppointments:",
      customerAppointments
    );
    return (
      <div className="py-12 text-center">
        <CalendarIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No appointments
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven&apos;t booked any appointments yet.
        </p>
        <div className="mt-6">
          <Button onClick={() => (window.location.href = "/shop/parlors")}>
            Browse Parlors
          </Button>
        </div>
      </div>
    );
  }

  console.log("Rendering customer appointments:", customerAppointments.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Appointments</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {customerAppointments.map((appointment) => (
        <Card key={appointment._id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {appointment.parlorId?.name}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Appointment #{appointment._id.slice(-8).toUpperCase()}
                </p>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Date and Time */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span>{formatTime(appointment.appointmentTime)}</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Services:</h4>
              <div className="space-y-2">
                {appointment.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-gray-50"
                  >
                    <span className="text-sm">{service.serviceName}</span>
                    <span className="text-sm font-medium">
                      Rs.{service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parlor Contact */}
            <div className="pt-2 space-y-2 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>
                  {appointment.parlorId?.address
                    ? `${appointment.parlorId.address.street}, ${appointment.parlorId.address.city}, ${appointment.parlorId.address.state} - ${appointment.parlorId.address.pincode}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4" />
                <span>{appointment.parlorId?.contact?.phone || "N/A"}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold">
                Rs.{appointment.totalAmount}
              </span>
            </div>

            {/* Action Button */}
            {(appointment.status === "pending" ||
              appointment.status === "confirmed") && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  Cancel Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ShoppingAppointments;
