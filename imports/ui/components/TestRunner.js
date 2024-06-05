import React from "react";
import { TestDefinitions } from "../../api/projectEvaluation/testDefinitions";
import { Box, CardContent } from "@mui/material";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { EvaluationStatus } from "../../api/constants";

const RUN_TEST = gql`
    mutation runTest($evaluationId: ID!) {
        runTest(evaluationId: $evaluationId) {
            _id
            status
            testIndex
            testResults {
                testId
                result
                errorMessage
            }
        }
    }
`;

const TestRunner = (props) => {
    const { evaluation } = props;
    const [runTest] = useMutation(RUN_TEST);
    const currentTest = TestDefinitions[evaluation.testIndex];
    React.useEffect(() => {
        if (evaluation.status === EvaluationStatus.RUNNING) {
            const timer = setTimeout(() => {
                runTest({
                    variables: {
                        evaluationId: evaluation._id,
                    },
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [evaluation]);
    return (
        <CardContent>
            <Box sx={{ fontStyle: "italic" }}>{currentTest?.label}...</Box>
        </CardContent>
    );
};

export default TestRunner;
