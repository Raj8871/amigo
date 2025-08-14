'use server';
/**
 * @fileOverview An AI image generation agent that creates images from an existing image and a prompt.
 *
 * - generateImageFromImage - A function that handles the image generation process.
 * - GenerateImageFromImageInput - The input type for the generateImageFromImage function.
 * - GenerateImageFromImageOutput - The return type for the generateImageFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to guide the image generation style.'),
  imageDataUri: z
    .string()
    .describe(
      "The source image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageFromImageInput = z.infer<typeof GenerateImageFromImageInputSchema>;

const GenerateImageFromImageOutputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe('The generated images as an array of data URIs.'),
});
export type GenerateImageFromImageOutput = z.infer<typeof GenerateImageFromImageOutputSchema>;

export async function generateImageFromImage(input: GenerateImageFromImageInput): Promise<GenerateImageFromImageOutput> {
  return generateImageFromImageFlow(input);
}

const generateImageFromImageFlow = ai.defineFlow(
  {
    name: 'generateImageFromImageFlow',
    inputSchema: GenerateImageFromImageInputSchema,
    outputSchema: GenerateImageFromImageOutputSchema,
  },
  async ({prompt, imageDataUri}) => {
    const generationPromises = Array(5)
      .fill(null)
      .map((_, i) => {
        const fullPrompt = `Analyze the face of the person in the provided image. Generate a new image of the exact same person but in the following style or setting: ${prompt}. Keep the facial features identical. This is image ${
          i + 1
        } of 5.`;

        return ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: [{text: fullPrompt}, {media: {url: imageDataUri}}],
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
      });

    const results = await Promise.all(generationPromises);

    const imageDataUris = results.map(result => {
        if (!result.media?.url) {
            throw new Error('One or more image generations failed.');
        }
        return result.media.url;
    });

    return {
      imageDataUris,
    };
  }
);
