import _ from "underscore";
import { Mongo } from "meteor/mongo";

const Evaluations = new Mongo.Collection("evaluations");

export default Evaluations;
export { Evaluations };
