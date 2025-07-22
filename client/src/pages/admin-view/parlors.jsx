import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchAllParlors,
  fetchAllUsers,
  createParlor,
  updateParlor,
  deleteParlor,
} from "@/store/admin/parlor-slice";
import { Edit, Trash2, Plus, MapPin, Phone, Mail, Users } from "lucide-react";
import CommonForm from "@/components/common/form";

const initialFormData = {
  name: "",
  description: "",
  ownerId: "",
  address: {
    street: "",
    city: "",
    state: "",
    pincode: "",
  },
  contact: {
    phone: "",
    email: "",
    website: "",
  },
  services: [],
};

const parlorFormControls = [
  {
    label: "Parlor Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter parlor name",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter parlor description",
  },
  {
    label: "Street Address",
    name: "address.street",
    componentType: "input",
    type: "text",
    placeholder: "Enter street address",
  },
  {
    label: "City",
    name: "address.city",
    componentType: "input",
    type: "text",
    placeholder: "Enter city",
  },
  {
    label: "State",
    name: "address.state",
    componentType: "input",
    type: "text",
    placeholder: "Enter state",
  },
  {
    label: "Pincode",
    name: "address.pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter pincode",
  },
  {
    label: "Phone",
    name: "contact.phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter phone number",
  },
  {
    label: "Email",
    name: "contact.email",
    componentType: "input",
    type: "email",
    placeholder: "Enter email address",
  },
  {
    label: "Website",
    name: "contact.website",
    componentType: "input",
    type: "text",
    placeholder: "Enter website URL (optional)",
  },
];

function AdminParlors() {
  const [openCreateEditSheet, setOpenCreateEditSheet] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [ownerFormControl, setOwnerFormControl] = useState(null);

  const { parlorList, userList } = useSelector((state) => state.adminParlors);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    console.log("Form submitted with data:", formData);

    if (!formData.ownerId) {
      toast({
        title: "Please select a parlor owner",
        variant: "destructive",
      });
      return;
    }

    const parlorData = {
      ...formData,
    };

    if (currentEditedId !== null) {
      dispatch(updateParlor({ id: currentEditedId, parlorData })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllParlors());
            setFormData(initialFormData);
            setOpenCreateEditSheet(false);
            setCurrentEditedId(null);
            toast({
              title: "Parlor updated successfully",
            });
          }
        }
      );
    } else {
      dispatch(createParlor(parlorData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllParlors());
          setOpenCreateEditSheet(false);
          setFormData(initialFormData);
          toast({
            title: "Parlor created successfully",
          });
        }
      });
    }
  }

  function handleDeleteParlor(parlorId) {
    dispatch(deleteParlor(parlorId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllParlors());
        toast({
          title: "Parlor deleted successfully",
        });
      }
    });
  }

  function handleEditParlor(parlor) {
    setCurrentEditedId(parlor._id);
    setFormData({
      name: parlor.name,
      description: parlor.description,
      ownerId: parlor.ownerId._id,
      address: parlor.address,
      contact: parlor.contact,
      services: parlor.services,
    });
    setOpenCreateEditSheet(true);
  }

  useEffect(() => {
    dispatch(fetchAllParlors());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userList.length > 0) {
      const availableUsers = userList.filter(
        (user) =>
          !parlorList.some((parlor) => parlor.ownerId?._id === user._id) ||
          (currentEditedId &&
            parlorList.find((p) => p._id === currentEditedId)?.ownerId?._id ===
              user._id)
      );

      setOwnerFormControl({
        label: "Parlor Owner",
        name: "ownerId",
        componentType: "select",
        options: availableUsers.map((user) => ({
          id: user._id,
          label: `${user.userName} (${user.email})`,
        })),
      });
    }
  }, [userList, parlorList, currentEditedId]);

  const finalFormControls = ownerFormControl
    ? [ownerFormControl, ...parlorFormControls]
    : parlorFormControls;

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between">
        <h1 className="text-3xl font-bold">Manage Parlors</h1>
        <Button
          onClick={() => {
            setOpenCreateEditSheet(true);
            setCurrentEditedId(null);
            setFormData(initialFormData);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Parlor
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parlors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parlorList?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Parlors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parlorList?.filter((parlor) => parlor.isActive)?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Parlors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parlorList && parlorList.length > 0 ? (
                parlorList.map((parlor) => (
                  <TableRow key={parlor._id}>
                    <TableCell className="font-medium">{parlor.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {parlor.ownerId?.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parlor.ownerId?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {parlor.address?.city}, {parlor.address?.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {parlor.contact?.phone}
                        </div>
                        {parlor.contact?.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-1" />
                            {parlor.contact?.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {parlor.services?.length || 0} Services
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={parlor.isActive ? "default" : "destructive"}
                      >
                        {parlor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditParlor(parlor)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteParlor(parlor._id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No parlors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Sheet
        open={openCreateEditSheet}
        onOpenChange={() => {
          setOpenCreateEditSheet(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Parlor" : "Add New Parlor"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={finalFormControls}
              isBtnDisabled={userList.length === 0}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminParlors;
