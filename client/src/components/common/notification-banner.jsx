import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);
  const { customerAppointments } = useSelector((state) => state.shopParlors);

  // Get processed notifications from localStorage
  const getProcessedNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem("processedNotifications");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Save processed notifications to localStorage
  const saveProcessedNotification = useCallback(
    (key) => {
      try {
        const processed = getProcessedNotifications();
        processed[key] = Date.now();
        // Clean up old entries (older than 24 hours)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        Object.keys(processed).forEach((k) => {
          if (processed[k] < oneDayAgo) {
            delete processed[k];
          }
        });
        localStorage.setItem(
          "processedNotifications",
          JSON.stringify(processed)
        );
      } catch (error) {
        console.error("Error saving notification state:", error);
      }
    },
    [getProcessedNotifications]
  );

  // Debug function to clear localStorage (can be removed in production)
  const clearNotificationHistory = useCallback(() => {
    try {
      localStorage.removeItem("processedNotifications");
      console.log("Notification history cleared");
    } catch (error) {
      console.error("Error clearing notification history:", error);
    }
  }, []);

  // Add this temporarily for testing - remove in production
  useEffect(() => {
    // Uncomment the line below to clear notification history on component mount for testing
    // clearNotificationHistory();
  }, [clearNotificationHistory]);

  // Remove auto-dismiss functionality - notifications persist until manually dismissed
  // useEffect(() => {
  //   const timers = notifications.map(notification => {
  //     return setTimeout(() => {
  //       dismissNotification(notification.id);
  //     }, 10000);
  //   });
  //
  //   return () => {
  //     timers.forEach(timer => clearTimeout(timer));
  //   };
  // }, [notifications]);

  // Check for new notifications only when appointments data changes
  useEffect(() => {
    if (!customerAppointments || customerAppointments.length === 0) return;

    const processedNotifications = getProcessedNotifications();

    customerAppointments.forEach((appointment) => {
      const appointmentKey = `${appointment._id}-${appointment.status}`;

      // Only show notification if we haven't processed this status change
      if (!processedNotifications[appointmentKey]) {
        let title = "";
        let message = "";
        let variant = "default";

        switch (appointment.status) {
          case "confirmed":
            title = "🎉 Appointment Confirmed!";
            message = `Your appointment at ${
              appointment.parlorId?.name || "the parlor"
            } has been confirmed.`;
            variant = "success";
            break;
          case "cancelled":
            // Only show notification if parlor cancelled, not if customer cancelled
            if (appointment.cancelledBy === "parlor") {
              title = "❌ Slot Not Available";
              message =
                "Services are not available for this time slot. Please book a different slot.";
              variant = "destructive";
            } else {
              // Skip notification for customer-initiated cancellations
              title = "";
              message = "";
            }
            break;
          case "completed":
            title = "✅ Service Completed";
            message = `Thank you for visiting ${
              appointment.parlorId?.name || "our parlor"
            }!`;
            variant = "success";
            break;
        }

        if (title && message && appointment.status !== "pending") {
          // Mark this notification as processed
          saveProcessedNotification(appointmentKey);

          const newNotification = {
            id: appointmentKey,
            title,
            message,
            appointmentId: appointment._id,
            timestamp: new Date(),
            variant,
          };

          setNotifications((prev) => {
            // Remove any existing notification for the same appointment
            const filtered = prev.filter(
              (n) => !n.id.startsWith(appointment._id)
            );
            return [...filtered, newNotification];
          });
        }
      }
    });
  }, [
    customerAppointments,
    getProcessedNotifications,
    saveProcessedNotification,
  ]);

  const dismissNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed z-50 max-w-sm space-y-2 top-20 right-4">
      {notifications.length > 1 && (
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={dismissAllNotifications}
            className="text-xs bg-white shadow-sm"
          >
            Dismiss All ({notifications.length})
          </Button>
        </div>
      )}

      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`bg-white shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-right ${
            notification.variant === "destructive"
              ? "border-l-4 border-l-red-500"
              : "border-l-4 border-l-green-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Bell
                  className={`w-5 h-5 mt-0.5 ${
                    notification.variant === "destructive"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                title="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default NotificationBanner;
