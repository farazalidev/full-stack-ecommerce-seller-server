import { IsDateString, IsNumber, Length } from "class-validator";

export class ImagesGalleryDto {
     @Length(1)
     url: string;

     @Length(1)
     public_id: string;

     @IsNumber({ allowInfinity: false })
     bytes: number;

     @Length(1)
     name: string;

     @IsDateString()
     uploaded_on: Date;
}
