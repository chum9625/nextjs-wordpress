import React from 'react';
import Head from 'next/head';
import ErrorPage from 'next/error';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Container from 'components/container';
import Header from 'components/header';
import Layout from 'components/layout';
import MoreStories from 'components/more-stories';
import PostBody from 'components/post-body';
import PostHeader from 'components/post-header';
import PostTitle from 'components/post-title';
import SectionSeparator from 'components/section-separator';
import Tags from 'components/tags';
import { getAllPostsWithSlug, getPostAndMorePosts } from 'lib/api';
import { CMS_NAME } from 'lib/constants';
import PostType from 'types/posts/post';
import { Edges } from 'types/common';

interface PostProps {
  post: PostType;
  posts: Edges<PostType>;
  preview: boolean;
}

const Post: React.FC<PostProps> = ({ post, posts, preview }) => {
  const router = useRouter();
  const morePosts = posts?.edges;

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.featuredImage?.node?.sourceUrl} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage?.node}
                date={post.date}
                author={post.author?.node}
                categories={post.categories}
              />
              <PostBody content={post.content} />
              <footer>{post.tags.edges.length > 0 && <Tags tags={post.tags} />}</footer>
            </article>

            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Post;

export const getStaticProps: GetStaticProps = async ({ params, preview = false, previewData }) => {
  const data = await getPostAndMorePosts(params.slug, preview, previewData);

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
    fallback: true,
  };
};
