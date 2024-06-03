import _ from "underscore";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { TestDefinitions } from "../../api/projectEvaluation/testDefinitions";
import { TestResults } from "../../api/constants";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";

const TestResult = (props) => {
    const { result } = props;
    const test = _.find(
        TestDefinitions,
        (testDef) => testDef.id === result.testId,
    );
    if (!test) {
        return null;
    }
    return (
        <ListItem>
            {result.result === TestResults.PASSED ? (
                <ListItemIcon sx={{ color: "green" }}>
                    <CheckIcon />
                </ListItemIcon>
            ) : (
                <ListItemIcon sx={{ color: "red" }}>
                    <WarningIcon />
                </ListItemIcon>
            )}
            <ListItemText
                primary={test.label}
                secondary={
                    result.result === TestResults.FAILED ? (
                        <Box sx={{ color: "red" }}>{result.errorMessage}</Box>
                    ) : null
                }
                secondaryTypographyProps={{ component: "div" }}
            />
        </ListItem>
    );
};

const TestResultsList = (props) => {
    const { evaluation } = props;
    return (
        <>
            <List disablePadding>
                {_.map(evaluation.testResults, (result) => (
                    <TestResult
                        {...props}
                        key={result.testId}
                        result={result}
                    />
                ))}
            </List>
        </>
    );
};

export default TestResultsList;
