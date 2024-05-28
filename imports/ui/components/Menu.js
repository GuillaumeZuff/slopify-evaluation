import _ from "underscore";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { STUDENTS } from "../../api/constants";
import StudentName from "./StudentName";

const Logo = () => {
  return <img src="/slopify_logo.webp" />;
};

const Menu = (props) => {
  const { studentId, setStudentId } = props;
  return (
    <>
      <Logo />
      <List>
        {_.values(STUDENTS).map((student) => (
          <ListItem key={student.id} disablePadding>
            <ListItemButton
              onClick={() => setStudentId(student.id)}
              selected={studentId === student.id}
            >
              <ListItemText primary={<StudentName student={student} />} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Menu;
