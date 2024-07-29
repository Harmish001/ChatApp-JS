import React from "react";
import { Badge, Box, Text } from "@chakra-ui/react";
import moment from "moment";

const DateTag = ({ date }: any) => {
  let dateLabel;

  if (moment(date).isSame(moment(), "day")) {
    dateLabel = "Today";
  } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
    dateLabel = "Yesterday";
  } else {
    dateLabel = moment(date).format("MMMM D, YYYY");
  }

  return (
    <Box textAlign="center">
      <Badge borderRadius={6} colorScheme='green' px={3} >{dateLabel}</Badge>
    </Box>
  );
};

export default DateTag;
