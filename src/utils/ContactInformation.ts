export interface ContactInformation {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

export const contactInfo: ContactInformation = {
  email: "sushan.poudel.242833@gmail.com",
  phone: "+977 9851069535",
  address: {
    street: "Nagarjun Tole, Bafal-13",
    city: "Kathmandu",
    country: "Nepal",
  },
};