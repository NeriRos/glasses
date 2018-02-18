import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import { Glasses, GlassesModel } from "../models/Glasses";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as request from "request";

/**
 * GET /glasses/downloadHTML
 * Crawler.
 */
export let downloadHTML = (req: Request, res?: Response) => {
  https.get(req.query.siteUrl, (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      if (!res)
        return data;
      res.json(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.status(500).json(err);
  });
};

/**
 * POST /glasses/saveGlasses
 * Database interaction
 * and Download image
 */
export let saveGlasses = (req: Request, res: Response) => {
  const glassesArray: Array<GlassesModel> = req.body;
  let errorCount = 0;

  if (!glassesArray)
    return res.json({error: true, msg: "No body!"});

  for (let i = 0; i < glassesArray.length; i++) {
    const glasses = glassesArray[i];
    const imageName = glasses.imagePath.slice(glasses.imagePath.lastIndexOf("/") + 1, glasses.imagePath.lastIndexOf("?"));
    download(glasses.imagePath, path.join(__dirname, "../", process.env.IMAGE_STORAGE, imageName), () => {
      glasses.imagePath = path.join(process.env.IMAGE_STORAGE, imageName);
      (new Glasses(glasses)).save((err, glassesDoc) => {
        if (err) {
          errorCount++;
          return res.status(500).json(glassesDoc);
        }
        if (i >= glassesArray.length - 1)
          res.json({msg: "Glasses saved successfully!", errorCount: errorCount});
      });
    });
  }
};

/**
 * GET /glasses/gallery
 * Get glasses from db
 */
export let gallery = (req: Request, res: Response) => {
  Glasses.find({}, (err: any, glasses: GlassesModel[]) => {
    if (err)
      return res.status(500).json(err);
    res.json(glasses);
  });
};

const download = (uri: string, filename: string, callback: Function) => {
  request.head(uri, function(err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};
