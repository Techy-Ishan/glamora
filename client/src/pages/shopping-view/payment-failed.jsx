import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentFailedPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl text-red-600">Payment Failed!</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <p className="text-gray-600 mb-4">
          Your payment could not be processed. Please try again or contact
          support.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/shop/checkout")}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/shop/home")}>
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentFailedPage;
