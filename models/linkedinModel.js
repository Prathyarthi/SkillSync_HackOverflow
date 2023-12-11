import { Schema, model } from 'mongoose';

const linkedinSchema = new Schema(
    {
        given_name: {
            type: String,
            required: [true, 'Name is required'],
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill in a valid email address',
            ],
        },
        picture: {
            public_id: {
                type: String,
            },
            secure_url: {
                type: String,
            },
        },
        skills: [{
            type: String,
            required: [true, 'Name is required'],
            lowercase: true,
            trim: true,
        }],
        experience: {
            type: Number,
            required: [true, 'Name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Linked = model('Linked', linkedinSchema);

export default Linked;
