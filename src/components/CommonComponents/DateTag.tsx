import React, { useContext } from "react";
import { Badge, Box, Text } from "@chakra-ui/react";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor } from "../Room/Room";

const DateTag = ({ date }: any) => {
  let dateLabel;
  const { color } = useContext(AuthContext);

  if (moment(date).isSame(moment(), "day")) {
    dateLabel = "Today";
  } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
    dateLabel = "Yesterday";
  } else {
    dateLabel = moment(date).format("MMMM D, YYYY");
  }

  return (
    <Box textAlign="center">
      <Badge borderRadius={10} fontWeight={500} bg={color} color={getFontColor(color)} px={3} py={1}>
        {dateLabel}
      </Badge>
    </Box>
  );
};

export default DateTag;
