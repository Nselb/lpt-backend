import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CommonService {

    handleDBErrors(err: any){
        if (err.errno === 1062) {
            throw new BadRequestException(err.sqlMessage);
          }
        if(err){
            throw new InternalServerErrorException('TODO')
        }
    }

}
