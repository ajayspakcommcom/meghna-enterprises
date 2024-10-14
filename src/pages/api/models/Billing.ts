
import mongoose from 'mongoose';
import './Buyer';
import './Seller';
import './Contract';

const billingSchema = new mongoose.Schema({

    billDate: {
        type: Date,
        default: Date.now
    },

    billingNo: {
        type: String,
        required: true
    },

    contractReferenceNo_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },

    contractReferenceNo: {
        type: String,
        required: true
    },

    buyer: {
        type: String,
        required: true
    },

    seller: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    brokeragePrice: {
        type: Number,
        required: true
    },

    brokerageOn: {
        type: String,
        enum: ['Price', 'Quantity'],
        required: true,
        default: 'Quantity'
    },

    brokerageAmount: {
        type: Number,
        required: false
    },

    sgst: {
        type: Number,
        required: false
    },

    cgst: {
        type: Number,
        required: false
    },

    igst: {
        type: Number,
        required: false
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




