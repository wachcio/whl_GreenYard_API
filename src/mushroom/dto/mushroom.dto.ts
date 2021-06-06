import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { messageMax, messageMin } from '../../utils/validation-message';

export enum MushroomApplication {
  edible = 'edible', //jadalny
  inedible = 'inedible', //niejadalny
  poisonous = 'poisonous', //trujący
  deadlyPoisonous = 'deadlyPoisonous', //śmiertelnie trujący
  conditionallyEdible = 'conditionallyEdible', //warunkowo jadalny
}

function convertMushroomEnumToString() {
  let result = '';

  Object.keys(MushroomApplication).filter((key) => (result += key + ', '));
  result = result.slice(0, -2);
  return result;
}

export class MushroomDescriptionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  occurrence: string; //występowanie

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  dimensions: string; //wymiary

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  cap: string; //kapelusz

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  underCap: string; //pod kapeluszem

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  capImprint: string; //odcisk kapelusza

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  stem: string; //trzon

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  flesh: string; //miąższ

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  characteristics: string; //cechy charakterystyczne

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  possibleConfusion: string; //możliwe pomyłki

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  value: string; //wartość (walory smakowe)

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  comments: string; //uwagi

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(1000, {
    message: messageMax('$property', '$constraint1'),
  })
  frequency: string; //częstotliwość występowania
}

export class MushroomDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  polishName: string; //nazwa polska

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  scientificName: string; //nazwa naukowa

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(255, {
    message: messageMax('$property', '$constraint1'),
  })
  anotherNames: string; //inne nazwy

  @IsEnum(MushroomApplication, {
    message: `application must be a valid enum value (${convertMushroomEnumToString()})`,
  })
  @IsNotEmpty()
  @MinLength(4, {
    message: messageMin('$property', '$constraint1'),
  })
  @MaxLength(36, {
    message: messageMax('$property', '$constraint1'),
  })
  application: MushroomApplication; //zastosowanie

  @IsBoolean()
  @IsNotEmpty()
  isLegallyProtected: boolean; //chroniony prawnie

  @IsBoolean()
  @IsNotEmpty()
  approvedForTrade: boolean; //dopuszczony do handlu

  @ValidateNested()
  @Type(() => MushroomDescriptionDto)
  @IsNotEmpty()
  description: MushroomDescriptionDto; //ID opisu

  @IsOptional()
  @IsInt()
  @Min(0)
  images: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  // @IsUrl({ each: true })
  // @MinLength(5, {
  //   message: messageMin('$property', '$constraint1'),
  // })
  // @MaxLength(2000, {
  //   message: messageMax('$property', '$constraint1'),
  // })
  dataSources: string[];
}
