import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
        _id
        username
        email
        savedBooks {
            authors: [String]!
            description: String
            bookId: String
            image: String
            link: String
            title: String
        }
        }
    }
`;