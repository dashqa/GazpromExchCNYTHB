import { connect, connection } from 'mongoose';
import { User, IUser } from './models/UserSchema';

const connectDB = async (MONGO_HOST: string, MONGO_PORT: string, MONGO_DB_NAME: string): Promise<void> => {
  const url: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

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
