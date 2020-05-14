import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import {
  GetConcertsQueryParamsDto,
  getConcertsQueryParamsSchema,
} from '../concerts/dto/get-concerts-query-params.dto';

@Injectable()
export class ParseConcertsQueryParamsPipe
  implements PipeTransform<any, GetConcertsQueryParamsDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): GetConcertsQueryParamsDto {
    const {
      value: validatedValue,
      error,
    }: {
      value: any;
      error?: Joi.ValidationError;
    } = getConcertsQueryParamsSchema.validate(value);

    if (error) {
      throw new BadRequestException('Validation failed');
    }

    return validatedValue;
  }
}
