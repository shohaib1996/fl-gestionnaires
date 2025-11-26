export interface Collaborator {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  projectCity: string;
  residenceCity: string;
  province: string;
}

export interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  parentName: string; // If minor
  phone: string;
  email: string;
  projectCity: string;
  residenceCity: string;
  province: string;
  hasCollaborators: boolean | null;
  collaborators: Collaborator[];

  // Project Category
  projectName: string;
  categories: string[];
  projectPhase: string;

  // Project Description
  description: string;
  logo: File | null;
  links: string[];

  // Signature
  signature: string | null; // Base64 string from canvas
  signerName: string;
}

export const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  parentName: "",
  phone: "",
  email: "",
  projectCity: "",
  residenceCity: "",
  province: "",
  hasCollaborators: null,
  collaborators: [],
  projectName: "",
  categories: [],
  projectPhase: "",
  description: "",
  logo: null,
  links: [""],
  signature: null,
  signerName: "",
};
