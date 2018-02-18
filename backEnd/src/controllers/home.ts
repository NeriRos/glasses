import { Request, Response } from "express";
import * as mime from "mime-types";
import * as path from "path";

/**
 * GET *
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  if (req.url != "/")
    res.type(mime.lookup(req.url).toString());

  if (req.url.endsWith(".bundle.js") || req.url.endsWith(".bundle.js.map")) {
    res.sendFile(path.join(__dirname, "../app", req.url));
  } else {
    res.sendFile(path.join(__dirname, "../app/index.html"));
  }
};

