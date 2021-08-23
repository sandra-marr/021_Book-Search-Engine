const { AuthenticationError } = require('apollo-server-express');
const { User, bookSchema } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, { username, id }) => {
      return User.findOne({
        $or: [{ id }, { username }],
      }).populate("savedBooks");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
    
      const token = signToken(user);
      
      return { token, user };
    },
    login: async (parent, { username, email, password }) => {
     
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { authors, description, bookId, image, link, title }, context ) => {

        if (context.user) {

            const book = new bookSchema({ authors, description, bookId, image, link, title,});

            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            )
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, { bookId }, context ) => {

        if (context.user) {

            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { _id: bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updatedUser
        }
        throw new AuthenticationError('You need to be logged in!');
    }
  }
}

module.exports = resolvers;
