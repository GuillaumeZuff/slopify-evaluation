import _ from "underscore";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
  TextField,
} from "@mui/material";
import React from "react";
import { STUDENTS } from "../../api/constants";

const CreateEvaluationDialog = (props) => {
  const { handleCancel, handleSave, studentId } = props;
  const [studentIds, setStudentIds] = React.useState(_.compact([studentId]));
  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>Évaluation</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          label="Étudiant-e-s"
          getOptionLabel={(option) => {
            if (option?.id) return option.label;
            const student = _.find(STUDENTS, (stud) => stud.id === option);
            return _.compact([student.lastname, student.firstname]).join(" ");
          }}
          isOptionEqualToValue={(option, value) => {
            return option?.id === value;
          }}
          onChange={(ev, value) => {
            setStudentIds(
              _.map(value, (val) => {
                if (val?.id) return val.id;
                return val;
              }),
            );
          }}
          options={_.map(STUDENTS, (student) => ({
            id: student.id,
            label: [student.lastname, student.firstname].join(" "),
          }))}
          renderInput={(params) => {
            return <TextField {...params} />;
          }}
          value={studentIds}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            handleSave({ studentIds });
          }}
          color="primary"
          disabled={_.isEmpty(studentIds)}
        >
          Confirmer
        </Button>
        <Button onClick={handleCancel}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEvaluationDialog;
