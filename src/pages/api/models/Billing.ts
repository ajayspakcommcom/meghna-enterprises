
import mongoose from 'mongoose';
import './Buyer';
import './Seller';
import './Contract';

const billingSchema = new mongoose.Schema({
    billingNo: {
        type: String,
        required: true,
        unique: true
    },
    billingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    partyType: {
        type: String,
        enum: ['Seller', 'Buyer'],
        required: true
    },
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: function (value: any) {
                const partyType = (this as any).partyType
                if (partyType === 'Seller') {
                    return mongoose.model('Seller').exists({ _id: value });
                } else if (partyType === 'Buyer') {
                    return mongoose.model('Buyer').exists({ _id: value });
                }
                return false;
            },
            message: (props: { value: any }) => `${props.value} is not a valid reference for the selected party type.`
        }
    },
    contracts: [{
        contractId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        brokerageQty: {
            type: Number,
            required: true
        },
        brokerageAmt: {
            type: Number,
            required: true
        },
        partyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        isBillCreated: {
            type: Boolean,
            default: false
        }
    }],
    sgst: {
        type: Number,
        required: true,
        default: 0
    },
    cgst: {
        type: Number,
        required: true,
        default: 0
    },
    igst: {
        type: Number,
        required: true,
        default: 18
    },
    netAmount: {
        type: Number,
        required: true,
        default: 0
    },
    brokerage: {
        type: Number,
        required: true,
        default: 0
    },
    grandTotalAmt: {
        type: Number,
        required: true,
        default: 0
    },
    outstandingAmount: {
        type: Number,
        required: true,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: null
    },
    deletedDate: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export const Billing = mongoose.models.Billing || mongoose.model('Billing', billingSchema);




