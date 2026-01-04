export interface AdminAccountRequestFormData {
  user_id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  postnom: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  email: string;
  password?: string;

  // Identification Information
  idType: string[];
  otherIdType: string;
  idNumber: string;
  idFrontImage: File | null;
  idBackImage: File | null;

  // Confirmation & Signature
  termsAccepted: boolean;
  privacyAccepted: boolean;
  signature: string | null;
  signerName: string;
}

export const initialAdminFormData: AdminAccountRequestFormData = {
  user_id: "",
  firstName: "",
  lastName: "",
  postnom: "",
  birthDate: "",
  address: "",
  phoneNumber: "",
  email: "",
  idType: [],
  otherIdType: "",
  idNumber: "",
  idFrontImage: null,
  idBackImage: null,
  termsAccepted: false,
  privacyAccepted: false,
  signature: null,
  signerName: "",
};
