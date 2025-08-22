// BASE INCLUDES

export const postCountInclude = {
  _count: {
    select: {
      replies: true,
      likes: true,
      bookmarks: true,
      reposts: true,
    },
  },
};
export const userInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      profile: { select: { id: true } },
    },
  },
};

export const mediasInclude = {
  medias: {
    select: {
      id: true,
      url: true,
      type: true,
    },
  },
};

export const postActionsInclude = {
  likes: {
    select: {
      userId: true,
    },
  },
  reposts: {
    select: {
      userId: true,
    },
  },
  bookmarks: {
    select: {
      userId: true,
    },
  },
};

// COMPOSITE INCLUDES

export const postInclude = {
  ...userInclude,
  ...postActionsInclude,
  ...mediasInclude,
  ...postCountInclude,
};

export const repostOfInclude = {
  repostOf: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      ...userInclude,
      ...postActionsInclude,
      ...mediasInclude,
      ...postCountInclude,

      repostOf: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          ...userInclude,
          ...postActionsInclude,
          ...mediasInclude,
          ...postCountInclude,
        },
      },
    },
  },
};

export const parentInclude = {
  parent: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      ...userInclude,
      ...postActionsInclude,
      ...mediasInclude,
      ...postCountInclude,
    },
  },
};

export const postWithRepostOfInclude = {
  ...postInclude,
  ...repostOfInclude,
};

export const postWithParentInclude = {
  ...postInclude,
  ...parentInclude,
};

export const postWithParentAndRepostOfInclude = {
  ...postInclude,
  ...parentInclude,
  ...repostOfInclude,
};
