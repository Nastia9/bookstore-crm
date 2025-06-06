import { UserRole } from "../enums/user-role";

export interface AddEditUserRequestParameter {
    id?: string;
    email?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: UserRole;
    password?: string;
}