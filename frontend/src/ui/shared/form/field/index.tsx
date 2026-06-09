import { Field as BaseField } from "@base-ui/react";
import type {
  FieldControlProps,
  FieldRootProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldItemProps,
  FieldValidityProps,
} from "@base-ui/react";
import type { FieldValues, UseFormRegister } from "react-hook-form";

type FieldProps<T extends FieldValues = FieldValues> = {
  register: UseFormRegister<T>;
  root: FieldRootProps;
  label: FieldLabelProps;
  control: FieldControlProps;
  description: FieldDescriptionProps;
  error: FieldErrorProps;
  item: FieldItemProps;
  validity: FieldValidityProps;
};

export const Field = <T extends FieldValues = FieldValues>({
  register,
  root,
  label,
  control,
  description,
  error,
  item,
  validity,
}: FieldProps<T>) => {
  return (
    <BaseField.Root {...root}>
      {label && <BaseField.Label {...label} />}
      {control && <BaseField.Control {...control} />}
      {description && <BaseField.Description {...description} />}
      {error && <BaseField.Error {...error} />}
      {item && <BaseField.Item {...item} />}
      {validity && <BaseField.Validity {...validity} />}
    </BaseField.Root>
  );
};
