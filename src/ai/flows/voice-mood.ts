'use server';
/**
 * @fileOverview Converts mood text to an encouraging voice note.
 *
 * - moodToVoice - A function that converts mood text to a short, encouraging voice note.
 * - MoodToVoiceInput - The input type for the moodToVoice function.
 * - MoodToVoiceOutput - The return type for the moodToVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const MoodToVoiceInputSchema = z.object({
  mood: z.string().describe('The mood of the user (Happy, Sad, Angry, Neutral, Flirty).'),
});
export type MoodToVoiceInput = z.infer<typeof MoodToVoiceInputSchema>;

const MoodToVoiceOutputSchema = z.object({
  media: z.string().describe('The audio data URI of the encouraging voice note.'),
});
export type MoodToVoiceOutput = z.infer<typeof MoodToVoiceOutputSchema>;

export async function moodToVoice(input: MoodToVoiceInput): Promise<MoodToVoiceOutput> {
  return moodToVoiceFlow(input);
}

const moodToVoicePrompt = ai.definePrompt({
  name: 'moodToVoicePrompt',
  input: {schema: MoodToVoiceInputSchema},
  prompt: `You are an AI assistant designed to generate short, encouraging voice notes based on the user's mood.

  Mood: {{{mood}}}

  Generate a short (10-20 word) encouraging voice note appropriate for the user's mood.
  Speak in a natural, friendly voice.`,
});

const moodToVoiceFlow = ai.defineFlow(
  {
    name: 'moodToVoiceFlow',
    inputSchema: MoodToVoiceInputSchema,
    outputSchema: MoodToVoiceOutputSchema,
  },
  async input => {
    const {text} = await moodToVoicePrompt(input);

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: text ?? 'Everything will be alright.',
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

