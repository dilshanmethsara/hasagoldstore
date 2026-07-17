import { prisma } from '../lib/prisma';
import { ApiError } from '../types';

export class BlogService {
  async list(adminAll?: boolean) {
    const where = adminAll ? {} : { isPublished: true };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    return posts;
  }

  async getBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new ApiError('BLOG_NOT_FOUND', 'Blog post not found');
    }

    return post;
  }

  async create(data: {
    slug: string;
    title: string;
    excerpt?: string;
    body: string;
    coverUrl?: string;
    isPublished?: boolean;
  }) {
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return post;
  }

  async update(id: string, data: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    coverUrl: string;
    isPublished: boolean;
  }>) {
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    const isBeingPublished = data.isPublished === true && currentPost?.isPublished === false;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: isBeingPublished ? new Date() : undefined,
      },
    });

    return post;
  }

  async delete(id: string) {
    await prisma.blogPost.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const blogService = new BlogService();
