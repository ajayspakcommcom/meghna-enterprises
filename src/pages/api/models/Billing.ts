
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
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
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
    totalAmount: {
        type: Number,
        required: true
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




