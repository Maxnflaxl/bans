import React, { useEffect, useState } from 'react';
import Button from '@app/components/Button';
import { Modal } from '@app/components/Modals/Modal';
import ArrowRight from '../../assets/icons/arrow-right.svg'

import { ButtonContainer } from '@app/components/ButtonsContainer/ButtonContainer';
import { CloseBtn } from '@app/components/CloseBtn/CloseBtn';
import { Box, Paragraph } from 'theme-ui';
import Input from '@app/components/Input';
import { TransferAction } from './TransferAction';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { IsTransactionPending } from '@app/library/transaction-react/IsTransactionStatus';
import { DomainPresenterType } from '@app/library/bans/DomainPresenter';
import { LoadingOverlay } from '@app/components/LoadingOverlay';

interface TranferProps {
  isShown: boolean;
  toggleClose: () => void;
  domain: DomainPresenterType
}
export const Transfer: React.FC<TranferProps> = ({ isShown, toggleClose, domain }) => {
  const TRANSACTION_ID = "DOMAIN_TRANSFERRING";
  const transactionState = useCurrentTransactionState(TRANSACTION_ID);
  const isTransactionPending = IsTransactionPending({ transactionIdPrefix: TRANSACTION_ID });

  useEffect(() => {
    if (transactionState.id === TRANSACTION_ID && transactionState.type === "completed") {
      toggleClose();
      return () => {
        //store.dispatch()
      }
    }

  }, [transactionState]);

  const [transferKey, setTransferKey] = useState<string>("");

  return (
    <Modal isShown={isShown} header="Transfer">
      <>
        <Box>
          <Paragraph sx={{ textAlign: 'center' }}>Paste the wallet address where you want to transfer this domain</Paragraph>
        </Box>
        <Box sx={{ mt: '20px', my: '30px' }}>
          <Input
            variant='proposal'
            pallete='white'
            onChange={(e) => setTransferKey(e.target.value)}
            value={transferKey}
            maxLength={66}
          />
        </Box>
        <ButtonContainer>
          <CloseBtn toggle={toggleClose} />
          <TransferAction
            transactionId={TRANSACTION_ID}
            change={"transferBans"}
            transferKey={transferKey}
            domain={domain}
          >
            <ArrowRight />
            Transfer
          </TransferAction>
        </ButtonContainer>
        {isTransactionPending && <LoadingOverlay />}
      </>
    </Modal>
  )
}