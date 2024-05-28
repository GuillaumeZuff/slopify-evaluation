import { GraphQLScalarType } from "graphql";
import {
  createProjectEvaluation,
  studentEvaluations,
} from "../projectEvaluation/resolvers/evaluation";

const DATE = new GraphQLScalarType({
  name: "DATE",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return new Date(value).getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
    return null;
  },
});

const resolvers = {
  DATE,
  Query: {
    studentEvaluations,
  },
  Mutation: {
    createProjectEvaluation,
  },
};

export { resolvers };
