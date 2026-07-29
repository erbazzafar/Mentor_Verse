import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  createdAt: Date;
  isAccepted: boolean;
  isAiGenerated: boolean;
}

const AnswerSchema: Schema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    isAccepted: { type: Boolean, default: false },
    isAiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Answer =
  mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
