import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchParlorOwnerAppointments,
  updateAppointmentStatus,
} from "@/store/admin/parlor-slice";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

function ParlorOwnerDashboard() {
  const dispatch = useDispatch();
  const { parlorOwnerAppointments, isLoading } = useSelector(
    (state) => state.adminParlors
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchParlorOwnerAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const filterAppointmentsByStatus = (status) => {
    return (
      parlorOwnerAppointments?.filter(
        (appointment) => appointment.appointmentStatus === status
      ) || []
    );
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await dispatch(
        updateAppointmentStatus({ appointmentId, status: newStatus })
      ).unwrap();
      dispatch(fetchParlorOwnerAppointments(user.id));
    } catch (error) {
      console.error("Failed to update appointment status:", error);
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
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderAppointmentCard = (appointment) => (
    <Card key={appointment._id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              {appointment.userName}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(appointment.appointmentDate)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {formatTime(appointment.appointmentTime)}
              </span>
              <span className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4" />
                {appointment.userPhone}
              </span>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(
              appointment.appointmentStatus
            )} border-0`}
          >
            {appointment.appointmentStatus.charAt(0).toUpperCase() +
              appointment.appointmentStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Services:</p>
            <p className="text-gray-600">
              {appointment.notes || "No specific services mentioned"}
            </p>
          </div>

          {appointment.appointmentStatus === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                className="flex items-center gap-1"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                className="flex items-center gap-1"
              >
                <XCircleIcon className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}

          {appointment.appointmentStatus === "confirmed" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(appointment._id, "completed")}
                className="flex items-center gap-1"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
                className="flex items-center gap-1"
              >
                <XCircleIcon className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold">Parlor Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and bookings</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Appointment Management</h2>
          <p className="text-gray-600">
            View and manage your customer appointments
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {filterAppointmentsByStatus("pending").length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filterAppointmentsByStatus("pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="relative">
              Confirmed
              {filterAppointmentsByStatus("confirmed").length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filterAppointmentsByStatus("confirmed").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              {filterAppointmentsByStatus("completed").length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filterAppointmentsByStatus("completed").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="relative">
              Cancelled
              {filterAppointmentsByStatus("cancelled").length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filterAppointmentsByStatus("cancelled").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {filterAppointmentsByStatus("pending").length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All caught up! No pending appointments to review.
                  </p>
                </div>
              ) : (
                filterAppointmentsByStatus("pending").map(renderAppointmentCard)
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            <div className="space-y-4">
              {filterAppointmentsByStatus("confirmed").length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No confirmed appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Confirmed appointments will appear here.
                  </p>
                </div>
              ) : (
                filterAppointmentsByStatus("confirmed").map(
                  renderAppointmentCard
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {filterAppointmentsByStatus("completed").length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No completed appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Completed appointments will appear here.
                  </p>
                </div>
              ) : (
                filterAppointmentsByStatus("completed").map(
                  renderAppointmentCard
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <div className="space-y-4">
              {filterAppointmentsByStatus("cancelled").length === 0 ? (
                <div className="text-center py-12">
                  <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No cancelled appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cancelled appointments will appear here.
                  </p>
                </div>
              ) : (
                filterAppointmentsByStatus("cancelled").map(
                  renderAppointmentCard
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ParlorOwnerDashboard;
