import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserActivity } from "src/domain/schemas/user-activity.schema";
import { Model } from 'mongoose';
import { create } from "domain";
import { userActivityDto } from "src/domain/dto/user-activity.dto";
import { async } from "rxjs/internal/scheduler/async";
import { UserActivityService } from "src/services/user-activity/user-activity.service";
import { User } from "src/domain/schemas/user.schema";

@Injectable()
export class UserActivityRepository{

    constructor(
        @InjectModel('UserActivity') private readonly userActivityCollection:Model<UserActivity>){}
            //Model é a interface para o schema

        async getById(id:string):Promise<UserActivity>{
            return await this.userActivityCollection
            .findOne(({_id:id}))
            .lean();
        }

        async getPaged(index:number){
            return await this.userActivityCollection
            .find()
            .sort({timestamp:-1})
            .skip(index)
            .limit(10)
            .lean();
        }

        async create(userActivityDto: userActivityDto){
            const newUserActivity=this.userActivityCollection(userActivityDto);
            await newUserActivity.save();
            return await this.getById(newUserActivity._id);
        };

        async update(userActivity:UserActivity){
            const updateActivity=await this.userActivityCollection.findOneAndUpdate(
                { _id:userActivity._id },
                userActivity,
                {new:true});
            return await updateActivity.save();
        }

}