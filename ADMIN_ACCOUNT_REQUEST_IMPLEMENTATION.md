# Admin Account Request Implementation

## Overview
This implementation creates a separate account request flow for admin users, excluding financial and occupation information steps.

## What Was Created

### 1. Database Schema
**File:** `admin_account_requests_schema.sql`
- New table: `admin_account_requests`
- Fields included: Personal info, identification, compliance, signature
- Fields excluded: occupation, employer info, income sources, funds confirmation

### 2. TypeScript Types
**File:** `types/supabase.ts`
- Added `admin_account_requests` table definition with Row, Insert, and Update types
- Integrated into the main Database type

**File:** `components/admin-account-request/types.ts`
- `AdminAccountRequestFormData` interface
- `initialAdminFormData` default values

### 3. Components
Created in `components/admin-account-request/`:

1. **PersonalInformationStep.tsx**
   - Fields: First name, last name, postnom, birth date, address, phone, email, password

2. **IdentificationStep.tsx**
   - Fields: ID type (checkboxes), other ID type, ID number, front/back image uploads

3. **ComplianceStep.tsx**
   - Fields: Terms acceptance, privacy acceptance, signature, signer name
   - Removed: funds source confirmation (not needed for admin accounts)

4. **ReviewStep.tsx**
   - Summary of all entered data
   - Sections: Personal Info, Identification, Compliance, Signature

5. **ConfirmationStep.tsx**
   - Success message after submission
   - Next steps information

6. **Stepper.tsx**
   - 4 steps total (vs 6 for regular accounts)
   - Steps: Personal → Identification → Compliance → Review

### 4. Main Page
**File:** `app/admin-account-request/page.tsx`
- Main form flow with step navigation
- Hero section with introduction
- Eligibility criteria
- Form submission handling
- Integration with auth system

### 5. Server Actions
**File:** `app/actions/createAdminAccountRequest.ts`
- Handles file uploads (ID front, ID back, signature)
- Inserts data into `admin_account_requests` table
- Returns success/error response

**File:** `app/actions/projects/adminAccountRequestActions.ts`
- `approveAdminAccountRequest()` - Creates user with 'admin' role
- `rejectAdminAccountRequest()` - Deletes user and marks request as rejected

## Form Flow

### Step 0: Personal Information (8 fields)
1. First name
2. Last name
3. Postnom
4. Birth date
5. Address
6. Phone number
7. Email
8. Password

### Step 1: Identification (4 sections)
8. ID type (checkboxes)
9. Other ID type (optional)
10. ID number
11. Front image upload
12. Back image upload

### Step 2: Compliance (4 fields)
12. Terms acceptance
13. Privacy acceptance
14. Signature
15. Signer name

### Step 3: Review
- Display all entered information
- Submit button

### Step 4: Confirmation
- Success message
- Next steps

## Differences from Regular Account Request

| Feature | Regular Account | Admin Account |
|---------|----------------|---------------|
| Steps | 6 | 4 |
| Financial Info | ✅ Yes | ❌ No |
| Occupation Info | ✅ Yes | ❌ No |
| Income Sources | ✅ Yes | ❌ No |
| Employer Details | ✅ Yes | ❌ No |
| Funds Confirmation | ✅ Yes | ❌ No |
| User Role | 'onterpeoner' (default) | 'admin' |

## Database Setup Required

Run the SQL schema to create the `admin_account_requests` table:

```bash
# Execute the SQL file in your Supabase SQL editor
admin_account_requests_schema.sql
```

## Routes

- **Form Page:** `/admin-account-request`
- **API Actions:** Server actions in `app/actions/`

## How It Works

1. User visits `/admin-account-request`
2. Reads introduction and eligibility criteria
3. Clicks "Continuer" to start form
4. Completes 4 steps (Personal → ID → Compliance → Review)
5. Submits form
6. System creates auth user + admin_account_requests entry
7. Admin reviews and approves/rejects from dashboard
8. On approval, user entry created with 'admin' role

## Admin Dashboard Integration

To manage admin account requests, you'll need to:
1. Create a dashboard page to list admin_account_requests
2. Use `approveAdminAccountRequest(requestId)` to approve
3. Use `rejectAdminAccountRequest(requestId)` to reject

## Files Created

### Components (9 files)
- components/admin-account-request/types.ts
- components/admin-account-request/PersonalInformationStep.tsx
- components/admin-account-request/IdentificationStep.tsx
- components/admin-account-request/ComplianceStep.tsx
- components/admin-account-request/ReviewStep.tsx
- components/admin-account-request/ConfirmationStep.tsx
- components/admin-account-request/Stepper.tsx

### Pages (1 file)
- app/admin-account-request/page.tsx

### Actions (2 files)
- app/actions/createAdminAccountRequest.ts
- app/actions/projects/adminAccountRequestActions.ts

### Database (2 files)
- admin_account_requests_schema.sql
- types/supabase.ts (updated)

## Next Steps

1. **Run the SQL schema** in Supabase to create the table
2. **Test the form** at `/admin-account-request`
3. **Create dashboard UI** to manage admin account requests (optional)
4. **Add email notifications** for approval/rejection (optional)

## Notes

- File uploads use the existing `project-images` bucket
- Separate folders: `admin_id_front/`, `admin_id_back/`, `admin_signatures/`
- Status values: 'pending', 'approved', 'rejected'
- Approved admin users get 'admin' role automatically
