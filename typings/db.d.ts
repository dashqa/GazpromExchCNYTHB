import { IUser } from './models/UserSchema';
declare const connectDB: (MONGO_HOST: string, MONGO_PORT: string, MONGO_DB_NAME: string) => Promise<void>;
declare const closeConnection: () => Promise<void>;
declare const saveOrUpdateUser: (user: IUser) => Promise<void>;
declare const getUser: (id: number) => Promise<IUser | undefined>;
declare const deleteUser: (id: number) => Promise<void>;
export { connectDB, closeConnection, saveOrUpdateUser, getUser, deleteUser, };
//# sourceMappingURL=db.d.ts.map