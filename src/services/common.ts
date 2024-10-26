import { debounce } from 'lodash';
import moment from 'moment';
import { getTemplate } from './template';
import { getContract } from './contract';

export const debouncedHandleChange = debounce((value) => {
    console.log('Debounced Billing No:', value);
    return value;
}, 1000);

export const getUserData = (): { [key: string]: any } => {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
        return JSON.parse(userDataString);
    } else {
        return {};
    }
};

export const customDateFormatter = (params: any): string => {
    const dateValue = moment(params.value);
    if (dateValue.isValid()) {
        return dateValue.format('DD/MM/YYYY');
    } else {
        console.error('Invalid date value:', params.value);
        return 'Invalid date';
    }
};

export const customFormatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = (isDashed: boolean = false): string => {

    const today = new Date();
    const currentMonth = today.getMonth(); //0-indexed (January is 0, December is 11)
    const currentYear = today.getFullYear();

    // Financial year starts from April (month index 3)
    const financialYearStartMonth = 3;
    const financialYearStartYear = currentMonth >= financialYearStartMonth ? currentYear : currentYear - 1;

    const financialYearEndYear = financialYearStartYear + 1;

    let formattedStart, formattedEnd;

    if (!isDashed) {
        formattedStart = `01/04/${financialYearStartYear}`;
        formattedEnd = `03/31/${financialYearEndYear}`;
        return `${formattedStart} - ${formattedEnd}`;
    } else {
        formattedStart = `${financialYearStartYear}`;
        formattedEnd = `${financialYearEndYear}`;
        return `${formattedStart}-${formattedEnd}`;
    }

};

export const incrementBillingNo = (input: string | null | undefined, currentFinancialYear: string): string => {
    // Check if the input is null or undefined
    if (!input) {
        return `00001/${currentFinancialYear}`;  // Return "00001" for null or undefined input
    }

    // Find the position of the first "/"
    const indexOfSlash = input.indexOf('/');

    // If "/" is found, take all characters before it; otherwise, take the whole input
    const beforeSlash = indexOfSlash !== -1 ? input.substring(0, indexOfSlash) : input;

    // Convert the extracted part to a number
    const numericValue = parseInt(beforeSlash, 10);

    // Check if the conversion to number is successful
    if (isNaN(numericValue)) {
        return `00001`;  // Return "00001" if the conversion fails
    }

    // Increment the numeric value by 1
    const incrementedValue = numericValue + 1;

    // Convert the incremented value back to a string and pad with leading zeros to ensure it is 5 characters long
    return incrementedValue.toString().padStart(5, '0') + '/' + currentFinancialYear;
}

export const incrementContractNo = (inputString: string, currentFinancialYear: string): string => {

    const appLogo = getLocalStorage('appLogo');

    if (!inputString) {

        //inputString = "S&F/L/0000/";  //logo => Seeds&Feeds
        //inputString = "MAC/L/0000/"; //bombay => Meghna Bombay Agency
        //inputString = "MA/L/0000/"; //agro => Meghna Agro Commodities 
        //inputString = "MEC/L/0000/"; //meghna => Meghna Enterprise

        switch (appLogo) {
            case 'logo':
                inputString = "S&F/L/0000/";
                break;
            case 'agro':
                inputString = "MA/L/0000/";
                break;
            case 'bombay':
                inputString = "MAC/L/0000/";
                break;
            case 'meghna':
                inputString = "MEC/L/0000/";
                break;
            default:
                break;
        }

    }

    const regex = /\/(\d+)\//;
    const match = inputString.match(regex);

    if (match && match[1]) {
        const numericPart: string = match[1];
        const incrementedValue: number = parseInt(numericPart) + 1;
        const numericLength: number = numericPart.length;
        const incrementedString: string = String(incrementedValue).padStart(numericLength, '0');
        const resultString: string = inputString.replace(regex, `/${incrementedString}/`);

        // Replace the last part with the current financial year
        const lastIndex = resultString.lastIndexOf('/');
        const finalString = resultString.substring(0, lastIndex + 1) + currentFinancialYear;

        const index = finalString.indexOf("/L");

        if (index !== -1) {
            switch (appLogo) {
                case 'logo':
                    return 'S&F' + finalString.slice(index);
                case 'agro':
                    return 'MA' + finalString.slice(index);
                case 'bombay':
                    return 'MAC' + finalString.slice(index);
                case 'meghna':
                    return 'MEC' + finalString.slice(index);
                default:
                    break;
            }
        }

        return '';
    } else {
        throw new Error("Numeric portion not found in the input string.");
    }
}


export const generateContractNumber = (): string => {
    const today = new Date();
    const currentYear = today.getFullYear();
    // Generate a random 4-digit number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${randomNumber}/${getCurrentFinancialYear()}`;
};


export const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = <T>(key: string): T | null => {

    if (typeof window === 'undefined') {
        return null;
    }
    const item = localStorage.getItem(key);
    if (item) {
        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
            return null;
        }
    }
    return null;

    // const item = localStorage.getItem(key);
    // if (item) {
    //     return JSON.parse(item) as T;
    // }
    // return null;
};

export function removeBackslash(input: string): string {
    if (input && input.trim() !== '') {
        return input.replace(/\//g, '');
    } else {
        return input;
    }
}

export function getCompanyName(input: string): string {
    switch (input.toLowerCase()) {
        case 'meghna':
            return 'Meghna Enterprise';
        case 'bombay':
            return 'Meghna Agencies (Bombay)';
        case 'logo':
            return 'Seeds & Feeds India';
        case 'agro':
            return 'Meghna Agro Commodities';
        default:
            return 'Unknown value';
    }
}

export const getBillingHtmlTemplate = (data?: any) => {
    const template = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing Invoice</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

    <div
        style="max-width: 1200px; margin: auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333; background-color: #c0c0c0; margin: auto; padding: 10px 0;">MEGHNA
            ENTERPRISE</h2>

        <div style="width: 600px; margin: auto; margin-top: 10px; margin-bottom: 10px;">
            <p style="text-align: center; font-size: 12px; margin: 0 0 10px 0; line-height: 20px; font-weight: 300;">
                504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W),
                MUMBAI - 400 064
            </p>

            <p style="text-align: center; font-size: 12px; margin: 0; line-height: 20px; font-weight: 300;">
                Tel. : 022 2880 2452-Fax : 022 2881 5002
            </p>

            <p style="text-align: center; font-size: 12px; margin: 0 0 0 0; line-height: 20px; font-weight: 300;">
                Email : meghnaagencies@gmail.com
            </p>

        </div>

        <div style="margin-top: 10px; margin-bottom: 10px;">
            <p style="text-align: center; font-size: 12px; margin: 0; line-height: 20px; font-weight: 300;">
                <b style="font-size: 14px; font-weight: 600;">TAX-INVOICE</b>
            </p>

            <div style="display: flex; justify-content: space-between; font-size: 14px; border: 1px solid #dddddd;">
                <div style="padding: 10px;">
                    <span>BILL NO.</span>
                    <b>: ${data?.billingData?.billingNo}</b>
                </div>
                <div style="padding: 10px 10px 10px 50px; border-left: 1px solid #dddddd;">
                    <span>DATE</span>
                    <b>: ${customFormatDate(new Date(data?.billingData?.billingDate))}</b>
                </div>
            </div>
        </div>

        <div style="margin-top: 15px; margin-bottom: 10px; padding-left: 15px; font-size: 14px;">
            <p style="margin: 0 0 5px 0;"><b>${data?.partyData?.name}</b></p>
            <div style="margin-left: 30px; line-height: 20px; font-size: 12px;">
                <p style="margin: 0; width: 300px;">
                    ${data?.partyData?.address}
                </p>
                <div style="width: 400px; margin-top: 15px;">
                    <div style="display: flex;">
                        <p style="margin: 0; width: 200px;">
                            PARTY'S GSTIN
                        </p>
                        <p style="margin: 0;">${data?.partyData?.gstin}</p>
                    </div>
                    <div style="display: flex;">
                        <p style="margin: 0; width: 200px;">
                            PARTY'S STATE CODE
                        </p>
                        <p style="margin: 0;">${data?.partyData?.state_code}</p>
                    </div>
                </div>
            </div>
        </div>


        <table style="width: 100%; border-collapse: collapse; font-size: 12px; border-bottom: 1px solid #ddd;"
            cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        SAUDA DATE</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        CONTRACT #</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        BUYER/SELLER NAME</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        COMMODITY</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        QTY
                    </th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        RATE/TON</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        PER TON</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background-color: #f7f7f7; text-align: left;">
                        BROKERAGE AMOUNT (RS.)</th>
                </tr>
            </thead>
            <tbody style="border: 1px solid #ddd;">
                ${data?.billingData?.contracts.length > 0 && data?.billingData?.contracts.map((contract: any) => (
        `
                        <tr>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd; border-left: 1px solid #ddd;">${customFormatDate(new Date(contract.createdDate))}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${contract.contractNo}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${data?.partyData?.name}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">SOYA EXT.</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${contract.quantity}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${contract.price}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${contract.brokerageQty}</td>
                            <td style="padding: 10px 10px; border-right: 1px solid #ddd;">${contract.brokerageAmt}</td>
                        </tr>
                    `
    ))
        }
                                
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        <span
                            style="text-decoration: underline; font-weight: 300; font-size: 13px; padding: 0 10px; display: inline-block; margin-top: 10px;">AMOUNT
                            IN
                            WORD(S)</span>
                        <p style="padding: 0 10px;">RUPEES TWENTY THOUSAND SIX HUNDRED FIFTY ONLY.</p>
                    </td>
                    <td colspan="4" style=" vertical-align: top; text-align: right;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    Total</td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    GST @18%</td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    ROUNDOFF AMOUNT
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-right: 1px solid #ddd; padding: 10px 10px;">
                                    GRAND TOTAL
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td colspan="1" style=" border-right: 1px solid #ddd;   vertical-align: top;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>${data?.billingData?.netAmount}</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>${data?.billingData?.brokerage}</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>0.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="width: 50%; border-bottom: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 10px 10px; text-align: right;">
                                    <b>${data?.billingData?.grandTotalAmt}</b>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="border-right: 1px solid #ddd; border-left: 1px solid #ddd;">
                        <div
                            style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 100px;   line-height: 20px; padding: 10px 10px;">
                            <div style="display: flex;">
                                <span style="width: 100px;">PAN No</span>
                                <b>: AFRPC6408E</b>
                            </div>
                            <div style="display: flex;">
                                <span style="width: 100px;">GSTIN</span>
                                <b>: 27AFRPC6408E1ZI</b>
                            </div>
                        </div>
                    </td>
                    <td colspan="5"
                        style="border-right: 1px solid #ddd; border-left: 1px solid #ddd; text-align: right; vertical-align: top; padding: 10px 10px;">
                        <b style="font-size: 16px;">for MEGHNA ENTERPRISE</b>
                        <br />
                        <img src="http://localhost:3000/images/signature.jpg" alt="Signature" style="width: 106px; height: 30px; display: inline-block; margin: 20px 15px;" />
                        <br />
                        <span style="font-size: 14px;">(AS BROKER)</span>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

</body>

</html>
    `;
    return template;
}
