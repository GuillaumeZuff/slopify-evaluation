import ProjectEvaluations from "./entities/projectEvaluation";
import { TestDefinitions, TestIds } from "./testDefinitions";
import { EvaluationStatus } from "../constants";
import { runGetUser1, runGetUser2 } from "./testRunners/getUser";

const runProjectEvaluationTest = async ({ evaluation }) => {
    const currentTest = TestDefinitions[evaluation.testIndex];
    if (!currentTest) {
        await ProjectEvaluations.updateAsync(
            {
                _id: evaluation._id,
            },
            {
                $set: {
                    status: EvaluationStatus.DONE,
                },
            },
        );
        return;
    }
    const runnerProps = {
        evaluation,
        test: currentTest,
    };
    switch (currentTest.id) {
        case TestIds.GET_USER_1: {
            await runGetUser1(runnerProps);
            break;
        }
        case TestIds.GET_USER_2: {
            await runGetUser2(runnerProps);
            break;
        }
    }
};

export { runProjectEvaluationTest };
