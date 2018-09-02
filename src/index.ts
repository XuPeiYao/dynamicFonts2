import * as express from 'express';
import { FontController } from './controllers/fontController';
import './middlewares/corsMiddleware';
import { cors } from './middlewares/corsMiddleware';
import { ControllerBase } from './base/controllerBase';
import { route, httpGet, stepMvc } from './middlewares/controllerMiddleware';

const app = express();

app.use(express.static('dist/wwwroot'));
// Body 處理middleware
app.use(express.json());
// CORS
app.use(cors());
var router = express.Router();
router.use('/font/:fontName?', (request, response, next) => {
  new FontController().run(request, response, next);
});
app.use('/api', router);
stepMvc(app, FontController);
try {
  app.listen(80);
  console.log('服務已啟動');
} catch (e) {
  console.error('服務啟動失敗');
  console.error(e);
}
