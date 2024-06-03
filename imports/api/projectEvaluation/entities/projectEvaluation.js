import _ from "underscore";
import { EvaluationStatus, TestResults } from "../../constants";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "meteor/aldeed:simple-schema";

const ProjectEvaluations = new Mongo.Collection("project.evaluations");

ProjectEvaluations.attachSchema(
    new SimpleSchema({
        createdAt: Date,
        deleted: Boolean,
        deletedAt: {
            type: Date,
            optional: true,
        },
        studentIds: Array,
        "studentIds.$": String,
        startedAt: {
            type: Date,
            optional: true,
        },
        status: {
            type: String,
            allowedValues: _.values(EvaluationStatus),
        },
        testIndex: Number,
        testResults: {
            type: Array,
            optional: true,
        },
        "testResults.$": {
            type: new SimpleSchema({
                testId: String,
                result: {
                    type: String,
                    allowedValues: _.values(TestResults),
                },
                errorMessage: {
                    type: String,
                    optional: true,
                },
            }),
        },
    }),
);

export { ProjectEvaluations };
export default ProjectEvaluations;
