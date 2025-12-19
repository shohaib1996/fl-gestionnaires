export interface AccountRequestFormData {
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

  // Financial Information
  incomeSources: string[];
  otherIncomeSource: string;

  // Occupation Information
  occupation: string;
  employerName: string;
  employerAddress: string;

  // Confirmation & Signature
  termsAccepted: boolean;
  privacyAccepted: boolean;
  fundsSourceConfirmed: boolean;
  signature: string | null;
  signerName: string;
}

export const initialFormData: AccountRequestFormData = {
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
  incomeSources: [],
  otherIncomeSource: "",
  occupation: "",
  employerName: "",
  employerAddress: "",
  termsAccepted: false,
  privacyAccepted: false,
  fundsSourceConfirmed: false,
  signature: null,
  signerName: "",
};
