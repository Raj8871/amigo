'use server';
/**
 * @fileOverview An AI agent that combines two images into a single cohesive scene.
 *
 * - combineImages - A function that handles the image combination process.
 * - CombineImagesInput - The input type for the combineImages function.
 * - CombineImagesOutput - The return type for the combineImages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CombineImagesInputSchema = z.object({
  prompt: z.string().describe('A description of the desired final scene, explaining how the subjects from the two images should be combined.'),
  image1DataUri: z
    .string()
    .describe(
      "The first image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CombineImagesInput = z.infer<typeof CombineImagesInputSchema>;

const CombineImagesOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe('The generated combined image as a data URI.'),
});
export type CombineImagesOutput = z.infer<typeof CombineImagesOutputSchema>;

export async function combineImages(input: CombineImagesInput): Promise<CombineImagesOutput> {
  return combineImagesFlow(input);
}

const combineImagesPrompt = ai.definePrompt({
  name: 'combineImagesPrompt',
  input: { schema: CombineImagesInputSchema },
  prompt: `You are an expert image editor. Your task is to combine the two provided images into a single, cohesive, and realistic photograph.

Analyze the main subjects in both Image 1 and Image 2. Then, create a new scene based on the following description: {{{prompt}}}.

Place the subjects from both images into this new scene. Pay close attention to the following to ensure a realistic result:
- **Lighting and Shadows:** Ensure lighting is consistent across all subjects and matches the new background. Add realistic shadows.
- **Color Balance:** Adjust the color tones of both subjects to blend seamlessly.
- **Scale and Perspective:** Make sure the subjects are scaled appropriately relative to each other and the new environment.
- **Edge Blending:** Seamlessly blend the edges of the subjects into the new background.

Image 1: {{media url=image1DataUri}}
Image 2: {{media url=image2DataUri}}`,
});


const combineImagesFlow = ai.defineFlow(
  {
    name: 'combineImagesFlow',
    inputSchema: CombineImagesInputSchema,
    outputSchema: CombineImagesOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {
          text: `You are an expert image editor. Your task is to combine the two provided images into a single, cohesive, and realistic photograph.

Analyze the main subjects in both Image 1 and Image 2. Then, create a new scene based on the following description: ${input.prompt}.

Place the subjects from both images into this new scene. Pay close attention to the following to ensure a realistic result:
- **Lighting and Shadows:** Ensure lighting is consistent across all subjects and matches the new background. Add realistic shadows.
- **Color Balance:** Adjust the color tones of both subjects to blend seamlessly.
- **Scale and Perspective:** Make sure the subjects are scaled appropriately relative to each other and the new environment.
- **Edge Blending:** Seamlessly blend the edges of the subjects into the new background.`
        },
        { media: { url: input.image1DataUri } },
        { media: { url: input.image2DataUri } }
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image combination failed.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
