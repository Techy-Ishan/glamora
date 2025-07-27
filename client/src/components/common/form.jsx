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

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  errors = {},
  onFieldChange,
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
        <div>
          <Input
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            type={control.type}
            value={value}
            onChange={(e) => {
              if (onFieldChange) {
                onFieldChange(control.name, e.target.value);
              } else {
                const newFormData = { ...formData };
                setNestedValue(newFormData, control.name, e.target.value);
                setFormData(newFormData);
              }
            }}
            className={errors[control.name] ? "border-red-500" : ""}
          />
          {errors[control.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[control.name]}</p>
          )}
        </div>
      );
    }
    if (control.componentType === "select") {
      return (
        <div>
          <Select
            onValueChange={(val) => {
              if (onFieldChange) {
                onFieldChange(control.name, val);
              } else {
                const newFormData = { ...formData };
                setNestedValue(newFormData, control.name, val);
                setFormData(newFormData);
              }
            }}
            value={value}
          >
            <SelectTrigger
              className={`w-full ${
                errors[control.name] ? "border-red-500" : ""
              }`}
            >
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
          {errors[control.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[control.name]}</p>
          )}
        </div>
      );
    }
    if (control.componentType === "textarea") {
      return (
        <div>
          <Textarea
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            value={value}
            onChange={(e) => {
              if (onFieldChange) {
                onFieldChange(control.name, e.target.value);
              } else {
                const newFormData = { ...formData };
                setNestedValue(newFormData, control.name, e.target.value);
                setFormData(newFormData);
              }
            }}
            className={errors[control.name] ? "border-red-500" : ""}
          />
          {errors[control.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[control.name]}</p>
          )}
        </div>
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

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
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
