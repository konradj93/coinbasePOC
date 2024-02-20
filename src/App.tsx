import { CBPayInstanceType, InitOnRampParams, initOnRamp } from '@coinbase/cbpay-js';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useRef, useState } from 'react';

const WALLET_ADDRESS = ""
const API_KEY = ""
const App = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CoinbaseButton openModal={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Coinbase Modal</DialogTitle>
        <DialogContent>
          <Grid container height="100%" overflow="scroll">
            <Grid item xs={12} className="onramp-modal__right-side">
              <div
                className="onramp-modal__sardine-wrapper"
                id="coinbase"
              ></div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {/* Additional actions can be added here */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const CoinbaseButton = ({ openModal }: { openModal: () => void }) => {
  const onrampInstance = useRef<CBPayInstanceType | null>();
  const onRampInstanceOptions: InitOnRampParams = {
    appId: API_KEY,
    target: "#cbpay-container",
    widgetParameters: {
      destinationWallets: [
        {
          address: WALLET_ADDRESS,
          blockchains: ["base"],
        },
      ],
    },
    embeddedContentStyles: {
      target: "#coinbase",
      height: "500px",
      width: "400px",
      position: "static",
    },
    onSuccess: () => {
      // handle navigation when user successfully completes the flow
    },
    onExit: () => {
      // handle navigation from dismiss / exit events due to errors
    },
    onEvent: (event) => {
      // event stream
      // eslint-disable-next-line no-console
      console.log(event, "Event");
    },
    experienceLoggedIn: "popup",
    experienceLoggedOut: "embedded",
  };

  const handleOnPress = () => {
    if (onrampInstance.current) {
      onrampInstance.current.destroy();
    }

    initOnRamp(onRampInstanceOptions, (error, instance) => {
      if (instance) {
        onrampInstance.current = instance;
        openModal();
        instance.open();
      }
      // eslint-disable-next-line no-console
      console.log(error);
    });
  };
  const destroy = () => {
    if (onrampInstance.current) {
      onrampInstance.current.destroy();
      onrampInstance.current = null;
    }
  };
  return (
    <div>
      <Button onClick={handleOnPress}>Initiate Coinbase Action</Button>
      <Button onClick={destroy}>Destroy</Button>
    </div>
  );
};



export default App;
