import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';

interface Group extends Document {
    name: string;
    users: Array<User['_id']>;
}

const groupSchema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { collection: "groups" });

const GroupModel = mongoose.model<Group>('Group', groupSchema);

export { GroupModel, Group };