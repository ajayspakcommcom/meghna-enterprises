
import mongoose, { Schema } from 'mongoose';
import './Buyer';
import './Seller';

const contractSchema = new mongoose.Schema({
    contract_no: {
        type: String,
        required: true
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    template: {
        type: Map,
        of: String,
        required: true
    },
    label: {
        type: Map,
        of: String,
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
    assessment_year: {
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
    }
});


export const Contract = mongoose.models.Contract || mongoose.model('Contract', contractSchema);




