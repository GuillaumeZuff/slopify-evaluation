import { EvaluationStatus } from "../../constants";
import { ProjectEvaluations } from "../entities/projectEvaluation";
import { runProjectEvaluationTest } from "../runProjectEvaluationTest";

const projectEvaluation = async (obj, args) => {
    const { evaluationId } = args;
    return await ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
};

const studentEvaluations = async (obj, args) => {
    const { studentId } = args;
    return ProjectEvaluations.find(
        {
            studentIds: studentId,
        },
        { sort: [["createdAt", "desc"]] },
    ).fetch();
};

const createProjectEvaluation = async (obj, args) => {
    const { studentIds } = args;
    const evaluationId = ProjectEvaluations.insert({
        createdAt: new Date(),
        deleted: false,
        status: EvaluationStatus.READY,
        studentIds,
        testIndex: 0,
    });
    return ProjectEvaluations.findOne({
        _id: evaluationId,
    });
};

const startProjectEvaluation = async (obj, args) => {
    const { evaluationId } = args;
    const evaluation = await ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
    if (!evaluation) {
        throw new Error("EvaluationNotFound");
    }
    if (evaluation.status !== EvaluationStatus.READY) {
        throw new Error("EvaluationNotReady");
    }
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluationId,
        },
        {
            $set: {
                status: EvaluationStatus.RUNNING,
                startedAt: new Date(),
                testIndex: 0,
            },
        },
    );
    return ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
};

const restartProjectEvaluation = async (obj, args) => {
    const { evaluationId } = args;
    const evaluation = await ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
    if (!evaluation) {
        throw new Error("EvaluationNotFound");
    }
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluationId,
        },
        {
            $set: {
                status: EvaluationStatus.RUNNING,
                startedAt: new Date(),
                testIndex: 0,
            },
            $unset: {
                testResults: "",
            },
        },
    );
    return await ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
};

const runTest = async (obj, args) => {
    const { evaluationId } = args;
    const evaluation = await ProjectEvaluations.findOneAsync({
        _id: evaluationId,
    });
    if (!evaluation) {
        throw new Error("EvaluationNotFound");
    }
    if (evaluation.status !== EvaluationStatus.RUNNING) {
        throw new Error("EvaluationNotRunning");
    }
    await runProjectEvaluationTest({
        evaluation,
    });
    return ProjectEvaluations.findOneAsync({ _id: evaluationId });
};

export {
    projectEvaluation,
    runTest,
    restartProjectEvaluation,
    startProjectEvaluation,
    studentEvaluations,
    createProjectEvaluation,
};
