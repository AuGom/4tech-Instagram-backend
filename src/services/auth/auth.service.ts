import { Injectable, BadRequestException } from '@nestjs/common';
import { UserViewModel } from 'src/domain/user.viewmodel';
import { UserService } from '../user/user.service';
import { LoginViewModel } from 'src/domain/login.viewmodel';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user-repository/user-repository';
import { UpdateViewModel } from 'src/domain/update.viewmodel';

@Injectable()
export class AuthService {
    constructor(private userRepitory:UserRepository,
                private jwtService:JwtService){

    }

    async login(login:LoginViewModel){
        const user=await this.userRepitory.getByCredentials(login.userLogin,login.password);
        if (!user) {
            throw new BadRequestException('Incorrect Credentials');
        }

        return {
            access_token: this.jwtService.sign({ status: 'Authorized' }),
            userId:(await user)._id,
        };
    }

    async updatePassword(login:UpdateViewModel){
        const user=await this.userRepitory.getByCredentials(login.userLogin,login.password);
        if (!user) {
            throw new BadRequestException('Incorrect Credentials');
        }else{
            this.userRepitory.updatePassword(user);
        }


    }

   

}
