interface DealerInfo {
  name: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  contacts: {
    name: string;
    role: string;
    phone: string;
  }[];
  vehicleNumber?: string;
  languages: string[];
  memberSince?: string;
  description?: string;
}
export type { DealerInfo };