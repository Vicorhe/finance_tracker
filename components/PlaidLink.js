import React, { useCallback } from 'react';
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@chakra-ui/react"

const PlaidLink = props => {
  const onSuccess = useCallback(
    (token, metadata) => {
      console.log('onSuccess', token, metadata);
      props.createItem(token);
    },
    []
  );

  const onEvent = useCallback(
    (eventName, metadata) => console.log('onEvent', eventName, metadata),
    []
  );

  const onExit = useCallback(
    (err, metadata) => console.log('onExit', err, metadata),
    []
  );

  const config = {
    token: props.token,
    onSuccess,
    onEvent,
    onExit,
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <>
      <Button
        onClick={() => open()}
        disabled={!ready || error}
        size="lg"
      >
        Add Source
      </Button>
    </>
  );
};

export default PlaidLink;