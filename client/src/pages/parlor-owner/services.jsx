import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClockIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SettingsIcon,
} from "lucide-react";
import {
  fetchMyParlor,
  addParlorService,
  updateParlorService,
  deleteParlorService,
} from "@/store/admin/parlor-slice";
import { useToast } from "@/components/ui/use-toast";

function ParlorOwnerServices() {
  const dispatch = useDispatch();
  const { myParlor, isLoading } = useSelector((state) => state.adminParlors);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching parlor data for user:", user.id);
      dispatch(fetchMyParlor());
    }
  }, [dispatch, user?.id]);

  const handleAddService = async () => {
    try {
      if (!myParlor?._id) {
        toast({
          title: "Error",
          description: "Parlor not found",
          variant: "destructive",
        });
        return;
      }

      const serviceData = {
        name: serviceForm.name,
        description: serviceForm.description,
        duration: parseInt(serviceForm.duration),
        price: parseFloat(serviceForm.price),
      };

      if (editingService) {
        await dispatch(
          updateParlorService({
            parlorId: myParlor._id,
            serviceId: editingService._id,
            serviceData,
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        await dispatch(
          addParlorService({
            parlorId: myParlor._id,
            serviceData,
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Service added successfully",
        });
      }

      setIsAddServiceOpen(false);
      setEditingService(null);
      setServiceForm({ name: "", description: "", duration: "", price: "" });
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
    });
    setIsAddServiceOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await dispatch(
        deleteParlorService({
          parlorId: myParlor._id,
          serviceId,
        })
      ).unwrap();
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const services = myParlor?.services || [];

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Service Management</h1>
              <p className="text-gray-600">
                Add and manage your parlor services
              </p>
            </div>
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? "Edit Service" : "Add New Service"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      value={serviceForm.name}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, name: e.target.value })
                      }
                      placeholder="e.g., Haircut, Facial, Manicure"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceDescription">Description</Label>
                    <Textarea
                      id="serviceDescription"
                      value={serviceForm.description}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceDuration">
                        Duration (minutes)
                      </Label>
                      <Input
                        id="serviceDuration"
                        type="number"
                        value={serviceForm.duration}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            duration: e.target.value,
                          })
                        }
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicePrice">Price (Rs.)</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        value={serviceForm.price}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            price: e.target.value,
                          })
                        }
                        placeholder="500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddServiceOpen(false);
                        setEditingService(null);
                        setServiceForm({
                          name: "",
                          description: "",
                          duration: "",
                          price: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddService}>
                      {editingService ? "Update Service" : "Add Service"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {services.length === 0 ? (
              <div className="py-12 text-center">
                <SettingsIcon className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No services added yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by adding your first service to attract customers.
                </p>
              </div>
            ) : (
              services.map((service) => (
                <Card key={service._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {service.name}
                        </h3>
                        <p className="mt-1 text-gray-600">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4" />
                            {service.duration} min
                          </span>
                          <span className="text-lg font-semibold text-green-600">
                            Rs.{service.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(service._id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParlorOwnerServices;
