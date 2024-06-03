import _ from "underscore";
import React from "react";
import { STUDENTS } from "../../api/constants";
import StudentName, { StudentNamesFromIds } from "./StudentName";
import {
    Card,
    CardHeader,
    Grid,
    Button,
    List,
    ListItemText,
    ListItem,
    ListItemButton,
} from "@mui/material";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import CreateEvaluationDialog from "./CreateEvaluationDialog";
import { format } from "date-fns";
import ProjectEvaluation from "./ProjectEvaluation";

const EVALUATIONS = gql`
    query studentEvaluations($studentId: ID!) {
        studentEvaluations(studentId: $studentId) {
            _id
            createdAt
            startedAt
            studentIds
        }
    }
`;

const CREATE_EVALUATION = gql`
    mutation createProjectEvaluation($studentIds: [ID]!) {
        createProjectEvaluation(studentIds: $studentIds) {
            _id
        }
    }
`;

const EvaluationsList = (props) => {
    const { evaluations, handleSelect } = props;
    return (
        <List disablePadding>
            {_.map(evaluations, (evaluation) => (
                <ListItem key={evaluation._id} disablePadding>
                    <ListItemButton
                        onClick={() => {
                            handleSelect(evaluation._id);
                        }}
                    >
                        <ListItemText
                            primary={format(
                                new Date(
                                    evaluation.startedAt ||
                                        evaluation.createdAt,
                                ),
                                "dd.MM.yyyy HH:mm",
                            )}
                            secondary={
                                <StudentNamesFromIds
                                    studentIds={evaluation.studentIds}
                                />
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

const StudentEvaluations = (props) => {
    const { studentId } = props;
    const [evaluationId, setEvaluationId] = React.useState(null);
    const [adding, setAdding] = React.useState(false);
    const student = _.find(STUDENTS, (student) => student.id === studentId);
    const { data, loading, refetch } = useQuery(EVALUATIONS, {
        fetchPolicy: "cache-and-network",
        variables: { studentId },
    });
    const [createEvaluation] = useMutation(CREATE_EVALUATION, {
        onCompleted() {
            refetch();
            setAdding(false);
        },
        onError(params) {
            console.log("onError", params, params.message);
        },
    });
    const evaluations = _.sortBy(
        data?.studentEvaluations || [],
        (evaluation) => {
            return evaluation.startedAt || evaluation.createdAt;
        },
    );
    const currentEvaluation =
        evaluationId && _.find(evaluations, (ev) => ev._id === evaluationId);
    if (loading) return "...";
    if (currentEvaluation) {
        return (
            <ProjectEvaluation
                evaluationId={currentEvaluation._id}
                handleClose={() => setEvaluationId(null)}
            />
        );
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <Card>
                        <CardHeader
                            action={
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => setAdding(true)}
                                    size="small"
                                >
                                    +
                                </Button>
                            }
                            title={<StudentName student={student} />}
                        />
                        <EvaluationsList
                            evaluations={evaluations}
                            handleSelect={setEvaluationId}
                        />
                    </Card>
                </Grid>
            </Grid>
            {adding && (
                <>
                    <CreateEvaluationDialog
                        handleCancel={() => setAdding(null)}
                        handleSave={({ studentIds }) => {
                            createEvaluation({
                                variables: {
                                    studentIds,
                                },
                            });
                        }}
                        studentId={studentId}
                    />
                </>
            )}
        </>
    );
};

export default StudentEvaluations;
