import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CommonService {
  handleDBErrors(err: any) {
    console.log(err);
    if (err.errno === 1062) {
      const error = {
        error: 'Error',
        sqlMessage: err.sqlMessage,
        frontMessage: 'Usuario profesor duplicado',
      };
      throw new BadRequestException(error);
    }
    if (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response.message);
      }
      throw new InternalServerErrorException('Contactar con admin');
    }
  }
}
