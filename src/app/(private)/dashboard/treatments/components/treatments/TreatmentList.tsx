import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { TreatmentItem } from "./TreatmentItem";
import { EmptyTreatmentList } from "./EmptyTreatmentList";

interface TreatmentListProps {
  fields: UseFieldArrayReturn["fields"];
  form: UseFormReturn<any>;
  remove: UseFieldArrayReturn["remove"];
  priceError?: string;
}

export function TreatmentList({
  fields,
  form,
  remove,
  priceError,
}: TreatmentListProps) {
  if (fields.length === 0) {
    return <EmptyTreatmentList />;
  }

  return (
    <div className="grid gap-4">
      {fields.map((field, index) => (
        <TreatmentItem
          key={field.id}
          index={index}
          field={field}
          form={form}
          onRemove={() => remove(index)}
          hasError={
            !!priceError?.includes(form.getValues(`treatments.${index}.name`))
          }
        />
      ))}
    </div>
  );
}
