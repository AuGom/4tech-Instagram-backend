import { Injectable } from '@nestjs/common';
import { UserViewModel } from 'src/domain/user.viewmodel';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/domain/schemas/user.schema';
import { promises } from 'dns';
import { LoginViewModel } from 'src/domain/login.viewmodel';
import { UpdateViewModel } from 'src/domain/update.viewmodel';

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel('User') private readonly userCollection:Model<User>){

    }

    async getByCredentials(userloginFromViewModel:string, passwordFromViewModel:string){
        return await this.userCollection
        .findOne({
            userLogin:userloginFromViewModel,
            password:passwordFromViewModel,
        })
        .lean()
    }

    async getById(id:string):Promise<User>{
        return await this.userCollection.findOne({_id:id}).lean();

    }


    async getUsers():Promise<User[]>{
        return await this.userCollection
        .find()
        .select({__v:false,password:false})
        .lean();
    }

    async updatePassword(login:User){
        const updatePass=await this.userCollection.findOneAndUpdate(
            { userLogin:login.userLogin},
            login.newPassword,
            {new:true});
        return await updatePass.save();
    }

    async createUser(newUser:UserViewModel){
        const user=this.userCollection(newUser);
        return await user.save();
        
    }

}
