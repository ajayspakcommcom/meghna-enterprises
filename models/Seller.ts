
export default interface Seller {
    _id?: string;
    name?: string | null;
    address?: string | null;
    telephone_no?: string | null;
    mobile_no?: string | null;
    fax?: string | null;
    pan?: string | null;
    gstin?: string | null;
    state_code?: string | null;
    email?: string;
    emails: string[];
    account_detail?: string | null;
}