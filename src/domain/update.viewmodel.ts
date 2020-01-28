import { IsNotEmpty, Length } from "class-validator";

export class UpdateViewModel{

    @IsNotEmpty()
    @Length(3,10)
    readonly userLogin:string;

    @IsNotEmpty()
    @Length(3,10)
    readonly password:string;

    @IsNotEmpty()
    @Length(3,10)
    readonly newPassword:string;

}