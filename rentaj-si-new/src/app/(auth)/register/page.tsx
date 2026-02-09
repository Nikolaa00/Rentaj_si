import RegisterCard from "@/app/components/auth/register/register-card";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center gap-[196px] mt-[25px]">
        <Image
        src="/svg/SVG-illustration-2.svg"
        alt="Register illustration"
        width={891}
        height={623}
        className="w-[891px] h-[623px] mt-10 mb-10"
      />
      <RegisterCard/>
    </div>
  );
}