
import mongoose, { Schema } from 'mongoose';

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    label: [{
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
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

export const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);


