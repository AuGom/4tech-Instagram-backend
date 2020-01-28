import { Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { UserViewModel } from 'src/domain/user.viewmodel';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor (private userService: UserService){}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    retornarUsuario(){
        return this.userService.getUsers();
    }

    /*@Get('test')
        retornarTeste(){
            return 'caminho diferente';
    }*/
    

    @Post()
    criarUsuarios(@Body() newUser: UserViewModel){
        return this.userService.createNewUser(newUser);
    }

       
}
