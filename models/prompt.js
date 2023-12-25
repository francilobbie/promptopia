import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
}, {
  timestamps: true, // This is the correct place for the timestamps option
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
