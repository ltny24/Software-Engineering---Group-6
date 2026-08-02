
# Tuition Feature Implementation Plan
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi

## Objective
Implement a React-based tuition page that provides a polished financial overview using mock data and styling consistent with the rest of the portal.

## Technical Approach
- Build the feature as a React functional component using `useState` and `useEffect`.
- Define interfaces for payment and financial balance data.
- Use hardcoded mock data inside `useEffect` so the page renders immediately.
- Display the financial summary from the mock data object.
- Render a payment history table that lists transaction details.

## UI Implementation Details
- Use strict inline styles only.
- Match the existing portal look and feel using soft slate backgrounds and dark text.
- Create a header section that shows the tuition term and financial status.
- Display four summary cards with distinct colored top borders.
- Render a payment history table with alternating row backgrounds.

## Data Model
```ts
interface TuitionPaymentDTO {
  paymentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  status: string;
}

interface TuitionBalanceResponse {
  studentId: number;
  term: string;
  totalCharges: number;
  payments: number;
  scholarshipAmount: number;
  balance: number;
  financialHold: boolean;
  paymentHistory: TuitionPaymentDTO[];
}
