import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
}, { collection: "users" });

const UserModel = mongoose.model<User>('User', UserSchema);

export { UserModel, User };