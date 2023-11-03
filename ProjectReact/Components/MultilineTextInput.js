import React, { useState } from 'react';
import { TextInput } from 'react-native';

const MultilineTextInput = (props) => {
  const [height, setHeight] = useState(40);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setHeight(Math.max(40, contentHeight));
  };

  return (
    <TextInput
      {...props}
      multiline
      onContentSizeChange={(e) => handleContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)}
      style={[props.style, { height: height }]}
    />
  );
};

export default MultilineTextInput;

