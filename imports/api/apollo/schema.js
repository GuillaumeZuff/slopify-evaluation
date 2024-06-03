import { gql } from "graphql-tag";

const TestResult = gql`
    type TestResult {
        testId: ID!
        result: ID!
        errorMessage: String
    }
`;

const ProjectEvaluation = gql`
    type ProjectEvaluation {
        _id: ID!
        createdAt: DATE!
        startedAt: DATE
        status: ID!
        studentIds: [ID]
        testIndex: Int
        testResults: [TestResult]
    }
`;

const Query = gql`
    scalar DATE
    type Query {
        projectEvaluation(evaluationId: ID!): ProjectEvaluation
        studentEvaluations(studentId: ID!): [ProjectEvaluation]
    }
`;

const Mutation = gql`
    type Mutation {
        createProjectEvaluation(studentIds: [ID]!): ProjectEvaluation
        restartProjectEvaluation(evaluationId: ID!): ProjectEvaluation
        startProjectEvaluation(evaluationId: ID!): ProjectEvaluation

        runTest(evaluationId: ID!): ProjectEvaluation
    }
`;
const typeDefs = [Query, Mutation, ProjectEvaluation, TestResult];

export default typeDefs;
