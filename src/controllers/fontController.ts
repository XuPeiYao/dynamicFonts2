import * as express from 'express';
import * as fontmin from 'fontmin';
import { ControllerBase } from '../base/controllerBase';
import * as fs from 'fs';
import { route, httpGet, httpPost } from '../middlewares/controllerMiddleware';

@route('/api/Font')
export class FontController extends ControllerBase {
  @httpGet('')
  public get(request: express.Request, response: express.Response) {
    return new Promise((res, rej) => {
      fs.readdir('fonts', (err, files) => {
        let result = files.map(x => {
          let segments = x.split('.');
          if (segments.length > 1) {
            segments.splice(-1, 1);
          }
          return segments.join('.');
        });
        res(result);
      });
    });
  }

  @httpPost('/:fontName')
  public post(
    fontName: string,
    request: express.Request,
    response: express.Response
  ) {
    console.info('%s 要求產生字體 %s', request.ip, request.params.fontName);

    var font = new fontmin()
      .src('fonts/' + fontName + '.*') //取出字體
      .use(fontmin.otf2ttf())
      .use(
        fontmin.glyph({
          // 擷取
          text: request.body.text
            .split('')
            .filter((v, i, a) => a.indexOf(v) === i && a[i].charCodeAt(0) >= 32)
            .join('')
        })
      );

    font.run(function(err, files) {
      if (err) {
        throw err;
      }
      response.attachment(`dynamic_${new Date().getTime()}.ttf`);
      files[0].pipe(response);
    });
  }
}
