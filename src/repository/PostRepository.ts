import { Post as PostRes } from '../types';
import Post from '../model/Post';
import { createSlug, createExcerpt, createMetaDescription } from '../service/PostService';
import { ObjectId } from 'mongoose';

export const CreatePost = async (
    title: string,
    content: string,
    categories: ObjectId[],
    tags: ObjectId[],
    keywords: string,
    status: string,
    image: string,
    isFeatured: boolean,
    allowComments: boolean,
    author: string
): Promise<PostRes | null> => {

    const post = await Post.create({
        title,
        slug: createSlug(title),
        content,
        excerpt: createExcerpt(content),
        image,
        author,
        categories,
        tags,
        keywords,
        status,
        isFeatured,
        metaDescription: createMetaDescription(content),
        metaKeywords: tags.map(tag => tag.toString()),
        allowComments,
    })

    return post as unknown as PostRes;
}
