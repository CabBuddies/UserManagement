import BaseRepository from './base.repository';
import {RefreshToken} from '../models';

class RefreshTokenRepository extends BaseRepository {
    constructor(){
        super(RefreshToken);
    }

    getActiveRefreshTokenCount = async(refreshToken : string) => {
        let temp:any = {
            refreshToken:{
                value:refreshToken,
                expiryTime:{
                    $gt:Date.now()
                }
            }
        };

        temp = {
            $and:[
                {"refreshToken.value":refreshToken},
                {
                    "refreshToken.expiryTime":{
                        $gt:Date.now()
                    }
                }
            ]
        }

        console.log('getActiveRefreshTokenCount',temp);
        temp = await this.model.count(
          temp  
        )
        console.log('getActiveRefreshTokenCount',temp);
        return temp;
    }

    removeByRefreshToken = async(refreshToken : string) => {
        return await this.model.deleteOne({"refreshToken.value":refreshToken});
    }

    removeAllByUserId = async(userId : string) => {
        return await this.model.deleteMany({userId});
    }

    update = async(entity) => {
        console.log('blocked method')
    }

}

export default RefreshTokenRepository;