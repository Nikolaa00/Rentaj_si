import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        " w-[443px] h-[55px] bg-[#ffffff] text-center text-lg shadow-md rounded-full border border-[#407BFF]  focus:outline-none placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

export { Input }
