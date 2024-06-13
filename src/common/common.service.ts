import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CommonService {

    handleDBErrors(err: any){
        console.log(err)
        if (err.errno === 1062) {
            throw new BadRequestException(err.sqlMessage);
          }
        if(err){
            if(err.status === 400){
                throw new BadRequestException(err.response.message)
            }
            throw new InternalServerErrorException(err.response)
        }
    }

}
