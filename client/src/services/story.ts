import { VocabularyService } from "./vocabulary";
import type { Lemma } from "../utils/lemmatize";

export const StoryService = {
  generateStory: async (n: number, m: number): Promise<string> => {
    const allLemmas = VocabularyService.getAll();

    // Sort lemmas by count to get the least used ones
    const sortedLemmas = [...allLemmas].sort((a, b) => a.count - b.count);

    // Get n least used lemmas
    const leastUsedLemmas = sortedLemmas.slice(0, n);

    // Get m random lemmas (ensure they are not duplicates of leastUsedLemmas)
    const randomLemmas: Lemma[] = [];
    const availableLemmas = allLemmas.filter(
      (lemma) => !leastUsedLemmas.some((lu) => lu.lemma === lemma.lemma)
    );

    for (let i = 0; i < m; i++) {
      if (availableLemmas.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableLemmas.length);
      randomLemmas.push(availableLemmas.splice(randomIndex, 1)[0]);
    }

    const selectedLemmas = [...leastUsedLemmas, ...randomLemmas];
    const lemmaWords = selectedLemmas.map((lemma) => lemma.lemma);

    const prompt = `Generate a short story of approximately ${
      2 * n + 2 * m
    } words using the following words: ${lemmaWords.join(", ")}.`;

    // Placeholder for Gemini API call
    // In a real application, this would likely be a fetch to a backend endpoint
    // that then calls the Gemini API to keep the API key secure.
    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate story");
    }

    const data = await response.json();
    return data.story;
  },
};
