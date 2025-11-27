export interface AccountRequestFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  postnom: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export const initialFormData: AccountRequestFormData = {
  firstName: "",
  lastName: "",
  postnom: "",
  birthDate: "",
  address: "",
  phoneNumber: "",
  email: "",
};
