import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentCancelledPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl text-yellow-600">
          Payment Cancelled!
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-gray-600 mb-4">
          You have cancelled the payment. Your order is still in your cart.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/shop/checkout")}>
            Complete Payment
          </Button>
          <Button variant="outline" onClick={() => navigate("/shop/home")}>
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentCancelledPage;
