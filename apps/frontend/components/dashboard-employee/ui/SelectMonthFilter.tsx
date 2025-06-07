import React from 'react';

{
  /* Import Components */
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

{
  /* Content */
}

type SelectMonthFilterProps = {
  selectedMonth: string;
  onChange: (value: string) => void;
};

export default function SelectMonthFilter({ selectedMonth, onChange }: SelectMonthFilterProps) {
  return (
    <Select value={selectedMonth} onValueChange={onChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="01">January</SelectItem>
          <SelectItem value="02">February</SelectItem>
          <SelectItem value="03">March</SelectItem>
          <SelectItem value="04">April</SelectItem>
          <SelectItem value="05">May</SelectItem>
          <SelectItem value="06">June</SelectItem>
          <SelectItem value="07">July</SelectItem>
          <SelectItem value="08">August</SelectItem>
          <SelectItem value="09">September</SelectItem>
          <SelectItem value="10">October</SelectItem>
          <SelectItem value="11">November</SelectItem>
          <SelectItem value="12">December</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
