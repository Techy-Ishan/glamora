import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const renderInputsByComponentType = (control) => {
    const value = formData[control.name] || "";
    if (control.componentType === "input") {
      return (
        <Input
          name={control.name}
          placeholder={control.placeholder}
          id={control.name}
          type={control.type}
          value={value}
          onChange={(e) =>
            setFormData({ ...formData, [control.name]: e.target.value })
          }
        />
      );
    }
    if (control.componentType === "select") {
      return (
        <Select
          onValueChange={(val) =>
            setFormData({ ...formData, [control.name]: val })
          }
          value={value}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={control.label} />
          </SelectTrigger>
          <SelectContent>
            {control.options?.length > 0 &&
              control.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );
    }
    if (control.componentType === "textarea") {
      return (
        <Textarea
          name={control.name}
          placeholder={control.placeholder}
          id={control.id}
          value={value}
          onChange={(e) =>
            setFormData({ ...formData, [control.name]: e.target.value })
          }
        />
      );
    }
    // default to input
    return (
      <Input
        name={control.name}
        placeholder={control.placeholder}
        id={control.name}
        type={control.type}
        value={value}
        onChange={(e) =>
          setFormData({ ...formData, [control.name]: e.target.value })
        }
      />
    );
  };

  // Validation state
  const [errors, setErrors] = useState({});

  // Basic validation: required fields and email format
  function validate() {
    const newErrors = {};
    formControls.forEach((control) => {
      const value = formData[control.name] || "";
      // Make salePrice truly optional
      if (
        control.componentType === "input" ||
        control.componentType === "textarea"
      ) {
        if (control.name !== "salePrice" && !value.trim()) {
          newErrors[control.name] = `${control.label} is required`;
        } else if (control.type === "email") {
          // Simple email regex
          const emailRegex = /^[^\s@]+@[^^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[control.name] = "Invalid email address";
          }
        } else if (control.name === "userName") {
          // Username must start with an alphabet
          if (!/^[A-Za-z]/.test(value)) {
            newErrors[control.name] = "User Name must start with an alphabet";
          }
        } else if (control.name === "password") {
          // Password: at least 6 chars, at least one special character
          if (value.length < 6) {
            newErrors[control.name] =
              "Password must be at least 6 characters long";
          } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
            newErrors[control.name] =
              "Password must include at least one special character";
          }
        }
      }
      if (control.componentType === "select" && (!value || value === "")) {
        newErrors[control.name] = `${control.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      onSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
            {errors[controlItem.name] && (
              <span className="mt-1 text-xs text-red-500">
                {errors[controlItem.name]}
              </span>
            )}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="w-full mt-2">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
