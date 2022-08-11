import { Request, Response } from 'express';

export interface CustomRequest extends Request {
    email?: string
}



// export interface CustomResponse extends Response {
   
// }