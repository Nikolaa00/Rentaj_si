"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 bg-[#97E4FF] h-[420px] rounded-t-3xl",
        className
      )}
      classNames={{
        root: defaultClassNames.root,
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn(
          "flex flex-col  w-full gap-4",
          defaultClassNames.month
        ),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "h-8 w-8 bg-transparent hover:bg-[#233B5D] rounded-full flex items-center justify-center aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "h-8 w-8 bg-transparent hover:bg-[#233B5D] rounded-full flex items-center justify-center aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 w-full px-8",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "select-none font-semibold text-lg text-gray-800",
          defaultClassNames.caption_label
        ),
        table: "w-full  border-collapse",
        weekdays: cn(
          "flex ",
          defaultClassNames.weekdays
        ),
        weekday: cn(
          "flex-1  font-medium text-gray-800 text-sm select-none",
          defaultClassNames.weekday
        ),
        week: cn(
          "flex  w-full mt-2",
          defaultClassNames.week
        ),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        today: cn(
          "rounded-full font-bold ",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-400 opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-gray-400 opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn(
          "invisible",
          defaultClassNames.hidden
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="h-4 w-4 " {...props} />
          }
          return <ChevronRightIcon className="h-4 w-4" {...props} />
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="viewDetailsDark"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected}
      className={cn(
        "flex aspect-square w-full min-w-8 justify-center items-center leading-none rounded-full",
        "data-[selected-single=true]:bg-[#407BFF] data-[selected-single=true]:text-white data-[selected-single=true]:font-bold",
        "hover:bg-[#2c5c8a]",
        modifiers.today && "border-[3px] border-[#407BFF] focuse:",
        modifiers.today && "focus:border-gray-700 focus:border",
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton }