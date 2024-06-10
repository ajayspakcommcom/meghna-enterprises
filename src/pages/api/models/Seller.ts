// UserModel.js
import mongoose, { Schema } from 'mongoose';

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    telephone_no: {
        type: String,
        required: false
    },
    mobile_no: {
        type: String,
        required: false
    },
    fax: {
        type: String,
        required: false
    },
    pan: {
        type: String,
        required: false
    },
    gstin: {
        type: String,
        required: false
    },
    state_code: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
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

sellerSchema.add({
    account_detail: {
        type: String,
        required: false
    }
})

export const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);


