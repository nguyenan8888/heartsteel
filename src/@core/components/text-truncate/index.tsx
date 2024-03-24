import { Button, Typography } from '@mui/material';
import React, { useState } from 'react';

interface Props {
    text: string
    maxLength: number
}

const TextTruncate = (props: Props) => {
  const { text, maxLength } = props;
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <>
      {isTruncated ? (
        <Typography>
          {text.substring(0, maxLength)}{' '}
          <Button style={{padding:0, margin:0, marginBottom: '2px'}} onClick={toggleTruncate}>...xem thêm</Button>
        </Typography>
      ) : (
        <Typography>
            {text}{' '}
            <Button style={{padding:0, margin:0, marginBottom: '2px'}} onClick={toggleTruncate}>ẩn bớt</Button>
        </Typography>
        
      )}
    </>
  );
};

export default TextTruncate;