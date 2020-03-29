const { AuthenticationError } = require("apollo-server-express");
const { createWriteStream } = require("fs");
const path = require("path");
const shortid = require("shortid");
const jwt = require("./jwt");
const password = require("./password");

const tokenCookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
};

const resolvers = {
  Query: {
    posts: (parent, { contain }, context) => {
      let where = {};
      if (contain) {
        if (contain.text) {
          where = {
            OR: [
              { title_contains: contain.text },
              { markdownText_contains: contain.text },
            ],
          };
        } else if (contain.tag) {
          where = { tags_some: { name: contain.tag } };
        }
      }

      return context.db.posts({ where });
    },
    post: (parent, { id }, context) => context.db.post({ id }),
    tags: async (parent, args, context) => context.db.tags(),
    tag: (parent, { id }, context) => context.db.tag({ id }),
  },
  Mutation: {
    signIn: async (
      parent,
      { id: enteredId, password: enteredPassword },
      context
    ) => {
      const user = await context.db.user({ name: enteredId });
      if (
        !user ||
        !password.verify(enteredPassword, user.passwordSalt, user.password)
      ) {
        throw new AuthenticationError(
          "You have entered an invalid id or password."
        );
      }

      const payload = { userId: user.id };
      context.res.cookie("token", jwt.sign(payload), tokenCookieOptions);

      return user.name;
    },
    signOut: async (parent, args, context) => {
      jwt.verifyUser(context.req.cookies.token);
      context.res.clearCookie("token", tokenCookieOptions);

      return true;
    },
    createPost: async (
      parent,
      { post: { title, startDate, endDate, markdownText, tags } },
      context
    ) => {
      const { userId } = jwt.verifyUser(context.req.cookies.token);

      const tagsToCreate = [];
      const tagsToConnect = [];

      for (const tagName of tags) {
        const tag = await context.db.tag({ name: tagName });
        if (tag) {
          tagsToConnect.push({ id: tag.id });
        } else {
          tagsToCreate.push({ name: tagName });
        }
      }

      return context.db.createPost({
        user: { connect: { id: userId } },
        title,
        startDate,
        endDate,
        markdownText,
        tags: {
          create: tagsToCreate,
          connect: tagsToConnect,
        },
      });
    },
    updatePost: async (
      parent,
      { id, post: { title, startDate, endDate, markdownText, tags } },
      context
    ) => {
      const { userId } = jwt.verifyUser(context.req.cookies.token);
      const owner = await context.db.post({ id }).user();
      if (userId !== owner.id) {
        throw new AuthenticationError("Invalid access!");
      }

      const tagsToCreate = [];
      const tagsToConnect = [];
      const tagsToDisconnect = [];

      for (const tagName of tags) {
        const tag = await context.db.tag({ name: tagName });
        if (tag) {
          tagsToConnect.push({ id: tag.id });
        } else {
          tagsToCreate.push({ name: tagName });
        }
      }
      const previousTags = await context.db.post({ id }).tags();
      for (const tag of previousTags) {
        if (!tags.includes(tag.name)) {
          tagsToDisconnect.push({ id: tag.id });
        }
      }

      return context.db.updatePost({
        where: { id },
        data: {
          user: { connect: { id: userId } },
          title,
          startDate,
          endDate,
          markdownText,
          tags: {
            create: tagsToCreate,
            connect: tagsToConnect,
            disconnect: tagsToDisconnect,
          },
        },
      });
    },
    deletePost: async (parent, { id }, context) => {
      const { userId } = jwt.verifyUser(context.req.cookies.token);
      const owner = await context.db.post({ id }).user();
      if (userId !== owner.id) {
        throw new AuthenticationError("Invalid access!");
      }

      return context.db.deletePost({ id });
    },
    uploadImage: async (parent, { file }, context) => {
      jwt.verifyUser(context.req.cookies.token);

      const { createReadStream, filename } = await file;

      const uploadedFilename = `${filename}-${shortid.generate()}`;
      const uploadedPath = path.resolve(
        `${__dirname}/../uploads/${uploadedFilename}`
      );

      return new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(uploadedPath))
          .on("error", (error) => reject(error))
          .on("finish", () => {
            resolve(`https://localhost/uploads/${uploadedFilename}`);
          });
      });
    },
  },
  User: {
    posts: (parent, args, context) =>
      context.db.user({ id: parent.id }).posts(),
  },
  Post: {
    user: (parent, args, context) => context.db.post({ id: parent.id }).user(),
    tags: (parent, args, context) => context.db.post({ id: parent.id }).tags(),
  },
  Tag: {
    posts: (parent, args, context) => context.db.tag({ id: parent.id }).posts(),
  },
};

module.exports = resolvers;
