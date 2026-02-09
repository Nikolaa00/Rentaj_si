import Image from "next/image";
import LoginCard from "@/app/components/auth/login/login-card";
export default function LoginPage() {
  return (
     <div className="flex items-center justify-center gap-[196px] mt-[70px]">
            <Image
            src="/svg/SVG-illustration-1.svg"
            alt="Register illustration"
            width={891}
            height={623}
            className="w-[891px] h-[623px] mt-10 mb-10"
          />
          <LoginCard/>
        </div>
  );
}