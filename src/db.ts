import { connect, connection } from 'mongoose';
import { User, IUser } from './models/UserSchema';

const url: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;

const connectDB = async (): Promise<void> => {
  try {
    await connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    throw new Error(`DB connection error: ${err}`);
  }
};

const closeConnection = async (): Promise<void> => {
  try {
    await connection.close();
  } catch (err) {
    throw new Error('DB connection closure fail');
  }
};

const saveOrUpdateUser = async (user: IUser): Promise<void> => {
  const users = await User.find({ id: user.id });
  if (users.length !== 0) {
    await User.updateOne({ id: user.id }, user, { upsert: true });
  } else {
    await User.create(user);
  }
};

const getUser = async (id: number): Promise<IUser | undefined> => {
  const users = await User.find({ id });
  if (users.length !== 0) {
    return users[0];
  }
  return undefined;
};

const deleteUser = async (id: number): Promise<void> => {
  await User.deleteOne({ id });
};

export {
  connectDB,
  closeConnection,
  saveOrUpdateUser,
  getUser,
  deleteUser,
};
