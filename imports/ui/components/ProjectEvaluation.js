import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Card,
    CardActions,
    CardHeader,
    IconButton,
} from "@mui/material";
import React from "react";
import { StudentNamesFromIds, getExportName } from "./StudentName";
import { EvaluationStatus } from "../../api/constants";
import TestRunner from "./TestRunner";
import TestResultsList from "./TestResultsList";
import { getExportData } from "./getExportData";
import { saveAs } from "file-saver";

const PROJECT_EVALUATION = gql`
    query projectEvaluation($evaluationId: ID!) {
        projectEvaluation(evaluationId: $evaluationId) {
            _id
            createdAt
            status
            studentIds
            testIndex
            testResults {
                testId
                result
                errorMessage
            }
        }
    }
`;

const START_EVALUATION = gql`
    mutation startProjectEvaluation($evaluationId: ID!) {
        startProjectEvaluation(evaluationId: $evaluationId) {
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

const RESTART_EVALUATION = gql`
    mutation restartProjectEvaluation($evaluationId: ID!) {
        restartProjectEvaluation(evaluationId: $evaluationId) {
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

const ProjectEvaluation = (props) => {
    const { evaluationId, handleClose } = props;
    const { data } = useQuery(PROJECT_EVALUATION, {
        variables: {
            evaluationId,
        },
    });
    const [startEvaluation] = useMutation(START_EVALUATION);
    const [restartEvaluation] = useMutation(RESTART_EVALUATION);
    const evaluation = data?.projectEvaluation || {};
    return (
        <Card>
            <CardHeader
                title={
                    <StudentNamesFromIds studentIds={evaluation.studentIds} />
                }
                action={
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                }
            />
            {evaluation.status !== EvaluationStatus.READY && (
                <>
                    <TestResultsList evaluation={evaluation} />
                    {evaluation.status === EvaluationStatus.RUNNING && (
                        <TestRunner evaluation={evaluation} />
                    )}
                    {evaluation.status === EvaluationStatus.DONE && (
                        <CardActions>
                            <Button
                                onClick={() => {
                                    restartEvaluation({
                                        variables: {
                                            evaluationId,
                                        },
                                    });
                                }}
                            >
                                Redémarrer
                            </Button>
                            <Button
                                onClick={() => {
                                    const csvData = getExportData({
                                        evaluation,
                                    });
                                    const blob = new Blob([csvData], {
                                        type: "text/json;charset=utf-8",
                                    });
                                    saveAs(
                                        blob,
                                        getExportName({
                                            studentIds: evaluation.studentIds,
                                        }),
                                    );
                                }}
                            >
                                Exporter
                            </Button>
                        </CardActions>
                    )}
                </>
            )}
            {evaluation.status === EvaluationStatus.READY && (
                <CardActions>
                    <Button
                        variant="contained"
                        onClick={() => {
                            startEvaluation({
                                variables: {
                                    evaluationId,
                                },
                            });
                        }}
                    >
                        Démarrer
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default ProjectEvaluation;
