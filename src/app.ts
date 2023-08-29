import express, { Request, Response } from 'express';

const expressApp = express();
const port = 3000;

expressApp.get("/", (_req: Request, res: Response) => {
  res.json({
    data: "Hello World!",
  });
});

const main = () => {
  expressApp.listen(port, () => {
    console.log(`listening @ ${port}`);
  });
};

export default { main, expressApp };
