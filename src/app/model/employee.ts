
export class AppUser{
    id?: string|null;
    firstName?: string|null;    
    lastName?: string|null;    
    email?:string|null; 
    phoneNumber?: string|null;   
    employementDate?: Date;
    password?: string | null;
    confirmPassword?: string | null;

    errorMsg?:string|null;    
}