import _ from "underscore";
import Papa from "papaparse";
import { TestDefinitions } from "../../api/projectEvaluation/testDefinitions";

const getExportData = ({ evaluation }) => {
    const testsDict = _.indexBy(TestDefinitions, "id");
    const data = _.map(evaluation.testResults, (testResult) => {
        const test = testsDict[testResult.testId];
        return {
            testId: testResult.testId,
            test: test?.label,
            result: testResult.result,
            errorMessage: testResult.errorMessage,
        };
    });
    return Papa.unparse(data, {
        headers: true,
        format: "utf8",
        encoding: "utf8",
    });
};

export { getExportData };
