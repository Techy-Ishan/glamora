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
} from "lucide-react";

function ShoppingAppointments() {
  const dispatch = useDispatch();
  const { customerAppointments, isLoading } = useSelector(
    (state) => state.shopParlor
  );

  useEffect(() => {
    dispatch(fetchCustomerAppointments());
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
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      dispatch(cancelAppointment(appointmentId));
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!customerAppointments || customerAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
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

  return (
    <div className="space-y-4">
      {customerAppointments.map((appointment) => (
        <Card key={appointment._id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {appointment.parlorId?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
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
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span>{formatTime(appointment.appointmentTime)}</span>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium text-sm mb-2">Services:</h4>
              <div className="space-y-2">
                {appointment.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{service.name}</span>
                    <span className="text-sm font-medium">
                      Rs.{service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parlor Contact */}
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                <span>{appointment.parlorId?.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4" />
                <span>{appointment.parlorId?.phone}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg">
                Rs.{appointment.totalAmount}
              </span>
            </div>

            {/* Action Button */}
            {appointment.status === "pending" && (
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
