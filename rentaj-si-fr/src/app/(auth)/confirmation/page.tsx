import React from 'react'
import ConfirmationCard from '@/app/components/auth/confirmation-card/confirmation-card';
import { ConfirmationCardProps } from '@/app/components/auth/confirmation-card/confirmation-card';
import Image from "next/image";

const confirmationData: ConfirmationCardProps = {
  vehicleModel: 'Audi A8 L 2022',
  pickupDate: 'Jun 28, 2025',
  returnDate: 'Jun 28, 2025',
  pickupLocation: 'Bitola',
  returnLocation: 'Skopje',
  totalPrice: 175.00
}; 

export default function ConfirmationPage() {
  return (
    <div className='flex items-center justify-center gap-[260px] mt-[30px]'>
      <ConfirmationCard {...confirmationData} />
      <Image
        src="/svg/ilustration-for-sucsesful-transaction-on-stripe.svg"
        alt="Success illustration"
        width={638}
        height={638}
        className="w-[638px] h-[638px]"
      />
    </div>
  )
}
