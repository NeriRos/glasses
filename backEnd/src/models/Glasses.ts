import * as mongoose from "mongoose";

export type GlassesModel = mongoose.Document & {
  id: string,
  name: string,
  imagePath: string,
  dimension: {
      frameWeight: number,
      frameWidth: number,
      lensHeigth: number,
      lensWidth: number,
      bridge: number,
      templateLength: number
  }
};

const glassesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  imagePath: String,
  dimension: {
      frameWeight: Number,
      frameWidth: Number,
      lensHeigth: Number,
      lensWidth: Number,
      bridge: Number,
      templateLength: Number
  }
}, { timestamps: true });

export const Glasses = mongoose.model<GlassesModel>("Glasses", glassesSchema);