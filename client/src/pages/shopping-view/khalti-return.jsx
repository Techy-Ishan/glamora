import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function KhaltiReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Get parameters from Khalti callback
  const pidx = params.get("pidx");
  const status = params.get("status");
  const transactionId = params.get("transaction_id");

  useEffect(() => {
    if (pidx && status) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      if (status === "Completed") {
        // Payment successful, capture the payment
        dispatch(capturePayment({ pidx, orderId })).then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          } else {
            // Handle payment verification failure
            window.location.href = "/shop/payment-failed";
          }
        });
      } else if (status === "User canceled") {
        // User canceled the payment
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/shop/payment-cancelled";
      } else {
        // Other statuses (Pending, etc.)
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/shop/payment-failed";
      }
    }
  }, [pidx, status, transactionId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default KhaltiReturnPage;
