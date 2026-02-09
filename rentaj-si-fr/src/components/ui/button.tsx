import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 drop-shadow-md text-shadow-md hover:drop-shadow-lg hover:scale-105 px-[15px] py-[4px] text-xs",
  {
    variants: {
      variant: {
        dealer:
          " bg-[linear-gradient(90deg,var(--color-MY-palatte-A5,#6FB3DD)_0%,var(--color-MY-palatte-2,#55627D)_90%)] text-slate-700   border border-[#6FB3DD]",
        renter:
          "hover:cursor-pointer bg-[linear-gradient(90deg,var(--color-MY-palatte-2,#55627D)_0%,var(--color-MY-palatte-A5,#6FB3DD)_89.9%)] text-slate-700   border border-[#6FB3DD]",
        submit:
          "bg-[#407BFF] text-white border border-[#55627D] hover:cursor-pointer   ",
        viewDetails:
          "bg-[#2C2C2C] text-white hover:cursor-pointer px-[16px] py-[5px] text-sm",
        cancel:
          "bg-[#960608] text-white border border-[#2C2C2C] text-sm px-[16px] py-[5px] hover:cursor-pointer",
        viewDetailsDark:
          "bg-gray-800 border border-gray-700 text-gray-300 hover:cursor-pointer",
        registerLogin:
          "font-semibold drop-shadow-none  text-shadow-none text-[#55627D] hover:cursor-pointer",
        dateTime:
          "bg-white border hover:scale-none hover:cursor-pointer border-[#6FB3DD] shadow-md rounded-full px-6 py-3 flex items-center gap-4 hover:shadow-lg",
        addCar:
          "bg-gray-800 border-gray-400 border hover:cursor-pointer  shadow-md rounded-full text-center px-6 py-3 flex items-center gap-4 hover:shadow-lg",
      },
    },
    defaultVariants: {
      variant: "dealer",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
