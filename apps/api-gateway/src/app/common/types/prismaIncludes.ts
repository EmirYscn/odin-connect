export const postInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      profile: true,
    },
  },
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
  medias: {
    select: {
      id: true,
      url: true,
      type: true,
    },
  },
  _count: {
    select: {
      replies: true,
      likes: true,
      bookmarks: true,
      reposts: true,
    },
  },
};

export const repostOfInclude = {
  repostOf: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      likes: { select: { userId: true } },
      reposts: { select: { userId: true } },
      bookmarks: {
        select: {
          userId: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          profile: true,
        },
      },
      medias: {
        select: {
          id: true,
          url: true,
          type: true,
        },
      },
      _count: {
        select: {
          replies: true,
          likes: true,
          bookmarks: true,
          reposts: true,
        },
      },
      repostOf: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          likes: { select: { userId: true } },
          reposts: { select: { userId: true } },
          bookmarks: {
            select: {
              userId: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              profile: true,
            },
          },
          medias: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
          _count: {
            select: {
              replies: true,
              likes: true,
              bookmarks: true,
              reposts: true,
            },
          },
        },
      },
    },
  },
};
export const postWithRepostOfInclude = {
  ...postInclude,
  ...repostOfInclude,
};

export const parentInclude = {
  parent: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      likes: { select: { userId: true } },
      reposts: { select: { userId: true } },
      bookmarks: {
        select: {
          userId: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          profile: true,
        },
      },
      medias: {
        select: {
          id: true,
          url: true,
          type: true,
        },
      },
      _count: {
        select: {
          replies: true,
          likes: true,
          bookmarks: true,
          reposts: true,
        },
      },
    },
  },
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
