import { JSDOM } from "jsdom";

export const createSlug = (title: string) => {
    return title.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
}

export const createExcerpt = (content: string) => {
    const removedTag = stripHtmlTags(content);
    const sentences = removedTag.match(/[^.!?]+[.!?]/g) || []; // Improved sentence extraction
    const firstSentence = sentences.slice(0, 1).join("").trim();
    return firstSentence ? firstSentence + "..." : "";
};

export const createMetaDescription = (content: string) => {
    const removedTag = stripHtmlTags(content);
    const sentences = removedTag.match(/[^.!?]+[.!?]/g) || [];
    const firstTwoSentences = sentences.slice(0, 2).join(" ").trim();
    return firstTwoSentences ? firstTwoSentences + "..." : "";
};

// Optimized HTML tag remover (Avoids JSDOM performance issues)
function stripHtmlTags(htmlString: string): string {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Uses regex for efficiency
}

