import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user-repository/user-repository';
import { userActivityDto } from 'src/domain/dto/user-activity.dto';
import { userActivityCommentDto } from 'src/domain/dto/user-activity-comment.dto';
import { UserActivityRepository } from 'src/repositories/user-activity-repository/user-activity-repository';
import { UserActivity } from 'src/domain/schemas/user-activity.schema';
import { readFileSync } from 'fs'; 
import { LikeOrDislikeViewModel } from 'src/domain/like-or-dislike.viewmodel';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class UserActivityService {
    constructor(private readonly userRepository:UserRepository,
                private readonly userActivityRepository:UserActivityRepository,
                private readonly webSocketGateway: WebsocketGateway){

    }

    async getRecentUploads(index:string){
        const indexAsNumber=parseInt(index,10);
        if(isNaN(indexAsNumber)){
            throw new BadRequestException('invalid index');
        }

        const recentUploads=await this.userActivityRepository.getPaged(indexAsNumber);
        return this.convertImagesToBase64(recentUploads);
        //return await this.userActivityRepository.getPaged(indexAsNumber);
    }

    async likeOrDislikeUserActivity(likeOrDislikeViewModel: LikeOrDislikeViewModel){
        const userActivity=await this.userActivityRepository.getById(likeOrDislikeViewModel.userActivityId);
        if(!userActivity){
            throw new BadRequestException('an user activity with the given id does not exist');
        } 

        const user=await this.userRepository.getById(likeOrDislikeViewModel.userId);
        if(!user){
            throw new BadRequestException('an user with the given id does not exist');
        }

        if(userActivity.likes.includes(user._id.toString())){
            userActivity.likes=userActivity.likes.filter(x=>x!==user._id.toString());
        }else{
            userActivity.likes.push(user._id.toString());
        }
        const updatedUserActivity= await this.userActivityRepository.update(userActivity);
        this.webSocketGateway.notifyOnLike(updatedUserActivity._id, userActivity.userId);
        return updatedUserActivity;
    }

    async uploadImage(userId:string, filename:string, description:string){
        const user=await this.userRepository.getById(userId);
        if(!user){
            throw new BadRequestException('this user does not exist');
        }

        const uploadImageObj=new userActivityDto(userId, filename, user.userName);
        if(description){
            uploadImageObj.comments.push(new userActivityCommentDto(
            userId,
            user.userName,
            description,
        ));
        }
        const createdUSerActivity=await this.userActivityRepository.create(uploadImageObj);
        return this.convertImageToBase64ForOneFile(createdUSerActivity);
        //return await  this.userActivityRepository.create(uploadImageObj);
    }

    convertImagesToBase64(userActivities:UserActivity[]){
        return Promise.all(//faz um buffer das imagens e retorna toda de uma vez
            userActivities.map(userActivity=>{
                return{
                    ...userActivity,
                    imgEncoded:readFileSync('../images/'+userActivity.fileName,'base64'),
                    //copia o user activity e busca a imagem pelo nome retornando ela ja na base 64
                };
            }),
        );
    }

    convertImageToBase64ForOneFile(userActivity: UserActivity){
        return {
            ...userActivity,
            imgEncoded:readFileSync('../images/'+userActivity.fileName,'base64'),
        };
    }
}
