import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { AppServerModule } from './app/app.server.module';
import { existsSync } from 'fs';

// The Express app
const app = express();
const distFolder = join(process.cwd(), 'dist/hospital-management-system/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) 
  ? 'index.original.html' 
  : 'index.html';

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', distFolder);

// Serve static files from /browser
app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(indexHtml, { req });
});

// Start up the Node server
const port = process.env['PORT'] || 7199;
app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
