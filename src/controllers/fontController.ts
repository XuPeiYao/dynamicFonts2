import * as express from 'express';
import * as fontmin from 'fontmin';
import { ControllerBase } from '../base/controllerBase';

export class FontController extends ControllerBase {
  public post(request: express.Request, response: express.Response) {
    console.info('%s 要求產生字體 %s', request.ip, request.params.fontName);

    var font = new fontmin()
      .src('fonts/' + request.params.fontName + '.*') //取出字體
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
