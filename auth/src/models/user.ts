import mongoose from "mongoose";
import { Password } from "../utils/password";

interface UserProps {
  email: string;
  password: string;
}

interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(props: UserProps): UserDocument;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (props: UserProps) => {
  return new User(props);
}

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);

    done();
  }
});

const User = mongoose.model<UserDocument, UserModel>('user', userSchema);

export {
  User
};
