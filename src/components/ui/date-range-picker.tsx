
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export interface DateRangePickerProps {
  className?: string;
  onChange: (range: DateRange) => void;
  value?: DateRange;
  placeholder?: string;
}

export function DateRangePicker({
  className,
  onChange,
  value,
  placeholder = "Selecione um período"
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange>(value || {
    from: undefined,
    to: undefined,
  });

  // Atualiza o estado local quando o valor da prop muda
  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  // Atualiza o valor quando o estado local muda
  React.useEffect(() => {
    onChange(date);
  }, [date, onChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "P", { locale: ptBR })} -{" "}
                  {format(date.to, "P", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "P", { locale: ptBR })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={{
              from: date.from,
              to: date.to,
            }}
            onSelect={(newDate) => {
              setDate({
                from: newDate?.from,
                to: newDate?.to
              });
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
