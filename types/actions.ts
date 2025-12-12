// Generic Success Response
export interface ActionSuccess<T = unknown> {
  success: true;
  data: T;
}

// Generic Error Response (compatible with Supabase errors)
export interface ActionError {
  success: false;
  message: string;
  code?: string;
  details?: string;
}

// Reusable generic mutation result type
export type ActionResult<T = unknown> = ActionSuccess<T> | ActionError;

// Mutation Variable Type (id, email, etc.)
export type ActionVariable = string;

// Project Type
export interface Project {
  id: string;
  title: string;
  status: string;
  claim: number;
  created_at: string;
}
