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
  // Helper function to get nested value
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested value
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const renderInputsByComponentType = (control) => {
    const value = getNestedValue(formData, control.name) || "";

    // Debug logging for nested fields
    if (control.name.includes(".")) {
      console.log(`Field ${control.name}:`, value, "from formData:", formData);
    }

    if (control.componentType === "input") {
      return (
        <Input
          name={control.name}
          placeholder={control.placeholder}
          id={control.name}
          type={control.type}
          value={value}
          onChange={(e) => {
            const newFormData = { ...formData };
            setNestedValue(newFormData, control.name, e.target.value);
            setFormData(newFormData);
          }}
        />
      );
    }
    if (control.componentType === "select") {
      return (
        <Select
          onValueChange={(val) => {
            const newFormData = { ...formData };
            setNestedValue(newFormData, control.name, val);
            setFormData(newFormData);
          }}
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
          id={control.name}
          value={value}
          onChange={(e) => {
            const newFormData = { ...formData };
            setNestedValue(newFormData, control.name, e.target.value);
            setFormData(newFormData);
          }}
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
        onChange={(e) => {
          const newFormData = setNestedValue(
            formData,
            control.name,
            e.target.value
          );
          setFormData(newFormData);
        }}
      />
    );
  };

  // Validation state
  const [errors, setErrors] = useState({});

  // Basic validation: required fields and email format
  function validate() {
    const newErrors = {};
    formControls.forEach((control) => {
      const rawValue = getNestedValue(formData, control.name);
      const value = rawValue != null ? String(rawValue) : "";
      // Make salePrice truly optional
      if (
        control.componentType === "input" ||
        control.componentType === "textarea"
      ) {
        // Optional fields that don't require validation
        const optionalFields = ["salePrice"];
        if (!optionalFields.includes(control.name) && !value.trim()) {
          newErrors[control.name] = `${control.label} is required`;
        } else if (control.type === "email" && value.trim()) {
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
          } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            newErrors[control.name] =
              "Password must include at least one special character";
          }
        }
      }
      if (
        control.componentType === "select" &&
        (!rawValue || rawValue === "")
      ) {
        newErrors[control.name] = `${control.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form validation starting...");
    const isValid = validate();
    console.log("Form validation result:", isValid);
    console.log("Form data:", formData);
    if (isValid) {
      console.log("Calling onSubmit...");
      onSubmit(e);
    } else {
      console.log("Form validation failed, errors:", errors);
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
