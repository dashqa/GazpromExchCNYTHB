import { IUser } from './models/UserSchema';
declare const connectDB: () => Promise<void>;
declare const closeConnection: () => Promise<void>;
declare const saveOrUpdateUser: (user: IUser) => Promise<void>;
declare const getUser: (id: number) => Promise<IUser | undefined>;
declare const deleteUser: (id: number) => Promise<void>;
export { connectDB, closeConnection, saveOrUpdateUser, getUser, deleteUser, };
//# sourceMappingURL=db.d.ts.map