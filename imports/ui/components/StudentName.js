import _ from "underscore";
import { STUDENTS } from "../../api/constants";
import React from "react";

const getStudentName = (student) => {
  if (!student) return "???";
  return _.compact([student.lastname, student.firstname]).join(" ");
};

const StudentName = (props) => {
  const { student } = props;
  return getStudentName(student);
};

const StudentNameFromId = (props) => {
  const { studentId } = props;
  const student = _.find(STUDENTS, (stud) => stud.id === studentId);
  return <StudentName student={student} />;
};

const StudentNamesFromIds = (props) => {
  const { studentIds } = props;
  const studentsById = _.indexBy(STUDENTS, "id");
  const students = _.sortBy(
    _.map(studentIds, (id) => {
      return studentsById[id];
    }),
    "lastname",
  );
  return _.map(students, getStudentName).join(", ");
};

export default StudentName;
export { StudentNameFromId, StudentNamesFromIds };
