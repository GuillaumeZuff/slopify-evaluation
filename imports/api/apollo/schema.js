import { gql } from "graphql-tag";

const ProjectEvaluation = gql`
  type ProjectEvaluation {
    _id: ID!
    createdAt: DATE!
    studentIds: [ID]
  }
`;

const Query = gql`
  scalar DATE
  type Query {
    studentEvaluations(studentId: ID!): [ProjectEvaluation]
  }
`;

const Mutation = gql`
  type Mutation {
    createProjectEvaluation(studentIds: [ID]!): ProjectEvaluation
  }
`;
const typeDefs = [Query, Mutation, ProjectEvaluation];

export default typeDefs;
