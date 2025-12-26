// Generic Success Response
export interface ActionSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

// Generic Error Response (Supabase-compatible)
export interface ActionError {
  success: false;
  message: string;
  code?: string;
  details?: string;
}

// Unified Action Result
export type ActionResult<T = null> = ActionSuccess<T> | ActionError;

// Mutation Variable Type (id, email, etc.)
export type ActionVariable = string;
