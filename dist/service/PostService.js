"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetaDescription = exports.createExcerpt = exports.createSlug = void 0;
const createSlug = (title) => {
    return title.trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
};
exports.createSlug = createSlug;
const createExcerpt = (content) => {
    const removedTag = stripHtmlTags(content);
    const sentences = removedTag.match(/[^.!?]+[.!?]/g) || []; // Improved sentence extraction
    const firstSentence = sentences.slice(0, 1).join("").trim();
    return firstSentence ? firstSentence + "..." : "";
};
exports.createExcerpt = createExcerpt;
const createMetaDescription = (content) => {
    const removedTag = stripHtmlTags(content);
    const sentences = removedTag.match(/[^.!?]+[.!?]/g) || [];
    const firstTwoSentences = sentences.slice(0, 2).join(" ").trim();
    return firstTwoSentences ? firstTwoSentences + "..." : "";
};
exports.createMetaDescription = createMetaDescription;
// Optimized HTML tag remover (Avoids JSDOM performance issues)
function stripHtmlTags(htmlString) {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Uses regex for efficiency
}
//# sourceMappingURL=PostService.js.map