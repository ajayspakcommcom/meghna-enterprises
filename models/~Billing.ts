
export default interface Billing {
    _id: string;
    contract_no: string;
    buyer_id: Buyer;
    seller_id: Seller;
    template: Template;
    label: Record<string, string>;
    quantity: number;
    price: string;
    assessment_year: string;
    template_id: string;
    updatedDate: Date | null;
    deletedDate: Date | null;
    isDeleted: boolean;
    company: string;
    createdDate: Date;
    __v: number;
    brokerageAmount: number;
    totalPurchasedAmount: number;
    brockerage: number;
    igst: number;
    cgst: number;
    sgst: number;
    grandTotal: number;

}

interface Buyer {
    _id: string;
    name: string;
    address: string;
    telephone_no: string;
    mobile_no: string;
    fax: string;
    pan: string;
    gstin: string;
    state_code: string;
    email: string;
    updatedDate: Date | null;
    deletedDate: Date | null;
    isDeleted: boolean;
    account_detail: string;
    createdDate: Date;
    __v: number;
}

interface Seller {
    _id: string;
    name: string;
    address: string;
    telephone_no: string;
    mobile_no: string;
    fax: string;
    pan: string;
    gstin: string;
    state_code: string;
    email: string;
    updatedDate: Date | null;
    deletedDate: Date | null;
    isDeleted: boolean;
    account_detail: string;
    createdDate: Date;
    __v: number;
}

interface Template {
    COMMODITY: string;
    PLACE_OF_DELIVERY: string;
    PERIOD_OF_DELIVERY: string;
    PAYMENT: string;
    TERMS_AND_CONDITIONS: string;
    BROKERAGE: string;
    BROKERAGE_LIABILITY: string;
}
