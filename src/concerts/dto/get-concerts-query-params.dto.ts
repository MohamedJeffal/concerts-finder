import * as Joi from 'joi';

export type GetConcertsQueryParamsByBandIdsDto = GetConcertsQueryParamsByBandIds & {
  type: 'by_bands';
};

export interface GetConcertsQueryParamsByBandIds {
  bandIds: number[];
}

export type GetConcertsQueryParamsByLocationDto = GetConcertsQueryParamsByLocation & {
  type: 'by_location';
};

export interface GetConcertsQueryParamsByLocation {
  longitude: number;
  latitude: number;
  radius: number;
}

export type GetConcertsQueryParamsByBandIdsAndLocationDto = GetConcertsQueryParamsByBandIdsAndLocation & {
  type: 'by_bands_and_location';
};

export interface GetConcertsQueryParamsByBandIdsAndLocation {
  bandIds: number[];
  longitude: number;
  latitude: number;
  radius: number;
}

export type GetConcertsQueryParamsDto =
  | GetConcertsQueryParamsByBandIdsDto
  | GetConcertsQueryParamsByLocationDto
  | GetConcertsQueryParamsByBandIdsAndLocationDto;

const customJoi = Joi.extend((joi) => ({
  base: joi.array(),
  name: 'integerArray',
  coerce: (value, state, options) =>
    value && value.split ? value.split(',') : value,
}));

export const getConcertsQueryParamsByBandIdsSchema = {
  type: Joi.string().default('by_bands'),
  bandIds: customJoi
    .integerArray()
    .items(Joi.number().integer().positive())
    .required(),
};

export const getConcertsQueryParamsByLocationSchema = {
  type: Joi.string().default('by_location'),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  radius: Joi.number().integer().positive().required(),
};

/**
 * Schema matching all possible valid data alternatives
 */
export const getConcertsQueryParamsSchema = Joi.alternatives().try(
  Joi.object(getConcertsQueryParamsByBandIdsSchema),
  Joi.object(getConcertsQueryParamsByLocationSchema),
  Joi.object({
    ...getConcertsQueryParamsByBandIdsSchema,
    ...getConcertsQueryParamsByLocationSchema,
    type: Joi.string().default('by_bands_and_location'),
  }),
);
