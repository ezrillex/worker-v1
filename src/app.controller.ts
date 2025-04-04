import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {AxiosError} from "axios";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly httpService: HttpService) {} // i thought this was the service lol, move this

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug_image')
  async getImages() {
    try{
      const response = await firstValueFrom(
          this.httpService.get('https://ezrillex.github.io/zebilla.jpeg',
              {
                responseType: 'arraybuffer',
              })
      )
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return base64
    }
    catch(err){
      console.error(err);
    }
  }


  // debug
  // todo build error handling and retry logic, i see axios has some functionality for that retry
  @Post('prediction')
  async getPrediction(
      @Body('signature_name') signature_name: string,
      @Body('inputs') inputs: { input: { b64: string}}
  ) {
    //console.log(signature_name);
    //console.log(inputs);
    try{
      const response = await firstValueFrom(
          this.httpService.post('http://localhost:8501/v1/models/jcaptcha-model:predict',
          {
              signature_name: signature_name,
              inputs: inputs
          }),
      );
      return response.data;
    }
    catch(err){
      const axiosError = err as AxiosError;
      console.log(axiosError.response);
      //return axiosError.response.data;
      return {
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
      }
    }
  }
}
