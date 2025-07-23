import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllAppointments } from "@/store/admin/appointments-slice/index";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  BuildingIcon,
} from "lucide-react";

function AdminAppointments() {
  const dispatch = useDispatch();
  const { allAppointments, isLoading } = useSelector(
    (state) => state.adminAppointments
  );

  console.log("AdminAppointments component loaded");
  console.log("allAppointments:", allAppointments);
  console.log("isLoading:", isLoading);

  useEffect(() => {
    console.log("Dispatching fetchAllAppointments");
    dispatch(fetchAllAppointments());
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
    dispatch(fetchAllAppointments());
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
    console.log("Admin appointments loading...");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!allAppointments || allAppointments.length === 0) {
    console.log(
      "No admin appointments found, allAppointments:",
      allAppointments
    );
    return (
      <div className="py-12 text-center">
        <CalendarIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No appointments found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No parlor appointments have been made yet.
        </p>
      </div>
    );
  }

  console.log("Rendering admin appointments:", allAppointments.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parlor Appointments</h1>
          <p className="text-gray-600">
            View all appointments across all parlors
          </p>
        </div>
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

      <div className="space-y-4">
        {allAppointments.map((appointment) => (
          <Card
            key={appointment._id}
            className="border-2 border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Appointment #{appointment._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <BuildingIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-muted-foreground">
                      {appointment.parlorId?.name || "Unknown Parlor"}
                    </span>
                  </div>
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

              {/* Customer Information */}
              <div className="p-3 border rounded-lg bg-gray-50">
                <h4 className="mb-2 text-sm font-medium">Customer Details:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span>
                      {appointment.customerId?.userName || "Unknown Customer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-500" />
                    <span>
                      {appointment.customerId?.phone || "No phone number"}
                    </span>
                  </div>
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

              {/* Parlor Information */}
              <div className="p-3 border rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-medium">
                  Parlor Information:
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Address: </span>
                    <span>
                      {appointment.parlorId?.address
                        ? `${appointment.parlorId.address.street}, ${appointment.parlorId.address.city}, ${appointment.parlorId.address.state} - ${appointment.parlorId.address.pincode}`
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Phone: </span>
                    <span>{appointment.parlorId?.contact?.phone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email: </span>
                    <span>{appointment.parlorId?.contact?.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">
                  Rs.{appointment.totalAmount}
                </span>
              </div>

              {/* Customer Notes */}
              {appointment.customerNotes && (
                <div className="p-3 border rounded-lg bg-yellow-50">
                  <h4 className="mb-1 text-sm font-medium">Customer Notes:</h4>
                  <p className="text-sm text-gray-700">
                    {appointment.customerNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminAppointments;
