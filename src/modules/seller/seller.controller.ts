import { Body, Controller, Get, HttpException, Post, Req, Res, UseGuards } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerDto } from "./dto/seller.dto";
import { Request, Response } from "express";
import { decodeLoginToken, decodeRegToken, genLoginToken, genRegToken } from "src/utils/generateConfirmationTokens";
import { complRegDto } from "./dto/complReg.dto";
import { genAccessToken, genRefreshToken } from "src/utils/genAuthTokens";
import { LoginDto } from "./dto/sellerLogin.dto";
import { ImagesGalleryDto } from "./dto/imagesGallery.dto";
import { authGuard } from "./auth.guard";
import { GalleryImagesEntity } from "./entities/galleryImages.entity";

@Controller("seller")
export class SellerController {
     constructor(private sellerService: SellerService) {}

     //Registration
     @Post("/registerseller")
     async RegisterSeller(
          @Body() seller: SellerDto,
          @Res() res: Response,
     ): Promise<Response<any, Record<string, any>>> {
          const response = await this.sellerService.RegisterSeller(seller);

          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }

          const regToken = genRegToken(response.data);

          return res.json({ message: "Registration successful", crn: regToken });
     }

     //resending email if user
     @Post("/resend-email")
     async ResendConfirmationEmail(@Req() req: Request, @Res() res: Response) {
          const crn = req.headers.crn;

          const decodedToken = decodeRegToken(crn as string);
          const isEmailReSended = await this.sellerService.ResendRegistrationEmail(decodedToken);
          if (!isEmailReSended.success) {
               throw new HttpException(isEmailReSended.error.message, isEmailReSended.error.statusCode);
          }
          return res.json({ message: "Email sended" });
     }

     @Post("/complreg")
     async complReg(@Body() body: complRegDto, @Res() res: Response) {
          const seller_email = decodeRegToken(body?.token) as string;

          if (seller_email === "Expired") {
               throw new HttpException("Registration Expired", 400);
          }

          const response = await this.sellerService.complRegService(seller_email, body?.seller_info);

          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }

          const accessToken = genAccessToken(response.data);
          const refreshToken = genRefreshToken(response.data);
          const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE);
          const accessTokenMaxAge = parseInt(process.env.ACCESS_TOKEN_MAX_AGE);
          return res
               .cookie(process.env.REFRESH_TOKEN_SECRET_NAME, refreshToken, {
                    httpOnly: true,
                    maxAge: refreshTokenMaxAge,
               })
               .cookie(process.env.ACCESS_TOKEN_SECRET_NAME, accessToken, {
                    maxAge: accessTokenMaxAge,
               })
               .json("Registration Completed!");
     }

     @Post("/login")
     async Login(@Body() seller_login_info: LoginDto, @Res() res: Response) {
          const response = await this.sellerService.LoginService(seller_login_info);

          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }

          const loginToken = genLoginToken(response.data);

          return res.json({ message: "Email sended", cln: loginToken });
     }

     //resending email if user
     @Post("/resend-login-email")
     async ResendLoginConfirmationEmail(@Req() req: Request, @Res() res: Response) {
          const cln = req.headers.cln;

          const decodedToken = decodeLoginToken(cln as string);

          const isEmailReSended = await this.sellerService.ResendLoginEmail(decodedToken);
          if (!isEmailReSended.success) {
               throw new HttpException(isEmailReSended.error.message, isEmailReSended.error.statusCode);
          }
          return res.json({ message: "Email sended" });
     }

     //verify login
     @Post("/verify-login")
     async verifyLogin(@Body() body, @Res() res: Response) {
          if (!body?.token) {
               throw new HttpException("Invalid Link", 400);
          }
          const response = await this.sellerService.verifyLoginService(body?.token);

          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }

          const accessToken = genAccessToken(response.data);
          const refreshToken = genRefreshToken(response.data);
          const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE);
          const accessTokenMaxAge = parseInt(process.env.ACCESS_TOKEN_MAX_AGE);
          return res
               .cookie(process.env.REFRESH_TOKEN_SECRET_NAME, refreshToken, {
                    httpOnly: true,
                    maxAge: refreshTokenMaxAge,
               })
               .cookie(process.env.ACCESS_TOKEN_SECRET_NAME, accessToken, {
                    maxAge: accessTokenMaxAge,
               })
               .json("Login Success!");
     }

     // add images to seller images gallery

     @Post("add_gallery_images")
     @UseGuards(authGuard)
     async AddGalleryImages(@Body() body: ImagesGalleryDto, @Req() req) {
          console.log(req.seller);
          console.log(body);

          const response = await this.sellerService.addImagesToGallery(body, req.seller);
          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }
          return {
               success: true,
          };
     }

     // get Gallery images of seller
     @Get("seller_gallery_images")
     @UseGuards(authGuard)
     async getSellerGalleryImages(@Req() req): Promise<GalleryImagesEntity> {
          const response = await this.sellerService.getGalleryImages(req.seller);

          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }
          return response.data;
     }
}
