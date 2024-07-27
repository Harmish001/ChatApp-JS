import React from "react";
import { Box, Text } from "@chakra-ui/react";
import moment from "moment";

const DateTag = ({ date }: any) => {
  let dateLabel;
  console.log("date",date)

  if (moment(date).isSame(moment(), "day")) {
    dateLabel = "Today";
  } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
    dateLabel = "Yesterday";
  } else {
    dateLabel = moment(date).format("MMMM D, YYYY");
  }

  return (
    <Box textAlign="center">
      <Text fontSize="sm" color="gray.500">
        {dateLabel}
      </Text>
    </Box>
  );
};

export default DateTag;
