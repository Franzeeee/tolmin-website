// Server-only: never import this from a client component.
// Reads the Facebook page posts via the Graph API and maps them to the
// shape the news pages use.

export interface FacebookNewsItem {
  id: number;
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: 'facebook';
  fbLink?: string;
}

interface GraphPost {
  id?: string;
  message?: string;
  created_time?: string;
  full_picture?: string;
}

const GRAPH_VERSION = 'v19.0';

export async function fetchFacebookNews(): Promise<FacebookNewsItem[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !token) {
    console.error('Facebook news: FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN is not set');
    return [];
  }

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/posts` +
    `?fields=id,message,created_time,full_picture` +
    `&access_token=${encodeURIComponent(token)}`;

  // Cache for 10 minutes so every page view doesn't hit the Graph API.
  const res = await fetch(url, { next: { revalidate: 600 } });
  const json = await res.json();

  if (!res.ok || json.error) {
    // Usually an expired or invalid token. Log it and return [] so the
    // website news still renders.
    console.error('Facebook news error:', json.error?.message ?? res.statusText);
    return [];
  }

  const posts: GraphPost[] = json.data ?? [];

  return posts.map((post) => {
    const msg = post.message ?? '';
    const [title, ...bodyParts] = msg.split('\n');
    const idStr = post.id ?? '';
    const [postPageId = '', postId = ''] = idStr.split('_');

    return {
      id: postId ? Number(postId) || 0 : Number(idStr) || 0,
      _id: idStr,
      title: title || '(ni naslova)',
      description: bodyParts.join('\n'),
      content: msg,
      image: post.full_picture ?? '/news.png',
      publishedAt: post.created_time ?? new Date().toISOString(),
      source: 'facebook',
      fbLink:
        postPageId && postId
          ? `https://www.facebook.com/${postPageId}/posts/${postId}`
          : undefined,
    };
  });
}
