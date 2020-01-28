import { Controller, Post, Body, Put } from '@nestjs/common';
import { UserViewModel } from 'src/domain/user.viewmodel';
import { AuthService } from 'src/services/auth/auth.service';
import { LoginViewModel } from 'src/domain/login.viewmodel';
import { UpdateViewModel } from 'src/domain/update.viewmodel';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('login')
    login(@Body() login:LoginViewModel){
        return this.authService.login(login);
    }

    @Put('update')
    updatePassword(@Body() login:UpdateViewModel){
        return this.authService.updatePassword(login);
    }

    

}
